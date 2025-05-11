import type { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { LoftedSurface } from "../components/LoftedSurface";
import { NurbsCurve } from "../components/NurbsCurve";
import type { ReactNode } from "react";

const curves = [
  {
    key: "curve1",
    points: [
      [0, 0, 0],
      [10, 0, 0],
      [40, 0, 0],
    ],
    degree: 2,
    knots: [0, 0, 0, 1, 1, 1],
    weights: [1, 1, 1],
  },
  {
    key: "curve2",
    points: [
      [0, 10, 10],
      [10, 5, 10],
      [20, -5, 10],
      [40, 10, 10],
    ],
    degree: 3,
    knots: [0, 0, 0, 0, 1, 1, 1, 1],
    weights: [1, 1, 1, 1],
  },
  {
    key: "curve3",
    points: [
      [0, 0, 20],
      [10, 0, 20],
      [20, 5, 20],
      [40, 0, 20],
    ],
    degree: 3,
    knots: [0, 0, 0, 0, 1, 1, 1, 1],
    weights: [1, 1, 1, 1],
  },
  {
    key: "curve4",
    points: [
      [0, 3, 30],
      [10, -4, 30],
      [20, 10, 30],
      [40, 0, 30],
    ],
    degree: 3,
    knots: [0, 0, 0, 0, 1, 1, 1, 1],
    weights: [1, 1, 1, 1],
  },
];

const meta = {
  title: "Components/LoftedSurface",
  component: LoftedSurface,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story: () => ReactNode) => (
      <div style={{ width: "100%", height: "100%" }}>
        <Canvas camera={{ position: [20, 20, 20], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof LoftedSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExampleLoft: Story = {
  args: {
    resolutionU: 20,
    resolutionV: 20,
    color: "#ff0000",
    wireframe: true,
    children: curves.map((curve) => (
      <NurbsCurve
        key={curve.key}
        points={curve.points}
        degree={curve.degree}
        knots={curve.knots}
        weights={curve.weights}
      />
    )),
  },
  render: (args) => (
    <>
      <LoftedSurface {...args} />
      {curves.map((curve) => (
        <NurbsCurve
          key={`display-${curve.key}`}
          points={curve.points}
          degree={curve.degree}
          knots={curve.knots}
          weights={curve.weights}
          color="#00ff00"
          lineWidth={2}
        />
      ))}
    </>
  ),
};
