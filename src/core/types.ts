/** Raw NURBS curve data (no methods, just numbers) */
export interface CurveData {
  degree: number;
  knots: number[];
  controlPoints: number[][];
  weights: number[];
}

/** Raw NURBS surface data (no methods, just numbers) */
export interface SurfaceData {
  degreeU: number;
  degreeV: number;
  knotsU: number[];
  knotsV: number[];
  controlPoints: number[][][]; // [u][v][xyz]
  weights: number[][]; // [u][v]
}
