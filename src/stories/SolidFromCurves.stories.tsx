import { useMemo } from "react";
import { Vector3 } from "three";
import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { DoubleSide } from "three";
import { NurbsSolid, NurbsSurface as NurbsSurfaceCore, NurbsCurve, createCircle } from "../core";
import { NurbsSolidComponent } from "../components/NurbsSolidComponent";
import { NurbsSurface } from "../components/NurbsSurface";

const meta = {
  title: "Solids/Construction",
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
    wireframe: { control: "boolean", description: "Wireframe rendering" },
    showInput: { control: "boolean", description: "Show the input curve/surface" },
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

// === Shared profile data ===

const vaseProfileData = NurbsCurve.byKnotsControlPointsWeights(
  3,
  [0, 0, 0, 0, 0.2, 0.4, 0.6, 0.8, 1, 1, 1, 1],
  [
    [0, -1, 0],
    [0.6, -1, 0],
    [0.9, -0.3, 0],
    [0.3, 0.2, 0],
    [0.8, 0.7, 0],
    [0.5, 1.2, 0],
    [0.15, 1.5, 0],
    [0, 1.6, 0],
  ],
  [1, 1, 1, 1, 1, 1, 1, 1]
);

const circleProfileData = createCircle([0, 0, 0], [1, 0, 0], [0, 1, 0], 0.8);

const bumpSurfaceData = NurbsSurfaceCore.byKnotsControlPointsWeights(
  2, 2,
  [0, 0, 0, 1, 1, 1],
  [0, 0, 0, 1, 1, 1],
  [
    [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
    [[0, 1, 0], [1, 1, 0.8], [2, 1, 0]],
    [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
  ],
  [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
);

// === Helper: render a curve as a colored line ===
function CurvePreview({ curve, color = "#ff0000", lineWidth = 2 }: { curve: NurbsCurve; color?: string; lineWidth?: number }) {
  const points = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => {
      const pt = curve.point(i / 79);
      return new Vector3(pt[0], pt[1], pt[2]);
    });
  }, [curve]);
  return <Line points={points} color={color} lineWidth={lineWidth} />;
}

// ============================================================
// Revolve Curve → Solid
// A profile curve is rotated around an axis to create a solid
// ============================================================

function RevolveCurveDemo({
  wireframe = true,
  showInput = true,
  resolutionU = 25,
  resolutionV = 25,
  angle = 6.28,
  capped = false,
}: Record<string, any>) {
  const solid = useMemo(() =>
    NurbsSolid.fromRevolution(vaseProfileData.asData(), [0, 0, 0], [0, 1, 0], angle, capped).asData(),
    [angle, capped]
  );

  return (
    <>
      {showInput && <CurvePreview curve={vaseProfileData} color="#ff3333" lineWidth={3} />}
      <NurbsSolidComponent solid={solid} resolutionU={resolutionU} resolutionV={resolutionV}>
        <meshPhongMaterial color="#cc4488" wireframe={wireframe} side={DoubleSide} />
      </NurbsSolidComponent>
    </>
  );
}

export const RevolveCurve = {
  args: { wireframe: true, showInput: true, resolutionU: 25, resolutionV: 25, angle: 6.28, capped: false },
  argTypes: {
    angle: { control: { type: "range", min: 0.5, max: 6.28, step: 0.1 }, description: "Revolution angle (radians)" },
    capped: { control: "boolean", description: "Cap partial revolutions" },
  },
  render: (args: Record<string, any>) => <RevolveCurveDemo {...args} />,
};

// ============================================================
// Extrude Curve → Solid
// A closed curve is pushed along a direction to create a solid
// ============================================================

function ExtrudeCurveDemo({
  wireframe = true,
  showInput = true,
  resolutionU = 20,
  resolutionV = 10,
  height = 2,
  capped = false,
}: Record<string, any>) {
  const circCurve = useMemo(() => new NurbsCurve(circleProfileData), []);
  const solid = useMemo(() =>
    NurbsSolid.fromExtrusion(circleProfileData, [0, 0, height], capped).asData(),
    [height, capped]
  );

  return (
    <>
      {showInput && <CurvePreview curve={circCurve} color="#ff3333" lineWidth={3} />}
      <NurbsSolidComponent solid={solid} resolutionU={resolutionU} resolutionV={resolutionV}>
        <meshPhongMaterial color="#4488cc" wireframe={wireframe} side={DoubleSide} />
      </NurbsSolidComponent>
    </>
  );
}

export const ExtrudeCurve = {
  args: { wireframe: true, showInput: true, resolutionU: 20, resolutionV: 10, height: 2, capped: false },
  argTypes: {
    height: { control: { type: "range", min: 0.5, max: 5, step: 0.1 }, description: "Extrusion height" },
    capped: { control: "boolean", description: "Cap ends" },
  },
  render: (args: Record<string, any>) => <ExtrudeCurveDemo {...args} />,
};

// ============================================================
// Thicken Surface → Solid
// A thin surface is given wall thickness to become a shell solid
// ============================================================

function ThickenSurfaceDemo({
  wireframe = true,
  showInput = true,
  resolutionU = 20,
  resolutionV = 20,
  thickness = 0.3,
}: Record<string, any>) {
  const solid = useMemo(() =>
    NurbsSolid.fromSurface(bumpSurfaceData.asData(), thickness).asData(),
    [thickness]
  );

  return (
    <>
      {showInput && (
        <NurbsSurface
          controlPoints={[
            [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
            [[0, 1, 0], [1, 1, 0.8], [2, 1, 0]],
            [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
          ]}
          weights={[[1, 1, 1], [1, 1, 1], [1, 1, 1]]}
          degreeU={2}
          degreeV={2}
          resolutionU={20}
          resolutionV={20}
        >
          <meshPhongMaterial color="#ff3333" transparent opacity={0.3} side={DoubleSide} depthWrite={false} />
        </NurbsSurface>
      )}
      <NurbsSolidComponent solid={solid} resolutionU={resolutionU} resolutionV={resolutionV}>
        <meshPhongMaterial color="#88cc44" wireframe={wireframe} side={DoubleSide} />
      </NurbsSolidComponent>
    </>
  );
}

export const ThickenSurface = {
  args: { wireframe: true, showInput: true, resolutionU: 20, resolutionV: 20, thickness: 0.3 },
  argTypes: {
    thickness: { control: { type: "range", min: 0.05, max: 1, step: 0.05 }, description: "Shell thickness" },
  },
  render: (args: Record<string, any>) => <ThickenSurfaceDemo {...args} />,
};
