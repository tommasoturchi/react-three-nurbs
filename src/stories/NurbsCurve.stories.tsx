import type { Meta, StoryObj } from '@storybook/react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { NurbsCurve } from '../components/NurbsCurve'
import type { ReactNode } from 'react'

const meta = {
  title: 'Components/NurbsCurve',
  component: NurbsCurve,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: () => ReactNode) => (
      <div style={{ width: '100%', height: '100%' }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof NurbsCurve>

export default meta
type Story = StoryObj<typeof meta>

// Sample points for a simple curve
const points = [
  [0, 0, 0],
  [1, 1, 0],
  [2, 0, 0],
  [3, 1, 0],
  [4, 0, 0],
]

// For degree 2 and 5 control points, we need 8 knots (5 + 2 + 1)
const knots = [0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1]

// Simple curve with default props
export const SimpleCurve: Story = {
  args: {
    points,
    knots,
    degree: 2,
    color: 'black',
  }
}

// Dashed curve with segments
export const DashedCurve: Story = {
  args: {
    points,
    knots,
    degree: 2,
    color: 'red',
    dashed: true,
    segments: true,
  }
}

// Curve with vertex colors
export const ColoredCurve: Story = {
  args: {
    points,
    knots,
    degree: 2,
    vertexColors: [
      [1, 0, 0], // red
      [0, 1, 0], // green
      [0, 0, 1], // blue
      [1, 1, 0], // yellow
      [1, 0, 1], // magenta
    ],
  }
}

// Curve with custom resolution and R3F props
export const CustomCurve: Story = {
  args: {
    points,
    knots,
    degree: 2,
    curveResolution: 100,
    color: 'blue',
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 1, 1],
  }
}

// Non-weighted curve of degree 2
export const Degree2Curve: Story = {
  args: {
    points: [
      [0, 0, 0],
      [1, 1, 0],
      [2, 0, 0]
    ],
    degree: 2,
    knots: [0, 0, 0, 1, 1, 1],
    resolution: 50,
    color: '#ff0000',
    lineWidth: 1
  }
}

// Non-weighted curve of degree 3
export const Degree3Curve: Story = {
  args: {
    points: [
      [0, 0, 0],
      [1, 1, 0],
      [2, 1, 0],
      [3, 0, 0]
    ],
    degree: 3,
    knots: [0, 0, 0, 0, 1, 1, 1, 1],
    resolution: 50,
    color: '#00ff00',
    lineWidth: 1
  }
}

// Weighted curve to demonstrate the effect of varying weights
export const WeightedCurve: Story = {
  args: {
    points: [
      [0, 0, 0],
      [1, 1, 0],
      [2, 0, 0]
    ],
    degree: 2,
    knots: [0, 0, 0, 1, 1, 1],
    weights: [1, 2, 1],
    resolution: 50,
    color: '#0000ff',
    lineWidth: 1
  }
} 