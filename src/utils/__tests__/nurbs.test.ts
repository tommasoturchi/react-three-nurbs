import { describe, it, expect } from "vitest";
import { NurbsCurve, NurbsSurface } from "../../core";
import {
  generateUniformKnots,
  computeNormal,
  projectPointToSurface,
  sampleNurbsCurve2D,
  adaptiveSampleNurbsCurve2D,
  projectPointToSurfaceUV,
} from "../nurbs";

// Helper: create a simple flat NURBS surface
function createFlatSurface() {
  const cp = [
    [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
    [[0, 1, 0], [1, 1, 0], [2, 1, 0]],
    [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
  ];
  const w = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
  const knots = [0, 0, 0, 1, 1, 1];
  return NurbsSurface.byKnotsControlPointsWeights(2, 2, knots, knots, cp, w);
}

// Helper: create a simple NURBS curve
function createSimpleCurve() {
  return NurbsCurve.byKnotsControlPointsWeights(
    2,
    [0, 0, 0, 1, 1, 1],
    [[0, 0, 0], [0.5, 1, 0], [1, 0, 0]],
    [1, 1, 1]
  );
}

describe("generateUniformKnots", () => {
  it("generates correct length", () => {
    const knots = generateUniformKnots(4, 2);
    expect(knots.length).toBe(4 + 2 + 1);
  });

  it("starts with degree+1 zeros", () => {
    const knots = generateUniformKnots(4, 2);
    expect(knots[0]).toBe(0);
    expect(knots[1]).toBe(0);
    expect(knots[2]).toBe(0);
  });

  it("ends with degree+1 ones", () => {
    const knots = generateUniformKnots(4, 2);
    expect(knots[knots.length - 1]).toBe(1);
    expect(knots[knots.length - 2]).toBe(1);
    expect(knots[knots.length - 3]).toBe(1);
  });

  it("is non-decreasing", () => {
    const knots = generateUniformKnots(6, 3);
    for (let i = 1; i < knots.length; i++) {
      expect(knots[i]).toBeGreaterThanOrEqual(knots[i - 1]);
    }
  });
});

describe("projectPointToSurface", () => {
  it("returns correct point for flat surface corner", () => {
    const surface = createFlatSurface();
    const point = projectPointToSurface(surface, 0, 0);
    expect(point.x).toBeCloseTo(0, 3);
    expect(point.y).toBeCloseTo(0, 3);
    expect(point.z).toBeCloseTo(0, 3);
  });

  it("returns correct point at (1,1)", () => {
    const surface = createFlatSurface();
    const point = projectPointToSurface(surface, 1, 1);
    expect(point.x).toBeCloseTo(2, 3);
    expect(point.y).toBeCloseTo(2, 3);
    expect(point.z).toBeCloseTo(0, 3);
  });
});

describe("computeNormal", () => {
  it("returns upward normal for flat XY surface", () => {
    const surface = createFlatSurface();
    const normal = computeNormal(surface, 0.5, 0.5);
    // Flat surface in XY plane should have normal along Z
    expect(Math.abs(normal.z)).toBeGreaterThan(0.9);
    expect(normal.length()).toBeCloseTo(1, 3);
  });
});

describe("sampleNurbsCurve2D", () => {
  it("returns correct number of points", () => {
    const curve = createSimpleCurve();
    const points = sampleNurbsCurve2D(curve, 50);
    expect(points.length).toBe(50);
  });

  it("starts at first control point region", () => {
    const curve = createSimpleCurve();
    const points = sampleNurbsCurve2D(curve, 10);
    expect(points[0][0]).toBeCloseTo(0, 1);
    expect(points[0][1]).toBeCloseTo(0, 1);
  });
});

describe("adaptiveSampleNurbsCurve2D", () => {
  it("returns at least 2 points", () => {
    const curve = createSimpleCurve();
    const points = adaptiveSampleNurbsCurve2D(curve, 5, 10);
    expect(points.length).toBeGreaterThanOrEqual(2);
  });

  it("returns more points for tighter angle threshold", () => {
    const curve = createSimpleCurve();
    const loose = adaptiveSampleNurbsCurve2D(curve, 45, 10);
    const tight = adaptiveSampleNurbsCurve2D(curve, 1, 10);
    expect(tight.length).toBeGreaterThanOrEqual(loose.length);
  });
});

describe("projectPointToSurfaceUV", () => {
  it("finds UV for a point on the surface", () => {
    const surface = createFlatSurface();
    const uv = projectPointToSurfaceUV(surface, [1, 1, 0]);
    expect(uv).not.toBeNull();
    if (uv) {
      expect(uv[0]).toBeCloseTo(0.5, 1);
      expect(uv[1]).toBeCloseTo(0.5, 1);
    }
  });

  it("finds UV for a corner point", () => {
    const surface = createFlatSurface();
    const uv = projectPointToSurfaceUV(surface, [0, 0, 0]);
    expect(uv).not.toBeNull();
    if (uv) {
      expect(uv[0]).toBeCloseTo(0, 1);
      expect(uv[1]).toBeCloseTo(0, 1);
    }
  });
});
