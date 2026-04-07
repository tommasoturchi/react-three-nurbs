import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { InterpolatedSurface } from "../components/InterpolatedSurface";

const meta = {
  title: "Surfaces/Interpolated Surface",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
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
  },
} satisfies Meta;

export default meta;

// 4x4 grid of through-points with some curvature
const gridPoints = [
  [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]],
  [[0, 1, 0], [1, 1, 0.5], [2, 1, 0.5], [3, 1, 0]],
  [[0, 2, 0], [1, 2, 1.0], [2, 2, 1.0], [3, 2, 0]],
  [[0, 3, 0], [1, 3, 0], [2, 3, 0], [3, 3, 0]],
];

export const Default = {
  args: {
    color: "#44ccff",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
  },
  render: ({
    color = "#44ccff",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
  }: Record<string, any>) => (
    <>
      <InterpolatedSurface
        points={gridPoints}
        degreeU={3}
        degreeV={3}
        resolutionU={resolutionU}
        resolutionV={resolutionV}
      >
        <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      </InterpolatedSurface>
      {/* Show the through-points */}
      {gridPoints.flat().map((pt, i) => (
        <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>
      ))}
    </>
  ),
};

export const Wireframe = {
  args: {
    color: "#ff8844",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
  },
  render: ({
    color = "#ff8844",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
  }: Record<string, any>) => (
    <InterpolatedSurface
      points={gridPoints}
      degreeU={3}
      degreeV={3}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
    >
      <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </InterpolatedSurface>
  ),
};
