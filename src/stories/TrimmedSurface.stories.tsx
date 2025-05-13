import type { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { DoubleSide } from "three";
import { TrimmedSurface } from "../components/TrimmedSurface";
import { sampleNurbsCurve2D } from "../utils/nurbs";
import { NurbsSurface } from "../components/NurbsSurface";
import { NurbsCurve } from "../components/NurbsCurve";
import verb from "verb-nurbs";

interface StoryProps {
  color?: string;
  wireframe?: boolean;
  scale: number;
}

const meta = {
  title: "Components/TrimmedSurface",
  component: TrimmedSurface,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
  argTypes: {
    color: { control: "color" },
    wireframe: { control: "boolean" },
    scale: { control: { type: "range", min: 0.1, max: 1, step: 0.01 } },
  },
} satisfies Meta<typeof TrimmedSurface>;

export default meta;
type Story = StoryObj<typeof meta & StoryProps>;

// Shared control points
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

// Utilities
const createCircularCurveUV = (
  radius: number,
  center: [number, number] = [0.5, 0.5],
  numPoints = 4
) => {
  const points: [number, number][] = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const u = center[0] + radius * Math.cos(angle);
    const v = center[1] + radius * Math.sin(angle);
    points.push([u, v]);
  }

  const degree = 2;
  const knots = Array(numPoints + degree + 1)
    .fill(0)
    .map((_, i) => {
      if (i < degree + 1) return 0;
      if (i >= numPoints) return 1;
      return (i - degree) / (numPoints - degree);
    });

  return { points, knots };
};

function projectUVTo3DWithOffset(
  surface: any,
  u: number,
  v: number,
  offset = 0.01
): [number, number, number] {
  const pt = surface.point(u, v);
  const epsilon = 0.0001;
  const pu = surface.point(u + epsilon, v);
  const pv = surface.point(u, v + epsilon);
  const du = [pu[0] - pt[0], pu[1] - pt[1], pu[2] - pt[2]];
  const dv = [pv[0] - pt[0], pv[1] - pt[1], pv[2] - pt[2]];
  const normal = [
    du[1] * dv[2] - du[2] * dv[1],
    du[2] * dv[0] - du[0] * dv[2],
    du[0] * dv[1] - du[1] * dv[0],
  ];
  const len = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2) || 1;
  return [
    pt[0] + (normal[0] / len) * offset,
    pt[1] + (normal[1] / len) * offset,
    pt[2] + (normal[2] / len) * offset,
  ];
}

// === Story 1 ===
export const TrimmedBulgedSurface: Story = {
  args: {
    color: "#ff0000",
    wireframe: false,
    scale: 0.35,
  },
  render: ({ color = "#ff0000", wireframe = false, scale = 0.35 }) => {
    const basePoints = createCircularCurveUV(0.5, [0.5, 0.5], 4).points;
    const trim: [number, number][] = basePoints.map(([u, v]) => [
      (u - 0.5) * Number(scale) + 0.5,
      (v - 0.5) * Number(scale) + 0.5,
    ]);
    const knots = Array(trim.length + 3)
      .fill(0)
      .map((_, i) => {
        if (i < 3) return 0;
        if (i >= trim.length) return 1;
        return (i - 2) / (trim.length - 2);
      });
    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(
      2,
      2,
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      controlPoints,
      weights
    );
    const nurbsTrim = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
      2,
      knots,
      trim.map(([u, v]) => [u, v, 0]),
      Array(trim.length).fill(1)
    );
    const trimLine = sampleNurbsCurve2D(nurbsTrim, 200).map(([u, v]) =>
      projectUVTo3DWithOffset(surface, u, v)
    );

    return (
      <>
        <NurbsSurface
          controlPoints={controlPoints}
          weights={weights}
          degreeU={2}
          degreeV={2}
          wireframe
        />
        <TrimmedSurface>
          <NurbsSurface
            controlPoints={controlPoints}
            weights={weights}
            degreeU={2}
            degreeV={2}
          />
          <NurbsCurve
            points={trim}
            weights={Array(trim.length).fill(1)}
            knots={knots}
            degree={2}
          />
          <meshPhongMaterial
            color={color}
            wireframe={wireframe}
            side={DoubleSide}
          />
        </TrimmedSurface>
        <Line points={trimLine} color="black" />
      </>
    );
  },
};

// === Story 2 ===
export const TrimmedFlatEllipticalSurface: Story = {
  args: {
    color: "#3366ff",
    wireframe: false,
    scale: 0.45,
  },
  render: ({ color = "#3366ff", wireframe = false, scale = 0.45 }) => {
    const numPoints = 6;
    const points: [number, number][] = Array.from(
      { length: numPoints },
      (_, i) => {
        const angle = (i / numPoints) * Math.PI * 2;
        return [
          0.5 + Number(scale) * 0.5 * Math.cos(angle),
          0.5 + Number(scale) * 0.25 * Math.sin(angle),
        ] as [number, number];
      }
    );
    const degree = 2;
    const knots = Array(numPoints + degree + 1)
      .fill(0)
      .map((_, i) =>
        i < degree + 1
          ? 0
          : i >= numPoints
          ? 1
          : (i - degree) / (numPoints - degree)
      );
    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(
      2,
      2,
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      controlPoints,
      weights
    );
    const curve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
      degree,
      knots,
      points.map(([u, v]) => [u, v, 0]),
      Array(points.length).fill(1)
    );
    const linePts = sampleNurbsCurve2D(curve, 200).map(([u, v]) =>
      projectUVTo3DWithOffset(surface, u, v)
    );

    return (
      <>
        <NurbsSurface
          controlPoints={controlPoints}
          weights={weights}
          degreeU={2}
          degreeV={2}
          wireframe
        />
        <TrimmedSurface>
          <NurbsSurface
            controlPoints={controlPoints}
            weights={weights}
            degreeU={2}
            degreeV={2}
          />
          <NurbsCurve
            points={points}
            weights={Array(points.length).fill(1)}
            knots={knots}
            degree={2}
          />
          <meshPhongMaterial
            color={color}
            wireframe={wireframe}
            side={DoubleSide}
          />
        </TrimmedSurface>
        <Line points={linePts} color="black" />
      </>
    );
  },
};

// === Story 3 ===
export const TrimmedSurfaceWithHole: Story = {
  args: {
    color: "#33cc33",
    wireframe: false,
    scale: 0.45,
  },
  render: ({ color = "#33cc33", wireframe = false, scale = 0.45 }) => {
    const baseOuter = createCircularCurveUV(0.5, [0.5, 0.5], 6).points;
    const baseHole = createCircularCurveUV(0.5, [0.5, 0.5], 6).points;
    const outer: [number, number][] = baseOuter.map(([u, v]) => [
      (u - 0.5) * Number(scale) + 0.5,
      (v - 0.5) * Number(scale) + 0.5,
    ]);
    const hole: [number, number][] = baseHole.map(([u, v]) => [
      (u - 0.5) * (Number(scale) * 0.33) + 0.5,
      (v - 0.5) * (Number(scale) * 0.33) + 0.5,
    ]);

    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(
      2,
      2,
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      controlPoints,
      weights
    );

    const outerCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
      2,
      Array(outer.length + 3)
        .fill(0)
        .map((_, i) => {
          if (i < 3) return 0;
          if (i >= outer.length) return 1;
          return (i - 2) / (outer.length - 2);
        }),
      outer.map(([u, v]) => [u, v, 0]),
      Array(outer.length).fill(1)
    );

    const holeCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
      2,
      Array(hole.length + 3)
        .fill(0)
        .map((_, i) => {
          if (i < 3) return 0;
          if (i >= hole.length) return 1;
          return (i - 2) / (hole.length - 2);
        }),
      hole.map(([u, v]) => [u, v, 0]),
      Array(hole.length).fill(1)
    );

    const outer3D = sampleNurbsCurve2D(outerCurve, 200).map(([u, v]) =>
      projectUVTo3DWithOffset(surface, u, v)
    );
    const hole3D = sampleNurbsCurve2D(holeCurve, 200).map(([u, v]) =>
      projectUVTo3DWithOffset(surface, u, v)
    );

    return (
      <>
        <NurbsSurface
          controlPoints={controlPoints}
          weights={weights}
          degreeU={2}
          degreeV={2}
          wireframe
        />
        <TrimmedSurface>
          <NurbsSurface
            controlPoints={controlPoints}
            weights={weights}
            degreeU={2}
            degreeV={2}
          />
          <NurbsCurve
            points={outer}
            weights={Array(outer.length).fill(1)}
            knots={Array(outer.length + 3)
              .fill(0)
              .map((_, i) => {
                if (i < 3) return 0;
                if (i >= outer.length) return 1;
                return (i - 2) / (outer.length - 2);
              })}
            degree={2}
          />
          <NurbsCurve
            points={hole}
            weights={Array(hole.length).fill(1)}
            knots={Array(hole.length + 3)
              .fill(0)
              .map((_, i) => {
                if (i < 3) return 0;
                if (i >= hole.length) return 1;
                return (i - 2) / (hole.length - 2);
              })}
            degree={2}
          />
          <meshPhongMaterial
            color={color}
            wireframe={wireframe}
            side={DoubleSide}
          />
        </TrimmedSurface>
        <Line points={outer3D} color="black" />
        <Line points={hole3D} color="black" />
      </>
    );
  },
};

export const TrimmedSurfaceClosedLoop: Story = {
  args: {
    color: "#ffaa00",
    wireframe: false,
    scale: 0.4,
  },
  render: ({ color = "#ffaa00", wireframe = false, scale = 0.4 }) => {
    const numPoints = 6;
    const center: [number, number] = [0.5, 0.5];

    const closedPoints: [number, number][] = Array.from(
      { length: numPoints },
      (_, i) => {
        const angle = (i / numPoints) * Math.PI * 2;
        return [
          center[0] + Number(scale) * 0.5 * Math.cos(angle),
          center[1] + Number(scale) * 0.5 * Math.sin(angle),
        ] as [number, number];
      }
    );
    closedPoints.push(closedPoints[0]); // Ensure closure

    const degree = 2;
    const knots = Array(closedPoints.length + degree + 1)
      .fill(0)
      .map((_, i) => {
        if (i < degree + 1) return 0;
        if (i >= closedPoints.length) return 1;
        return (i - degree) / (closedPoints.length - degree);
      });

    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(
      2,
      2,
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      controlPoints,
      weights
    );

    const closedCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
      degree,
      knots,
      closedPoints.map(([u, v]) => [u, v, 0]),
      Array(closedPoints.length).fill(1)
    );

    const trimLine = sampleNurbsCurve2D(closedCurve, 200).map(([u, v]) =>
      projectUVTo3DWithOffset(surface, u, v)
    );

    return (
      <>
        <NurbsSurface
          controlPoints={controlPoints}
          weights={weights}
          degreeU={2}
          degreeV={2}
          wireframe
        />
        <TrimmedSurface>
          <NurbsSurface
            controlPoints={controlPoints}
            weights={weights}
            degreeU={2}
            degreeV={2}
          />
          <NurbsCurve
            points={closedPoints}
            weights={Array(closedPoints.length).fill(1)}
            knots={knots}
            degree={2}
          />
          <meshPhongMaterial
            color={color}
            wireframe={wireframe}
            side={DoubleSide}
          />
        </TrimmedSurface>
        <Line points={trimLine} color="black" />
      </>
    );
  },
};
