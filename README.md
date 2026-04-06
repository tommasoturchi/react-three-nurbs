# react-three-nurbs

A React component library for NURBS (Non-Uniform Rational B-Spline) curves and surfaces in Three.js. Built with React Three Fiber, zero external NURBS dependencies — all math implemented from scratch.

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/tommasoturchi)

## Features

- 15 components for curves, surfaces, and geometric operations
- 7 hooks for using NURBS math without rendering
- Custom NURBS engine — no external math dependencies
- Full TypeScript support with exported prop types
- Interactive control point editing with drag handles
- Point projection using NURBS Book Algorithm A6.1

## Installation

```bash
npm install react-three-nurbs
```

Peer dependencies: `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`

## Components

### NurbsCurve

Renders a NURBS curve from control points. Knots are auto-generated if omitted.

```tsx
import { NurbsCurve } from 'react-three-nurbs'

<NurbsCurve
  points={[[0, 0, 0], [1, 1, 0], [2, 0, 0], [3, 1, 0]]}
  degree={3}
  color="red"
  lineWidth={2}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `points` | `number[][]` | required | Control points |
| `degree` | `number` | `3` | Curve degree |
| `knots` | `number[]` | auto | Knot vector (auto-generated if omitted) |
| `weights` | `number[]` | `[1,...]` | Control point weights |
| `resolution` | `number` | `50` | Sampling resolution |
| `color` | `string` | `'black'` | Line color |

### NurbsSurface

Renders a NURBS surface with customizable tessellation and materials.

```tsx
import { NurbsSurface } from 'react-three-nurbs'
import { DoubleSide } from 'three'

<NurbsSurface
  controlPoints={[
    [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
    [[0, 1, 0], [1, 1, 1], [2, 1, 0]],
    [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
  ]}
  weights={[[1, 1, 1], [1, 1, 1], [1, 1, 1]]}
  degreeU={2}
  degreeV={2}
  resolutionU={30}
  resolutionV={30}
>
  <meshStandardMaterial color="#4488ff" side={DoubleSide} />
</NurbsSurface>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `controlPoints` | `number[][][]` | required | 3D control point grid |
| `weights` | `number[][]` | required | Weight grid |
| `degreeU` / `degreeV` | `number` | required | Surface degree |
| `knotsU` / `knotsV` | `number[]` | auto | Knot vectors |
| `resolutionU` / `resolutionV` | `number` | `20` | Tessellation resolution |
| `fastNormals` | `boolean` | `false` | Use fast vertex normals (skip analytical) |

### InterpolatedCurve

Creates a smooth curve that passes *through* a set of points (unlike NurbsCurve which uses control points).

```tsx
import { InterpolatedCurve } from 'react-three-nurbs'

<InterpolatedCurve
  throughPoints={[[0, 0, 0], [1, 1, 0], [2, 0, 0], [3, 1, 0]]}
  degree={3}
  color="blue"
  lineWidth={2}
/>
```

### InterpolatedSurface

Creates a surface passing through a grid of 3D points.

```tsx
import { InterpolatedSurface } from 'react-three-nurbs'

<InterpolatedSurface
  points={[
    [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
    [[0, 1, 0], [1, 1, 0.5], [2, 1, 0]],
    [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
  ]}
  degreeU={2}
  degreeV={2}
  resolutionU={30}
  resolutionV={30}
>
  <meshPhongMaterial color="#44ccff" side={DoubleSide} />
</InterpolatedSurface>
```

### LoftedSurface

Creates a surface by lofting through multiple profile curves.

```tsx
import { LoftedSurface, NurbsCurve } from 'react-three-nurbs'

<LoftedSurface degreeV={3} resolutionU={20} resolutionV={20}>
  <NurbsCurve points={[[0, 0, 0], [1, 0, 0], [2, 0, 0]]} degree={2} />
  <NurbsCurve points={[[0, 1, 1], [1, 1, 0], [2, 1, 1]]} degree={2} />
  <NurbsCurve points={[[0, 2, 0], [1, 2, 0], [2, 2, 0]]} degree={2} />
  <meshStandardMaterial color="#ff0000" side={DoubleSide} />
</LoftedSurface>
```

### RevolvedSurface

Creates a surface of revolution by rotating a profile curve around an axis.

```tsx
import { RevolvedSurface, NurbsCurve } from 'react-three-nurbs'

<RevolvedSurface
  center={[0, 0, 0]}
  axis={[0, 1, 0]}
  angle={Math.PI * 2}
  resolutionU={30}
  resolutionV={20}
>
  <NurbsCurve points={[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]} degree={3} />
  <meshStandardMaterial color="#ff0000" side={DoubleSide} />
</RevolvedSurface>
```

### ExtrudedSurface

Extrudes a profile curve along a direction vector.

```tsx
import { ExtrudedSurface, NurbsCurve } from 'react-three-nurbs'

<ExtrudedSurface direction={[0, 0, 2]} resolutionU={20} resolutionV={20}>
  <NurbsCurve points={[[0, 0, 0], [0.5, 0.5, 0], [1, 0, 0]]} degree={2} />
  <meshStandardMaterial color="#4488ff" side={DoubleSide} />
</ExtrudedSurface>
```

### SweptSurface

Sweeps a profile curve along a rail curve.

```tsx
import { SweptSurface, NurbsCurve } from 'react-three-nurbs'

<SweptSurface resolutionU={30} resolutionV={30}>
  {/* First NurbsCurve = profile, Second = rail */}
  <NurbsCurve points={[[0, -0.2, 0], [0.2, 0, 0], [0, 0.2, 0], [-0.2, 0, 0]]} degree={2} />
  <NurbsCurve points={[[0, 0, 0], [1, 1, 0.5], [2, 0, 1], [3, 0, 2]]} degree={3} />
  <meshStandardMaterial color="#44ff88" side={DoubleSide} />
</SweptSurface>
```

### TrimmedSurface

Creates a surface trimmed by one or more curves in UV space.

```tsx
import { TrimmedSurface, NurbsSurface, NurbsCurve } from 'react-three-nurbs'

<TrimmedSurface trimCurveResolution={200} adaptiveMaxAngleDeg={5}>
  <NurbsSurface controlPoints={...} weights={...} degreeU={2} degreeV={2} />
  <NurbsCurve points={[[0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8]]} degree={3} />
  <meshPhongMaterial color="#ff0000" side={DoubleSide} />
</TrimmedSurface>
```

Set `world={true}` to use 3D world-space trimming curves (automatically projected onto the surface).

### CoonsPatch

Fills a region bounded by 4 boundary curves using bilinear Coons interpolation.

```tsx
import { CoonsPatch, NurbsCurve } from 'react-three-nurbs'

<CoonsPatch resolutionU={30} resolutionV={30}>
  {/* Order: bottom, top, left, right */}
  <NurbsCurve points={[[0, 0, 0], [1, 0, 0.5], [2, 0, 0]]} degree={2} />
  <NurbsCurve points={[[0, 2, 0], [1, 2, 1], [2, 2, 0]]} degree={2} />
  <NurbsCurve points={[[0, 0, 0], [0, 1, 0.3], [0, 2, 0]]} degree={2} />
  <NurbsCurve points={[[2, 0, 0], [2, 1, 0.5], [2, 2, 0]]} degree={2} />
  <meshPhongMaterial color="#6688cc" side={DoubleSide} />
</CoonsPatch>
```

### NurbsCircle / NurbsArc

Exact NURBS circle and arc primitives (not polygon approximations).

```tsx
import { NurbsCircle, NurbsArc } from 'react-three-nurbs'

<NurbsCircle center={[0, 0, 0]} radius={1} color="blue" lineWidth={2} />
<NurbsArc center={[0, 0, 0]} radius={1} startAngle={0} endAngle={Math.PI} color="red" />
```

### IsoCurves

Renders iso-parametric curves on a surface for visualization.

```tsx
import { IsoCurves } from 'react-three-nurbs'
import { useNurbsSurface } from 'react-three-nurbs'

function MyComponent() {
  const { surface } = useNurbsSurface({ controlPoints, weights, degreeU: 2, degreeV: 2 })
  return surface ? <IsoCurves surface={surface} countU={10} countV={10} color="#333" /> : null
}
```

### OffsetCurve

Renders a curve offset by a distance in a plane.

```tsx
import { OffsetCurve } from 'react-three-nurbs'

<OffsetCurve
  sourcePoints={[[0, 0, 0], [1, 1, 0], [2, 0, 0]]}
  sourceDegree={2}
  distance={0.2}
  color="red"
  lineWidth={2}
/>
```

### SurfaceIntersection

Computes and renders intersection curves between two NurbsSurface children.

```tsx
import { SurfaceIntersection, NurbsSurface } from 'react-three-nurbs'

<SurfaceIntersection lineColor="#ff0000" lineWidth={4} tolerance={0.001}>
  <NurbsSurface controlPoints={surface1CP} weights={w1} degreeU={2} degreeV={2}>
    <meshPhongMaterial color="#4488ff" transparent opacity={0.4} side={DoubleSide} />
  </NurbsSurface>
  <NurbsSurface controlPoints={surface2CP} weights={w2} degreeU={2} degreeV={2}>
    <meshPhongMaterial color="#44ff88" transparent opacity={0.4} side={DoubleSide} />
  </NurbsSurface>
</SurfaceIntersection>
```

## Hooks

### useNurbsCurve

```tsx
const { curve, points, point, tangent, length, closestParam } = useNurbsCurve({
  points: [[0, 0, 0], [1, 1, 0], [2, 0, 0]],
  degree: 2,
  resolution: 50,
})

// Evaluate at parameter t
const pt = point(0.5)        // Vector3
const tan = tangent(0.5)     // Vector3 (normalized)
const len = length()          // number
const t = closestParam(pt)   // number
```

### useNurbsSurface

```tsx
const { surface, geometry, point, normal, closestParam } = useNurbsSurface({
  controlPoints, weights, degreeU: 2, degreeV: 2,
  resolutionU: 30, resolutionV: 30,
})

// geometry contains: vertices, normals, uvs, indices (Float32Array/Uint32Array)
const pt = point(0.5, 0.5)         // Vector3
const n = normal(0.5, 0.5)          // Vector3
const [u, v] = closestParam(pt)    // [number, number]
```

### useInterpolatedCurve

```tsx
const { curve, points, point, tangent } = useInterpolatedCurve({
  throughPoints: [[0, 0, 0], [1, 1, 0], [2, 0, 0]],
  degree: 3,
})
```

### useControlPointDrag

Interactive control point dragging for surfaces and curves.

```tsx
const [controlPoints, setControlPoints] = useState(initialCP)

const { handles, isDragging, activeIndex, dragBind } = useControlPointDrag({
  controlPoints,
  onControlPointChange: (newPoints) => setControlPoints(newPoints),
  dragPlane: 'screen', // 'xy' | 'xz' | 'yz' | 'screen'
})

return (
  <>
    <NurbsSurface controlPoints={controlPoints} ... />
    {handles.map(handle => (
      <mesh key={handle.index.join('-')} position={handle.position} {...handle.bind}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color={activeIndex?.join(',') === handle.index.join(',') ? 'red' : 'orange'} />
      </mesh>
    ))}
    {isDragging && (
      <mesh visible={false} {...dragBind}>
        <planeGeometry args={[100, 100]} />
      </mesh>
    )}
  </>
)
```

### useSurfaceIntersection

```tsx
const { curves } = useSurfaceIntersection({
  surface0: { controlPoints: cp1, weights: w1, degreeU: 2, degreeV: 2 },
  surface1: { controlPoints: cp2, weights: w2, degreeU: 2, degreeV: 2 },
  tolerance: 0.001,
})
// curves: Array<{ points: Vector3[] }>
```

### useOffsetCurve

```tsx
const { curve, points } = useOffsetCurve({
  curve: sourceNurbsCurve, // from useNurbsCurve
  distance: 0.2,
  planeNormal: [0, 0, 1],
})
```

## Utilities

```tsx
import {
  generateUniformKnots,    // (numControlPoints, degree) => number[]
  computeNormal,            // (surface, u, v) => Vector3
  projectPointToSurfaceUV,  // (surface, point) => [u, v] | null
  projectCurveOntoSurface,  // (surface, curve, samples) => [u, v][]
  computeCoonsPatch,        // (bottom, top, left, right, resU, resV) => BufferGeometry
  curveKnotRefine,          // (curve, knotsToInsert) => NurbsCurve
  surfaceKnotRefine,        // (surface, knotsToInsert, useV) => NurbsSurface
  curveElevateDegree,       // (curve, finalDegree) => NurbsCurve
  unifyCurveKnots,          // (curves) => NurbsCurve[]
  validateControlPoints,    // (cp, degreeU, degreeV) => string | null
  validateKnots,            // (knots, numCP, degree) => string | null
  isMaterialElement,        // (child) => boolean
} from 'react-three-nurbs'
```

## Core NURBS Engine

The library includes a standalone NURBS math engine with no external dependencies:

```tsx
import { NurbsCurve, NurbsSurface } from 'react-three-nurbs'

// These are the same classes used internally by all components
const curve = NurbsCurve.byKnotsControlPointsWeights(degree, knots, controlPoints, weights)
const point = curve.point(0.5)
const tangent = curve.tangent(0.5)

const surface = NurbsSurface.byKnotsControlPointsWeights(degreeU, degreeV, knotsU, knotsV, cp, w)
const pt = surface.point(0.5, 0.5)
const normal = surface.normal(0.5, 0.5)
const isoCurve = surface.isocurve(0.5, false) // extract V-direction curve at u=0.5
```

## Development

```bash
npm install       # Install dependencies
npm run dev       # Start Storybook (port 6006)
npm run build     # Build the library
npm run test      # Run tests (vitest)
npm run lint      # Run ESLint
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
