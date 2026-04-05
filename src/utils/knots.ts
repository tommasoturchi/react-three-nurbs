import verb from "verb-nurbs";

/**
 * Refine a curve by inserting additional knots without changing its shape.
 */
export function curveKnotRefine(
  curve: verb.geom.NurbsCurve,
  knotsToInsert: number[]
): verb.geom.NurbsCurve {
  const data = verb.eval.Modify.curveKnotRefine(
    {
      degree: curve.degree(),
      knots: curve.knots(),
      controlPoints: curve.controlPoints(),
      weights: curve.weights(),
    },
    knotsToInsert
  );
  return verb.geom.NurbsCurve.byKnotsControlPointsWeights(
    data.degree,
    data.knots,
    data.controlPoints,
    data.weights
  );
}

/**
 * Refine a surface by inserting additional knots in U or V direction.
 */
export function surfaceKnotRefine(
  surface: verb.geom.NurbsSurface,
  knotsToInsert: number[],
  useV: boolean
): verb.geom.NurbsSurface {
  const data = verb.eval.Modify.surfaceKnotRefine(
    {
      degreeU: surface.degreeU(),
      degreeV: surface.degreeV(),
      knotsU: surface.knotsU(),
      knotsV: surface.knotsV(),
      controlPoints: surface.controlPoints(),
      weights: surface.weights(),
    },
    knotsToInsert,
    useV
  );
  return verb.geom.NurbsSurface.byKnotsControlPointsWeights(
    data.degreeU,
    data.degreeV,
    data.knotsU,
    data.knotsV,
    data.controlPoints,
    data.weights
  );
}

/**
 * Elevate the degree of a curve.
 */
export function curveElevateDegree(
  curve: verb.geom.NurbsCurve,
  finalDegree: number
): verb.geom.NurbsCurve {
  const data = verb.eval.Modify.curveElevateDegree(
    {
      degree: curve.degree(),
      knots: curve.knots(),
      controlPoints: curve.controlPoints(),
      weights: curve.weights(),
    },
    finalDegree
  );
  return verb.geom.NurbsCurve.byKnotsControlPointsWeights(
    data.degree,
    data.knots,
    data.controlPoints,
    data.weights
  );
}

/**
 * Unify knot vectors across multiple curves (same degree + knots).
 * Required before operations like lofting with incompatible curves.
 */
export function unifyCurveKnots(
  curves: verb.geom.NurbsCurve[]
): verb.geom.NurbsCurve[] {
  const dataArray = curves.map((c) => ({
    degree: c.degree(),
    knots: c.knots(),
    controlPoints: c.controlPoints(),
    weights: c.weights(),
  }));

  const unified = verb.eval.Modify.unifyCurveKnotVectors(dataArray);

  return unified.map((data) =>
    verb.geom.NurbsCurve.byKnotsControlPointsWeights(
      data.degree,
      data.knots,
      data.controlPoints,
      data.weights
    )
  );
}
