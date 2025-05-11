import type { Meta, StoryObj } from '@storybook/react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { RevolvedSurface } from '../components/RevolvedSurface'
import { NurbsCurve } from '../components/NurbsCurve'

const meta = {
  title: 'Components/RevolvedSurface',
  component: RevolvedSurface,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => (
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Story />
        <OrbitControls />
      </Canvas>
    )
  ]
} satisfies Meta<typeof RevolvedSurface>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    center: [0, 0, 0],
    axis: [0, 1, 0],
    angle: 2 * Math.PI,
    resolutionU: 20,
    resolutionV: 20,
    color: '#ff0000',
    wireframe: false,
    children: (
      <NurbsCurve
        points={[
          [0, 0, 0],
          [0, 1, 0],
          [1, 1, 0],
          [1, 0, 0]
        ]}
        degree={3}
        knots={[0, 0, 0, 0, 1, 1, 1, 1]}
      />
    )
  }
}

export const WithWireframe: Story = {
  args: {
    ...Default.args,
    wireframe: true
  }
}

export const PartialRevolution: Story = {
  args: {
    ...Default.args,
    angle: Math.PI
  }
}

export const CustomAxis: Story = {
  args: {
    ...Default.args,
    axis: [1, 1, 0],
    children: (
      <NurbsCurve
        points={[
          [0, 0, 0],
          [0, 0, 1],
          [1, 0, 1],
          [1, 0, 0]
        ]}
        degree={3}
        knots={[0, 0, 0, 0, 1, 1, 1, 1]}
      />
    )
  }
} 