// Core classes
export { NurbsCurve } from "./curve";
export { NurbsSurface } from "./surface";

// Types
export type { CurveData, SurfaceData } from "./types";

// Basis functions
export { findSpan, basisFunctions, derivBasisFunctions } from "./basis";

// Fitting
export { globalCurveInterpolation, loftSurface } from "./fit";

// Construction
export {
  createArc,
  createCircle,
  createEllipseArc,
  createEllipse,
  createCylindricalSurface,
  createExtrudedSurface,
  createRevolvedSurface,
  createSweptSurface,
} from "./construct";

// Modification
export {
  curveKnotInsert,
  curveKnotRefine,
  surfaceKnotRefine,
  curveElevateDegree,
  unifyCurveKnots,
} from "./modify";

// Intersection
export { intersectSurfaces } from "./intersect";
export type { IntersectionResult } from "./intersect";
