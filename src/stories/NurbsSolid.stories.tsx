import { useMemo } from "react";
import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { NurbsSolid } from "../core";
import { NurbsSolidComponent } from "../components/NurbsSolidComponent";

const meta = {
  title: "Solids/Primitives",
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
    color: { control: "color", description: "Solid color" },
    wireframe: { control: "boolean", description: "Wireframe rendering" },
    resolutionU: {
      control: { type: "range", min: 5, max: 40, step: 5 },
      description: "Tessellation resolution U",
    },
    resolutionV: {
      control: { type: "range", min: 5, max: 40, step: 5 },
      description: "Tessellation resolution V",
    },
  },
} satisfies Meta;

export default meta;

function BoxDemo({
  dx = 2, dy = 1.5, dz = 1,
  color = "#4488ff", wireframe = false,
  resolutionU = 10, resolutionV = 10,
}: Record<string, any>) {
  const solid = useMemo(() =>
    NurbsSolid.makeBox(dx, dy, dz).asData(),
    [dx, dy, dz]
  );
  return (
    <NurbsSolidComponent solid={solid} resolutionU={resolutionU} resolutionV={resolutionV}>
      <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </NurbsSolidComponent>
  );
}

export const Box = {
  args: {
    dx: 2, dy: 1.5, dz: 1,
    color: "#4488ff", wireframe: true,
    resolutionU: 10, resolutionV: 10,
  },
  argTypes: {
    dx: { control: { type: "range", min: 0.5, max: 4, step: 0.1 }, description: "Width" },
    dy: { control: { type: "range", min: 0.5, max: 4, step: 0.1 }, description: "Height" },
    dz: { control: { type: "range", min: 0.5, max: 4, step: 0.1 }, description: "Depth" },
  },
  render: (args: Record<string, any>) => <BoxDemo {...args} />,
};

function CylinderDemo({
  radius = 1, height = 2,
  color = "#ff6644", wireframe = false,
  resolutionU = 20, resolutionV = 10,
}: Record<string, any>) {
  const solid = useMemo(() =>
    NurbsSolid.makeCylinder(radius, height).asData(),
    [radius, height]
  );
  return (
    <NurbsSolidComponent solid={solid} resolutionU={resolutionU} resolutionV={resolutionV}>
      <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </NurbsSolidComponent>
  );
}

export const Cylinder = {
  args: {
    radius: 1, height: 2,
    color: "#ff6644", wireframe: true,
    resolutionU: 20, resolutionV: 10,
  },
  argTypes: {
    radius: { control: { type: "range", min: 0.2, max: 3, step: 0.1 }, description: "Radius" },
    height: { control: { type: "range", min: 0.5, max: 5, step: 0.1 }, description: "Height" },
  },
  render: (args: Record<string, any>) => <CylinderDemo {...args} />,
};

function SphereDemo({
  radius = 1,
  color = "#44cc88", wireframe = false,
  resolutionU = 25, resolutionV = 25,
}: Record<string, any>) {
  const solid = useMemo(() =>
    NurbsSolid.makeSphere(radius).asData(),
    [radius]
  );
  return (
    <NurbsSolidComponent solid={solid} resolutionU={resolutionU} resolutionV={resolutionV}>
      <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </NurbsSolidComponent>
  );
}

export const Sphere = {
  args: {
    radius: 1,
    color: "#44cc88", wireframe: true,
    resolutionU: 25, resolutionV: 25,
  },
  argTypes: {
    radius: { control: { type: "range", min: 0.2, max: 3, step: 0.1 }, description: "Radius" },
  },
  render: (args: Record<string, any>) => <SphereDemo {...args} />,
};

function AllPrimitivesDemo({
  wireframe = false,
  resolutionU = 20, resolutionV = 20,
}: Record<string, any>) {
  const box = useMemo(() => NurbsSolid.makeBox(1.5, 1.5, 1.5).asData(), []);
  const cyl = useMemo(() => NurbsSolid.makeCylinder(0.8, 2).asData(), []);
  const sph = useMemo(() => NurbsSolid.makeSphere(1).asData(), []);
  return (
    <>
      <group position={[-3, 0, 0]}>
        <NurbsSolidComponent solid={box} resolutionU={resolutionU} resolutionV={resolutionV}>
          <meshPhongMaterial color="#4488ff" wireframe={wireframe} side={DoubleSide} />
        </NurbsSolidComponent>
      </group>
      <group position={[0, 0, 0]}>
        <NurbsSolidComponent solid={cyl} resolutionU={resolutionU} resolutionV={resolutionV}>
          <meshPhongMaterial color="#ff6644" wireframe={wireframe} side={DoubleSide} />
        </NurbsSolidComponent>
      </group>
      <group position={[3, 0, 0]}>
        <NurbsSolidComponent solid={sph} resolutionU={resolutionU} resolutionV={resolutionV}>
          <meshPhongMaterial color="#44cc88" wireframe={wireframe} side={DoubleSide} />
        </NurbsSolidComponent>
      </group>
    </>
  );
}

export const AllPrimitives = {
  args: {
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    color: "#a93939"
  },
  render: (args: Record<string, any>) => <AllPrimitivesDemo {...args} />,
};
