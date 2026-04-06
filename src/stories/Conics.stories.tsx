import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NurbsCircle } from "../components/NurbsCircle";
import { NurbsArc } from "../components/NurbsArc";
import { NurbsEllipse } from "../components/NurbsEllipse";
import { NurbsEllipseArc } from "../components/NurbsEllipseArc";
import { NurbsCurve } from "../components/NurbsCurve";

const meta = {
  title: "Examples/Exact Conics (Circle, Arc, Ellipse)",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Exact NURBS representations of conic sections: arc, circle, ellipse, ellipse arc, and a parabolic Bezier curve. " +
          "These are mathematically exact (not polygon approximations).",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
  argTypes: {
    lineWidth: {
      control: { type: "range", min: 1, max: 5, step: 0.5 },
      description: "Line width for all curves",
    },
  },
} satisfies Meta;

export default meta;

export const AllConics = {
  args: { lineWidth: 2 },
  render: ({ lineWidth = 2 }: Record<string, any>) => (
    <>
      {/* Arc: 270 degrees */}
      <group position={[-12, 0, 0]}>
        <NurbsArc
          center={[0, 0, 0]}
          radius={3}
          startAngle={0}
          endAngle={Math.PI * 1.5}
          color="#ff0000"
          lineWidth={lineWidth}
          resolution={64}
        />
        <mesh position={[0, -4.5, 0]}>
          <planeGeometry args={[0, 0]} />
        </mesh>
      </group>

      {/* Circle */}
      <group position={[-4, 0, 0]}>
        <NurbsCircle
          center={[0, 0, 0]}
          radius={3}
          color="#00cc00"
          lineWidth={lineWidth}
          resolution={64}
        />
      </group>

      {/* Ellipse */}
      <group position={[4, 0, 0]}>
        <NurbsEllipse
          center={[0, 0, 0]}
          xaxis={[3, 0, 0]}
          yaxis={[0, 1.5, 0]}
          color="#0066ff"
          lineWidth={lineWidth}
          resolution={64}
        />
      </group>

      {/* Ellipse Arc: 270 degrees */}
      <group position={[12, 0, 0]}>
        <NurbsEllipseArc
          center={[0, 0, 0]}
          xaxis={[3, 0, 0]}
          yaxis={[0, 1.5, 0]}
          startAngle={0}
          endAngle={Math.PI * 1.5}
          color="#ff6600"
          lineWidth={lineWidth}
          resolution={64}
        />
      </group>

      {/* Bezier parabola (degree 2 curve with 3 control points) */}
      <group position={[20, 0, 0]}>
        <NurbsCurve
          points={[[-3, -2, 0], [0, 4, 0], [3, -2, 0]]}
          degree={2}
          color="#cc00cc"
          lineWidth={lineWidth}
        />
        {/* Show control points */}
        {[[-3, -2, 0], [0, 4, 0], [3, -2, 0]].map((pt, i) => (
          <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color="#cc00cc" />
          </mesh>
        ))}
      </group>
    </>
  ),
};
