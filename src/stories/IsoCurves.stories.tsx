import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import { NurbsSurface } from "../components/NurbsSurface";
import { IsoCurves } from "../components/IsoCurves";
import { useNurbsSurface } from "../hooks/useNurbsSurface";

const meta = {
  title: "Surfaces/IsoCurves",
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
    countU: {
      control: { type: "range", min: 2, max: 30, step: 1 },
      description: "Number of U iso-curves",
    },
    countV: {
      control: { type: "range", min: 2, max: 30, step: 1 },
      description: "Number of V iso-curves",
    },
    isoColor: { control: "color", description: "Iso-curve color" },
    lineWidth: {
      control: { type: "range", min: 0.5, max: 5, step: 0.5 },
      description: "Line width",
    },
    surfaceColor: { control: "color", description: "Surface color" },
  },
} satisfies Meta;

export default meta;

const controlPoints = [
  [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
  [[0, 1, 0], [1, 1, 1], [2, 1, 0]],
  [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
];
const weights = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

function IsoCurvesDemo({
  countU = 10,
  countV = 10,
  isoColor = "#000000",
  lineWidth = 1,
  surfaceColor = "#4488ff",
}: Record<string, any>) {
  const { surface } = useNurbsSurface({
    controlPoints,
    weights,
    degreeU: 2,
    degreeV: 2,
  });

  return (
    <>
      <NurbsSurface
        controlPoints={controlPoints}
        weights={weights}
        degreeU={2}
        degreeV={2}
        resolutionU={30}
        resolutionV={30}
      >
        <meshPhongMaterial
          color={surfaceColor}
          transparent
          opacity={0.6}
          side={DoubleSide}
        />
      </NurbsSurface>
      {surface && (
        <IsoCurves
          surface={surface}
          countU={countU}
          countV={countV}
          color={isoColor}
          lineWidth={lineWidth}
        />
      )}
    </>
  );
}

export const Default = {
  args: {
    countU: 10,
    countV: 10,
    isoColor: "#000000",
    lineWidth: 1,
    surfaceColor: "#4488ff",
  },
  render: (args: Record<string, any>) => <IsoCurvesDemo {...args} />,
};
