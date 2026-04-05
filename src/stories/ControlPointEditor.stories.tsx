import { useState, useRef, useCallback } from "react";
import { DoubleSide } from "three";
import type { Mesh, Group } from "three";
import type { Meta } from "@storybook/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { NurbsSurface as NurbsSurfaceCore } from "../core";
import { NurbsSurface } from "../components/NurbsSurface";
import { useControlPointDrag } from "../hooks/useControlPointDrag";
import { generateUniformKnots } from "../utils/nurbs";

const meta = {
  title: "Hooks/ControlPointEditor",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Story />
        </Canvas>
      </div>
    ),
  ],
  argTypes: {
    handleSize: {
      control: { type: "range", min: 0.02, max: 0.15, step: 0.01 },
      description: "Size of the control point handles",
    },
    color: { control: "color", description: "Surface color" },
    wireframe: { control: "boolean", description: "Wireframe rendering" },
    resolutionU: {
      control: { type: "range", min: 5, max: 60, step: 5 },
      description: "Tessellation resolution in U direction",
    },
    resolutionV: {
      control: { type: "range", min: 5, max: 60, step: 5 },
      description: "Tessellation resolution in V direction",
    },
  },
} satisfies Meta;

export default meta;

const initialControlPoints = [
  [[-1, -1, 0], [-1, 0, 0], [-1, 1, 0]],
  [[0, -1, 0], [0, 0, 1], [0, 1, 0]],
  [[1, -1, 0], [1, 0, 0], [1, 1, 0]],
];

const weights = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

function InteractiveSurface({
  handleSize = 0.06,
  color = "#4488ff",
  wireframe = false,
  resolutionU = 30,
  resolutionV = 30,
}: {
  handleSize?: number;
  color?: string;
  wireframe?: boolean;
  resolutionU?: number;
  resolutionV?: number;
}) {
  const [controlPoints, setControlPoints] = useState(initialControlPoints);

  const livePointsRef = useRef(controlPoints);
  const meshRef = useRef<Mesh>(null);
  const handlesGroupRef = useRef<Group>(null);
  const dirtyRef = useRef(false);

  const onControlPointChange = useCallback(
    (newPoints: number[][][] | number[][]) => {
      livePointsRef.current = newPoints as number[][][];
      dirtyRef.current = true;
    },
    [],
  );

  const { handles, isDragging, activeIndex, dragBind } = useControlPointDrag({
    controlPoints: livePointsRef.current,
    onControlPointChange,
    dragPlane: "screen",
  });

  const wasDraggingRef = useRef(false);

  useFrame(() => {
    if (wasDraggingRef.current && !isDragging) {
      setControlPoints(livePointsRef.current);
      dirtyRef.current = false;
    }
    wasDraggingRef.current = isDragging;

    if (!isDragging || !dirtyRef.current) return;
    dirtyRef.current = false;

    const cp = livePointsRef.current;

    // 1) Update handle sphere positions imperatively
    const group = handlesGroupRef.current;
    if (group) {
      let childIdx = 0;
      for (let i = 0; i < cp.length; i++) {
        for (let j = 0; j < cp[i].length; j++) {
          const sphere = group.children[childIdx++];
          if (sphere) {
            sphere.position.set(cp[i][j][0], cp[i][j][1], cp[i][j][2]);
          }
        }
      }
    }

    // 2) Update surface geometry imperatively
    const mesh = meshRef.current;
    if (!mesh?.geometry) return;
    const posAttr = mesh.geometry.getAttribute("position");
    if (!posAttr) return;

    try {
      const knotsU = generateUniformKnots(cp.length, 2);
      const knotsV = generateUniformKnots(cp[0].length, 2);
      const surf = NurbsSurfaceCore.byKnotsControlPointsWeights(
        2, 2, knotsU, knotsV, cp, weights
      );

      const arr = posAttr.array as Float32Array;
      let vi = 0;
      for (let i = 0; i <= resolutionU; i++) {
        for (let j = 0; j <= resolutionV; j++) {
          const u = i / resolutionU;
          const v = j / resolutionV;
          const pt = surf.point(u, v);
          arr[vi++] = pt[0];
          arr[vi++] = pt[1];
          arr[vi++] = pt[2];
        }
      }
      posAttr.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeBoundingSphere();
    } catch {
      // ignore errors during fast drag
    }
  });

  return (
    <>
      <OrbitControls makeDefault enabled={!isDragging} />
      <Stats />

      <NurbsSurface
        ref={meshRef}
        controlPoints={controlPoints}
        weights={weights}
        degreeU={2}
        degreeV={2}
        resolutionU={resolutionU}
        resolutionV={resolutionV}
        fastNormals
      >
        <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      </NurbsSurface>

      <group ref={handlesGroupRef}>
        {handles.map((handle) => {
          const isActive = activeIndex?.join(",") === handle.index.join(",");
          return (
            <mesh
              key={handle.index.join("-")}
              position={handle.position}
              {...handle.bind}
            >
              <sphereGeometry args={[isActive ? handleSize * 1.5 : handleSize, 16, 16]} />
              <meshBasicMaterial
                color={isActive ? "#ff0000" : isDragging ? "#888888" : "#ffaa00"}
              />
            </mesh>
          );
        })}
      </group>

      {isDragging && (
        <mesh visible={false} {...dragBind}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} side={DoubleSide} />
        </mesh>
      )}
    </>
  );
}

export const Default = {
  args: {
    handleSize: 0.06,
    color: "#4488ff",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
  },
  render: ({
    handleSize = 0.06,
    color = "#4488ff",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
  }: Record<string, any>) => (
    <InteractiveSurface
      handleSize={handleSize}
      color={color}
      wireframe={wireframe}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
    />
  ),
};
