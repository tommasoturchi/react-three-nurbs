import { useMemo } from "react";
import { DoubleSide, Vector3 } from "three";
import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { NurbsSurface as NurbsSurfaceCore } from "../core";
import { NurbsSurface } from "../components/NurbsSurface";
import { useNurbsSurface } from "../hooks/useNurbsSurface";

const meta = {
  title: "Surfaces/Operations",
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
} satisfies Meta;

export default meta;

const controlPoints = [
  [[0, 0, 0], [0.5, 0, 0.3], [1, 0, -0.2], [1.5, 0, 0.1], [2, 0, 0]],
  [[0, 0.5, 0.2], [0.5, 0.5, 0.8], [1, 0.5, 0.5], [1.5, 0.5, 0.6], [2, 0.5, 0.1]],
  [[0, 1, -0.1], [0.5, 1, 0.4], [1, 1, 1.0], [1.5, 1, 0.3], [2, 1, -0.1]],
  [[0, 1.5, 0.1], [0.5, 1.5, 0.6], [1, 1.5, 0.5], [1.5, 1.5, 0.7], [2, 1.5, 0.2]],
  [[0, 2, 0], [0.5, 2, 0.2], [1, 2, -0.1], [1.5, 2, 0.1], [2, 2, 0]],
];
const weights = controlPoints.map(row => row.map(() => 1));

// === Surface Boundaries ===
function SurfaceBoundariesDemo() {
  const { surface } = useNurbsSurface({
    controlPoints, weights, degreeU: 3, degreeV: 3,
  });

  const boundaries = useMemo(() => {
    if (!surface) return [];
    const n = 50;
    const curves: { points: Vector3[]; color: string; label: string }[] = [];

    // u=0 boundary (V-direction)
    const iso0 = surface.isocurve(0, false);
    curves.push({
      points: Array.from({ length: n + 1 }, (_, i) => {
        const pt = iso0.point(i / n);
        return new Vector3(pt[0], pt[1], pt[2]);
      }),
      color: "#ff0000",
      label: "u=0",
    });
    // u=1
    const iso1 = surface.isocurve(1, false);
    curves.push({
      points: Array.from({ length: n + 1 }, (_, i) => {
        const pt = iso1.point(i / n);
        return new Vector3(pt[0], pt[1], pt[2]);
      }),
      color: "#00ff00",
      label: "u=1",
    });
    // v=0
    const iso2 = surface.isocurve(0, true);
    curves.push({
      points: Array.from({ length: n + 1 }, (_, i) => {
        const pt = iso2.point(i / n);
        return new Vector3(pt[0], pt[1], pt[2]);
      }),
      color: "#0000ff",
      label: "v=0",
    });
    // v=1
    const iso3 = surface.isocurve(1, true);
    curves.push({
      points: Array.from({ length: n + 1 }, (_, i) => {
        const pt = iso3.point(i / n);
        return new Vector3(pt[0], pt[1], pt[2]);
      }),
      color: "#ffaa00",
      label: "v=1",
    });

    return curves;
  }, [surface]);

  return (
    <>
      <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={3} degreeV={3} resolutionU={30} resolutionV={30}>
        <meshPhongMaterial color="#aaaacc" transparent opacity={0.5} side={DoubleSide} depthWrite={false} />
      </NurbsSurface>
      {boundaries.map((b) => (
        <Line key={b.label} points={b.points} color={b.color} lineWidth={3} />
      ))}
    </>
  );
}

export const SurfaceBoundaries = {
  render: () => <SurfaceBoundariesDemo />,
};

// === Surface Closest Point ===
function SurfaceClosestPointDemo({ numTestPoints = 6 }: Record<string, any>) {
  const data = useMemo(() => {
    const surf = NurbsSurfaceCore.byKnotsControlPointsWeights(
      3, 3,
      [0, 0, 0, 0, 0.5, 1, 1, 1, 1],
      [0, 0, 0, 0, 0.5, 1, 1, 1, 1],
      controlPoints, weights
    );
    const testPts = Array.from({ length: numTestPoints }, (_, i) => [
      0.5 + 1.5 * Math.cos(i * 1.3),
      0.5 + 1.5 * Math.sin(i * 0.9),
      1.5 + Math.sin(i * 2),
    ]);
    const lines: { from: Vector3; to: Vector3 }[] = [];
    const closestPts: Vector3[] = [];
    for (const tp of testPts) {
      const uv = surf.closestParam(tp);
      const cp = surf.point(uv[0], uv[1]);
      lines.push({
        from: new Vector3(tp[0], tp[1], tp[2]),
        to: new Vector3(cp[0], cp[1], cp[2]),
      });
      closestPts.push(new Vector3(cp[0], cp[1], cp[2]));
    }
    return { testPts, lines, closestPts };
  }, [numTestPoints]);

  return (
    <>
      <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={3} degreeV={3} resolutionU={30} resolutionV={30}>
        <meshPhongMaterial color="#4488ff" transparent opacity={0.6} side={DoubleSide} depthWrite={false} />
      </NurbsSurface>
      {data.testPts.map((pt, i) => (
        <mesh key={`tp-${i}`} position={[pt[0], pt[1], pt[2]]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      ))}
      {data.closestPts.map((pt, i) => (
        <mesh key={`cp-${i}`} position={pt}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      ))}
      {data.lines.map((l, i) => (
        <Line key={`line-${i}`} points={[l.from, l.to]} color="#888888" lineWidth={1} />
      ))}
    </>
  );
}

export const SurfaceClosestPoint = {
  args: { numTestPoints: 6 },
  argTypes: {
    numTestPoints: { control: { type: "range", min: 2, max: 15, step: 1 }, description: "Number of test points" },
  },
  render: (args: Record<string, any>) => <SurfaceClosestPointDemo {...args} />,
};

// === Adaptive Tessellation Comparison ===
export const AdaptiveTessellation = {
  args: { resLow: 5, resHigh: 30 },
  argTypes: {
    resLow: { control: { type: "range", min: 2, max: 15, step: 1 }, description: "Low resolution" },
    resHigh: { control: { type: "range", min: 15, max: 60, step: 5 }, description: "High resolution" },
  },
  render: ({ resLow = 5, resHigh = 30 }: Record<string, any>) => (
    <>
      {/* Low res - offset left */}
      <group position={[-1.5, 0, 0]}>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={3} degreeV={3}
          resolutionU={resLow} resolutionV={resLow}>
          <meshPhongMaterial color="#ff4444" wireframe side={DoubleSide} />
        </NurbsSurface>
      </group>
      {/* High res - offset right */}
      <group position={[1.5, 0, 0]}>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={3} degreeV={3}
          resolutionU={resHigh} resolutionV={resHigh}>
          <meshPhongMaterial color="#4488ff" wireframe side={DoubleSide} />
        </NurbsSurface>
      </group>
    </>
  ),
};
