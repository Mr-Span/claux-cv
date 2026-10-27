import { useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import type { WorkshopModel } from "../content/workshop";
import {
  createWorkshopScene,
  type WorkshopScene,
  type WorkshopView,
} from "./workshopScene";

export type WorkshopModelViewerProps = {
  variants: WorkshopModel[];
  initialVariant: WorkshopModel["id"];
};

export function WorkshopModelViewer({
  variants,
  initialVariant,
}: WorkshopModelViewerProps) {
  const [variant, setVariant] = useState(initialVariant);
  const [view, setView] = useState<WorkshopView>("assembly");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<WorkshopScene | null>(null);
  const selectedView = useRef(view);
  selectedView.current = view;
  const model = variants.find((item) => item.id === variant) ?? variants[0];

  useEffect(() => {
    if (!host.current) return;
    let active = true;
    let controller: WorkshopScene | undefined;
    setStatus("loading");
    const fail = () => {
      controller?.dispose();
      if (!active) return;
      scene.current = null;
      setStatus("error");
    };
    try {
      controller = createWorkshopScene(host.current, fail);
      scene.current = controller;
      controller
        .load(model.src)
        .then(() => {
          if (!active || !controller || controller.disposed) return;
          controller.setView(selectedView.current);
          setStatus("ready");
        })
        .catch(fail);
    } catch {
      fail();
    }
    return () => {
      active = false;
      controller?.dispose();
      scene.current = null;
    };
  }, [model.src, attempt]);

  function selectView(next: WorkshopView) {
    setView(next);
    scene.current?.setView(next);
  }

  return (
    <div
      className="workshop-viewer"
      role="region"
      aria-label="Interactive CNC layout comparison"
    >
      <div className="workshop-viewer-toolbar">
        <div role="group" aria-label="Assembly layout">
          {variants.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={variant === item.id}
              onClick={() => setVariant(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Camera views">
          {(
            [
              ["assembly", "Assembly"],
              ["enclosure", "Enclosure"],
              ["cabling", "Cabling"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              disabled={status !== "ready"}
              onClick={() => selectView(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div
        className="workshop-viewer-viewport"
        data-state={status}
        aria-busy={status === "loading"}
      >
        <img
          className="workshop-viewer-poster"
          src={model.poster.src}
          alt={model.poster.alt}
          width={1400}
          height={1050}
        />
        <div className="workshop-viewer-host" ref={host} />
        {status !== "ready" ? (
          <div className="workshop-viewer-status" role="status">
            {status === "loading" ? (
              `Loading layout ${variant}…`
            ) : (
              <>
                <p>
                  3D is unavailable. Close this view to return to the images.
                </p>
                <button
                  type="button"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Retry 3D view
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
      <div className="workshop-viewer-toolbar" style={{ marginTop: 12 }}>
        <div role="group" aria-label="Model controls">
          <button
            type="button"
            aria-label="Rotate left"
            disabled={status !== "ready"}
            onClick={() => scene.current?.rotate(-1)}
          >
            <RotateCcw size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Rotate right"
            disabled={status !== "ready"}
            onClick={() => scene.current?.rotate(1)}
          >
            <RotateCw size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={status !== "ready"}
            onClick={() => scene.current?.zoom(0.8)}
          >
            <ZoomIn size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            disabled={status !== "ready"}
            onClick={() => scene.current?.zoom(1.25)}
          >
            <ZoomOut size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled={status !== "ready"}
            onClick={() => selectView("assembly")}
          >
            Reset view
          </button>
        </div>
      </div>
      <div className="workshop-viewer-caption sr-only">
        <p role="status">
          Layout {variant} / {model.description}
          {status === "ready"
            ? ` ${view === "enclosure" ? "Enclosure view, cover hidden." : view === "cabling" ? "Cable-routing view." : "Complete assembly view."}`
            : ""}
        </p>
      </div>
    </div>
  );
}
