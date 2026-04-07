import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { SweptSurface } from "../components/SweptSurface";
import { NurbsCurve } from "../components/NurbsCurve";

const meta = {
  title: "Surfaces/Swept Surface",
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
      description: "Tessellation resolution in U direction",
    },
    resolutionV: {
      control: { type: "range", min: 5, max: 60, step: 5 },
      description: "Tessellation resolution in V direction",
    },
  },
} satisfies Meta;

export default meta;

export const Default = {
  args: {
    color: "#44ff88",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
  },
  render: ({
    color = "#44ff88",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
  }: Record<string, any>) => (
    <SweptSurface resolutionU={resolutionU} resolutionV={resolutionV}>
      <NurbsCurve
        points={[
          [0, -0.2, 0],
          [0.2, 0, 0],
          [0, 0.2, 0],
          [-0.2, 0, 0],
          [0, -0.2, 0],
        ]}
        degree={2}
      />
      <NurbsCurve
        points={[
          [0, 0, 0],
          [1, 1, 0.5],
          [2, 0, 1],
          [3, -1, 1.5],
          [4, 0, 2],
        ]}
        degree={3}
      />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </SweptSurface>
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
    <SweptSurface resolutionU={resolutionU} resolutionV={resolutionV}>
      <NurbsCurve
        points={[
          [0, -0.3, 0],
          [0.3, 0, 0],
          [0, 0.3, 0],
          [-0.3, 0, 0],
          [0, -0.3, 0],
        ]}
        degree={2}
      />
      <NurbsCurve
        points={[
          [0, 0, 0],
          [1, 0, 1],
          [2, 1, 2],
          [3, 0, 3],
        ]}
        degree={2}
      />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </SweptSurface>
  ),
};
