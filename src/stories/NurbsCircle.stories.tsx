import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NurbsCircle } from "../components/NurbsCircle";

const meta = {
  title: "Curves/Circle",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
  argTypes: {
    color: { control: "color", description: "Circle color" },
    radius: {
      control: { type: "range", min: 0.1, max: 3, step: 0.1 },
      description: "Circle radius",
    },
    resolution: {
      control: { type: "range", min: 16, max: 128, step: 8 },
      description: "Sampling resolution",
    },
    lineWidth: {
      control: { type: "range", min: 1, max: 10, step: 0.5 },
      description: "Line width",
    },
  },
} satisfies Meta;

export default meta;

export const Default = {
  args: {
    color: "#0066ff",
    radius: 1,
    resolution: 64,
    lineWidth: 2,
  },
  render: ({
    color = "#0066ff",
    radius = 1,
    resolution = 64,
    lineWidth = 2,
  }: Record<string, any>) => (
    <NurbsCircle
      center={[0, 0, 0]}
      radius={radius}
      resolution={resolution}
      color={color}
      lineWidth={lineWidth}
    />
  ),
};

export const TiltedCircle = {
  args: {
    color: "#ff0066",
    radius: 1.5,
    resolution: 64,
    lineWidth: 2,
  },
  render: ({
    color = "#ff0066",
    radius = 1.5,
    resolution = 64,
    lineWidth = 2,
  }: Record<string, any>) => (
    <NurbsCircle
      center={[0, 0, 0]}
      xaxis={[1, 0, 0]}
      yaxis={[0, 1, 1]}
      radius={radius}
      resolution={resolution}
      color={color}
      lineWidth={lineWidth}
    />
  ),
};
