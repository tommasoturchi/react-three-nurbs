import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NurbsCurve } from "../components/NurbsCurve";

const meta = {
  title: "Curves/NURBS Curve",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
  argTypes: {
    color: { control: "color", description: "Line color" },
    resolution: {
      control: { type: "range", min: 10, max: 200, step: 10 },
      description: "Number of points sampled along the curve",
    },
    lineWidth: {
      control: { type: "range", min: 1, max: 10, step: 0.5 },
      description: "Line width",
    },
    dashed: { control: "boolean", description: "Dashed line" },
  },
} satisfies Meta;

export default meta;

export const Degree2Curve = {
  args: {
    color: "#ff0000",
    resolution: 50,
    lineWidth: 2,
    dashed: false,
  },
  render: ({
    color = "#ff0000",
    resolution = 50,
    lineWidth = 2,
    dashed = false,
  }: Record<string, any>) => (
    <NurbsCurve
      points={[
        [0, 0, 0],
        [1, 1, 0],
        [2, 0, 0],
      ]}
      degree={2}
      knots={[0, 0, 0, 1, 1, 1]}
      resolution={resolution}
      color={color}
      lineWidth={lineWidth}
      dashed={dashed}
    />
  ),
};

export const Degree3Curve = {
  args: {
    color: "#00ff00",
    resolution: 50,
    lineWidth: 2,
    dashed: false,
  },
  render: ({
    color = "#00ff00",
    resolution = 50,
    lineWidth = 2,
    dashed = false,
  }: Record<string, any>) => (
    <NurbsCurve
      points={[
        [0, 0, 0],
        [1, 1, 0],
        [2, 1, 0],
        [3, 0, 0],
      ]}
      degree={3}
      knots={[0, 0, 0, 0, 1, 1, 1, 1]}
      resolution={resolution}
      color={color}
      lineWidth={lineWidth}
      dashed={dashed}
    />
  ),
};

export const WeightedCurve = {
  args: {
    color: "#0000ff",
    resolution: 50,
    lineWidth: 2,
    dashed: false,
  },
  render: ({
    color = "#0000ff",
    resolution = 50,
    lineWidth = 2,
    dashed = false,
  }: Record<string, any>) => (
    <NurbsCurve
      points={[
        [0, 0, 0],
        [1, 1, 0],
        [2, 0, 0],
      ]}
      degree={2}
      knots={[0, 0, 0, 1, 1, 1]}
      weights={[1, 2, 1]}
      resolution={resolution}
      color={color}
      lineWidth={lineWidth}
      dashed={dashed}
    />
  ),
};

export const AutoKnots = {
  args: {
    color: "#ff00ff",
    resolution: 80,
    lineWidth: 2,
    dashed: false,
  },
  render: ({
    color = "#ff00ff",
    resolution = 80,
    lineWidth = 2,
    dashed = false,
  }: Record<string, any>) => (
    <NurbsCurve
      points={[
        [0, 0, 0],
        [0.5, 1, 0],
        [1.5, -0.5, 0.5],
        [2, 1, 1],
        [3, 0, 0],
      ]}
      degree={3}
      resolution={resolution}
      color={color}
      lineWidth={lineWidth}
      dashed={dashed}
    />
  ),
};
