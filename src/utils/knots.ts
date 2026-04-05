import {
  NurbsCurve,
  NurbsSurface,
  curveKnotRefine as coreKnotRefine,
  surfaceKnotRefine as coreSurfaceKnotRefine,
  curveElevateDegree as coreElevateDegree,
  unifyCurveKnots as coreUnifyCurveKnots,
} from "../core";

/**
 * Refine a curve by inserting additional knots without changing its shape.
 */
export function curveKnotRefine(
  curve: NurbsCurve,
  knotsToInsert: number[]
): NurbsCurve {
  const data = coreKnotRefine(curve.asData(), knotsToInsert);
  return new NurbsCurve(data);
}

/**
 * Refine a surface by inserting additional knots in U or V direction.
 */
export function surfaceKnotRefine(
  surface: NurbsSurface,
  knotsToInsert: number[],
  useV: boolean
): NurbsSurface {
  const data = coreSurfaceKnotRefine(surface.asData(), knotsToInsert, useV);
  return new NurbsSurface(data);
}

/**
 * Elevate the degree of a curve.
 */
export function curveElevateDegree(
  curve: NurbsCurve,
  finalDegree: number
): NurbsCurve {
  const data = coreElevateDegree(curve.asData(), finalDegree);
  return new NurbsCurve(data);
}

/**
 * Unify knot vectors across multiple curves (same degree + knots).
 * Required before operations like lofting with incompatible curves.
 */
export function unifyCurveKnots(
  curves: NurbsCurve[]
): NurbsCurve[] {
  const dataArray = curves.map((c) => c.asData());
  const unified = coreUnifyCurveKnots(dataArray);
  return unified.map((data) => new NurbsCurve(data));
}
