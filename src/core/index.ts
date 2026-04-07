// Core classes
export { NurbsCurve } from "./curve";
export { NurbsSurface } from "./surface";
export { NurbsSolid } from "./solid";

// Types
export type { CurveData, SurfaceData, FaceData, SolidData } from "./types";

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
  createBoxSolid,
  createCylinderSolid,
  createSphereSolid,
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
