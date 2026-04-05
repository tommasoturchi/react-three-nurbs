import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { CoonsPatch } from "../components/CoonsPatch";
import { NurbsCurve } from "../components/NurbsCurve";

const meta = {
  title: "Components/CoonsPatch",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Creates a smooth surface that fills the region enclosed by 4 boundary curves. " +
          "The 4 curves define the edges: bottom (red), top (green), left (blue), right (orange). " +
          "The surface smoothly interpolates between them using bilinear Coons interpolation. " +
          "This is the standard technique for filling holes between surface patches in CAD.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [2, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
  argTypes: {
    color: { control: "color", description: "Surface color" },
    wireframe: { control: "boolean", description: "Wireframe rendering" },
    resolutionU: {
      control: { type: "range", min: 5, max: 60, step: 5 },
      description: "Tessellation resolution in U",
    },
    resolutionV: {
      control: { type: "range", min: 5, max: 60, step: 5 },
      description: "Tessellation resolution in V",
    },
    bulge: {
      control: { type: "range", min: 0, max: 2, step: 0.1 },
      description: "How much the boundary curves bulge upward",
    },
  },
} satisfies Meta;

export default meta;

// The 4 boundary curves form a "saddle" shape when bulge > 0.
// Corners must match: bottom(0)=left(0), bottom(1)=right(0), top(0)=left(1), top(1)=right(1)
function makeBoundaries(bulge: number) {
  // bottom: y=0, x goes 0→2
  const bottom = [[0, 0, 0], [1, 0, bulge * 0.5], [2, 0, 0]];
  // top: y=2, x goes 0→2
  const top = [[0, 2, 0], [1, 2, bulge], [2, 2, 0]];
  // left: x=0, y goes 0→2
  const left = [[0, 0, 0], [0, 1, bulge * 0.3], [0, 2, 0]];
  // right: x=2, y goes 0→2
  const right = [[2, 0, 0], [2, 1, bulge * 0.8], [2, 2, 0]];
  return { bottom, top, left, right };
}

export const Default = {
  args: {
    color: "#6688cc",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
    bulge: 1.0,
  },
  render: ({
    color = "#6688cc",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
    bulge = 1.0,
  }: Record<string, any>) => {
    const { bottom, top, left, right } = makeBoundaries(bulge);
    return (
      <>
        <CoonsPatch resolutionU={resolutionU} resolutionV={resolutionV}>
          <NurbsCurve points={bottom} degree={2} />
          <NurbsCurve points={top} degree={2} />
          <NurbsCurve points={left} degree={2} />
          <NurbsCurve points={right} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </CoonsPatch>
        {/* Boundary curves colored to show which is which */}
        <NurbsCurve points={bottom} degree={2} color="#ff3333" lineWidth={3} />
        <NurbsCurve points={top} degree={2} color="#33ff33" lineWidth={3} />
        <NurbsCurve points={left} degree={2} color="#3333ff" lineWidth={3} />
        <NurbsCurve points={right} degree={2} color="#ffaa00" lineWidth={3} />
        {/* Corner markers */}
        {[bottom[0], bottom[2], top[0], top[2]].map((pt, i) => (
          <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </>
    );
  },
};

export const Wireframe = {
  args: {
    color: "#ff4488",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    bulge: 0.8,
  },
  render: ({
    color = "#ff4488",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
    bulge = 0.8,
  }: Record<string, any>) => {
    const { bottom, top, left, right } = makeBoundaries(bulge);
    return (
      <>
        <CoonsPatch resolutionU={resolutionU} resolutionV={resolutionV}>
          <NurbsCurve points={bottom} degree={2} />
          <NurbsCurve points={top} degree={2} />
          <NurbsCurve points={left} degree={2} />
          <NurbsCurve points={right} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </CoonsPatch>
        <NurbsCurve points={bottom} degree={2} color="#ff3333" lineWidth={3} />
        <NurbsCurve points={top} degree={2} color="#33ff33" lineWidth={3} />
        <NurbsCurve points={left} degree={2} color="#3333ff" lineWidth={3} />
        <NurbsCurve points={right} degree={2} color="#ffaa00" lineWidth={3} />
      </>
    );
  },
};
