import { useMemo, useRef, isValidElement, Children } from "react";
import type { ReactElement } from "react";
import { NurbsCurve as NurbsCurveCore, NurbsSurface as NurbsSurfaceCore } from "../core";
import { BufferGeometry, Float32BufferAttribute } from "three";
import type { MeshProps } from "@react-three/fiber";
import { NurbsSurface } from "./NurbsSurface";
import { NurbsCurve } from "./NurbsCurve";
import earcut from "earcut";
import {
  generateUniformKnots,
  projectPointToSurface,
  computeNormal,
  adaptiveSampleNurbsCurve2D,
  projectCurveOntoSurface,
} from "../utils/nurbs";
import { isMaterialElement } from "../utils/materials";

export interface TrimmedSurfaceProps extends Omit<MeshProps, "geometry"> {
  color?: string;
  trimCurveResolution?: number;
  adaptiveMaxAngleDeg?: number;
  adaptiveMaxDepth?: number;
  wireframe?: boolean;
  world?: boolean;
  children?: ReactElement | ReactElement[];
}

export function TrimmedSurface({
  color: _color = "#ffffff",
  trimCurveResolution = 200,
  adaptiveMaxAngleDeg = 5,
  adaptiveMaxDepth = 10,
  wireframe: _wireframe = false,
  world = false,
  children,
  ...meshProps
}: TrimmedSurfaceProps) {
  const { surfaceChild, curveChildren, materialChild } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    let surfaceChild: ReactElement | null = null;
    const curveChildren: ReactElement[] = [];
    let materialChild: ReactElement | null = null;

    for (const child of childrenArray) {
      if (!isValidElement(child)) continue;
      if (child.type === NurbsSurface || child.type === "NurbsSurface") {
        surfaceChild = child;
      } else if (child.type === NurbsCurve || child.type === "NurbsCurve") {
        curveChildren.push(child);
      } else if (isMaterialElement(child)) {
        materialChild = child as ReactElement;
      }
    }

    return { surfaceChild, curveChildren, materialChild };
  }, [children]);

  const geometryRef = useRef<BufferGeometry | null>(null);

  const geometry = useMemo(() => {
    if (!surfaceChild || curveChildren.length === 0) {
      if (!surfaceChild) console.warn("TrimmedSurface requires a NurbsSurface child");
      if (curveChildren.length === 0) console.warn("TrimmedSurface requires at least one NurbsCurve");
      return null;
    }

    try {
      const surfaceProps = surfaceChild.props;
      const knotsU = generateUniformKnots(surfaceProps.controlPoints.length, surfaceProps.degreeU);
      const knotsV = generateUniformKnots(surfaceProps.controlPoints[0].length, surfaceProps.degreeV);

      const verbSurface = NurbsSurfaceCore.byKnotsControlPointsWeights(
        surfaceProps.degreeU,
        surfaceProps.degreeV,
        knotsU,
        knotsV,
        surfaceProps.controlPoints,
        surfaceProps.weights
      );

      const trimmingCurves = curveChildren
        .map((child) => {
          const curveProps = child.props;
          const resolvedKnots = curveProps.knots ?? generateUniformKnots(curveProps.points.length, curveProps.degree ?? 2);
          const curve = NurbsCurveCore.byKnotsControlPointsWeights(
            curveProps.degree ?? 2,
            resolvedKnots,
            curveProps.points,
            curveProps.weights ?? Array(curveProps.points.length).fill(1)
          );

          if (world) {
            const projectedUVs = projectCurveOntoSurface(
              verbSurface, curve, trimCurveResolution
            );
            if (projectedUVs.length > 1) {
              const projectedKnots = generateUniformKnots(projectedUVs.length, curveProps.degree ?? 2);
              return NurbsCurveCore.byKnotsControlPointsWeights(
                curveProps.degree ?? 2,
                projectedKnots,
                projectedUVs.map(([u, v]) => [u, v, 0]),
                Array(projectedUVs.length).fill(1)
              );
            }
            return null;
          }

          return curve;
        })
        .filter((curve): curve is NurbsCurveCore => curve !== null);

      const uvLoops: [number, number][][] = trimmingCurves.map((curve) =>
        adaptiveSampleNurbsCurve2D(curve, adaptiveMaxAngleDeg, adaptiveMaxDepth)
      );

      const earcutVertices: number[] = [];
      const holeIndices: number[] = [];
      let vertexCount = 0;

      uvLoops.forEach((loop, i) => {
        if (i > 0) holeIndices.push(vertexCount);
        loop.forEach(([u, v]) => {
          earcutVertices.push(u, v);
          vertexCount++;
        });
      });

      const triangles = earcut(earcutVertices, holeIndices, 2);

      const positions: number[] = [];
      const normals: number[] = [];
      const uvParams: number[] = [];

      const usedVertices: [number, number][] = [];
      for (let i = 0; i < earcutVertices.length; i += 2) {
        usedVertices.push([earcutVertices[i], earcutVertices[i + 1]]);
      }

      for (const [u, v] of usedVertices) {
        const p = projectPointToSurface(verbSurface, u, v);
        const n = computeNormal(verbSurface, u, v);
        positions.push(p.x, p.y, p.z);
        normals.push(n.x, n.y, n.z);
        uvParams.push(u, v);
      }

      // Imperatively update geometry (same pattern as NurbsSurface)
      if (geometryRef.current) geometryRef.current.dispose();
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
      geo.setAttribute("normal", new Float32BufferAttribute(normals, 3));
      geo.setAttribute("uv", new Float32BufferAttribute(uvParams, 2));
      geo.setIndex(Array.from(triangles));
      geo.computeBoundingSphere();
      geometryRef.current = geo;

      return geo;
    } catch (error) {
      console.error("Error creating trimmed surface:", error);
      return null;
    }
  }, [
    surfaceChild,
    curveChildren,
    trimCurveResolution,
    adaptiveMaxAngleDeg,
    adaptiveMaxDepth,
    world,
  ]);

  if (!geometry || !materialChild) {
    if (!materialChild && surfaceChild && curveChildren.length > 0) {
      console.warn("TrimmedSurface requires a material as a direct child");
    }
    return null;
  }

  return (
    <mesh {...meshProps} geometry={geometry}>
      {materialChild}
    </mesh>
  );
}
