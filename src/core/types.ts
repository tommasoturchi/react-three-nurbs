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

/** A face is a surface bounded by trim curves with an orientation */
export interface FaceData {
  surface: SurfaceData;
  outerWire?: CurveData[]; // trim curves forming the outer boundary (in UV space)
  holes?: CurveData[][]; // inner trim loops (holes), each an array of curves
  orientation: "forward" | "reversed"; // which side of the surface faces outward
}

/** A solid is a closed shell of oriented faces */
export interface SolidData {
  faces: FaceData[];
}
