import { useState, useMemo, useCallback, useRef } from "react";
import { Vector3, Plane, Raycaster, Vector2 } from "three";
import { useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";

export interface ControlPointHandle {
  position: [number, number, number];
  index: number[];
  bind: {
    onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
  };
}

export interface UseControlPointDragOptions {
  controlPoints: number[][][] | number[][];
  onControlPointChange: (
    newPoints: number[][][] | number[][],
    index: number[]
  ) => void;
  dragPlane?: "xy" | "xz" | "yz" | "screen";
  handleSize?: number;
}

export interface UseControlPointDragResult {
  handles: ControlPointHandle[];
  isDragging: boolean;
  activeIndex: number[] | null;
  /** Spread this on a large invisible mesh to capture drag events */
  dragBind: {
    onPointerMove: (e: ThreeEvent<PointerEvent>) => void;
    onPointerUp: (e: ThreeEvent<PointerEvent>) => void;
  };
}

function is3D(cp: number[][][] | number[][]): cp is number[][][] {
  return Array.isArray(cp[0]) && Array.isArray(cp[0][0]);
}

function getPlaneNormal(
  dragPlane: "xy" | "xz" | "yz" | "screen",
  cameraDirection: Vector3
): Vector3 {
  switch (dragPlane) {
    case "xy":
      return new Vector3(0, 0, 1);
    case "xz":
      return new Vector3(0, 1, 0);
    case "yz":
      return new Vector3(1, 0, 0);
    case "screen":
    default:
      return cameraDirection.clone().negate();
  }
}

export function useControlPointDrag({
  controlPoints,
  onControlPointChange,
  dragPlane = "screen",
}: UseControlPointDragOptions): UseControlPointDragResult {
  const { camera } = useThree();
  const [activeIndex, setActiveIndex] = useState<number[] | null>(null);

  const activeIndexRef = useRef<number[] | null>(null);
  const dragPlaneRef = useRef<Plane>(new Plane());
  const raycasterRef = useRef(new Raycaster());
  const controlPointsRef = useRef(controlPoints);
  const onChangeRef = useRef(onControlPointChange);
  const rafRef = useRef<number | null>(null);
  const pendingPointRef = useRef<number[] | null>(null);
  controlPointsRef.current = controlPoints;
  onChangeRef.current = onControlPointChange;

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>, index: number[]) => {
      e.stopPropagation();
      activeIndexRef.current = index;
      setActiveIndex(index);

      const hitPoint = e.point.clone();
      const cameraDir = new Vector3();
      camera.getWorldDirection(cameraDir);
      const planeNormal = getPlaneNormal(dragPlane, cameraDir);
      dragPlaneRef.current.setFromNormalAndCoplanarPoint(planeNormal, hitPoint);
    },
    [camera, dragPlane]
  );

  const onDragMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const idx = activeIndexRef.current;
      if (!idx) return;
      e.stopPropagation();

      // Use R3F's ray directly
      const ray = e.ray ?? raycasterRef.current.ray;
      if (e.ray === undefined) {
        // fallback: construct from pointer
        const ndc = new Vector2(e.pointer.x, e.pointer.y);
        raycasterRef.current.setFromCamera(ndc, camera);
      }

      const intersection = new Vector3();
      if (ray.intersectPlane(dragPlaneRef.current, intersection)) {
        pendingPointRef.current = [intersection.x, intersection.y, intersection.z];

        // Throttle to one update per animation frame
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            const point = pendingPointRef.current;
            const curIdx = activeIndexRef.current;
            if (!point || !curIdx) return;

            const cp = controlPointsRef.current;
            if (is3D(cp)) {
              const newCP = cp.map((row) => row.map((pt) => [...pt]));
              newCP[curIdx[0]][curIdx[1]] = point;
              onChangeRef.current(newCP, curIdx);
            } else {
              const newCP = cp.map((pt) => [...pt]);
              newCP[curIdx[0]] = point;
              onChangeRef.current(newCP, curIdx);
            }
          });
        }
      }
    },
    [camera]
  );

  const onDragUp = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    // Flush any pending point
    const point = pendingPointRef.current;
    const idx = activeIndexRef.current;
    if (point && idx) {
      const cp = controlPointsRef.current;
      if (is3D(cp)) {
        const newCP = cp.map((row) => row.map((pt) => [...pt]));
        newCP[idx[0]][idx[1]] = point;
        onChangeRef.current(newCP, idx);
      } else {
        const newCP = cp.map((pt) => [...pt]);
        newCP[idx[0]] = point;
        onChangeRef.current(newCP, idx);
      }
    }
    pendingPointRef.current = null;
    activeIndexRef.current = null;
    setActiveIndex(null);
  }, []);

  const handles = useMemo(() => {
    const result: ControlPointHandle[] = [];

    if (is3D(controlPoints)) {
      for (let i = 0; i < controlPoints.length; i++) {
        for (let j = 0; j < controlPoints[i].length; j++) {
          const pt = controlPoints[i][j];
          const idx = [i, j];
          result.push({
            position: [pt[0], pt[1], pt[2] ?? 0] as [number, number, number],
            index: idx,
            bind: {
              onPointerDown: (e: ThreeEvent<PointerEvent>) => onPointerDown(e, idx),
            },
          });
        }
      }
    } else {
      for (let i = 0; i < controlPoints.length; i++) {
        const pt = controlPoints[i];
        const idx = [i];
        result.push({
          position: [pt[0], pt[1], pt[2] ?? 0] as [number, number, number],
          index: idx,
          bind: {
            onPointerDown: (e: ThreeEvent<PointerEvent>) => onPointerDown(e, idx),
          },
        });
      }
    }

    return result;
  }, [controlPoints, onPointerDown]);

  return {
    handles,
    isDragging: activeIndex !== null,
    activeIndex,
    dragBind: {
      onPointerMove: onDragMove,
      onPointerUp: onDragUp,
    },
  };
}
