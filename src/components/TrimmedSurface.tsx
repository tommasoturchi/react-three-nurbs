import { useState, useEffect, isValidElement, Children } from "react";
import type { ReactElement } from "react";
import { useThree } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute } from "three";
import verb from "verb-nurbs";
import type { MeshProps } from "@react-three/fiber";
import { NurbsSurface } from "./NurbsSurface";
import { NurbsCurve } from "./NurbsCurve";
import earcut from "earcut";
import {
  projectPointToSurface,
  computeNormal,
  adaptiveSampleNurbsCurve2D,
  projectPointToSurfaceUV,
} from "../utils/nurbs";

interface Props extends Omit<MeshProps, "geometry"> {
  color?: string;
  trimCurveResolution?: number;
  adaptiveMaxAngleDeg?: number;
  adaptiveMaxDepth?: number;
  wireframe?: boolean;
  world?: boolean;
  children?: ReactElement | ReactElement[];
}

export function TrimmedSurface({
  color = "#ffffff",
  trimCurveResolution = 200,
  adaptiveMaxAngleDeg = 5,
  adaptiveMaxDepth = 10,
  wireframe = false,
  world = false,
  children,
  ...meshProps
}: Props) {
  const { scene } = useThree();
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    if (!children) return;

    const childrenArray = Children.toArray(children);
    if (childrenArray.length < 2) {
      console.warn(
        "TrimmedSurface requires a NurbsSurface and at least one NurbsCurve"
      );
      return;
    }

    const surfaceChild = childrenArray.find(
      (child) =>
        isValidElement(child) &&
        [NurbsSurface, "NurbsSurface"].includes(child.type as any)
    );

    if (!surfaceChild || !isValidElement(surfaceChild)) {
      console.warn("First child must be a NurbsSurface");
      return;
    }

    const curveChildren = childrenArray.filter(
      (child) =>
        isValidElement(child) &&
        [NurbsCurve, "NurbsCurve"].includes(child.type as any)
    );

    if (curveChildren.length === 0) {
      console.warn("At least one NurbsCurve is required");
      return;
    }

    const surfaceProps = surfaceChild.props;
    const verbSurface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(
      surfaceProps.degreeU,
      surfaceProps.degreeV,
      Array(surfaceProps.controlPoints.length + surfaceProps.degreeU + 1)
        .fill(0)
        .map((_, i) => {
          if (i < surfaceProps.degreeU + 1) return 0;
          if (i >= surfaceProps.controlPoints.length) return 1;
          return (
            (i - surfaceProps.degreeU) /
            (surfaceProps.controlPoints.length - surfaceProps.degreeU)
          );
        }),
      Array(surfaceProps.controlPoints[0].length + surfaceProps.degreeV + 1)
        .fill(0)
        .map((_, i) => {
          if (i < surfaceProps.degreeV + 1) return 0;
          if (i >= surfaceProps.controlPoints[0].length) return 1;
          return (
            (i - surfaceProps.degreeV) /
            (surfaceProps.controlPoints[0].length - surfaceProps.degreeV)
          );
        }),
      surfaceProps.controlPoints,
      surfaceProps.weights
    );

    const trimmingCurves = curveChildren
      .map((child) => {
        if (!isValidElement(child)) return null;
        const curveProps = child.props;
        const curve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
          curveProps.degree,
          curveProps.knots,
          curveProps.points,
          curveProps.weights
        );

        if (world) {
          // If in world space, project curve points onto surface to get UV coordinates
          const numPoints = trimCurveResolution;
          const projectedPoints: [number, number][] = [];
          for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const point = curve.point(t);
            // Project 3D point onto surface to get UV coordinates
            const uv = projectPointToSurfaceUV(verbSurface, point);
            if (uv) {
              projectedPoints.push(uv);
            }
          }
          // Create new curve in UV space using projected points
          if (projectedPoints.length > 0) {
            return verb.geom.NurbsCurve.byKnotsControlPointsWeights(
              curveProps.degree,
              Array(projectedPoints.length + curveProps.degree + 1)
                .fill(0)
                .map((_, i) => {
                  if (i < curveProps.degree + 1) return 0;
                  if (i >= projectedPoints.length) return 1;
                  return (
                    (i - curveProps.degree) /
                    (projectedPoints.length - curveProps.degree)
                  );
                }),
              projectedPoints.map(([u, v]) => [u, v, 0]),
              Array(projectedPoints.length).fill(1)
            );
          }
          return null;
        }

        return curve;
      })
      .filter((curve): curve is verb.geom.NurbsCurve => curve !== null);

    // Sample all curves
    const uvLoops: [number, number][][] = trimmingCurves.map((curve) =>
      adaptiveSampleNurbsCurve2D(curve, adaptiveMaxAngleDeg, adaptiveMaxDepth)
    );

    // Flatten UVs for earcut
    const earcutVertices: number[] = [];
    const holeIndices: number[] = [];
    let vertexCount = 0;

    // Add curve points first to maintain boundary
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

    // Add only vertices actually used by triangles
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

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new Float32BufferAttribute(uvParams, 2));
    geometry.setIndex(triangles);

    setGeometry(geometry);

    return () => geometry.dispose();
  }, [
    children,
    color,
    wireframe,
    scene,
    trimCurveResolution,
    adaptiveMaxAngleDeg,
    adaptiveMaxDepth,
    world,
  ]);

  if (!geometry) return null;

  // Find material that is a direct child of TrimmedSurface
  const materialChild = Children.toArray(children).find(
    (child) =>
      isValidElement(child) &&
      child.type.toString().includes("Material") &&
      // Exclude materials that are children of NurbsSurface or NurbsCurve
      ![NurbsSurface, NurbsCurve, "NurbsSurface", "NurbsCurve"].includes(
        child.type as any
      )
  );

  if (!materialChild) {
    console.warn("TrimmedSurface requires a material as a direct child");
    return null;
  }

  return (
    <mesh {...meshProps}>
      <primitive object={geometry} attach="geometry" />
      {materialChild}
    </mesh>
  );
}
