/**
 * NURBS curve evaluation and operations.
 * Implements algorithms from "The NURBS Book" (Piegl & Tiller), Chapters 3-5.
 */

import { findSpan, basisFunctions, derivBasisFunctions } from "./basis";
import { globalCurveInterpolation } from "./fit";
import { curveKnotInsert } from "./modify";
import type { CurveData } from "./types";

export class NurbsCurve {
  private _degree: number;
  private _knots: number[];
  private _controlPoints: number[][];
  private _weights: number[];

  constructor(data: CurveData) {
    this._degree = data.degree;
    this._knots = data.knots;
    this._controlPoints = data.controlPoints;
    this._weights = data.weights;
  }

  // --- Construction ---

  static byKnotsControlPointsWeights(
    degree: number,
    knots: number[],
    controlPoints: number[][],
    weights: number[]
  ): NurbsCurve {
    return new NurbsCurve({ degree, knots, controlPoints, weights });
  }

  static byPoints(throughPoints: number[][], degree: number): NurbsCurve {
    const data = globalCurveInterpolation(throughPoints, degree);
    return new NurbsCurve(data);
  }

  // --- Evaluation ---

  /**
   * Evaluate curve point at parameter t (Algorithm A4.1).
   * Rational curve: C(t) = Σ R_i(t) * P_i where R_i = N_i*w_i / Σ N_j*w_j
   */
  point(t: number): number[] {
    const n = this._controlPoints.length - 1;
    const span = findSpan(n, this._degree, t, this._knots);
    const N = basisFunctions(span, t, this._degree, this._knots);

    const dim = this._controlPoints[0].length;
    const result = new Array(dim).fill(0);
    let wSum = 0;

    for (let i = 0; i <= this._degree; i++) {
      const idx = span - this._degree + i;
      const w = this._weights[idx];
      const Nw = N[i] * w;
      wSum += Nw;
      for (let d = 0; d < dim; d++) {
        result[d] += Nw * this._controlPoints[idx][d];
      }
    }

    if (wSum !== 0) {
      for (let d = 0; d < dim; d++) {
        result[d] /= wSum;
      }
    }

    return result;
  }

  /**
   * Compute derivatives of the rational curve at parameter t.
   * Uses Algorithm A4.2 + Eq. 4.20 from The NURBS Book.
   *
   * Returns: derivatives[k] = kth derivative vector
   */
  derivatives(t: number, numDerivs: number): number[][] {
    const n = this._controlPoints.length - 1;
    const dim = this._controlPoints[0].length;
    const du = Math.min(numDerivs, this._degree);

    const span = findSpan(n, this._degree, t, this._knots);
    const nders = derivBasisFunctions(span, t, this._degree, du, this._knots);

    // Compute homogeneous derivatives: Aders[k] and wders[k]
    const Aders: number[][] = [];
    const wders: number[] = [];

    for (let k = 0; k <= du; k++) {
      const a = new Array(dim).fill(0);
      let w = 0;
      for (let j = 0; j <= this._degree; j++) {
        const idx = span - this._degree + j;
        const wi = this._weights[idx];
        for (let d = 0; d < dim; d++) {
          a[d] += nders[k][j] * wi * this._controlPoints[idx][d];
        }
        w += nders[k][j] * wi;
      }
      Aders.push(a);
      wders.push(w);
    }

    // Apply quotient rule for rational derivatives (Eq. 4.20)
    const CK: number[][] = [];
    for (let k = 0; k <= du; k++) {
      const v = [...Aders[k]];
      for (let i = 1; i <= k; i++) {
        const bin = binomial(k, i);
        for (let d = 0; d < dim; d++) {
          v[d] -= bin * wders[i] * CK[k - i][d];
        }
      }
      for (let d = 0; d < dim; d++) {
        v[d] /= wders[0];
      }
      CK.push(v);
    }

    // Pad with zeros if numDerivs > degree
    for (let k = du + 1; k <= numDerivs; k++) {
      CK.push(new Array(dim).fill(0));
    }

    return CK;
  }

  /**
   * Compute tangent vector (first derivative, NOT normalized) at parameter t.
   */
  tangent(t: number): number[] {
    return this.derivatives(t, 1)[1];
  }

  /**
   * Compute arc length using Gauss-Legendre quadrature.
   */
  length(): number {
    return this.lengthBetween(this._knots[this._degree], this._knots[this._knots.length - this._degree - 1]);
  }

  private lengthBetween(a: number, b: number): number {
    // 5-point Gauss-Legendre quadrature
    const nodes = [-0.9061798459, -0.5384693101, 0.0, 0.5384693101, 0.9061798459];
    const weights = [0.2369268851, 0.4786286705, 0.5688888889, 0.4786286705, 0.2369268851];

    // Subdivide into segments for accuracy
    const numSegments = Math.max(this._controlPoints.length * 2, 8);
    let totalLength = 0;

    for (let s = 0; s < numSegments; s++) {
      const sa = a + (b - a) * s / numSegments;
      const sb = a + (b - a) * (s + 1) / numSegments;
      const halfRange = (sb - sa) / 2;
      const midpoint = (sa + sb) / 2;

      let segLength = 0;
      for (let i = 0; i < nodes.length; i++) {
        const t = midpoint + halfRange * nodes[i];
        const d = this.tangent(t);
        const speed = Math.sqrt(d.reduce((sum, v) => sum + v * v, 0));
        segLength += weights[i] * speed;
      }
      totalLength += halfRange * segLength;
    }

    return totalLength;
  }

  /**
   * Find the parameter of the closest point on the curve to a given point.
   * Uses Newton iteration with initial guess from uniform sampling.
   */
  closestParam(point: number[]): number {
    const dim = point.length;

    // Coarse sampling for initial guess
    const numSamples = Math.max(this._controlPoints.length * 10, 50);
    let bestT = 0;
    let bestDist = Infinity;
    const tMin = this._knots[this._degree];
    const tMax = this._knots[this._knots.length - this._degree - 1];

    for (let i = 0; i <= numSamples; i++) {
      const t = tMin + (tMax - tMin) * i / numSamples;
      const pt = this.point(t);
      let dist = 0;
      for (let d = 0; d < dim; d++) dist += (pt[d] - point[d]) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        bestT = t;
      }
    }

    // Newton iteration to refine
    // Minimize D(t) = ||C(t) - P||^2
    // D'(t) = 2 * C'(t) · (C(t) - P)
    // D''(t) = 2 * (C''(t) · (C(t) - P) + C'(t) · C'(t))
    let t = bestT;
    const maxDeriv = Math.min(2, this._degree);
    for (let iter = 0; iter < 50; iter++) {
      const ders = this.derivatives(t, maxDeriv);
      const diff = ders[0].map((v, d) => v - point[d]);

      // f = C'·(C-P), fPrime = C''·(C-P) + ||C'||^2
      let f = 0;
      let cPrimeSq = 0;
      for (let d = 0; d < dim; d++) {
        f += ders[1][d] * diff[d];
        cPrimeSq += ders[1][d] * ders[1][d];
      }

      // Check if we've converged (C' · (C-P) ≈ 0 means we're at the foot of the perpendicular)
      if (Math.abs(f) < 1e-12 * cPrimeSq) break;

      let fPrime = cPrimeSq;
      if (maxDeriv >= 2) {
        for (let d = 0; d < dim; d++) {
          fPrime += ders[2][d] * diff[d];
        }
      }

      if (Math.abs(fPrime) < 1e-14) break;

      const tNew = t - f / fPrime;
      const tClamped = Math.max(tMin, Math.min(tMax, tNew));

      if (Math.abs(tClamped - t) < 1e-12) break;
      t = tClamped;
    }

    return t;
  }

  closestPoint(point: number[]): number[] {
    return this.point(this.closestParam(point));
  }

  /**
   * Split curve at parameter t by inserting knot until multiplicity = degree.
   * Returns two NurbsCurve objects.
   */
  split(t: number): NurbsCurve[] {
    // curveKnotInsert imported at top level

    // Find current multiplicity of t
    let mult = 0;
    for (const k of this._knots) {
      if (Math.abs(k - t) < 1e-10) mult++;
    }

    const insertions = this._degree - mult;
    if (insertions <= 0) {
      // Already has full multiplicity, just split the data
      return this._splitAtFullMult(t);
    }

    // Insert knot until multiplicity = degree
    let data: CurveData = this.asData();
    for (let i = 0; i < insertions; i++) {
      data = curveKnotInsert(data, t, 1);
    }

    const curve = new NurbsCurve(data);
    return curve._splitAtFullMult(t);
  }

  private _splitAtFullMult(t: number): NurbsCurve[] {
    // Find the split index
    let splitIdx = -1;
    for (let i = 0; i < this._knots.length; i++) {
      if (Math.abs(this._knots[i] - t) < 1e-10) {
        splitIdx = i;
        break;
      }
    }
    if (splitIdx === -1) return [this.clone()];

    const d = this._degree;

    // Left curve: knots[0..splitIdx+d], control points [0..splitIdx-1]
    const leftKnots = this._knots.slice(0, splitIdx + 1);
    // Clamp right end
    for (let i = 0; i < d + 1; i++) leftKnots.push(t);
    const leftCP = this._controlPoints.slice(0, splitIdx - d + 1);
    const leftW = this._weights.slice(0, splitIdx - d + 1);

    // Right curve
    const rightKnots: number[] = [];
    for (let i = 0; i < d + 1; i++) rightKnots.push(t);
    rightKnots.push(...this._knots.slice(splitIdx + 1));
    const rightCP = this._controlPoints.slice(splitIdx - d);
    const rightW = this._weights.slice(splitIdx - d);

    return [
      new NurbsCurve({ degree: d, knots: leftKnots, controlPoints: leftCP, weights: leftW }),
      new NurbsCurve({ degree: d, knots: rightKnots, controlPoints: rightCP, weights: rightW }),
    ];
  }

  reverse(): NurbsCurve {
    const maxKnot = this._knots[this._knots.length - 1];
    const minKnot = this._knots[0];
    return new NurbsCurve({
      degree: this._degree,
      knots: this._knots.map(k => maxKnot + minKnot - k).reverse(),
      controlPoints: [...this._controlPoints].reverse(),
      weights: [...this._weights].reverse(),
    });
  }

  clone(): NurbsCurve {
    return new NurbsCurve({
      degree: this._degree,
      knots: [...this._knots],
      controlPoints: this._controlPoints.map(p => [...p]),
      weights: [...this._weights],
    });
  }

  // --- Accessors ---

  degree(): number { return this._degree; }
  knots(): number[] { return this._knots; }
  controlPoints(): number[][] { return this._controlPoints; }
  weights(): number[] { return this._weights; }

  asData(): CurveData {
    return {
      degree: this._degree,
      knots: [...this._knots],
      controlPoints: this._controlPoints.map(p => [...p]),
      weights: [...this._weights],
    };
  }
}

// --- Helpers ---

function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}
