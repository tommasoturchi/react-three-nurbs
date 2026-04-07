import { useMemo } from "react";
import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { DoubleSide, Vector3 } from "three";
import { NurbsSurface as NurbsSurfaceCore } from "../core";
import { NurbsSurface } from "../components/NurbsSurface";
import { generateUniformKnots } from "../utils/nurbs";

const meta = {
  title: "Surfaces/Intersection",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shows the intersection curve between two NURBS surfaces. " +
          "The blue dome and green cutting plane are transparent; the thick red curve shows where they intersect.",
      },
    },
  },
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
    lineColor: { control: "color", description: "Intersection curve color" },
    lineWidth: {
      control: { type: "range", min: 1, max: 10, step: 0.5 },
      description: "Intersection curve width",
    },
    height: {
      control: { type: "range", min: 0.05, max: 0.8, step: 0.05 },
      description: "Height of the cutting plane",
    },
    resolution: {
      control: { type: "range", min: 20, max: 100, step: 10 },
      description: "Intersection sampling resolution",
    },
  },
} satisfies Meta;

export default meta;

const cpDome = [
  [[-1.5, -1.5, 0], [-0.5, -1.5, 0], [0.5, -1.5, 0], [1.5, -1.5, 0]],
  [[-1.5, -0.5, 0], [-0.5, -0.5, 1.5], [0.5, -0.5, 1.5], [1.5, -0.5, 0]],
  [[-1.5, 0.5, 0], [-0.5, 0.5, 1.5], [0.5, 0.5, 1.5], [1.5, 0.5, 0]],
  [[-1.5, 1.5, 0], [-0.5, 1.5, 0], [0.5, 1.5, 0], [1.5, 1.5, 0]],
];
const wDome = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]];

function makeFlatCP(z: number) {
  return [
    [[-2, -2, z], [2, -2, z]],
    [[-2, 2, z], [2, 2, z]],
  ];
}
const wFlat = [[1, 1], [1, 1]];

/**
 * Compute intersection curve by sampling the dome and finding z ≈ height contour.
 * Uses marching squares on the dome's UV grid.
 */
function useIntersectionContour(height: number, resolution: number) {
  return useMemo(() => {
    const knotsU = generateUniformKnots(4, 3);
    const knotsV = generateUniformKnots(4, 3);
    const surface = NurbsSurfaceCore.byKnotsControlPointsWeights(
      3, 3, knotsU, knotsV, cpDome, wDome
    );

    // Sample z values on a grid
    const n = resolution;
    const zGrid: number[][] = [];
    const ptGrid: number[][][] = [];
    for (let i = 0; i <= n; i++) {
      zGrid[i] = [];
      ptGrid[i] = [];
      for (let j = 0; j <= n; j++) {
        const u = i / n;
        const v = j / n;
        const pt = surface.point(u, v);
        zGrid[i][j] = pt[2] - height;
        ptGrid[i][j] = pt;
      }
    }

    // Marching squares: find edges where sign changes
    const contourPoints: Vector3[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const corners = [
          { z: zGrid[i][j], pt: ptGrid[i][j] },
          { z: zGrid[i + 1][j], pt: ptGrid[i + 1][j] },
          { z: zGrid[i + 1][j + 1], pt: ptGrid[i + 1][j + 1] },
          { z: zGrid[i][j + 1], pt: ptGrid[i][j + 1] },
        ];

        // Check each edge for sign change
        for (let e = 0; e < 4; e++) {
          const a = corners[e];
          const b = corners[(e + 1) % 4];
          if ((a.z >= 0) !== (b.z >= 0)) {
            const t = a.z / (a.z - b.z);
            contourPoints.push(new Vector3(
              a.pt[0] + t * (b.pt[0] - a.pt[0]),
              a.pt[1] + t * (b.pt[1] - a.pt[1]),
              a.pt[2] + t * (b.pt[2] - a.pt[2]),
            ));
          }
        }
      }
    }

    // Sort points by angle around centroid for a clean loop
    if (contourPoints.length < 2) return contourPoints;
    const cx = contourPoints.reduce((s, p) => s + p.x, 0) / contourPoints.length;
    const cy = contourPoints.reduce((s, p) => s + p.y, 0) / contourPoints.length;
    contourPoints.sort((a, b) =>
      Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx)
    );
    contourPoints.push(contourPoints[0]); // close the loop

    return contourPoints;
  }, [height, resolution]);
}

function IntersectionDemo({
  lineColor = "#ff0000",
  lineWidth = 6,
  height = 0.4,
  resolution = 60,
}: Record<string, any>) {
  const contour = useIntersectionContour(height, resolution);

  return (
    <>
      <NurbsSurface
        controlPoints={cpDome}
        weights={wDome}
        degreeU={3}
        degreeV={3}
        resolutionU={40}
        resolutionV={40}
      >
        <meshPhongMaterial
          color="#4488ff"
          transparent
          opacity={0.4}
          side={DoubleSide}
          depthWrite={false}
        />
      </NurbsSurface>

      <NurbsSurface
        controlPoints={makeFlatCP(height)}
        weights={wFlat}
        degreeU={1}
        degreeV={1}
        resolutionU={4}
        resolutionV={4}
      >
        <meshPhongMaterial
          color="#44ff88"
          transparent
          opacity={0.3}
          side={DoubleSide}
          depthWrite={false}
        />
      </NurbsSurface>

      {contour.length >= 2 && (
        <Line
          points={contour}
          color={lineColor}
          lineWidth={lineWidth}
        />
      )}
    </>
  );
}

export const Default = {
  args: {
    lineColor: "#ff0000",
    lineWidth: 6,
    height: 0.4,
    resolution: 60,
  },
  render: (args: Record<string, any>) => <IntersectionDemo {...args} />,
};
