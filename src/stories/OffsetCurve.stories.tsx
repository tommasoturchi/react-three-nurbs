import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NurbsCurve } from "../components/NurbsCurve";
import { OffsetCurve } from "../components/OffsetCurve";

const meta = {
  title: "Components/OffsetCurve",
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
    distance: {
      control: { type: "range", min: -1, max: 1, step: 0.05 },
      description: "Offset distance (positive = one side, negative = other)",
    },
    samples: {
      control: { type: "range", min: 10, max: 100, step: 5 },
      description: "Number of offset sample points",
    },
    color: { control: "color", description: "Offset curve color" },
    lineWidth: {
      control: { type: "range", min: 1, max: 10, step: 0.5 },
      description: "Line width",
    },
  },
} satisfies Meta;

export default meta;

const sourcePoints = [
  [0, 0, 0],
  [0.5, 1, 0],
  [1.5, -0.5, 0],
  [2, 0.5, 0],
  [2.5, 0, 0],
];

export const Default = {
  args: {
    distance: 0.2,
    samples: 50,
    color: "#ff0000",
    lineWidth: 2,
  },
  render: ({
    distance = 0.2,
    samples = 50,
    color = "#ff0000",
    lineWidth = 2,
  }: Record<string, any>) => (
    <>
      <NurbsCurve
        points={sourcePoints}
        degree={3}
        color="#000000"
        lineWidth={2}
      />
      <OffsetCurve
        sourcePoints={sourcePoints}
        sourceDegree={3}
        distance={distance}
        samples={samples}
        color={color}
        lineWidth={lineWidth}
      />
      <OffsetCurve
        sourcePoints={sourcePoints}
        sourceDegree={3}
        distance={-distance}
        samples={samples}
        color="#0066ff"
        lineWidth={lineWidth}
      />
    </>
  ),
};
