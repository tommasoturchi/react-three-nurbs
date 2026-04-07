import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { CylindricalSurface } from "../components/CylindricalSurface";

const meta = {
  title: "Surfaces/Cylindrical Surface",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
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
    height: {
      control: { type: "range", min: 0.5, max: 5, step: 0.1 },
      description: "Cylinder height",
    },
    radius: {
      control: { type: "range", min: 0.1, max: 3, step: 0.1 },
      description: "Cylinder radius",
    },
    resolutionU: {
      control: { type: "range", min: 8, max: 60, step: 4 },
      description: "Circumferential resolution",
    },
    resolutionV: {
      control: { type: "range", min: 2, max: 20, step: 1 },
      description: "Height resolution",
    },
  },
} satisfies Meta;

export default meta;

export const Default = {
  args: {
    color: "#44aaff",
    wireframe: false,
    height: 2,
    radius: 1,
    resolutionU: 32,
    resolutionV: 6,
  },
  render: ({
    color = "#44aaff",
    wireframe = false,
    height = 2,
    radius = 1,
    resolutionU = 32,
    resolutionV = 6,
  }: Record<string, any>) => (
    <CylindricalSurface
      axis={[0, 1, 0]}
      xaxis={[1, 0, 0]}
      base={[0, 0, 0]}
      height={height}
      radius={radius}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
    >
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </CylindricalSurface>
  ),
};

export const TiltedCylinder = {
  args: {
    color: "#ff8844",
    wireframe: true,
    height: 3,
    radius: 0.8,
    resolutionU: 24,
    resolutionV: 8,
  },
  render: ({
    color = "#ff8844",
    wireframe = true,
    height = 3,
    radius = 0.8,
    resolutionU = 24,
    resolutionV = 8,
  }: Record<string, any>) => (
    <CylindricalSurface
      axis={[1, 1, 0]}
      xaxis={[0, 0, 1]}
      base={[0, 0, 0]}
      height={height}
      radius={radius}
      resolutionU={resolutionU}
      resolutionV={resolutionV}
    >
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </CylindricalSurface>
  ),
};
