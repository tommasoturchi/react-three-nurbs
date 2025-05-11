import type { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NurbsCurve } from "../components/NurbsCurve";
import type { ReactNode } from "react";

const meta = {
  title: "Components/NurbsCurve",
  component: NurbsCurve,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story: () => ReactNode) => (
      <div style={{ width: "100%", height: "100%" }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof NurbsCurve>;

export default meta;
type Story = StoryObj<typeof meta>;

// Non-weighted curve of degree 2
export const Degree2Curve: Story = {
  args: {
    points: [
      [0, 0, 0],
      [1, 1, 0],
      [2, 0, 0],
    ],
    degree: 2,
    knots: [0, 0, 0, 1, 1, 1],
    curveResolution: 50,
    color: "#ff0000",
    lineWidth: 1,
  },
};

// Non-weighted curve of degree 3
export const Degree3Curve: Story = {
  args: {
    points: [
      [0, 0, 0],
      [1, 1, 0],
      [2, 1, 0],
      [3, 0, 0],
    ],
    degree: 3,
    knots: [0, 0, 0, 0, 1, 1, 1, 1],
    curveResolution: 50,
    color: "#00ff00",
    lineWidth: 1,
  },
};

// Weighted curve to demonstrate the effect of varying weights
export const WeightedCurve: Story = {
  args: {
    points: [
      [0, 0, 0],
      [1, 1, 0],
      [2, 0, 0],
    ],
    degree: 2,
    knots: [0, 0, 0, 1, 1, 1],
    weights: [1, 2, 1],
    curveResolution: 50,
    color: "#0000ff",
    lineWidth: 1,
  },
};
