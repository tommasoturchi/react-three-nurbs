/**
 * B-spline basis function algorithms.
 * Implements Algorithms A2.1, A2.2, A2.3 from "The NURBS Book" (Piegl & Tiller).
 */

/**
 * Find the knot span index (Algorithm A2.1).
 * Returns i such that knots[i] <= u < knots[i+1], with special handling for the upper boundary.
 *
 * @param n - Number of control points minus 1 (= controlPoints.length - 1)
 * @param degree - Polynomial degree
 * @param u - Parameter value
 * @param knots - Knot vector
 */
export function findSpan(
  n: number,
  degree: number,
  u: number,
  knots: number[]
): number {
  // Special case: u at upper boundary
  if (u >= knots[n + 1]) return n;
  if (u <= knots[degree]) return degree;

  // Binary search
  let low = degree;
  let high = n + 1;
  let mid = (low + high) >> 1;

  while (u < knots[mid] || u >= knots[mid + 1]) {
    if (u < knots[mid]) {
      high = mid;
    } else {
      low = mid;
    }
    mid = (low + high) >> 1;
  }

  return mid;
}

/**
 * Compute non-vanishing basis functions (Algorithm A2.2).
 * Returns an array N of length (degree+1) where N[j] = N_{span-degree+j, degree}(u).
 *
 * @param span - Knot span index (from findSpan)
 * @param u - Parameter value
 * @param degree - Polynomial degree
 * @param knots - Knot vector
 */
export function basisFunctions(
  span: number,
  u: number,
  degree: number,
  knots: number[]
): number[] {
  const N = new Array(degree + 1);
  const left = new Array(degree + 1);
  const right = new Array(degree + 1);

  N[0] = 1.0;

  for (let j = 1; j <= degree; j++) {
    left[j] = u - knots[span + 1 - j];
    right[j] = knots[span + j] - u;
    let saved = 0.0;

    for (let r = 0; r < j; r++) {
      const temp = N[r] / (right[r + 1] + left[j - r]);
      N[r] = saved + right[r + 1] * temp;
      saved = left[j - r] * temp;
    }

    N[j] = saved;
  }

  return N;
}

/**
 * Compute basis function derivatives (Algorithm A2.3).
 * Returns a 2D array ders[k][j] where ders[k][j] is the kth derivative
 * of the jth non-vanishing basis function at u.
 *
 * @param span - Knot span index
 * @param u - Parameter value
 * @param degree - Polynomial degree
 * @param n - Maximum derivative order to compute
 * @param knots - Knot vector
 */
export function derivBasisFunctions(
  span: number,
  u: number,
  degree: number,
  n: number,
  knots: number[]
): number[][] {
  // ndu[j][r] stores basis function values and knot differences
  const ndu: number[][] = Array.from({ length: degree + 1 }, () =>
    new Array(degree + 1).fill(0)
  );
  const left = new Array(degree + 1);
  const right = new Array(degree + 1);

  ndu[0][0] = 1.0;

  for (let j = 1; j <= degree; j++) {
    left[j] = u - knots[span + 1 - j];
    right[j] = knots[span + j] - u;
    let saved = 0.0;

    for (let r = 0; r < j; r++) {
      // Lower triangle
      ndu[j][r] = right[r + 1] + left[j - r];
      const temp = ndu[r][j - 1] / ndu[j][r];

      // Upper triangle
      ndu[r][j] = saved + right[r + 1] * temp;
      saved = left[j - r] * temp;
    }

    ndu[j][j] = saved;
  }

  // Load basis functions
  const ders: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(degree + 1).fill(0)
  );

  for (let j = 0; j <= degree; j++) {
    ders[0][j] = ndu[j][degree];
  }

  // Compute derivatives (Eq. 2.9)
  const a: number[][] = [new Array(degree + 1).fill(0), new Array(degree + 1).fill(0)];

  for (let r = 0; r <= degree; r++) {
    let s1 = 0;
    let s2 = 1;
    a[0][0] = 1.0;

    for (let k = 1; k <= n; k++) {
      let d = 0.0;
      const rk = r - k;
      const pk = degree - k;

      if (r >= k) {
        a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
        d = a[s2][0] * ndu[rk][pk];
      }

      const j1 = rk >= -1 ? 1 : -rk;
      const j2 = r - 1 <= pk ? k - 1 : degree - r;

      for (let j = j1; j <= j2; j++) {
        a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
        d += a[s2][j] * ndu[rk + j][pk];
      }

      if (r <= pk) {
        a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r];
        d += a[s2][k] * ndu[r][pk];
      }

      ders[k][r] = d;

      // Swap rows
      const temp = s1;
      s1 = s2;
      s2 = temp;
    }
  }

  // Multiply by correct factors (Eq. 2.9)
  let r = degree;
  for (let k = 1; k <= n; k++) {
    for (let j = 0; j <= degree; j++) {
      ders[k][j] *= r;
    }
    r *= degree - k;
  }

  return ders;
}
