# react-three-nurbs

A React component library for NURBS (Non-Uniform Rational B-Spline) curves, surfaces, and solids in Three.js. Built with React Three Fiber, zero external NURBS dependencies — all math implemented from scratch. Boolean operations powered by OpenCASCADE WASM.

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/tommasoturchi)

## Features

- 20 components for curves, surfaces, solids, and geometric operations
- 9 hooks for using NURBS math without rendering
- Custom NURBS engine — no external math dependencies
- Solid primitives (box, cylinder, sphere) with B-Rep data model
- Boolean operations (union, difference, intersection) via OpenCASCADE WASM
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

### NurbsEllipse / NurbsEllipseArc

Exact NURBS ellipse and elliptical arc primitives. Semi-axes are defined by the length of the `xaxis` and `yaxis` vectors.

```tsx
import { NurbsEllipse, NurbsEllipseArc } from 'react-three-nurbs'

<NurbsEllipse
  center={[0, 0, 0]}
  xaxis={[2, 0, 0]}
  yaxis={[0, 1, 0]}
  color="blue"
  lineWidth={2}
/>
<NurbsEllipseArc
  center={[0, 0, 0]}
  xaxis={[2, 0, 0]}
  yaxis={[0, 1, 0]}
  startAngle={0}
  endAngle={Math.PI}
  color="red"
/>
```

### CylindricalSurface

Creates a cylindrical NURBS surface from a base circle extruded along an axis.

```tsx
import { CylindricalSurface } from 'react-three-nurbs'

<CylindricalSurface
  axis={[0, 1, 0]}
  base={[0, 0, 0]}
  height={2}
  radius={0.5}
  resolutionU={30}
  resolutionV={10}
>
  <meshStandardMaterial color="#ff8800" side={DoubleSide} />
</CylindricalSurface>
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

### NurbsSolidComponent

Renders all faces of a NURBS solid as a single merged mesh. Accepts a `SolidData` object (from `NurbsSolid.asData()` or `useNurbsSolid`).

```tsx
import { NurbsSolidComponent, NurbsSolid } from 'react-three-nurbs'

const box = NurbsSolid.makeBox(2, 1, 1)

<NurbsSolidComponent
  solid={box.asData()}
  resolutionU={20}
  resolutionV={20}
  color="#4488ff"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `solid` | `SolidData` | required | Solid data (array of oriented faces) |
| `resolutionU` / `resolutionV` | `number` | `20` | Per-face tessellation resolution |
| `color` | `string` | `'#4488ff'` | Default material color |
| `wireframe` | `boolean` | `false` | Render as wireframe |

### BooleanResult

Performs a boolean operation (union, difference, intersection) between two shape descriptors using OpenCASCADE WASM and renders the resulting mesh. The WASM module (~5 MB) is lazy-loaded on first use.

```tsx
import { BooleanResult } from 'react-three-nurbs'
import type { ShapeDescriptor } from 'react-three-nurbs'

const box: ShapeDescriptor = { type: 'box', dx: 2, dy: 2, dz: 2, origin: [-1, -1, -1] }
const cyl: ShapeDescriptor = { type: 'cylinder', radius: 0.8, height: 3, origin: [0, 0, -1.5] }

<BooleanResult
  shapeA={box}
  shapeB={cyl}
  operation="difference"
  meshDeflection={0.05}
  color="#ff4444"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shapeA` | `ShapeDescriptor \| null` | required | First operand |
| `shapeB` | `ShapeDescriptor \| null` | required | Second operand |
| `operation` | `BooleanOperation` | required | `'union'` \| `'difference'` \| `'intersection'` |
| `meshDeflection` | `number` | `0.1` | Tessellation accuracy (lower = finer mesh) |
| `color` | `string` | `'#4488ff'` | Default material color |
| `wireframe` | `boolean` | `false` | Render as wireframe |

The `ShapeDescriptor` type supports three primitive shapes:

```tsx
type ShapeDescriptor =
  | { type: 'box'; dx: number; dy: number; dz: number; origin?: [number, number, number] }
  | { type: 'cylinder'; radius: number; height: number; origin?: [number, number, number]; axis?: [number, number, number] }
  | { type: 'sphere'; radius: number; center?: [number, number, number] }
```

> **Note:** Boolean operations require the OpenCASCADE WASM module (~5 MB), which is lazy-loaded via dynamic `import()` the first time a boolean operation is invoked. This keeps the base bundle small and avoids loading WASM for applications that only use curves and surfaces.

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

### useNurbsSolid

Creates a NURBS solid primitive (box, cylinder, sphere, or custom faces) and returns the `NurbsSolid` instance along with its plain data.

```tsx
import { useNurbsSolid, NurbsSolidComponent } from 'react-three-nurbs'

function MyBox() {
  const { solid, data, faces } = useNurbsSolid({
    primitive: { type: 'box', dx: 2, dy: 1, dz: 1 },
  })

  return data ? <NurbsSolidComponent solid={data} color="#4488ff" /> : null
}
```

The `primitive` option accepts one of:

```tsx
type SolidPrimitive =
  | { type: 'box'; dx: number; dy: number; dz: number; origin?: [number, number, number] }
  | { type: 'cylinder'; radius: number; height: number; axis?: [number, number, number]; origin?: [number, number, number] }
  | { type: 'sphere'; radius: number; center?: [number, number, number] }
  | { type: 'custom'; faces: FaceData[] }
```

### useBooleanOperation

Performs an async boolean operation between two `ShapeDescriptor` objects using OpenCASCADE WASM. Returns the tessellated mesh result, a loading flag, and any error.

```tsx
import { useBooleanOperation } from 'react-three-nurbs'
import type { ShapeDescriptor } from 'react-three-nurbs'

const box: ShapeDescriptor = { type: 'box', dx: 2, dy: 2, dz: 2 }
const sphere: ShapeDescriptor = { type: 'sphere', radius: 1.2 }

function MyBoolean() {
  const { mesh, isComputing, error } = useBooleanOperation({
    shapeA: box,
    shapeB: sphere,
    operation: 'intersection',
    meshDeflection: 0.05,
  })

  if (isComputing) return <mesh><sphereGeometry args={[0.1]} /><meshBasicMaterial color="#888" wireframe /></mesh>
  if (error || !mesh) return null

  // mesh.vertices, mesh.normals, mesh.indices are typed arrays
  // ready to be used with BufferGeometry
}
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
} from 'react-three-nurbs'
```

## Solids

### NurbsSolid Primitives

Create solid volumes from NURBS faces:

```tsx
import { NurbsSolid, NurbsSolidComponent } from 'react-three-nurbs'

const box = NurbsSolid.makeBox(2, 1.5, 1)
const cylinder = NurbsSolid.makeCylinder(0.5, 2)
const sphere = NurbsSolid.makeSphere(1)

<NurbsSolidComponent solid={box.asData()} resolutionU={10} resolutionV={10}>
  <meshPhongMaterial color="#4488ff" side={DoubleSide} />
</NurbsSolidComponent>
```

### Solid Construction from Curves & Surfaces

Build solids from existing curves and surfaces:

```tsx
import { NurbsSolid, NurbsCurve, createCircle } from 'react-three-nurbs'

// Revolve a profile curve around an axis (like a lathe)
const vaseProfile = NurbsCurve.byKnotsControlPointsWeights(3, knots, profilePoints, weights)
const vase = NurbsSolid.fromRevolution(vaseProfile.asData(), [0,0,0], [0,1,0], Math.PI * 2)

// Extrude a closed curve along a direction (like pushing Play-Doh)
const circle = createCircle([0,0,0], [1,0,0], [0,1,0], 0.8)
const tube = NurbsSolid.fromExtrusion(circle, [0, 0, 2], true) // capped = true

// Thicken a surface into a shell (adds wall thickness)
const shell = NurbsSolid.fromSurface(surfaceData, 0.2)

// Wrap any surface as a solid face for manual composition
const face = NurbsSolid.faceFromSurface(surfaceData, 'forward')
const custom = NurbsSolid.fromFaces([face1, face2, face3])
```

Both `fromRevolution` and `fromExtrusion` accept an optional `capped` parameter (default `false`) to close partial revolutions or extrusion ends.

### Boolean Operations

Union, difference, and intersection between solids using OpenCASCADE WASM (~5 MB, lazy-loaded on first use):

```tsx
import { BooleanResult } from 'react-three-nurbs'

<BooleanResult
  shapeA={{ type: "box", dx: 2, dy: 2, dz: 2, origin: [-1, -1, -1] }}
  shapeB={{ type: "cylinder", radius: 0.5, height: 3, origin: [0, 0, -1.5], axis: [0, 0, 1] }}
  operation="difference"
>
  <meshPhongMaterial color="#4488ff" side={DoubleSide} />
</BooleanResult>
```

Or at the hook level:

```tsx
import { useBooleanOperation } from 'react-three-nurbs'

const { mesh, isComputing, error } = useBooleanOperation({
  shapeA: { type: "box", dx: 2, dy: 2, dz: 2 },
  shapeB: { type: "sphere", radius: 1 },
  operation: 'difference', // 'union' | 'difference' | 'intersection'
})
```

Shape descriptors: `{ type: "box", dx, dy, dz, origin? }`, `{ type: "cylinder", radius, height, axis?, origin? }`, `{ type: "sphere", radius, center? }`.

## Core NURBS Engine

The library includes a standalone NURBS math engine with no external dependencies:

```tsx
import { NurbsCurve, NurbsSurface, NurbsSolid } from 'react-three-nurbs'

const curve = NurbsCurve.byKnotsControlPointsWeights(degree, knots, controlPoints, weights)
const point = curve.point(0.5)
const tangent = curve.tangent(0.5)

const surface = NurbsSurface.byKnotsControlPointsWeights(degreeU, degreeV, knotsU, knotsV, cp, w)
const pt = surface.point(0.5, 0.5)
const normal = surface.normal(0.5, 0.5)
const isoCurve = surface.isocurve(0.5, false)

const solid = NurbsSolid.makeBox(2, 1, 3)       // 6 planar faces
const revolved = NurbsSolid.fromRevolution(curveData, center, axis, angle)
const extruded = NurbsSolid.fromExtrusion(curveData, direction, capped)
const shell = NurbsSolid.fromSurface(surfaceData, thickness)
const faces = solid.faces()                      // FaceData[]
```

## Boolean Operations (OpenCASCADE)

Boolean operations (union, difference, intersection) use a custom OpenCASCADE WASM build (~5 MB). The WASM is **lazy-loaded** via dynamic `import()` the first time a boolean operation runs, keeping the base bundle small.

```tsx
import { booleanOperation } from 'react-three-nurbs'
import type { ShapeDescriptor, BooleanMeshResult } from 'react-three-nurbs'

const result: BooleanMeshResult = await booleanOperation(
  { type: 'box', dx: 2, dy: 2, dz: 2 },
  { type: 'cylinder', radius: 0.8, height: 3 },
  'difference',
  0.05 // meshDeflection
)
// result.vertices: Float32Array
// result.indices:  Uint32Array
// result.normals:  Float32Array
```

WASM loader utilities:

```tsx
import { getOC, setOC, isOCLoaded } from 'react-three-nurbs'

await getOC()         // Load and return OCCT instance (cached after first call)
setOC(myOCInstance)   // Provide your own OCCT instance
isOCLoaded()          // Check if WASM is ready
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
