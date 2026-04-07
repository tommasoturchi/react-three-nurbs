import { useMemo } from "react";
import { Vector3 } from "three";
import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { NurbsCurve as NurbsCurveCore } from "../core";
import { InterpolatedCurve } from "../components/InterpolatedCurve";

const meta = {
  title: "Curves/Operations",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta;

export default meta;

// Shared points for most stories
const throughPoints = [
  [-3, 0, 0],
  [-1, 2, -1],
  [1, -1, 1],
  [3, 1, 0],
  [5, 0, -1],
];

// === Closest Point ===
function ClosestPointDemo({ numTestPoints = 8 }: Record<string, any>) {
  const data = useMemo(() => {
    const curve = NurbsCurveCore.byPoints(throughPoints, 3);
    // Spread test points in a grid-like pattern around the curve's bounding area
    const testPoints = Array.from({ length: numTestPoints }, (_, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return [
        -2 + (i / (numTestPoints - 1)) * 8,
        -3 + col * 3,
        -2 + row * 1.5,
      ];
    });
    const lines: { from: Vector3; to: Vector3 }[] = [];
    const closestPts: Vector3[] = [];
    for (const tp of testPoints) {
      const t = curve.closestParam(tp);
      const cp = curve.point(t);
      lines.push({
        from: new Vector3(tp[0], tp[1], tp[2]),
        to: new Vector3(cp[0], cp[1], cp[2]),
      });
      closestPts.push(new Vector3(cp[0], cp[1], cp[2]));
    }
    return { testPoints, lines, closestPts };
  }, [numTestPoints]);

  return (
    <>
      <InterpolatedCurve throughPoints={throughPoints} degree={3} color="#0066ff" lineWidth={2} />
      {data.testPoints.map((pt, i) => (
        <mesh key={`tp-${i}`} position={[pt[0], pt[1], pt[2]]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      ))}
      {data.closestPts.map((pt, i) => (
        <mesh key={`cp-${i}`} position={pt}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      ))}
      {data.lines.map((l, i) => (
        <Line key={`line-${i}`} points={[l.from, l.to]} color="#888888" lineWidth={1} />
      ))}
    </>
  );
}

export const ClosestPoint = {
  args: { numTestPoints: 8 },
  argTypes: {
    numTestPoints: { control: { type: "range", min: 3, max: 20, step: 1 }, description: "Number of test points" },
  },
  render: (args: Record<string, any>) => <ClosestPointDemo {...args} />,
};

// === Curve Divide ===
function CurveDivideDemo({ divisions = 12 }: Record<string, any>) {
  const divPoints = useMemo(() => {
    const curve = NurbsCurveCore.byPoints(throughPoints, 3);
    return curve.divideByEqualArcLength(divisions);
  }, [divisions]);

  return (
    <>
      <InterpolatedCurve throughPoints={throughPoints} degree={3} color="#0066ff" lineWidth={2} />
      {divPoints.map((d, i) => (
        <mesh key={i} position={[d.pt[0], d.pt[1], d.pt[2]]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>
      ))}
    </>
  );
}

export const EqualArcLengthDivision = {
  args: { divisions: 12 },
  argTypes: {
    divisions: { control: { type: "range", min: 2, max: 40, step: 1 }, description: "Number of divisions" },
  },
  render: (args: Record<string, any>) => <CurveDivideDemo {...args} />,
};

// === Curve Intersection ===
function CurveIntersectionDemo() {
  const pts1 = useMemo(() => [[-3, -1, 0], [0, 3, 0], [3, -1, 0]], []);
  const pts2 = useMemo(() => [[-3, 1, 0], [0, -3, 0], [3, 1, 0]], []);

  const intersections = useMemo(() => {
    const c1 = NurbsCurveCore.byPoints(pts1, 2);
    const c2 = NurbsCurveCore.byPoints(pts2, 2);
    // Brute force: sample both, find closest pairs
    const results: Vector3[] = [];
    const n = 200;
    for (let i = 0; i < n; i++) {
      const p1 = c1.point(i / n);
      for (let j = 0; j < n; j++) {
        const p2 = c2.point(j / n);
        const d = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);
        if (d < 0.05) {
          const mid = new Vector3((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
          // Avoid duplicates
          if (!results.some(r => r.distanceTo(mid) < 0.2)) {
            results.push(mid);
          }
        }
      }
    }
    return results;
  }, [pts1, pts2]);

  return (
    <>
      <InterpolatedCurve throughPoints={pts1} degree={2} color="#ff0000" lineWidth={2} />
      <InterpolatedCurve throughPoints={pts2} degree={2} color="#0066ff" lineWidth={2} />
      {intersections.map((pt, i) => (
        <mesh key={i} position={pt}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}
    </>
  );
}

export const CurveIntersection = {
  render: () => <CurveIntersectionDemo />,
};

// === Curve Reverse ===
function CurveReverseDemo() {
  const data = useMemo(() => {
    const curve = NurbsCurveCore.byPoints(throughPoints, 3);
    const reversed = curve.reverse();
    // Sample both to show direction with graduated colors
    const n = 50;
    const originalPts = Array.from({ length: n + 1 }, (_, i) => {
      const pt = curve.point(i / n);
      return new Vector3(pt[0], pt[1], pt[2]);
    });
    const reversedPts = Array.from({ length: n + 1 }, (_, i) => {
      const pt = reversed.point(i / n);
      return new Vector3(pt[0], pt[1] - 3, pt[2]); // offset down for visibility
    });
    // Show start/end markers
    const origStart = curve.point(0);
    const origEnd = curve.point(1);
    const revStart = reversed.point(0);
    const revEnd = reversed.point(1);
    return { originalPts, reversedPts, origStart, origEnd, revStart, revEnd };
  }, []);

  return (
    <>
      <Line points={data.originalPts} color="#0066ff" lineWidth={2} />
      <Line points={data.reversedPts} color="#ff6600" lineWidth={2} />
      {/* Start = green, End = red */}
      <mesh position={[data.origStart[0], data.origStart[1], data.origStart[2]]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[data.origEnd[0], data.origEnd[1], data.origEnd[2]]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[data.revStart[0], data.revStart[1] - 3, data.revStart[2]]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[data.revEnd[0], data.revEnd[1] - 3, data.revEnd[2]]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </>
  );
}

export const CurveReverse = {
  render: () => <CurveReverseDemo />,
};

// === Curve Split ===
function CurveSplitDemo({ splitParam = 0.4 }: Record<string, any>) {
  const data = useMemo(() => {
    const curve = NurbsCurveCore.byPoints(throughPoints, 3);
    const [left, right] = curve.split(splitParam);
    const n = 50;

    // Sample each curve over its actual knot domain
    const leftKnots = left.knots();
    const leftMin = leftKnots[left.degree()];
    const leftMax = leftKnots[leftKnots.length - left.degree() - 1];
    const leftPts = Array.from({ length: n + 1 }, (_, i) => {
      const t = leftMin + (leftMax - leftMin) * i / n;
      const pt = left.point(t);
      return new Vector3(pt[0], pt[1], pt[2]);
    });

    const rightKnots = right.knots();
    const rightMin = rightKnots[right.degree()];
    const rightMax = rightKnots[rightKnots.length - right.degree() - 1];
    const rightPts = Array.from({ length: n + 1 }, (_, i) => {
      const t = rightMin + (rightMax - rightMin) * i / n;
      const pt = right.point(t);
      return new Vector3(pt[0], pt[1], pt[2]);
    });

    const splitPt = curve.point(splitParam);
    return { leftPts, rightPts, splitPt };
  }, [splitParam]);

  return (
    <>
      <Line points={data.leftPts} color="#ff0000" lineWidth={3} />
      <Line points={data.rightPts} color="#0066ff" lineWidth={3} />
      <mesh position={[data.splitPt[0], data.splitPt[1], data.splitPt[2]]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      {throughPoints.map((pt, i) => (
        <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#888888" />
        </mesh>
      ))}
    </>
  );
}

export const CurveSplit = {
  args: { splitParam: 0.4 },
  argTypes: {
    splitParam: { control: { type: "range", min: 0.1, max: 0.9, step: 0.05 }, description: "Split parameter (0-1)" },
  },
  render: (args: Record<string, any>) => <CurveSplitDemo {...args} />,
};
