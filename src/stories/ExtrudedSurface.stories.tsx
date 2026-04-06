import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { ExtrudedSurface } from "../components/ExtrudedSurface";
import { NurbsCurve } from "../components/NurbsCurve";

const meta = {
  title: "Surfaces/ExtrudedSurface",
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
    dirX: {
      control: { type: "range", min: -3, max: 3, step: 0.1 },
      description: "Extrusion direction X",
    },
    dirY: {
      control: { type: "range", min: -3, max: 3, step: 0.1 },
      description: "Extrusion direction Y",
    },
    dirZ: {
      control: { type: "range", min: -3, max: 3, step: 0.1 },
      description: "Extrusion direction Z",
    },
  },
} satisfies Meta;

export default meta;

const profilePoints = [
  [0, 0, 0],
  [0.5, 0.5, 0],
  [1, 0, 0],
  [1.5, -0.5, 0],
  [2, 0, 0],
];

export const Default = {
  args: {
    color: "#4488ff",
    wireframe: true,
    resolutionU: 60,
    resolutionV: 60,
    dirX: -0.1,
    dirY: 0,
    dirZ: 2,
  },
  render: ({
    color = "#4488ff",
    wireframe = false,
    resolutionU = 20,
    resolutionV = 20,
    dirX = 0,
    dirY = 0,
    dirZ = 2,
  }: Record<string, any>) => (
    <>
      <ExtrudedSurface
        direction={[dirX, dirY, dirZ]}
        resolutionU={resolutionU}
        resolutionV={resolutionV}
      >
        <NurbsCurve points={profilePoints} degree={3} />
        <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      </ExtrudedSurface>
      {/* Show the profile curve */}
      <NurbsCurve points={profilePoints} degree={3} color="#ff0000" lineWidth={2} />
    </>
  ),
};

export const DiagonalExtrusion = {
  args: {
    color: "#ff4488",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
    dirX: 1,
    dirY: 2,
    dirZ: 1,
  },
  render: ({
    color = "#ff4488",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
    dirX = 1,
    dirY = 2,
    dirZ = 1,
  }: Record<string, any>) => {
    const arcPoints = [
      [0, 0, 0],
      [1, 1, 0],
      [2, 0, 0],
    ];
    return (
      <>
        <ExtrudedSurface
          direction={[dirX, dirY, dirZ]}
          resolutionU={resolutionU}
          resolutionV={resolutionV}
        >
          <NurbsCurve points={arcPoints} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </ExtrudedSurface>
        <NurbsCurve points={arcPoints} degree={2} color="#ff0000" lineWidth={2} />
      </>
    );
  },
};
