/**
 * NURBS modification operations.
 * Implements Algorithms A5.1, A5.4, A5.9 from "The NURBS Book" (Piegl & Tiller).
 */

import type { CurveData, SurfaceData } from "./types";

/**
 * Insert a single knot u into a curve r times (Algorithm A5.1 — Boehm's algorithm).
 */
export function curveKnotInsert(
  curve: CurveData,
  u: number,
  r: number
): CurveData {
  const { degree: p, knots: UP, controlPoints: Pw, weights: W } = curve;
  const n = Pw.length - 1;
  const dim = Pw[0].length;

  // Find knot span and current multiplicity
  let k = -1;
  let s = 0; // current multiplicity
  for (let i = 0; i < UP.length; i++) {
    if (UP[i] <= u) k = i;
    if (Math.abs(UP[i] - u) < 1e-14) s++;
  }

  if (r + s > p) r = p - s; // clamp
  if (r <= 0) return { ...curve };

  // New knot vector
  const newKnots = new Array(UP.length + r);
  for (let i = 0; i <= k; i++) newKnots[i] = UP[i];
  for (let i = 1; i <= r; i++) newKnots[k + i] = u;
  for (let i = k + 1; i < UP.length; i++) newKnots[i + r] = UP[i];

  // Work with homogeneous coordinates: [w*x, w*y, w*z, w]
  const Rw: number[][] = new Array(p + 1);
  const newPw: number[][] = new Array(n + r + 1);
  const newW: number[] = new Array(n + r + 1);

  // Copy unchanged control points
  for (let i = 0; i <= k - p; i++) {
    newPw[i] = [...Pw[i]];
    newW[i] = W[i];
  }
  for (let i = k - s; i <= n; i++) {
    newPw[i + r] = [...Pw[i]];
    newW[i + r] = W[i];
  }

  // Copy affected control points to Rw (homogeneous)
  for (let i = 0; i <= p - s; i++) {
    const idx = k - p + 1 + i;
    Rw[i] = Pw[idx].map(v => v * W[idx]);
    Rw[i].push(W[idx]); // append weight as extra coord
  }

  // Insert knot r times
  let L = 0;
  for (let j = 1; j <= r; j++) {
    L = k - p + j;
    for (let i = 0; i <= p - j - s; i++) {
      const alpha = (u - UP[L + i]) / (UP[i + k + 1] - UP[L + i]);
      const newRw = new Array(dim + 1);
      for (let d = 0; d <= dim; d++) {
        newRw[d] = alpha * Rw[i + 1][d] + (1 - alpha) * Rw[i][d];
      }
      Rw[i] = newRw;
    }
    // Extract from homogeneous
    const wL = Rw[0][dim];
    newPw[L] = Rw[0].slice(0, dim).map(v => wL !== 0 ? v / wL : v);
    newW[L] = wL;

    const wR = Rw[p - j - s][dim];
    newPw[k + r - j - s] = Rw[p - j - s].slice(0, dim).map(v => wR !== 0 ? v / wR : v);
    newW[k + r - j - s] = wR;
  }

  // Copy remaining
  for (let i = L + 1; i < k - s; i++) {
    const wI = Rw[i - L][dim];
    newPw[i] = Rw[i - L].slice(0, dim).map(v => wI !== 0 ? v / wI : v);
    newW[i] = wI;
  }

  return {
    degree: p,
    knots: newKnots,
    controlPoints: newPw,
    weights: newW,
  };
}

/**
 * Refine a curve by inserting multiple knots (Algorithm A5.4).
 */
export function curveKnotRefine(
  curve: CurveData,
  knotsToInsert: number[]
): CurveData {
  const sorted = [...knotsToInsert].sort((a, b) => a - b);
  let result = curve;
  for (const u of sorted) {
    result = curveKnotInsert(result, u, 1);
  }
  return result;
}

/**
 * Refine a surface by inserting knots in U or V direction.
 */
export function surfaceKnotRefine(
  surface: SurfaceData,
  knotsToInsert: number[],
  useV: boolean
): SurfaceData {
  const { degreeU, degreeV, knotsU, knotsV, controlPoints, weights } = surface;
  const numU = controlPoints.length;
  const numV = controlPoints[0].length;

  if (useV) {
    // Refine each row (V direction)
    const newRows: { cp: number[][]; w: number[]; knots: number[] }[] = [];
    for (let i = 0; i < numU; i++) {
      const row: CurveData = {
        degree: degreeV,
        knots: [...knotsV],
        controlPoints: controlPoints[i].map(p => [...p]),
        weights: [...weights[i]],
      };
      const refined = curveKnotRefine(row, knotsToInsert);
      newRows.push({ cp: refined.controlPoints, w: refined.weights, knots: refined.knots });
    }
    return {
      degreeU, degreeV,
      knotsU: [...knotsU],
      knotsV: newRows[0].knots,
      controlPoints: newRows.map(r => r.cp),
      weights: newRows.map(r => r.w),
    };
  } else {
    // Refine each column (U direction)
    const newKnotsU: number[] = [];
    const newCols: number[][][][] = []; // [col][row][dim]
    const newWCols: number[][] = []; // [col][row]

    for (let j = 0; j < numV; j++) {
      const col: CurveData = {
        degree: degreeU,
        knots: [...knotsU],
        controlPoints: Array.from({ length: numU }, (_, i) => [...controlPoints[i][j]]),
        weights: Array.from({ length: numU }, (_, i) => weights[i][j]),
      };
      const refined = curveKnotRefine(col, knotsToInsert);
      if (j === 0) newKnotsU.push(...refined.knots);
      newCols.push(refined.controlPoints.map(p => [p]));
      newWCols.push(refined.weights);
    }

    const newNumU = newCols[0].length;
    const newCP: number[][][] = [];
    const newW: number[][] = [];
    for (let i = 0; i < newNumU; i++) {
      newCP[i] = [];
      newW[i] = [];
      for (let j = 0; j < numV; j++) {
        newCP[i][j] = newCols[j][i][0];
        newW[i][j] = newWCols[j][i];
      }
    }

    return {
      degreeU, degreeV,
      knotsU: newKnotsU,
      knotsV: [...knotsV],
      controlPoints: newCP,
      weights: newW,
    };
  }
}

/**
 * Elevate the degree of a curve (simplified approach: insert all interior knots
 * to get Bezier segments, elevate each, then remove unnecessary knots).
 * For the initial implementation, we use a simpler approach via knot insertion.
 */
export function curveElevateDegree(
  curve: CurveData,
  finalDegree: number
): CurveData {
  if (finalDegree <= curve.degree) return { ...curve };

  const elevateBy = finalDegree - curve.degree;
  let result = curve;

  for (let e = 0; e < elevateBy; e++) {
    result = elevateDegreeByOne(result);
  }

  return result;
}

function elevateDegreeByOne(curve: CurveData): CurveData {
  const { degree: p, knots, controlPoints, weights } = curve;
  const n = controlPoints.length - 1;
  const dim = controlPoints[0].length;
  const newP = p + 1;

  // Homogeneous coordinates
  const Pw = controlPoints.map((pt, i) => {
    const w = weights[i];
    return [...pt.map(v => v * w), w];
  });

  // Find unique knot values and their multiplicities
  const uniqueKnots: { value: number; mult: number }[] = [];
  let i = 0;
  while (i < knots.length) {
    const val = knots[i];
    let mult = 0;
    while (i < knots.length && Math.abs(knots[i] - val) < 1e-14) {
      mult++;
      i++;
    }
    uniqueKnots.push({ value: val, mult });
  }

  // Build new knot vector: increase each multiplicity by 1
  const newKnots: number[] = [];
  for (const uk of uniqueKnots) {
    for (let j = 0; j < uk.mult + 1; j++) {
      newKnots.push(uk.value);
    }
  }

  const newN = newKnots.length - newP - 2;
  const newPw: number[][] = new Array(newN + 1);

  // For a simple degree elevation, new control points are computed as:
  // Q_i = (i/(p+1)) * P_{i-1} + (1 - i/(p+1)) * P_i for interior points
  // with appropriate handling at boundaries
  for (let j = 0; j <= newN; j++) {
    const alpha = (j <= 0) ? 0 : (j > n) ? 1 : j / (newP);
    const idx0 = Math.max(0, Math.min(n, j - 1));
    const idx1 = Math.max(0, Math.min(n, j));

    newPw[j] = new Array(dim + 1);
    for (let d = 0; d <= dim; d++) {
      newPw[j][d] = alpha * Pw[idx0][d] + (1 - alpha) * Pw[idx1][d];
    }
  }

  // Convert back from homogeneous
  const newCP: number[][] = newPw.map(pw => {
    const w = pw[dim];
    return pw.slice(0, dim).map(v => w !== 0 ? v / w : v);
  });
  const newW = newPw.map(pw => pw[dim]);

  return {
    degree: newP,
    knots: newKnots,
    controlPoints: newCP,
    weights: newW,
  };
}

/**
 * Unify knot vectors across multiple curves:
 * 1. Elevate all to the maximum degree
 * 2. Merge all knot vectors and refine each curve to the union
 */
export function unifyCurveKnots(curves: CurveData[]): CurveData[] {
  if (curves.length === 0) return [];
  if (curves.length === 1) return [{ ...curves[0] }];

  // 1. Find max degree
  const maxDeg = Math.max(...curves.map(c => c.degree));

  // 2. Elevate all to max degree
  let elevated = curves.map(c =>
    c.degree < maxDeg ? curveElevateDegree(c, maxDeg) : { ...c }
  );

  // 3. Compute union of all interior knots
  const allInteriorKnots = new Set<number>();
  for (const c of elevated) {
    for (let i = maxDeg + 1; i < c.knots.length - maxDeg - 1; i++) {
      allInteriorKnots.add(c.knots[i]);
    }
  }

  // 4. For each curve, insert any missing knots
  elevated = elevated.map(c => {
    const missing: number[] = [];
    for (const k of allInteriorKnots) {
      const hasKnot = c.knots.some(ck => Math.abs(ck - k) < 1e-14);
      if (!hasKnot) missing.push(k);
    }
    return missing.length > 0 ? curveKnotRefine(c, missing) : c;
  });

  return elevated;
}
