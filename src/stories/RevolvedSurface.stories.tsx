import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { RevolvedSurface } from "../components/RevolvedSurface";
import { NurbsCurve } from "../components/NurbsCurve";

const meta = {
  title: "Surfaces/RevolvedSurface",
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
    angle: {
      control: { type: "range", min: 0.1, max: 6.28, step: 0.1 },
      description: "Rotation angle in radians",
    },
  },
} satisfies Meta;

export default meta;

const profilePoints = [
  [0, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 0],
];

export const Default = {
  args: {
    color: "#ff0000",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    angle: 2 * Math.PI,
  },
  render: ({
    color = "#ff0000",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
    angle = 2 * Math.PI,
  }: Record<string, any>) => (
    <RevolvedSurface
      center={[0, 0, 0]}
      axis={[0, 1, 0]}
      angle={angle}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
    >
      <NurbsCurve
        points={profilePoints}
        degree={3}
        knots={[0, 0, 0, 0, 1, 1, 1, 1]}
      />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </RevolvedSurface>
  ),
};

export const PartialRevolution = {
  args: {
    color: "#00ccff",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
    angle: Math.PI,
  },
  render: ({
    color = "#00ccff",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
    angle = Math.PI,
  }: Record<string, any>) => (
    <RevolvedSurface
      center={[0, 0, 0]}
      axis={[0, 1, 0]}
      angle={angle}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
    >
      <NurbsCurve
        points={profilePoints}
        degree={3}
        knots={[0, 0, 0, 0, 1, 1, 1, 1]}
      />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </RevolvedSurface>
  ),
};

export const CustomAxis = {
  args: {
    color: "#ffaa00",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    angle: 2 * Math.PI,
  },
  render: ({
    color = "#ffaa00",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
    angle = 2 * Math.PI,
  }: Record<string, any>) => (
    <RevolvedSurface
      center={[0, 0, 0]}
      axis={[1, 1, 0]}
      angle={angle}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
    >
      <NurbsCurve
        points={[
          [0, 0, 0],
          [0, 0, 1],
          [1, 0, 1],
          [1, 0, 0],
        ]}
        degree={3}
        knots={[0, 0, 0, 0, 1, 1, 1, 1]}
      />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </RevolvedSurface>
  ),
};
