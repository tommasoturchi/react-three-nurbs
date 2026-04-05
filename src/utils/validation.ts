/**
 * Validates that a control point grid has consistent dimensions and is compatible with the given degrees.
 * For surfaces: checks that all rows have the same length and dimensions are >= degree + 1.
 */
export function validateControlPoints(
  controlPoints: number[][][],
  degreeU: number,
  degreeV: number
): string | null {
  if (!controlPoints || controlPoints.length === 0) {
    return "controlPoints must be a non-empty 3D array";
  }

  const rowLength = controlPoints[0].length;
  for (let i = 1; i < controlPoints.length; i++) {
    if (controlPoints[i].length !== rowLength) {
      return `controlPoints row ${i} has length ${controlPoints[i].length}, expected ${rowLength}`;
    }
  }

  if (controlPoints.length < degreeU + 1) {
    return `controlPoints has ${controlPoints.length} rows but degreeU=${degreeU} requires at least ${degreeU + 1}`;
  }

  if (rowLength < degreeV + 1) {
    return `controlPoints has ${rowLength} columns but degreeV=${degreeV} requires at least ${degreeV + 1}`;
  }

  for (let i = 0; i < controlPoints.length; i++) {
    for (let j = 0; j < controlPoints[i].length; j++) {
      if (!Array.isArray(controlPoints[i][j]) || controlPoints[i][j].length < 2) {
        return `controlPoints[${i}][${j}] must be an array of at least 2 numbers`;
      }
    }
  }

  return null;
}

/**
 * Validates a knot vector: correct length, non-decreasing.
 */
export function validateKnots(
  knots: number[],
  numControlPoints: number,
  degree: number,
  name = "knots"
): string | null {
  const expectedLength = numControlPoints + degree + 1;
  if (knots.length !== expectedLength) {
    return `${name} has length ${knots.length}, expected ${expectedLength} (numControlPoints=${numControlPoints}, degree=${degree})`;
  }

  for (let i = 1; i < knots.length; i++) {
    if (knots[i] < knots[i - 1]) {
      return `${name} must be non-decreasing, but ${name}[${i}]=${knots[i]} < ${name}[${i - 1}]=${knots[i - 1]}`;
    }
  }

  return null;
}

/**
 * Validates that a 2D weights array matches the control points dimensions.
 */
export function validateWeights2D(
  weights: number[][],
  controlPoints: number[][][]
): string | null {
  if (!weights || weights.length === 0) {
    return "weights must be a non-empty 2D array";
  }

  if (weights.length !== controlPoints.length) {
    return `weights has ${weights.length} rows, expected ${controlPoints.length} to match controlPoints`;
  }

  for (let i = 0; i < weights.length; i++) {
    if (weights[i].length !== controlPoints[i].length) {
      return `weights[${i}] has length ${weights[i].length}, expected ${controlPoints[i].length}`;
    }
  }

  return null;
}

/**
 * Validates that a 1D weights array matches the control points count.
 */
export function validateWeights1D(
  weights: number[],
  numControlPoints: number
): string | null {
  if (weights.length !== numControlPoints) {
    return `weights has length ${weights.length}, expected ${numControlPoints}`;
  }
  return null;
}

/**
 * Validates that a degree is valid for the given number of control points.
 */
export function validateDegree(
  degree: number,
  numControlPoints: number,
  name = "degree"
): string | null {
  if (degree < 1) {
    return `${name} must be >= 1, got ${degree}`;
  }
  if (degree >= numControlPoints) {
    return `${name}=${degree} must be < numControlPoints=${numControlPoints}`;
  }
  return null;
}
