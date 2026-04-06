import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { NurbsSurface } from "../components/NurbsSurface";

const meta = {
  title: "Surfaces/NurbsSurface",
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
      control: { type: "range", min: 2, max: 60, step: 2 },
      description: "Tessellation resolution in U direction",
    },
    resolutionV: {
      control: { type: "range", min: 2, max: 60, step: 2 },
      description: "Tessellation resolution in V direction",
    },
    degreeU: {
      control: { type: "range", min: 1, max: 3, step: 1 },
      description: "Surface degree in U direction",
    },
    degreeV: {
      control: { type: "range", min: 1, max: 3, step: 1 },
      description: "Surface degree in V direction",
    },
  },
} satisfies Meta;

export default meta;

const controlPoints = [
  [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
  [[0, 1, 0], [1, 1, 1], [2, 1, 0]],
  [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
];

const weights = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

export const SimpleSurface = {
  args: {
    color: "#ff0000",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    degreeU: 2,
    degreeV: 2,
  },
  render: ({
    color = "#ff0000",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
    degreeU = 2,
    degreeV = 2,
  }: Record<string, any>) => (
    <NurbsSurface
      controlPoints={controlPoints}
      weights={weights}
      degreeU={degreeU}
      degreeV={degreeV}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
    >
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </NurbsSurface>
  ),
};

const bulgedControlPoints = [
  [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
  [[0, 1, 0], [1, 1, 2], [2, 1, 0]],
  [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
];

export const BulgedSurface = {
  args: {
    color: "#00ff00",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
    degreeU: 2,
    degreeV: 2,
  },
  render: ({
    color = "#00ff00",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
    degreeU = 2,
    degreeV = 2,
  }: Record<string, any>) => (
    <NurbsSurface
      controlPoints={bulgedControlPoints}
      weights={weights}
      degreeU={degreeU}
      degreeV={degreeV}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
    >
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        metalness={0.5}
        roughness={0.5}
        side={DoubleSide}
      />
    </NurbsSurface>
  ),
};

export const CustomMaterialSurface = {
  args: {
    color: "#0000ff",
    wireframe: false,
    resolutionU: 20,
    resolutionV: 20,
    degreeU: 2,
    degreeV: 2,
  },
  render: ({
    color = "#0000ff",
    wireframe = false,
    resolutionU = 20,
    resolutionV = 20,
    degreeU = 2,
    degreeV = 2,
  }: Record<string, any>) => (
    <NurbsSurface
      controlPoints={controlPoints}
      weights={weights}
      degreeU={degreeU}
      degreeV={degreeV}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
      rotation={[0, Math.PI / 4, 0]}
    >
      <meshPhongMaterial
        color={color}
        wireframe={wireframe}
        shininess={100}
        side={DoubleSide}
      />
    </NurbsSurface>
  ),
};
