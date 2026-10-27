import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type WorkshopView = "assembly" | "enclosure" | "cabling";
export type WorkshopScene = {
  readonly disposed: boolean;
  load: (url: string) => Promise<void>;
  setView: (view: WorkshopView) => void;
  rotate: (direction: number) => void;
  zoom: (factor: number) => void;
  dispose: () => void;
};

function releaseModel(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material)
      ? object.material
      : [object.material])
      materials.add(material);
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

/** An on-demand renderer: no animation loop, hardware connection or machine control. */
export function createWorkshopScene(
  host: HTMLElement,
  onFailure: () => void,
): WorkshopScene {
  const scene = new THREE.Scene();
  const paper =
    getComputedStyle(host).getPropertyValue("--paper").trim() || "#f2e2c8";
  scene.background = new THREE.Color(paper);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1 : 1.5),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "CNC laser CAD assembly. Use the camera, rotate and zoom buttons to explore the model.",
  );
  host.appendChild(canvas);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.001, 20);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = false;
  controls.enablePan = false;
  controls.minDistance = 0.055;
  controls.maxDistance = 2.8;
  controls.maxPolarAngle = Math.PI * 0.85;
  const ambient = new THREE.HemisphereLight(0xffffff, 0x3b2e2a, 1.3);
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(-0.5, 1.5, -0.9);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, {
    left: -0.9,
    right: 0.9,
    top: 0.9,
    bottom: -0.9,
    near: 0.01,
    far: 4,
  });
  key.shadow.bias = -0.0002;
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(1, 0.6, 0.7);
  scene.add(ambient, key, fill);

  const request = new AbortController();
  let root: THREE.Object3D | null = null;
  let floor: THREE.Mesh | null = null;
  let disposed = false;
  let visible = true;
  let frame = 0;
  let currentView: WorkshopView = "assembly";
  const wholeBounds = new THREE.Box3();

  function draw() {
    if (disposed || !root || frame || !visible || document.hidden) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      try {
        renderer.render(scene, camera);
      } catch {
        onFailure();
      }
    });
  }

  function setView(view: WorkshopView) {
    currentView = view;
    if (!root || disposed) return;
    const bounds = new THREE.Box3();
    const points: THREE.Vector3[] = [];
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const layer = object.userData.layer;
      if (layer === "lid" || object.name.includes("02_carcasa_capac"))
        object.visible = view !== "enclosure";
      if (
        object.visible &&
        (view === "assembly" ||
          (view === "enclosure" &&
            (layer === "case" ||
              layer === "pcb" ||
              object.name.includes("carcasa"))) ||
          (view === "cabling" && (layer === "chains" || layer === "cables")))
      ) {
        object.geometry.computeBoundingBox();
        const box = object.geometry.boundingBox!;
        for (const x of [box.min.x, box.max.x])
          for (const y of [box.min.y, box.max.y])
            for (const z of [box.min.z, box.max.z])
              points.push(
                new THREE.Vector3(x, y, z).applyMatrix4(object.matrixWorld),
              );
      }
    });
    if (!points.length) return;
    bounds.setFromPoints(points);
    const centre = bounds.getCenter(new THREE.Vector3());
    const vertical = THREE.MathUtils.degToRad(camera.fov) / 2;
    const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
    const direction =
      view === "cabling"
        ? new THREE.Vector3(-0.3, 1.4, -0.8)
        : view === "enclosure"
          ? new THREE.Vector3(-0.4, 0.5, -1)
          : new THREE.Vector3(-0.85, 0.85, -1.1);
    direction.normalize();
    const right = new THREE.Vector3()
      .crossVectors(camera.up, direction)
      .normalize();
    const up = new THREE.Vector3().crossVectors(direction, right).normalize();
    // Centre the occupied projection, rather than empty corners of a box around
    // the complete machine. This also frames shallow objects well on mobile.
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const point of points) {
      const offset = point.clone().sub(centre);
      const x = offset.dot(right),
        y = offset.dot(up);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    centre
      .addScaledVector(right, (minX + maxX) / 2)
      .addScaledVector(up, (minY + maxY) / 2);
    let distance = 0.14;
    // Fit each part's corners in both axes, including perspective depth.
    for (const point of points) {
      const corner = point.clone().sub(centre);
      const depth = corner.dot(direction);
      distance = Math.max(
        distance,
        depth + (1.14 * Math.abs(corner.dot(right))) / Math.tan(horizontal),
        depth + (1.14 * Math.abs(corner.dot(up))) / Math.tan(vertical),
      );
    }
    controls.target.copy(centre);
    camera.position.copy(centre).add(direction.multiplyScalar(distance));
    camera.lookAt(centre);
    controls.update();
    draw();
  }

  function resize() {
    if (disposed) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    setView(currentView);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) draw();
  });
  visibilityObserver.observe(host);
  const lost = (event: Event) => {
    event.preventDefault();
    if (!disposed) onFailure();
  };
  canvas.addEventListener("webglcontextlost", lost);
  document.addEventListener("visibilitychange", draw);
  controls.addEventListener("change", draw);
  resize();

  return {
    get disposed() {
      return disposed;
    },
    async load(url) {
      const response = await fetch(url, { signal: request.signal });
      if (!response.ok)
        throw new Error(`Model load failed: ${response.status}`);
      const buffer = await response.arrayBuffer();
      if (disposed) return;
      const gltf = await new GLTFLoader().parseAsync(buffer, "");
      if (disposed) {
        releaseModel(gltf.scene);
        return;
      }
      root = gltf.scene;
      scene.add(root);
      root.updateMatrixWorld(true);
      wholeBounds.setFromObject(root);
      root.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
      const centre = wholeBounds.getCenter(new THREE.Vector3());
      floor = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShadowMaterial({ color: 0x3b2e2a, opacity: 0.17 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(centre.x, wholeBounds.min.y - 0.001, centre.z);
      floor.receiveShadow = true;
      scene.add(floor);
      setView(currentView);
    },
    setView,
    rotate(direction) {
      if (disposed || !root) return;
      const offset = camera.position
        .clone()
        .sub(controls.target)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), (direction * Math.PI) / 12);
      camera.position.copy(controls.target).add(offset);
      controls.update();
      draw();
    },
    zoom(factor) {
      if (disposed || !root) return;
      const offset = camera.position.clone().sub(controls.target);
      offset.setLength(
        THREE.MathUtils.clamp(
          offset.length() * factor,
          controls.minDistance,
          controls.maxDistance,
        ),
      );
      camera.position.copy(controls.target).add(offset);
      controls.update();
      draw();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      request.abort();
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", draw);
      canvas.removeEventListener("webglcontextlost", lost);
      controls.removeEventListener("change", draw);
      controls.dispose();
      if (root) {
        scene.remove(root);
        releaseModel(root);
        root = null;
      }
      if (floor) {
        scene.remove(floor);
        releaseModel(floor);
        floor = null;
      }
      key.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
