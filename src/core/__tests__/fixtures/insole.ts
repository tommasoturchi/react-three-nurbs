/**
 * Test fixtures for insole NURBS surface data.
 * Loads real-world insole geometry and converts to NurbsSurface instances.
 */

import { createRequire } from "node:module";
import { NurbsSurface } from "../../surface";
import { generateUniformKnots } from "../../../utils/nurbs";
import insoleData from "./user-b-insole-right.json" with { type: "json" };

// verb-nurbs is CJS and needs `window` global (provided by happy-dom).
// Use createRequire to avoid verbatimModuleSyntax issues.
const require = createRequire(import.meta.url);
const verb = require("verb-nurbs");

/** Grid dimensions for the upper surface (21 rows × 61 cols = 1281 points) */
const ROWS_U = 21;
const COLS_V = 61;
const DEGREE = 3; // order [4,4] → degree 3

interface InsoleJSON {
  upper: { points: number[][]; order: [number, number] };
  bottom: { points: number[][]; splits: number[] };
  curve_upper: { points: number[][]; splits: number[] };
  curve_bottom: { points: number[][]; splits: number[] };
}

/**
 * Reshape a flat array of [x,y,z] points into a 2D grid [u][v][xyz].
 */
function reshapeGrid(
  flatPoints: number[][],
  rows: number,
  cols: number
): number[][][] {
  const grid: number[][][] = [];
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = flatPoints[i * cols + j];
    }
  }
  return grid;
}

/**
 * Create uniform weights (all 1.0) for a grid.
 */
function uniformWeights(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(1));
}

/**
 * Create the insole upper surface using the project's NurbsSurface.
 */
export function createInsoleSurface(): NurbsSurface {
  const data = insoleData as unknown as InsoleJSON;
  const controlPoints = reshapeGrid(data.upper.points, ROWS_U, COLS_V);
  const knotsU = generateUniformKnots(ROWS_U, DEGREE);
  const knotsV = generateUniformKnots(COLS_V, DEGREE);
  const weights = uniformWeights(ROWS_U, COLS_V);

  return NurbsSurface.byKnotsControlPointsWeights(
    DEGREE,
    DEGREE,
    knotsU,
    knotsV,
    controlPoints,
    weights
  );
}

/**
 * Create the insole upper surface using verb-nurbs.
 */
export function createVerbInsoleSurface(): any {
  const data = insoleData as unknown as InsoleJSON;
  const controlPoints = reshapeGrid(data.upper.points, ROWS_U, COLS_V);
  const knotsU = generateUniformKnots(ROWS_U, DEGREE);
  const knotsV = generateUniformKnots(COLS_V, DEGREE);
  const weights = uniformWeights(ROWS_U, COLS_V);

  return verb.geom.NurbsSurface.byKnotsControlPointsWeights(
    DEGREE,
    DEGREE,
    knotsU,
    knotsV,
    controlPoints,
    weights
  );
}

export { verb, ROWS_U, COLS_V, DEGREE };
