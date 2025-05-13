import type { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { NurbsSurface } from "../components/NurbsSurface";
import type { ReactNode } from "react";

const meta = {
  title: "Components/NurbsSurface",
  component: NurbsSurface,
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
} satisfies Meta<typeof NurbsSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample control points for a simple surface
const controlPoints = [
  [
    [0, 0, 0],
    [1, 0, 0],
    [2, 0, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
    [2, 1, 0],
  ],
  [
    [0, 2, 0],
    [1, 2, 0],
    [2, 2, 0],
  ],
];

const weights = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];

// Simple flat surface with default material
export const SimpleSurface: Story = {
  args: {
    controlPoints,
    weights,
    degreeU: 2,
    degreeV: 2,
    color: "#ff0000",
    wireframe: true,
    children: <meshStandardMaterial color="#ff0000" wireframe={true} side={DoubleSide} />,
  },
};

// Surface with a bulge in the middle and custom material
export const BulgedSurface: Story = {
  args: {
    controlPoints: [
      [
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 2],
        [2, 1, 0],
      ],
      [
        [0, 2, 0],
        [1, 2, 0],
        [2, 2, 0],
      ],
    ],
    weights,
    degreeU: 2,
    degreeV: 2,
    children: (
      <meshStandardMaterial
        color="#00ff00"
        metalness={0.5}
        roughness={0.5}
        wireframe={true}
        side={DoubleSide}
      />
    ),
  },
};

// Surface with custom material and R3F props
export const CustomMaterialSurface: Story = {
  args: {
    controlPoints,
    weights,
    degreeU: 2,
    degreeV: 2,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 1, 1],
    children: (
      <meshPhongMaterial
        color="#0000ff"
        shininess={100}
        specular="#ffffff"
        side={DoubleSide}
      />
    ),
  },
};
