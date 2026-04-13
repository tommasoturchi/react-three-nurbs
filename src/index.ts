// Components
export { NurbsCurve } from "./components/NurbsCurve";
export { NurbsSurface } from "./components/NurbsSurface";
export { LoftedSurface } from "./components/LoftedSurface";
export { TrimmedSurface } from "./components/TrimmedSurface";
export { RevolvedSurface } from "./components/RevolvedSurface";
export { ExtrudedSurface } from "./components/ExtrudedSurface";
export { SweptSurface } from "./components/SweptSurface";
export { SurfaceIntersection } from "./components/SurfaceIntersection";
export { InterpolatedCurve } from "./components/InterpolatedCurve";
export { InterpolatedSurface } from "./components/InterpolatedSurface";
export { NurbsCircle } from "./components/NurbsCircle";
export { NurbsArc } from "./components/NurbsArc";
export { IsoCurves } from "./components/IsoCurves";
export { CoonsPatch } from "./components/CoonsPatch";
export { OffsetCurve } from "./components/OffsetCurve";
export { NurbsEllipse } from "./components/NurbsEllipse";
export { NurbsEllipseArc } from "./components/NurbsEllipseArc";
export { CylindricalSurface } from "./components/CylindricalSurface";
export { NurbsSolidComponent } from "./components/NurbsSolidComponent";
export { BooleanResult } from "./components/BooleanResult";

// Hooks
export { useNurbsCurve } from "./hooks/useNurbsCurve";
export { useNurbsSurface } from "./hooks/useNurbsSurface";
export { useControlPointDrag } from "./hooks/useControlPointDrag";
export { useSurfaceIntersection } from "./hooks/useSurfaceIntersection";
export { useInterpolatedCurve } from "./hooks/useInterpolatedCurve";
export { useInterpolatedSurface } from "./hooks/useInterpolatedSurface";
export { useOffsetCurve } from "./hooks/useOffsetCurve";
export { useNurbsSolid } from "./hooks/useNurbsSolid";
export { useBooleanOperation } from "./hooks/useBooleanOperation";

// OCCT (lazy-loaded — import these directly from 'react-three-nurbs/occt' or use useBooleanOperation hook)
export { getOC, setOC, isOCLoaded } from "./occt/loader";

// Utilities
export {
  generateUniformKnots,
  projectPointToSurface,
  computeNormal,
  sampleNurbsCurve2D,
  adaptiveSampleNurbsCurve2D,
  projectPointToSurfaceUV,
  projectCurveOntoSurface,
} from "./utils/nurbs";

export {
  validateControlPoints,
  validateKnots,
  validateWeights2D,
  validateWeights1D,
  validateDegree,
} from "./utils/validation";


export {
  curveKnotRefine,
  surfaceKnotRefine,
  curveElevateDegree,
  unifyCurveKnots,
} from "./utils/knots";

export { computeCoonsPatch } from "./utils/coons";

// Types
export type { NurbsCurveProps } from "./components/NurbsCurve";
export type { NurbsSurfaceProps } from "./components/NurbsSurface";
export type { LoftedSurfaceProps } from "./components/LoftedSurface";
export type { TrimmedSurfaceProps } from "./components/TrimmedSurface";
export type { RevolvedSurfaceProps } from "./components/RevolvedSurface";
export type { ExtrudedSurfaceProps } from "./components/ExtrudedSurface";
export type { SweptSurfaceProps } from "./components/SweptSurface";
export type { SurfaceIntersectionProps } from "./components/SurfaceIntersection";
export type { InterpolatedCurveProps } from "./components/InterpolatedCurve";
export type { InterpolatedSurfaceProps } from "./components/InterpolatedSurface";
export type { NurbsCircleProps } from "./components/NurbsCircle";
export type { NurbsArcProps } from "./components/NurbsArc";
export type { IsoCurvesProps } from "./components/IsoCurves";
export type { CoonsPatchProps } from "./components/CoonsPatch";
export type { OffsetCurveProps } from "./components/OffsetCurve";
export type { NurbsEllipseProps } from "./components/NurbsEllipse";
export type { NurbsEllipseArcProps } from "./components/NurbsEllipseArc";
export type { CylindricalSurfaceProps } from "./components/CylindricalSurface";
export type { UseNurbsCurveOptions, UseNurbsCurveResult } from "./hooks/useNurbsCurve";
export type { UseNurbsSurfaceOptions, UseNurbsSurfaceResult, SurfaceGeometry } from "./hooks/useNurbsSurface";
export type { UseControlPointDragOptions, UseControlPointDragResult, ControlPointHandle } from "./hooks/useControlPointDrag";
export type { UseSurfaceIntersectionOptions, UseSurfaceIntersectionResult, SurfaceDefinition, IntersectionCurve } from "./hooks/useSurfaceIntersection";
export type { UseInterpolatedCurveOptions, UseInterpolatedCurveResult } from "./hooks/useInterpolatedCurve";
export type { UseInterpolatedSurfaceOptions, UseInterpolatedSurfaceResult } from "./hooks/useInterpolatedSurface";
export type { UseOffsetCurveOptions, UseOffsetCurveResult } from "./hooks/useOffsetCurve";
export type { NurbsSolidProps } from "./components/NurbsSolidComponent";
export type { UseNurbsSolidOptions, UseNurbsSolidResult, SolidPrimitive } from "./hooks/useNurbsSolid";
export type { BooleanResultProps } from "./components/BooleanResult";
export type { UseBooleanOperationOptions, UseBooleanOperationResult } from "./hooks/useBooleanOperation";
export type { BooleanOperation, BooleanMeshResult, ShapeDescriptor } from "./occt/boolean";
