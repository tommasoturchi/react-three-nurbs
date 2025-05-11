import { useState, useEffect, isValidElement } from "react";
import { useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  Float32BufferAttribute,
  MeshPhongMaterial,
  Mesh,
  DoubleSide,
  Color,
} from "three";
import verb from "verb-nurbs";
import type { ReactElement } from "react";
import type { MeshProps } from "@react-three/fiber";

interface Props extends Omit<MeshProps, "geometry"> {
  controlPoints: number[][][];
  weights: number[][];
  degreeU: number;
  degreeV: number;
  color?: string;
  wireframe?: boolean;
  children?: ReactElement;
}

export function NurbsSurface({
  controlPoints,
  weights,
  degreeU,
  degreeV,
  color = "#ffffff",
  wireframe = false,
  children,
  ...meshProps
}: Props) {
  const { scene } = useThree();
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    // Create verb-nurbs surface
    const numKnotsU = controlPoints.length + degreeU + 1;
    const numKnotsV = controlPoints[0].length + degreeV + 1;

    // Create uniform knot vectors
    const knotsU = Array(numKnotsU)
      .fill(0)
      .map((_, i) => {
        if (i < degreeU + 1) return 0;
        if (i >= numKnotsU - degreeU - 1) return 1;
        return (i - degreeU) / (numKnotsU - 2 * degreeU - 1);
      });

    const knotsV = Array(numKnotsV)
      .fill(0)
      .map((_, i) => {
        if (i < degreeV + 1) return 0;
        if (i >= numKnotsV - degreeV - 1) return 1;
        return (i - degreeV) / (numKnotsV - 2 * degreeV - 1);
      });

    const verbSurface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(
      degreeU,
      degreeV,
      knotsU,
      knotsV,
      controlPoints,
      weights
    );

    // Create geometry for rendering
    const geometry = new BufferGeometry();
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    // Sample points and create triangles
    const uSegments = 20;
    const vSegments = 20;
    const uStep = 1 / uSegments;
    const vStep = 1 / vSegments;

    // Create vertices
    for (let i = 0; i <= uSegments; i++) {
      for (let j = 0; j <= vSegments; j++) {
        const u = i * uStep;
        const v = j * vStep;
        const point = verbSurface.point(u, v);

        // Calculate normal using finite differences
        const epsilon = 0.0001;
        const pu = verbSurface.point(u + epsilon, v);
        const pv = verbSurface.point(u, v + epsilon);
        const p = verbSurface.point(u, v);
        const du = pu.map((val, i) => (val - p[i]) / epsilon);
        const dv = pv.map((val, i) => (val - p[i]) / epsilon);
        const normal = [
          du[1] * dv[2] - du[2] * dv[1],
          du[2] * dv[0] - du[0] * dv[2],
          du[0] * dv[1] - du[1] * dv[0],
        ];
        const length = Math.sqrt(
          normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]
        );
        const normalizedNormal = normal.map((n) => n / length);

        positions.push(...point);
        normals.push(...normalizedNormal);
      }
    }

    // Create indices for triangles
    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (vSegments + 1) + j;
        const d = c + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);

    setGeometry(geometry);

    // Create default material if no children provided
    if (!children) {
      const material = new MeshPhongMaterial({
        color: new Color(color),
        side: DoubleSide,
        wireframe,
      });

      const mesh = new Mesh(geometry, material);
      scene.add(mesh);

      return () => {
        scene.remove(mesh);
        geometry.dispose();
        material.dispose();
      };
    }

    return () => {
      geometry.dispose();
    };
  }, [
    controlPoints,
    weights,
    degreeU,
    degreeV,
    color,
    wireframe,
    scene,
    children,
  ]);

  if (!geometry) return null;

  // If children are provided, use R3F primitives
  if (children) {
    // Validate that children is a material
    if (
      !isValidElement(children) ||
      !children.type.toString().includes("Material")
    ) {
      console.warn("NurbsSurface children must be a material component");
      return null;
    }

    return (
      <mesh {...meshProps}>
        <primitive object={geometry} attach="geometry" />
        {children}
      </mesh>
    );
  }

  return null;
}
