import { useEffect, useRef, useState } from "react";
import type { AtelierZone } from "./sceneGeometry";
import { sitePath } from "../sitePaths";

export type { AtelierZone } from "./sceneGeometry";

export interface AtelierSceneProps {
  zone: AtelierZone;
  paused: boolean;
  reducedMotion: boolean;
  exception: boolean;
  obstacleIndex: number;
  codeTested: boolean;
  onZoneSelect: (zone: AtelierZone) => void;
  onReady?: () => void;
  replayKey?: number;
  className?: string;
}

type SceneController = { refresh: () => void };

/** React owns intent; the imperative scene owns transient rendering state. */
export function AtelierScene(props: AtelierSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  const controllerRef = useRef<SceneController | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );
  useEffect(() => {
    propsRef.current = props;
    controllerRef.current?.refresh();
  }, [
    props.zone,
    props.paused,
    props.reducedMotion,
    props.exception,
    props.obstacleIndex,
    props.codeTested,
    props.replayKey,
    props.onZoneSelect,
    props.onReady,
  ]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const once = (release: () => void) => {
      let released = false;
      return () => {
        if (released) return;
        released = true;
        release();
      };
    };
    let readyNotified = false;
    const signalReady = () => {
      if (disposed || readyNotified) return;
      readyNotified = true;
      propsRef.current.onReady?.();
    };
    // Give input and the fallback image a paint opportunity between CPU-heavy phases.
    const checkpoint = async () => {
      const scheduler = (
        window as Window & {
          scheduler?: { yield?: () => Promise<void> };
        }
      ).scheduler;
      if (scheduler?.yield) await scheduler.yield();
      else await new Promise<void>((resolve) => setTimeout(resolve, 0));
      if (disposed) throw new Error("Atelier initialization cancelled");
    };

    void Promise.all([import("three"), import("./sceneGeometry")])
      .then(async ([THREE, { buildAtelier }]) => {
        if (disposed) return;
        await checkpoint();
        const compact = host.clientWidth < 650;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          setStatus("fallback");
          signalReady();
          return;
        }
        // Keep shader diagnostics in development; GL log queries stall production startup.
        renderer.debug.checkShaderErrors = !import.meta.env.PROD;
        renderer.setPixelRatio(
          compact ? 1 : Math.min(window.devicePixelRatio || 1, 1.5),
        );
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.16;
        renderer.shadowMap.enabled = !compact;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        const canvas = renderer.domElement;
        canvas.setAttribute("aria-hidden", "true");
        canvas.style.cssText =
          "display:block;width:100%;height:100%;touch-action:pan-y;";
        host.append(canvas);
        cleanup = once(() => {
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
        });
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(
          -4.8,
          4.8,
          2.5,
          -2.5,
          0.1,
          100,
        );
        const baseCamera = new THREE.Vector3(6.4, 6.4, 11.6);
        camera.position.copy(baseCamera);
        camera.lookAt(0, 0.65, 0);
        const ambient = new THREE.HemisphereLight(0xfff0d8, 0x3b2e2a, 2.4);
        scene.add(ambient);
        const key = new THREE.DirectionalLight(0xffedcf, 4.3);
        key.position.set(-3.5, 7, 5.5);
        key.castShadow = !compact;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.left = -6;
        key.shadow.camera.right = 6;
        key.shadow.camera.top = 5;
        key.shadow.camera.bottom = -5;
        key.shadow.camera.near = 0.1;
        key.shadow.camera.far = 20;
        key.shadow.normalBias = 0.035;
        key.shadow.bias = -0.00015;
        key.shadow.radius = 3;
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xe5ead9, 1.2);
        fill.position.set(4, 3, -4);
        scene.add(fill);
        await checkpoint();
        const model = await buildAtelier({ compact, checkpoint });
        if (disposed) {
          model.dispose();
          return;
        }
        scene.add(model.group);
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let hover: AtelierZone | null = null;
        let elapsed = 0;
        let lastTime = 0;
        let frameId = 0;
        let visible = true;
        let lastReplay = propsRef.current.replayKey;
        let lastZone = propsRef.current.zone;
        let lost = false;
        let initialized = false;
        let width = 1,
          height = 1;
        const target = new THREE.Vector3(0, 0.65, 0);
        const currentTarget = target.clone();
        const parallax = new THREE.Vector2();
        const running = () =>
          !disposed &&
          initialized &&
          !lost &&
          visible &&
          !document.hidden &&
          !propsRef.current.paused &&
          !propsRef.current.reducedMotion &&
          (propsRef.current.zone === "quadyx" || elapsed < 7.2);
        const draw = (delta = 0) => {
          if (disposed || lost || !initialized || width <= 1 || height <= 1)
            return;
          const state = propsRef.current;
          const compact = width < 650;
          // Keep the workshop intact; selection shifts the emphasis rather than hiding evidence.
          target.set(
            compact
              ? 0
              : state.zone === "automation"
                ? -0.15
                : state.zone === "quadyx"
                  ? 0.15
                  : 0,
            0.65,
            0,
          );
          if (state.reducedMotion || delta === 0) currentTarget.copy(target);
          else currentTarget.lerp(target, 1 - Math.exp(-delta * 6));
          camera.position.copy(baseCamera);
          if (!state.reducedMotion && !compact) {
            camera.position.x += parallax.x * 0.18;
            camera.position.y += parallax.y * 0.12;
          }
          camera.lookAt(currentTarget);
          model.update(
            state.reducedMotion ? 6.6 : elapsed,
            state.zone,
            state.exception,
            state.obstacleIndex,
            state.codeTested,
            running(),
            hover,
          );
          renderer.render(scene, camera);
        };
        const tick = (now: number) => {
          frameId = 0;
          if (!running()) {
            lastTime = 0;
            return;
          }
          const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.08) : 0;
          if (compact && lastTime && now - lastTime < 1000 / 30 - 1) {
            frameId = requestAnimationFrame(tick);
            return;
          }
          lastTime = now;
          elapsed += delta;
          draw(delta);
          frameId = requestAnimationFrame(tick);
        };
        const sync = () => {
          if (disposed || !initialized) return;
          const state = propsRef.current;
          if (state.replayKey !== lastReplay || state.zone !== lastZone) {
            elapsed = 0;
            lastReplay = state.replayKey;
            lastZone = state.zone;
          }
          if (!running() && frameId) {
            cancelAnimationFrame(frameId);
            frameId = 0;
            lastTime = 0;
          }
          draw();
          if (running() && !frameId) frameId = requestAnimationFrame(tick);
        };
        controllerRef.current = { refresh: sync };
        const resize = () => {
          width = host.clientWidth;
          height = host.clientHeight;
          if (width <= 1 || height <= 1) return;
          const aspect = width / height;
          const viewHeight = Math.max(4.7, 9.25 / aspect);
          camera.top = viewHeight / 2;
          camera.bottom = -viewHeight / 2;
          camera.left = (-viewHeight * aspect) / 2;
          camera.right = (viewHeight * aspect) / 2;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          sync();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        const intersectionObserver = new IntersectionObserver(
          (entries) => {
            visible = entries[0]?.isIntersecting ?? true;
            sync();
          },
          { rootMargin: "120px" },
        );
        intersectionObserver.observe(host);
        const selectAt = (event: PointerEvent): AtelierZone | null => {
          const rect = canvas.getBoundingClientRect();
          pointer.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1,
          );
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(model.hitTargets, true)[0];
          let object: import("three").Object3D | null = hit?.object ?? null;
          while (object) {
            if (object.userData.zone)
              return object.userData.zone as AtelierZone;
            object = object.parent;
          }
          return null;
        };
        const pointerMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          hover = selectAt(event);
          canvas.style.cursor = hover ? "pointer" : "default";
          parallax.set(pointer.x, pointer.y);
          if (!running()) draw();
        };
        const pointerLeave = () => {
          hover = null;
          parallax.set(0, 0);
          canvas.style.cursor = "default";
          if (!running()) draw();
        };
        let pointerDownPosition: { x: number; y: number } | null = null;
        const pointerDown = (event: PointerEvent) => {
          pointerDownPosition = { x: event.clientX, y: event.clientY };
        };
        const pointerUp = (event: PointerEvent) => {
          if (
            !pointerDownPosition ||
            Math.hypot(
              event.clientX - pointerDownPosition.x,
              event.clientY - pointerDownPosition.y,
            ) > 12
          )
            return;
          pointerDownPosition = null;
          const selection = selectAt(event);
          if (selection) propsRef.current.onZoneSelect(selection);
        };
        const visibility = () => sync();
        const contextLost = (event: Event) => {
          event.preventDefault();
          lost = true;
          if (frameId) cancelAnimationFrame(frameId);
          frameId = 0;
          canvas.style.display = "none";
          cleanup?.();
          if (!disposed) {
            setStatus("fallback");
            signalReady();
          }
        };
        canvas.addEventListener("pointermove", pointerMove);
        canvas.addEventListener("pointerleave", pointerLeave);
        canvas.addEventListener("pointerdown", pointerDown);
        canvas.addEventListener("pointerup", pointerUp);
        canvas.addEventListener("webglcontextlost", contextLost);
        document.addEventListener("visibilitychange", visibility);
        cleanup = once(() => {
          if (frameId) cancelAnimationFrame(frameId);
          controllerRef.current = null;
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          document.removeEventListener("visibilitychange", visibility);
          canvas.removeEventListener("pointermove", pointerMove);
          canvas.removeEventListener("pointerleave", pointerLeave);
          canvas.removeEventListener("pointerdown", pointerDown);
          canvas.removeEventListener("pointerup", pointerUp);
          canvas.removeEventListener("webglcontextlost", contextLost);
          model.dispose();
          key.shadow.map?.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
        });
        try {
          resize();
          // KHR_parallel_shader_compile avoids blocking the first draw on shader linking.
          await renderer.compileAsync(scene, camera);
          await checkpoint();
          if (lost) return;
          initialized = true;
          sync();
          setStatus("ready");
          signalReady();
        } catch {
          cleanup();
          cleanup = undefined;
          if (!disposed) {
            setStatus("fallback");
            signalReady();
          }
        }
      })
      .catch(() => {
        cleanup?.();
        cleanup = undefined;
        if (!disposed) {
          setStatus("fallback");
          signalReady();
        }
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`atelier-scene ${props.className ?? ""}`}
      data-renderer={status}
      data-zone={props.zone}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      role="img"
      aria-label="Interactive matte workshop with a robotic arm, coding console, and miniature quadcopter. Use the zone controls to explore each system."
    >
      {status !== "ready" ? (
        <img
          src={sitePath("/images/atelier.webp")}
          fetchPriority="high"
          alt="Matte workshop with a robotic arm, coding console and four-rotor drone"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "absolute",
            inset: 0,
          }}
        />
      ) : null}
    </div>
  );
}

export default AtelierScene;
