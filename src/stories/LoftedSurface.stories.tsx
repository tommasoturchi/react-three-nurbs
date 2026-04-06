import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { LoftedSurface } from "../components/LoftedSurface";
import { NurbsCurve } from "../components/NurbsCurve";

const meta = {
  title: "Surfaces/LoftedSurface",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [20, 20, 20], fov: 50 }}>
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
    degreeV: {
      control: { type: "range", min: 1, max: 3, step: 1 },
      description: "Loft degree in V direction",
    },
  },
} satisfies Meta;

export default meta;

const curves = [
  { key: "c1", points: [[0, 0, 0], [10, 0, 0], [40, 0, 0]], degree: 2, knots: [0, 0, 0, 1, 1, 1] },
  { key: "c2", points: [[0, 10, 10], [10, 5, 10], [20, -5, 10], [40, 10, 10]], degree: 3, knots: [0, 0, 0, 0, 1, 1, 1, 1] },
  { key: "c3", points: [[0, 0, 20], [10, 0, 20], [20, 5, 20], [40, 0, 20]], degree: 3, knots: [0, 0, 0, 0, 1, 1, 1, 1] },
  { key: "c4", points: [[0, 3, 30], [10, -4, 30], [20, 10, 30], [40, 0, 30]], degree: 3, knots: [0, 0, 0, 0, 1, 1, 1, 1] },
];

export const ExampleLoft = {
  args: {
    color: "#ff0000",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    degreeV: 3,
  },
  render: ({
    color = "#ff0000",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
    degreeV = 3,
  }: Record<string, any>) => (
    <>
      <LoftedSurface
        resolutionU={resolutionU}
        resolutionV={resolutionV}
        degreeV={degreeV}
      >
        {curves.map((c) => (
          <NurbsCurve key={c.key} points={c.points} degree={c.degree} knots={c.knots} />
        ))}
        <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      </LoftedSurface>
      {curves.map((c) => (
        <NurbsCurve
          key={`vis-${c.key}`}
          points={c.points}
          degree={c.degree}
          knots={c.knots}
          color="#00ff00"
          lineWidth={2}
        />
      ))}
    </>
  ),
};
