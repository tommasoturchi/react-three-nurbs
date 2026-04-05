# react-three-nurbs — Agent Context

## What This Library Is

A React Three Fiber component library for NURBS (Non-Uniform Rational B-Spline) curves and surfaces. Provides declarative React components for rendering and manipulating NURBS geometry in 3D. **Zero external NURBS dependencies** — all math is implemented from scratch in `src/core/`.

## Architecture

```
src/
  core/           — Custom NURBS math engine (no external deps)
    basis.ts      — B-spline basis functions (Cox-de Boor, Algorithms A2.1-A2.3)
    curve.ts      — NurbsCurve class (eval, tangent, derivatives, length, closestParam, split)
    surface.ts    — NurbsSurface class (eval, normal, derivatives, closestParam, isocurve)
    fit.ts        — Curve interpolation (Algorithm A9.1), surface lofting
    construct.ts  — Circle, arc, revolve, extrude, sweep construction
    modify.ts     — Knot insertion (Boehm's A5.1), refinement, degree elevation
    intersect.ts  — Surface-surface intersection (marching squares)
    types.ts      — CurveData, SurfaceData interfaces
    index.ts      — Barrel export

  components/     — React Three Fiber components
    NurbsCurve.tsx          — Renders NURBS curve via drei <Line>
    NurbsSurface.tsx        — Renders NURBS surface (forwardRef<Mesh>), imperative geometry updates
    LoftedSurface.tsx       — Surface through multiple profile curves
    TrimmedSurface.tsx      — Surface with UV-space trimming curves (earcut triangulation)
    RevolvedSurface.tsx     — Surface of revolution
    ExtrudedSurface.tsx     — Profile extruded along direction
    SweptSurface.tsx        — Profile swept along rail curve
    InterpolatedCurve.tsx   — Curve through points (fitting, not control points)
    InterpolatedSurface.tsx — Surface through point grid
    NurbsCircle.tsx         — Exact NURBS circle
    NurbsArc.tsx            — Exact NURBS arc
    IsoCurves.tsx           — Iso-parametric curve visualization
    CoonsPatch.tsx          — Surface from 4 boundary curves (bilinear Coons)
    OffsetCurve.tsx         — Curve offset by distance
    SurfaceIntersection.tsx — Renders intersection curves between 2 surfaces

  hooks/          — React hooks for NURBS math without rendering
    useNurbsCurve.ts          — Curve creation + point/tangent/length/closestParam methods
    useNurbsSurface.ts        — Surface creation + geometry + point/normal/closestParam
    useInterpolatedCurve.ts   — Curve fitting through points
    useInterpolatedSurface.ts — Surface fitting through point grid
    useOffsetCurve.ts         — Offset curve computation
    useControlPointDrag.ts    — Interactive control point dragging (imperative R3F)
    useSurfaceIntersection.ts — Surface-surface intersection computation

  utils/          — Shared utilities
    nurbs.ts      — generateUniformKnots, computeNormal, projectPointToSurfaceUV,
                    projectCurveOntoSurface (marching), sampleNurbsCurve2D,
                    adaptiveSampleNurbsCurve2D
    materials.ts  — isMaterialElement (detects R3F material elements including JSX intrinsics)
    validation.ts — validateControlPoints, validateKnots, validateWeights, validateDegree
    coons.ts      — computeCoonsPatch (bilinear Coons interpolation math)
    knots.ts      — Typed wrappers around core knot operations

  stories/        — Storybook demos with interactive controls
  types/          — (empty — verb-nurbs types were here, now removed)
```

## Key Design Patterns

### Component Pattern
- Components use `useMemo` for geometry computation + declarative JSX or imperative `BufferGeometry` updates
- `NurbsSurface` uses `forwardRef<Mesh>` with imperative geometry mutation (for performance during interactive editing)
- Material detection via `isMaterialElement()` which handles both R3F JSX intrinsics (`"meshPhongMaterial"`) and class-based materials
- Child separation: components extract `NurbsCurve` children from material children using `Children.toArray()` + type checks

### Hook Pattern
- `useMemo` for verb object creation and geometry computation
- `useCallback` for stable method references (point, tangent, closestParam, etc.)
- Options/Result interfaces exported alongside each hook

### Core Engine
- `NurbsCurve` and `NurbsSurface` are classes wrapping `CurveData`/`SurfaceData` plain objects
- Static factory methods: `byKnotsControlPointsWeights()`, `byPoints()`, `byLoftingCurves()`, `byCorners()`
- `.asData()` for extracting plain data (needed when passing to construction functions)
- Construction functions (`createArc`, `createRevolvedSurface`, etc.) return plain data, wrapped in `new NurbsCurve(data)` or `new NurbsSurface(data)` by callers
- No circular dependencies: `curve.ts` → `fit.ts` → `modify.ts`; `surface.ts` → `curve.ts`, `fit.ts`

### Storybook Pattern
- Meta uses `satisfies Meta` (no component generic, since children can't be serialized as args)
- `argTypes` with explicit controls (color, range, boolean)
- `args` with default values on each story
- `render` destructures from `Record<string, any>` with defaults matching `args`
- Interactive demos (ControlPointEditor) use `useFrame` for imperative updates bypassing React

## Performance Notes

### Control Point Editor
- During drag: React is completely bypassed. `useFrame` loop reads from refs, mutates `BufferGeometry` directly, updates sphere positions imperatively
- Adaptive throttle considered but simpler ref-based approach works better
- `Stats` component (drei) available for FPS monitoring
- `fastNormals` prop on NurbsSurface skips analytical normals, uses `computeVertexNormals()` instead

### Point Projection (Algorithm A6.1)
- Curve: Greville abscissa initial guess + global sweep + Newton with 4 convergence criteria (point coincidence, zero cosine, parameter correction, domain bounds)
- Surface: Control polygon initial guess + 20×20 grid + Newton with 4 criteria (both U and V cosine checks)
- Curve-onto-surface: Marching approach (`projectCurveOntoSurface`) — each point uses previous UV as Newton initial guess

## Build & Test

- **Build**: `npm run build` (tsc + vite library mode, ESM only)
- **Test**: `npm run test` (vitest, 71 tests across 7 files)
- **Dev**: `npm run dev` (launches Storybook on port 6006)
- **Storybook build**: `npm run build-storybook`
- Bundle: ~109 KB ESM (no external NURBS deps)
- Externals: react, react-dom, three, @react-three/fiber, @react-three/drei

## Dependencies

### Production
- `@react-three/drei` — Line component, OrbitControls, Stats
- `@react-three/fiber` — React renderer for Three.js
- `earcut` — 2D polygon triangulation (for TrimmedSurface)
- `react`, `react-dom`, `three`

### Removed
- `verb-nurbs` — fully replaced by `src/core/` custom engine (was buggy: Intersect.surfaces crashed, unmaintained, 965KB)

## Reference

Algorithms implemented from: "The NURBS Book" (2nd ed.), Les Piegl & Wayne Tiller, Springer 1997.
Key algorithms: A2.1-A2.3 (basis), A4.1-A4.3 (evaluation), A5.1/A5.4/A5.9 (modify), A6.1 (projection), A8.1 (revolution), A9.1 (interpolation).
