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
   * Implements Algorithm A6.1 from "The NURBS Book" (Piegl & Tiller), Section 6.1.
   *
   * Phase 1: Initial guess via control polygon (Greville abscissa of closest control point)
   *          + refinement by sampling within the support of that basis function.
   * Phase 2: Newton iteration with four convergence criteria:
   *   (1) Point coincidence:  ||C(t) - P|| < eps1
   *   (2) Zero cosine:        |C'(t) · (C(t) - P)| / (|C'(t)| · |C(t) - P|) < eps2
   *   (3) Parameter correction: |Δt| · |C'(t)| < eps1
   *   (4) Domain bounds
   */
  closestParam(point: number[]): number {
    const dim = point.length;
    const eps1 = 1e-8;  // distance tolerance
    const eps2 = 1e-6;  // cosine tolerance
    const tMin = this._knots[this._degree];
    const tMax = this._knots[this._knots.length - this._degree - 1];
    const n = this._controlPoints.length - 1;

    // Phase 1: Initial guess — closest control point's Greville abscissa + local sampling
    let bestT = tMin;
    let bestDist = Infinity;

    // Find closest control point and use its Greville abscissa
    for (let i = 0; i <= n; i++) {
      let dist = 0;
      for (let d = 0; d < dim; d++) {
        dist += (this._controlPoints[i][d] - point[d]) ** 2;
      }
      if (dist < bestDist) {
        bestDist = dist;
        // Greville abscissa: average of knots in the support of N_{i,p}
        let greville = 0;
        for (let j = 1; j <= this._degree; j++) {
          greville += this._knots[i + j];
        }
        greville /= this._degree;
        bestT = Math.max(tMin, Math.min(tMax, greville));
      }
    }

    // Refine by sampling near the initial guess
    const span = 0.2 * (tMax - tMin);
    const sampleMin = Math.max(tMin, bestT - span);
    const sampleMax = Math.min(tMax, bestT + span);
    const numSamples = 20;
    for (let i = 0; i <= numSamples; i++) {
      const t = sampleMin + (sampleMax - sampleMin) * i / numSamples;
      const pt = this.point(t);
      let dist = 0;
      for (let d = 0; d < dim; d++) dist += (pt[d] - point[d]) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        bestT = t;
      }
    }

    // Also do a coarser global sweep to avoid local minima traps
    const globalSamples = Math.max(n * 4, 20);
    for (let i = 0; i <= globalSamples; i++) {
      const t = tMin + (tMax - tMin) * i / globalSamples;
      const pt = this.point(t);
      let dist = 0;
      for (let d = 0; d < dim; d++) dist += (pt[d] - point[d]) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        bestT = t;
      }
    }

    // Phase 2: Newton iteration with proper convergence criteria
    let t = bestT;
    const maxDeriv = Math.min(2, this._degree);

    for (let iter = 0; iter < 50; iter++) {
      const ders = this.derivatives(t, maxDeriv);
      const C = ders[0];
      const Ct = ders[1];
      const diff = C.map((v, d) => v - point[d]);

      // Criterion 1: Point coincidence ||C(t) - P|| < eps1
      let distSq = 0;
      for (let d = 0; d < dim; d++) distSq += diff[d] ** 2;
      if (Math.sqrt(distSq) < eps1) break;

      // Criterion 2: Zero cosine |C'·(C-P)| / (|C'|·|C-P|) < eps2
      let dotCtDiff = 0;
      let CtLen = 0;
      for (let d = 0; d < dim; d++) {
        dotCtDiff += Ct[d] * diff[d];
        CtLen += Ct[d] ** 2;
      }
      CtLen = Math.sqrt(CtLen);
      const dist = Math.sqrt(distSq);
      if (CtLen > 0 && dist > 0) {
        const cosine = Math.abs(dotCtDiff) / (CtLen * dist);
        if (cosine < eps2) break;
      }

      // Newton step: Δt = -C'·(C-P) / (C''·(C-P) + C'·C')
      let numerator = dotCtDiff;
      let denominator = CtLen * CtLen;
      if (maxDeriv >= 2) {
        const Ctt = ders[2];
        for (let d = 0; d < dim; d++) {
          denominator += Ctt[d] * diff[d];
        }
      }

      if (Math.abs(denominator) < 1e-14) break;

      const dt = -numerator / denominator;

      // Criterion 3: Parameter correction |Δt|·|C'| < eps1
      if (Math.abs(dt) * CtLen < eps1) break;

      // Criterion 4: Clamp to domain
      const tNew = Math.max(tMin, Math.min(tMax, t + dt));

      if (Math.abs(tNew - t) < 1e-14) break;
      t = tNew;
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
