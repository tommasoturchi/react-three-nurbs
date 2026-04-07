import { useMemo, useRef } from "react";
import type { ReactElement } from "react";
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from "three";
import type { MeshProps } from "@react-three/fiber";
import { isMaterialElement } from "../utils/materials";
import { useBooleanOperation } from "../hooks/useBooleanOperation";
import type { BooleanOperation, ShapeDescriptor } from "../occt/boolean";

export interface BooleanResultProps extends Omit<MeshProps, "geometry" | "ref"> {
  shapeA: ShapeDescriptor | null;
  shapeB: ShapeDescriptor | null;
  operation: BooleanOperation;
  meshDeflection?: number;
  color?: string;
  wireframe?: boolean;
  children?: ReactElement;
}

export const BooleanResult = ({
  shapeA,
  shapeB,
  operation,
  meshDeflection = 0.1,
  color = "#4488ff",
  wireframe = false,
  children,
  ...meshProps
}: BooleanResultProps) => {
  const materialChild = useMemo(() => {
    if (!children) return null;
    if (isMaterialElement(children)) return children;
    return null;
  }, [children]);

  const { mesh, isComputing, error } = useBooleanOperation({
    shapeA,
    shapeB,
    operation,
    meshDeflection,
  });

  const geometryRef = useRef<BufferGeometry | null>(null);

  const geometry = useMemo(() => {
    if (!mesh) return null;

    if (geometryRef.current) geometryRef.current.dispose();
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(mesh.vertices, 3));
    geo.setAttribute("normal", new Float32BufferAttribute(mesh.normals, 3));
    geo.setIndex(Array.from(mesh.indices));
    geo.computeBoundingSphere();
    geometryRef.current = geo;

    return geo;
  }, [mesh]);

  if (isComputing) {
    return (
      <mesh {...meshProps}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#888888" wireframe />
      </mesh>
    );
  }

  if (error) {
    console.error("BooleanResult error:", error);
    return null;
  }

  if (!geometry) return null;

  return (
    <mesh {...meshProps} geometry={geometry}>
      {materialChild ? (
        materialChild
      ) : (
        <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      )}
    </mesh>
  );
};
