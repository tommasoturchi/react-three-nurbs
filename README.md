# react-three-nurbs

A React component library for rendering NURBS (Non-Uniform Rational B-Spline) surfaces in Three.js. Built with React Three Fiber, this library provides an easy way to create and visualize complex curved surfaces in your 3D applications.

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/tommasoturchi)

## Features

- 🎯 Simple React component API for NURBS surfaces
- 📐 Support for arbitrary degree NURBS surfaces
- ✂️ Trimmed surfaces with multiple trimming curves
- 🔄 Revolved surfaces with custom axes
- 📈 Lofted surfaces from multiple curves
- 🎨 Customizable surface appearance with R3F materials
- 🔄 Automatic normal calculation for proper lighting
- 🎮 Interactive 3D visualization with React Three Fiber
- 📦 Written in TypeScript with full type support
- 🎨 Compatible with drei's Line component for curves

## Installation

```bash
npm install react-three-nurbs
```

## Quick Start

### Surface with Default Material

```tsx
import { NurbsSurface } from 'react-three-nurbs'
import { Canvas } from '@react-three/fiber'

function App() {
  // Define a simple 4x4 control point grid for a surface
  const controlPoints = [
    [[-1, -1, 0], [-1, -0.5, 0], [-1, 0.5, 0], [-1, 1, 0]],
    [[-0.5, -1, 0], [-0.5, -0.5, 1], [-0.5, 0.5, 1], [-0.5, 1, 0]],
    [[0.5, -1, 0], [0.5, -0.5, 1], [0.5, 0.5, 1], [0.5, 1, 0]],
    [[1, -1, 0], [1, -0.5, 0], [1, 0.5, 0], [1, 1, 0]]
  ]

  // Define weights for each control point (1.0 for uniform B-spline)
  const weights = [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1]
  ]

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <NurbsSurface
        controlPoints={controlPoints}
        weights={weights}
        degreeU={3}
        degreeV={3}
        color="#ff0000"
        wireframe={false}
      />
    </Canvas>
  )
}
```

### Surface with Custom Material

```tsx
import { NurbsSurface } from 'react-three-nurbs'
import { Canvas } from '@react-three/fiber'
import { MeshStandardMaterial } from 'three'

function App() {
  // ... control points and weights as above ...

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <NurbsSurface
        controlPoints={controlPoints}
        weights={weights}
        degreeU={3}
        degreeV={3}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <meshStandardMaterial
          color="#00ff00"
          metalness={0.5}
          roughness={0.5}
          wireframe={true}
        />
      </NurbsSurface>
    </Canvas>
  )
}
```

### NURBS Curve

```tsx
import { NurbsCurve } from 'react-three-nurbs'
import { Canvas } from '@react-three/fiber'

function App() {
  const points = [
    [0, 0, 0],
    [1, 1, 0],
    [2, 0, 0],
    [3, 1, 0],
    [4, 0, 0],
  ]

  const knots = [0, 0, 0, 0.5, 1, 1, 1]

  return (
    <Canvas>
      <NurbsCurve
        points={points}
        knots={knots}
        degree={2}
        color="red"
        dashed={true}
        segments={true}
        vertexColors={[
          [1, 0, 0], // red
          [0, 1, 0], // green
          [0, 0, 1], // blue
          [1, 1, 0], // yellow
          [1, 0, 1], // magenta
        ]}
      />
    </Canvas>
  )
}
```

### Trimmed Surface

```tsx
import { TrimmedSurface, NurbsSurface, NurbsCurve } from 'react-three-nurbs'
import { Canvas } from '@react-three/fiber'
import { DoubleSide } from 'three'

function App() {
  // Define control points for the base surface
  const controlPoints = [
    [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
    [[0, 1, 0], [1, 1, 1], [2, 1, 0]],
    [[0, 2, 0], [1, 2, 0], [2, 2, 0]]
  ]
  const weights = [[1, 1, 1], [1, 1, 1], [1, 1, 1]]

  // Define trimming curve in UV space
  const trimPoints = [
    [0.2, 0.2],
    [0.8, 0.2],
    [0.8, 0.8],
    [0.2, 0.8]
  ]
  const knots = [0, 0, 0, 0, 1, 1, 1, 1]

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <TrimmedSurface>
        <NurbsSurface
          controlPoints={controlPoints}
          weights={weights}
          degreeU={2}
          degreeV={2}
        />
        <NurbsCurve
          points={trimPoints}
          knots={knots}
          degree={3}
        />
        <meshPhongMaterial
          color="#ff0000"
          side={DoubleSide}
        />
      </TrimmedSurface>
    </Canvas>
  )
}
```

## Props

### NurbsSurface Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `controlPoints` | `number[][][]` | Yes | - | 3D control points grid defining the surface shape |
| `weights` | `number[][]` | Yes | - | Weights for each control point |
| `degreeU` | `number` | Yes | - | Degree of the surface in U direction |
| `degreeV` | `number` | Yes | - | Degree of the surface in V direction |
| `color` | `string` | No | `'#ffffff'` | Surface color (only used if no material is provided) |
| `wireframe` | `boolean` | No | `false` | Whether to render as wireframe (only used if no material is provided) |
| `children` | `ReactElement` | No | - | Material component (e.g., `meshStandardMaterial`, `meshPhongMaterial`) |
| `...meshProps` | `MeshProps` | No | - | All React Three Fiber mesh props are supported |

### NurbsCurve Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `points` | `number[][]` | Yes | - | Control points defining the curve shape |
| `knots` | `number[]` | Yes | - | Knot vector defining the curve parameterization |
| `degree` | `number` | No | `3` | Degree of the curve |
| `weights` | `number[]` | No | `[1, 1, ...]` | Weights for each control point |
| `curveResolution` | `number` | No | `50` | Number of points to sample along the curve |
| `color` | `string` | No | `'black'` | Line color |
| `segments` | `boolean` | No | `false` | Whether to render as line segments |
| `dashed` | `boolean` | No | `false` | Whether to render as dashed line |
| `vertexColors` | `number[][]` | No | - | RGB colors for each vertex |
| `...lineProps` | `LineProps` | No | - | All drei Line component props are supported |

### TrimmedSurface Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactElement[]` | Yes | - | Must contain exactly one `NurbsSurface`, one or more `NurbsCurve` components for trimming, and one material component |
| `...meshProps` | `MeshProps` | No | - | All React Three Fiber mesh props are supported |

The `TrimmedSurface` component requires its children to be in this specific order:
1. A `NurbsSurface` component defining the base surface
2. One or more `NurbsCurve` components defining the trimming curves (in UV space)
3. A material component (e.g., `meshStandardMaterial`, `meshPhongMaterial`)

## Development

This project is built with:
- [React](https://reactjs.org/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [verb-nurbs](https://github.com/pboyer/verb) for NURBS calculations
- [Vite](https://vitejs.dev/) for building
- [TypeScript](https://www.typescriptlang.org/) for type safety

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build

# Run Storybook
npm run storybook
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
