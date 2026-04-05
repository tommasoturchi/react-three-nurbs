import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { InterpolatedCurve } from "../components/InterpolatedCurve";

const meta = {
  title: "Components/InterpolatedCurve",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Creates a smooth NURBS curve that passes exactly through a set of points. " +
          "Unlike NurbsCurve (which uses control points that the curve is attracted to but doesn't touch), " +
          "InterpolatedCurve guarantees the curve goes through every point. " +
          "Orange spheres show the through-points.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
  argTypes: {
    color: { control: "color", description: "Curve color" },
    resolution: {
      control: { type: "range", min: 10, max: 200, step: 10 },
      description: "Sampling resolution",
    },
    lineWidth: {
      control: { type: "range", min: 1, max: 10, step: 0.5 },
      description: "Line width",
    },
    degree: {
      control: { type: "range", min: 2, max: 5, step: 1 },
      description: "Interpolation degree (higher = smoother between points)",
    },
  },
} satisfies Meta;

export default meta;

const throughPoints = [
  [0, 0, 0],
  [0.5, 1, 0.3],
  [1, 0.2, 0.8],
  [1.5, 0.8, 1.2],
  [2, 0, 0.5],
  [2.5, -0.5, 0],
];

export const Default = {
  args: {
    color: "#ff0000",
    resolution: 150,
    lineWidth: 2,
    degree: 3,
  },
  render: ({
    color = "#ff0000",
    resolution = 150,
    lineWidth = 2,
    degree = 3,
  }: Record<string, any>) => (
    <>
      <InterpolatedCurve
        throughPoints={throughPoints}
        degree={degree}
        resolution={resolution}
        color={color}
        lineWidth={lineWidth}
      />
      {throughPoints.map((pt, i) => (
        <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>
      ))}
    </>
  ),
};

const wavePoints = [
  [-2, 0, 0],
  [-1, 1, 0],
  [0, 0, 0],
  [1, -1, 0],
  [2, 0, 0],
  [3, 1, 0],
  [4, 0, 0],
];

export const Wave = {
  args: {
    color: "#0066ff",
    resolution: 100,
    lineWidth: 2,
    degree: 3,
  },
  render: ({
    color = "#0066ff",
    resolution = 100,
    lineWidth = 2,
    degree = 3,
  }: Record<string, any>) => (
    <>
      <InterpolatedCurve
        throughPoints={wavePoints}
        degree={degree}
        resolution={resolution}
        color={color}
        lineWidth={lineWidth}
      />
      {wavePoints.map((pt, i) => (
        <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>
      ))}
    </>
  ),
};
