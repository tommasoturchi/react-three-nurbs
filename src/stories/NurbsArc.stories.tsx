import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NurbsArc } from "../components/NurbsArc";

const meta = {
  title: "Curves/NurbsArc",
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
    color: { control: "color", description: "Arc color" },
    radius: {
      control: { type: "range", min: 0.1, max: 3, step: 0.1 },
      description: "Arc radius",
    },
    startAngle: {
      control: { type: "range", min: 0, max: 6.28, step: 0.1 },
      description: "Start angle (radians)",
    },
    endAngle: {
      control: { type: "range", min: 0, max: 6.28, step: 0.1 },
      description: "End angle (radians)",
    },
    resolution: {
      control: { type: "range", min: 10, max: 100, step: 5 },
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
    color: "#ff6600",
    radius: 1,
    startAngle: 0,
    endAngle: Math.PI / 2,
    resolution: 50,
    lineWidth: 2,
  },
  render: ({
    color = "#ff6600",
    radius = 1,
    startAngle = 0,
    endAngle = Math.PI / 2,
    resolution = 50,
    lineWidth = 2,
  }: Record<string, any>) => (
    <NurbsArc
      center={[0, 0, 0]}
      radius={radius}
      startAngle={startAngle}
      endAngle={endAngle}
      resolution={resolution}
      color={color}
      lineWidth={lineWidth}
    />
  ),
};

export const Semicircle = {
  args: {
    color: "#00cc66",
    radius: 1.5,
    startAngle: 0,
    endAngle: Math.PI,
    resolution: 50,
    lineWidth: 2,
  },
  render: ({
    color = "#00cc66",
    radius = 1.5,
    startAngle = 0,
    endAngle = Math.PI,
    resolution = 50,
    lineWidth = 2,
  }: Record<string, any>) => (
    <NurbsArc
      center={[0, 0, 0]}
      radius={radius}
      startAngle={startAngle}
      endAngle={endAngle}
      resolution={resolution}
      color={color}
      lineWidth={lineWidth}
    />
  ),
};
