# react-three-nurbs — Agent Context

## What This Library Is

A React Three Fiber component library for NURBS (Non-Uniform Rational B-Spline) curves, surfaces, and solids. Provides declarative React components for rendering and manipulating NURBS geometry in 3D. **Zero external NURBS dependencies** — all math is implemented from scratch in `src/core/`. Boolean operations on solids use a custom OpenCASCADE WASM build (~5 MB, lazy-loaded).

## Architecture

```
src/
  core/           — Custom NURBS math engine (no external deps)
    basis.ts      — B-spline basis functions (Cox-de Boor, Algorithms A2.1-A2.3)
    curve.ts      — NurbsCurve class (eval, tangent, derivatives, length, closestParam, split, divideByEqualArcLength)
    surface.ts    — NurbsSurface class (eval, normal, derivatives, closestParam, isocurve)
    solid.ts      — NurbsSolid class (closed volume of oriented faces; makeBox, makeCylinder, makeSphere, fromFaces)
    fit.ts        — Curve interpolation (Algorithm A9.1), surface lofting
    construct.ts  — Circle, arc, ellipse, ellipseArc, cylindricalSurface, revolve, extrude, sweep,
                    createBoxSolid, createCylinderSolid, createSphereSolid
    modify.ts     — Knot insertion (Boehm's A5.1), refinement, degree elevation
    intersect.ts  — Surface-surface intersection (marching squares)
    types.ts      — CurveData, SurfaceData, FaceData, SolidData interfaces
    index.ts      — Barrel export

  occt/           — OpenCASCADE WASM integration (boolean operations)
    loader.ts     — Lazy loader: getOC(), setOC(), isOCLoaded(). WASM loaded on first use via dynamic import().
                    Cached as singleton — subsequent calls return the same instance.
    convert.ts    — Conversion between react-three-nurbs types and OCCT objects
                    (curveDataToOCCT, surfaceDataToOCCT, faceDataToOCCT, solidToOCCT, occtShapeToMesh).
                    Handles knot multiplicity extraction, pole arrays, sewing faces into solids.
    boolean.ts    — booleanOperation(shapeA, shapeB, op, deflection): builds OCCT primitives via
                    BRepPrimAPI_MakeBox/Cylinder/Sphere, runs BRepAlgoAPI_Fuse/Cut/Common,
                    tessellates result via BRepMesh_IncrementalMesh, returns Float32Array mesh.
                    Exports: ShapeDescriptor type (box | cylinder | sphere),
                    BooleanOperation type ("union" | "difference" | "intersection"),
                    BooleanMeshResult interface (vertices, indices, normals as typed arrays).
    occtBooleans.js   — Custom OCCT WASM JS glue (ES6 module, built via opencascade.js Docker)
    occtBooleans.wasm — Custom OCCT WASM binary (~5 MB, contains only primitives + booleans + meshing)
    occtBooleans.d.ts — TypeScript declarations for bound OCCT classes
    __tests__/
      boolean.test.ts — Tests for boolean operations

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
    NurbsEllipse.tsx        — Exact NURBS ellipse (semi-axes via xaxis/yaxis vectors)
    NurbsEllipseArc.tsx     — Exact NURBS elliptical arc
    CylindricalSurface.tsx  — Cylindrical surface (circle extruded along axis)
    IsoCurves.tsx           — Iso-parametric curve visualization
    CoonsPatch.tsx          — Surface from 4 boundary curves (bilinear Coons)
    OffsetCurve.tsx         — Curve offset by distance
    SurfaceIntersection.tsx — Renders intersection curves between 2 surfaces
    NurbsSolidComponent.tsx — Renders all faces of a NurbsSolid as a single merged mesh.
                              Tessellates each FaceData (respecting orientation), merges
                              vertices/normals/UVs/indices into one BufferGeometry.
    BooleanResult.tsx       — Performs boolean operation via useBooleanOperation hook,
                              renders result mesh. Shows placeholder sphere while WASM computes.
                              Accepts ShapeDescriptor props + operation + meshDeflection.

  hooks/          — React hooks for NURBS math without rendering
    useNurbsCurve.ts          — Curve creation + point/tangent/length/closestParam methods
    useNurbsSurface.ts        — Surface creation + geometry + point/normal/closestParam
    useInterpolatedCurve.ts   — Curve fitting through points
    useInterpolatedSurface.ts — Surface fitting through point grid
    useOffsetCurve.ts         — Offset curve computation
    useControlPointDrag.ts    — Interactive control point dragging (imperative R3F)
    useSurfaceIntersection.ts — Surface-surface intersection computation
    useNurbsSolid.ts          — Creates NurbsSolid from SolidPrimitive descriptor
                                (box, cylinder, sphere, custom). Returns solid, data, faces.
                                SolidPrimitive is a discriminated union type.
    useBooleanOperation.ts    — Async boolean op via OCCT WASM. Returns mesh, isComputing, error.
                                Uses useState + useEffect with abort ref pattern for async safety.
                                Dynamically imports ../occt/boolean on first call.

  utils/          — Shared utilities
    nurbs.ts      — generateUniformKnots, computeNormal, projectPointToSurfaceUV,
                    projectCurveOntoSurface (marching), sampleNurbsCurve2D,
                    adaptiveSampleNurbsCurve2D
    materials.ts  — isMaterialElement (detects R3F material elements including JSX intrinsics)
    validation.ts — validateControlPoints, validateKnots, validateWeights, validateDegree
    coons.ts      — computeCoonsPatch (bilinear Coons interpolation math)
    knots.ts      — Typed wrappers around core knot operations

  stories/        — Storybook demos with interactive controls
    NurbsSolid.stories.tsx          — Solid primitive demos (box, cylinder, sphere)
    BooleanOperations.stories.tsx   — Boolean operation demos (union, difference, intersection)
  types/          — (empty — verb-nurbs types were here, now removed)
```

## Key Design Patterns

### Component Pattern
- Components use `useMemo` for geometry computation + declarative JSX or imperative `BufferGeometry` updates
- `NurbsSurface` uses `forwardRef<Mesh>` with imperative geometry mutation (for performance during interactive editing)
- Material detection via `isMaterialElement()` which handles both R3F JSX intrinsics (`"meshPhongMaterial"`) and class-based materials
- Child separation: components extract `NurbsCurve` children from material children using `Children.toArray()` + type checks
- `NurbsSolidComponent` merges all face tessellations into a single BufferGeometry, respecting face orientation for correct normals
- `BooleanResult` shows a placeholder mesh during async WASM computation, null on error

### Hook Pattern
- `useMemo` for verb object creation and geometry computation
- `useCallback` for stable method references (point, tangent, closestParam, etc.)
- Options/Result interfaces exported alongside each hook
- `useBooleanOperation` uses `useState` + `useEffect` with abort ref pattern for async WASM calls; dynamically imports the OCCT module

### Core Engine
- `NurbsCurve`, `NurbsSurface`, and `NurbsSolid` are classes wrapping `CurveData`/`SurfaceData`/`SolidData` plain objects
- Static factory methods: `byKnotsControlPointsWeights()`, `byPoints()`, `byLoftingCurves()`, `byCorners()`, `makeBox()`, `makeCylinder()`, `makeSphere()`, `fromFaces()`
- `.asData()` for extracting plain data (needed when passing to construction functions or components)
- Construction functions (`createArc`, `createRevolvedSurface`, `createBoxSolid`, `createCylinderSolid`, `createSphereSolid`, etc.) return plain data, wrapped in class instances by callers
- Solid primitives: `createBoxSolid` (6 planar faces), `createCylinderSolid` (1 cylindrical face + 2 revolved disk caps), `createSphereSolid` (1 revolved semicircle)
- No circular dependencies: `curve.ts` -> `fit.ts` -> `modify.ts`; `surface.ts` -> `curve.ts`, `fit.ts`; `solid.ts` -> `construct.ts`

### OCCT / Boolean Pattern
- WASM is lazy-loaded via `getOC()` which uses dynamic `import("./occtBooleans.js")` — only loaded when boolean operations are first invoked
- `ShapeDescriptor` is a discriminated union (box | cylinder | sphere) describing primitives for OCCT
- `buildShape()` constructs native OCCT primitives (BRepPrimAPI_MakeBox/Cylinder/Sphere)
- `BRepAlgoAPI_Fuse/Cut/Common` perform the boolean, then `occtShapeToMesh()` tessellates via `BRepMesh_IncrementalMesh`
- `convert.ts` handles bidirectional conversion: library types <-> OCCT types (knot multiplicity extraction, pole arrays, face sewing, solid building)
- The WASM binary contains only the OCCT symbols needed for primitives + booleans + meshing (configured in `occt-build.yml`)
- `setOC()` allows injecting a pre-loaded OCCT instance to avoid double-loading if the host app already uses OCCT

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
- Surface: Control polygon initial guess + 20x20 grid + Newton with 4 criteria (both U and V cosine checks)
- Curve-onto-surface: Marching approach (`projectCurveOntoSurface`) — each point uses previous UV as Newton initial guess

### WASM Loading
- OpenCASCADE WASM (~5 MB) is only loaded when `getOC()` is first called (triggered by `useBooleanOperation` or `booleanOperation`)
- Cached after first load — subsequent calls return the same instance
- `setOC()` allows injecting a pre-loaded instance to avoid double-loading if the app already uses OCCT
- The custom WASM build includes only primitives + booleans + meshing symbols, not all of OCCT

## OpenCASCADE WASM Integration

- Custom WASM build via Docker: `docker run --rm --platform linux/amd64 -v "$(pwd):/src" donalffons/opencascade.js:2.0.0-beta.b5ff984 occt-build.yml`
- Build config: `occt-build.yml` — lists bound OCCT classes (primitives, booleans, geometry, tessellation)
- Output: `occtBooleans.js` (127KB) + `occtBooleans.wasm` (5.1MB) + `occtBooleans.d.ts`
- Canonical location: `src/occt/` (shipped in npm package via `files` in package.json)
- Storybook copy: `public/occtBooleans.wasm` (served via `staticDirs` in `.storybook/main.ts`)
- Root build outputs: gitignored (Docker drops files in project root)
- Lazy loading: WASM only loaded on first `getOC()` call (boolean operations)
- `setOC(instance)` allows injecting a pre-loaded OCCT instance

### OCCT Build Config (occt-build.yml)

The yml file specifies which OCCT symbols to include in the WASM binary:
- **Primitives**: BRepPrimAPI_MakeBox, BRepPrimAPI_MakeCylinder, BRepPrimAPI_MakeSphere
- **Booleans**: BRepAlgoAPI_Fuse, BRepAlgoAPI_Cut, BRepAlgoAPI_Common
- **Geometry**: Geom_BSplineCurve, Geom_BSplineSurface, gp_Pnt, gp_Dir, gp_Ax2, etc.
- **Topology**: TopoDS_Shape/Face/Shell/Solid, TopExp_Explorer, BRepBuilderAPI_MakeFace/Sewing/MakeSolid
- **Meshing**: BRepMesh_IncrementalMesh, Poly_Triangulation, BRep_Tool.Triangulation

emcc flags: `-O3 -flto -sEXPORT_ES6=1 -sINITIAL_MEMORY=32MB -sALLOW_MEMORY_GROWTH=1 -sMAXIMUM_MEMORY=256MB`

## Build & Test

- **Build**: `npm run build` (tsc + vite library mode, ESM only)
- **Test**: `npm run test` (vitest, 72 tests across core, occt, and component files)
- **Dev**: `npm run dev` (launches Storybook on port 6006)
- **Storybook build**: `npm run build-storybook`
- Main bundle: ~121 KB ESM (no WASM included)
- OCCT chunk: ~115 KB (lazy-loaded JS wrapper for boolean ops)
- OCCT WASM: 5.1 MB (only loaded when boolean operations are used)
- Externals: react, react-dom, three, @react-three/fiber, @react-three/drei

## Dependencies

### Production
- `@react-three/drei` — Line component, OrbitControls, Stats
- `@react-three/fiber` — React renderer for Three.js
- `earcut` — 2D polygon triangulation (for TrimmedSurface)
- `react`, `react-dom`, `three`
- OpenCASCADE WASM — bundled custom build in `src/occt/` (no npm dependency)

### Removed
- `verb-nurbs` — fully replaced by `src/core/` custom engine (was buggy: Intersect.surfaces crashed, unmaintained, 965KB)

## Reference

Algorithms implemented from: "The NURBS Book" (2nd ed.), Les Piegl & Wayne Tiller, Springer 1997.
Key algorithms: A2.1-A2.3 (basis), A4.1-A4.3 (evaluation), A5.1/A5.4/A5.9 (modify), A6.1 (projection), A8.1 (revolution), A9.1 (interpolation).
Boolean operations powered by OpenCASCADE Technology 7.6.2 via Emscripten WASM.
