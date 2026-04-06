import { describe, it, expect } from "vitest";
import { NurbsCurve } from "../curve";

describe("NurbsCurve", () => {
  // Simple degree-2 Bezier curve: 3 control points, uniform weights
  const simpleCurve = () =>
    NurbsCurve.byKnotsControlPointsWeights(
      2,
      [0, 0, 0, 1, 1, 1],
      [[0, 0, 0], [0.5, 1, 0], [1, 0, 0]],
      [1, 1, 1]
    );

  // Line segment (degree 1)
  const lineCurve = () =>
    NurbsCurve.byKnotsControlPointsWeights(
      1,
      [0, 0, 1, 1],
      [[0, 0, 0], [3, 4, 0]],
      [1, 1]
    );

  describe("point", () => {
    it("interpolates endpoints", () => {
      const c = simpleCurve();
      const p0 = c.point(0);
      const p1 = c.point(1);
      expect(p0[0]).toBeCloseTo(0, 8);
      expect(p0[1]).toBeCloseTo(0, 8);
      expect(p1[0]).toBeCloseTo(1, 8);
      expect(p1[1]).toBeCloseTo(0, 8);
    });

    it("evaluates midpoint of symmetric curve", () => {
      const c = simpleCurve();
      const mid = c.point(0.5);
      expect(mid[0]).toBeCloseTo(0.5, 8);
      expect(mid[1]).toBeCloseTo(0.5, 8); // quadratic Bezier midpoint
    });

    it("evaluates linear curve correctly", () => {
      const c = lineCurve();
      const mid = c.point(0.5);
      expect(mid[0]).toBeCloseTo(1.5, 8);
      expect(mid[1]).toBeCloseTo(2, 8);
    });
  });

  describe("tangent", () => {
    it("returns non-zero tangent", () => {
      const c = simpleCurve();
      const t = c.tangent(0.5);
      const mag = Math.sqrt(t[0] ** 2 + t[1] ** 2 + t[2] ** 2);
      expect(mag).toBeGreaterThan(0);
    });

    it("tangent of line is constant direction", () => {
      const c = lineCurve();
      const t0 = c.tangent(0);
      const t1 = c.tangent(0.5);
      // Direction should be proportional to [3, 4, 0]
      expect(t0[0] / t0[1]).toBeCloseTo(3 / 4, 6);
      expect(t1[0] / t1[1]).toBeCloseTo(3 / 4, 6);
    });
  });

  describe("derivatives", () => {
    it("zeroth derivative matches point", () => {
      const c = simpleCurve();
      const d = c.derivatives(0.3, 0);
      const p = c.point(0.3);
      for (let i = 0; i < 3; i++) {
        expect(d[0][i]).toBeCloseTo(p[i], 8);
      }
    });

    it("first derivative matches tangent", () => {
      const c = simpleCurve();
      const d = c.derivatives(0.3, 1);
      const t = c.tangent(0.3);
      for (let i = 0; i < 3; i++) {
        expect(d[1][i]).toBeCloseTo(t[i], 8);
      }
    });
  });

  describe("length", () => {
    it("computes correct length for line segment", () => {
      const c = lineCurve();
      expect(c.length()).toBeCloseTo(5, 4); // sqrt(3^2 + 4^2) = 5
    });

    it("returns positive length for curved segment", () => {
      const c = simpleCurve();
      expect(c.length()).toBeGreaterThan(0);
      expect(c.length()).toBeGreaterThan(1); // longer than chord
    });
  });

  describe("closestParam", () => {
    it("finds parameter for point on curve", () => {
      const c = simpleCurve();
      const pt = c.point(0.3);
      const t = c.closestParam(pt);
      expect(t).toBeCloseTo(0.3, 4);
    });

    it("projects nearby point onto line", () => {
      const c = lineCurve();
      // Line is [0,0,0]->[3,4,0]. Point [1.2, 1.6, 0] is on the line at t=0.4
      // (since 3*0.4=1.2, 4*0.4=1.6)
      const t = c.closestParam([1.2, 1.6, 0]);
      expect(t).toBeCloseTo(0.4, 2);
    });
  });

  describe("clone", () => {
    it("creates independent copy", () => {
      const c = simpleCurve();
      const c2 = c.clone();
      const p1 = c.point(0.5);
      const p2 = c2.point(0.5);
      expect(p1[0]).toBeCloseTo(p2[0], 10);
      expect(p1[1]).toBeCloseTo(p2[1], 10);
    });
  });

  describe("reverse", () => {
    it("reverses the curve direction", () => {
      const c = simpleCurve();
      const r = c.reverse();
      const p0 = c.point(0);
      const r1 = r.point(1);
      expect(p0[0]).toBeCloseTo(r1[0], 8);
      expect(p0[1]).toBeCloseTo(r1[1], 8);
    });
  });

  describe("rational curves", () => {
    it("weight > 1 pulls curve toward control point", () => {
      const c1 = NurbsCurve.byKnotsControlPointsWeights(
        2, [0, 0, 0, 1, 1, 1],
        [[0, 0, 0], [0.5, 1, 0], [1, 0, 0]],
        [1, 1, 1]
      );
      const c2 = NurbsCurve.byKnotsControlPointsWeights(
        2, [0, 0, 0, 1, 1, 1],
        [[0, 0, 0], [0.5, 1, 0], [1, 0, 0]],
        [1, 5, 1] // heavy middle weight
      );
      const mid1 = c1.point(0.5);
      const mid2 = c2.point(0.5);
      // Higher weight should pull midpoint closer to control point [0.5, 1, 0]
      expect(mid2[1]).toBeGreaterThan(mid1[1]);
    });
  });
});

describe("split", () => {
  it("splits a curve and both halves evaluate correctly", () => {
    const c = NurbsCurve.byKnotsControlPointsWeights(
      2,
      [0, 0, 0, 0.5, 1, 1, 1],
      [[0, 0, 0], [1, 2, 0], [2, 0, 0], [3, 1, 0]],
      [1, 1, 1, 1]
    );
    const [left, right] = c.split(0.4);
    
    // Left should start at original start
    const l0 = left.point(0);
    expect(l0[0]).toBeCloseTo(0, 2);
    expect(l0[1]).toBeCloseTo(0, 2);
    
    // Right should end at original end
    const r1 = right.point(1);
    expect(r1[0]).toBeCloseTo(3, 1);
    expect(r1[1]).toBeCloseTo(1, 1);
  });
});
