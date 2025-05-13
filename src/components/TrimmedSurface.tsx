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
  sampleNurbsCurve2D,
} from "../utils/nurbs";

interface Props extends Omit<MeshProps, "geometry"> {
  color?: string;
  wireframe?: boolean;
  children?: ReactElement | ReactElement[];
}

export function TrimmedSurface({
  color = "#ffffff",
  wireframe = false,
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
        return verb.geom.NurbsCurve.byKnotsControlPointsWeights(
          curveProps.degree,
          curveProps.knots,
          curveProps.points,
          curveProps.weights
        );
      })
      .filter((curve): curve is verb.geom.NurbsCurve => curve !== null);

    // Sample all curves
    const uvLoops: [number, number][][] = trimmingCurves.map((curve) =>
      sampleNurbsCurve2D(curve, 200)
    );

    // Flatten UVs for earcut
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
  }, [children, color, wireframe, scene]);

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
