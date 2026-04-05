/**
 * Curve fitting and surface lofting algorithms.
 * Implements Algorithm A9.1 from "The NURBS Book" (Piegl & Tiller).
 */

import { findSpan, basisFunctions } from "./basis";
import { unifyCurveKnots } from "./modify";
import type { CurveData, SurfaceData } from "./types";

/**
 * Global curve interpolation through a set of points (Algorithm A9.1).
 * Uses chord-length parameterization and averages for knot vector.
 */
export function globalCurveInterpolation(
  points: number[][],
  degree: number
): CurveData {
  const n = points.length - 1;
  const dim = points[0].length;
  const p = Math.min(degree, n);

  // 1. Compute chord-length parameters
  const params = new Array(n + 1);
  params[0] = 0;
  const dists = new Array(n);
  let totalDist = 0;
  for (let k = 1; k <= n; k++) {
    let d = 0;
    for (let j = 0; j < dim; j++) {
      d += (points[k][j] - points[k - 1][j]) ** 2;
    }
    dists[k - 1] = Math.sqrt(d);
    totalDist += dists[k - 1];
  }
  if (totalDist === 0) totalDist = 1;
  for (let k = 1; k <= n; k++) {
    params[k] = params[k - 1] + dists[k - 1] / totalDist;
  }
  params[n] = 1; // clamp

  // 2. Compute knot vector by averaging
  const m = n + p + 1;
  const knots = new Array(m + 1);
  for (let i = 0; i <= p; i++) knots[i] = 0;
  for (let i = m - p; i <= m; i++) knots[i] = 1;
  for (let j = 1; j <= n - p; j++) {
    let sum = 0;
    for (let i = j; i <= j + p - 1; i++) {
      sum += params[i];
    }
    knots[j + p] = sum / p;
  }

  // 3. Set up and solve the linear system N * P = Q
  // N is (n+1) x (n+1), banded with bandwidth p
  const N: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= n; i++) {
    const span = findSpan(n, p, params[i], knots);
    const basis = basisFunctions(span, params[i], p, knots);
    for (let j = 0; j <= p; j++) {
      N[i][span - p + j] = basis[j];
    }
  }

  // Solve for each coordinate dimension independently
  const controlPoints: number[][] = new Array(n + 1);
  for (let i = 0; i <= n; i++) controlPoints[i] = new Array(dim);

  for (let d = 0; d < dim; d++) {
    const rhs = points.map(pt => pt[d]);
    const solution = solveLinearSystem(N, rhs);
    for (let i = 0; i <= n; i++) {
      controlPoints[i][d] = solution[i];
    }
  }

  return {
    degree: p,
    knots,
    controlPoints,
    weights: new Array(n + 1).fill(1),
  };
}

/**
 * Create a lofted surface through multiple curves.
 * All curves are made compatible (same degree, same knots) first.
 */
export function loftSurface(
  curves: CurveData[],
  degreeV: number
): SurfaceData {
  if (curves.length < 2) throw new Error("Lofting requires at least 2 curves");

  // 1. Make all curves compatible (unify degrees and knot vectors)
  const unified: CurveData[] = unifyCurveKnots(curves);

  const degreeU = unified[0].degree;
  const knotsU = unified[0].knots;
  const numCPU = unified[0].controlPoints.length;
  const numCurves = unified.length;
  const dV = Math.min(degreeV, numCurves - 1);

  // 2. For each control point column, interpolate through the curves in V direction
  const columns: number[][][] = [];
  for (let i = 0; i < numCPU; i++) {
    const colPoints: number[][] = [];
    for (let c = 0; c < numCurves; c++) {
      colPoints.push(unified[c].controlPoints[i]);
    }
    columns.push(colPoints);
  }

  const interpColumns = columns.map(col =>
    globalCurveInterpolation(col, dV)
  );

  const knotsV = interpColumns[0].knots;
  const numCPV = interpColumns[0].controlPoints.length;

  // 3. Assemble into surface
  const controlPoints: number[][][] = [];
  const weights: number[][] = [];
  for (let i = 0; i < numCPU; i++) {
    controlPoints[i] = [];
    weights[i] = [];
    for (let j = 0; j < numCPV; j++) {
      controlPoints[i][j] = interpColumns[i].controlPoints[j];
      weights[i][j] = 1; // interpolated points have uniform weights
    }
  }

  return {
    degreeU,
    degreeV: dV,
    knotsU,
    knotsV,
    controlPoints,
    weights,
  };
}

/**
 * Solve a linear system Ax = b using Gaussian elimination with partial pivoting.
 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  // Create augmented matrix
  const aug: number[][] = A.map((row, i) => [...row, b[i]]);

  // Forward elimination
  for (let col = 0; col < n; col++) {
    // Partial pivoting
    let maxRow = col;
    let maxVal = Math.abs(aug[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > maxVal) {
        maxVal = Math.abs(aug[row][col]);
        maxRow = row;
      }
    }
    if (maxRow !== col) {
      [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    }

    const pivot = aug[col][col];
    if (Math.abs(pivot) < 1e-14) continue;

    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / pivot;
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    let sum = aug[row][n];
    for (let col = row + 1; col < n; col++) {
      sum -= aug[row][col] * x[col];
    }
    x[row] = Math.abs(aug[row][row]) > 1e-14 ? sum / aug[row][row] : 0;
  }

  return x;
}
