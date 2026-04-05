import { describe, it, expect } from "vitest";
import { NurbsCurve } from "../curve";
import { NurbsSurface } from "../surface";

describe("Curve closestParam (Algorithm A6.1)", () => {
  const line = () =>
    NurbsCurve.byKnotsControlPointsWeights(
      1, [0, 0, 1, 1],
      [[0, 0, 0], [10, 0, 0]],
      [1, 1]
    );

  const arc = () =>
    NurbsCurve.byKnotsControlPointsWeights(
      2, [0, 0, 0, 1, 1, 1],
      [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
      [1, Math.SQRT1_2, 1]
    );

  it("finds exact point on a line", () => {
    const c = line();
    const t = c.closestParam([5, 0, 0]);
    expect(t).toBeCloseTo(0.5, 4);
  });

  it("projects off-line point correctly", () => {
    const c = line();
    // Point [3, 5, 0] should project to [3, 0, 0] at t=0.3
    const t = c.closestParam([3, 5, 0]);
    expect(t).toBeCloseTo(0.3, 2);
    const projected = c.point(t);
    expect(projected[0]).toBeCloseTo(3, 2);
    expect(projected[1]).toBeCloseTo(0, 2);
  });

  it("projects point near curve endpoint", () => {
    const c = line();
    const t = c.closestParam([10, 1, 0]);
    expect(t).toBeCloseTo(1, 2);
  });

  it("finds closest point on a rational arc", () => {
    const c = arc();
    // The arc goes from [1,0,0] to [0,1,0] — midpoint at t=0.5 is on the unit circle
    const midPt = c.point(0.5);
    const r = Math.sqrt(midPt[0] ** 2 + midPt[1] ** 2);
    expect(r).toBeCloseTo(1, 3);

    // Project a point at [2, 2, 0] — should map to the 45° point
    const t = c.closestParam([2, 2, 0]);
    const proj = c.point(t);
    // The projected point should be on the arc (radius ≈ 1)
    const projR = Math.sqrt(proj[0] ** 2 + proj[1] ** 2);
    expect(projR).toBeCloseTo(1, 2);
  });

  it("satisfies zero-cosine criterion", () => {
    const c = arc();
    const target = [0.5, 0.5, 0];
    const t = c.closestParam(target);
    const pt = c.point(t);
    const tan = c.tangent(t);

    // The vector from projected point to target should be perpendicular to tangent
    const diff = [target[0] - pt[0], target[1] - pt[1], target[2] - pt[2]];
    const dot = diff[0] * tan[0] + diff[1] * tan[1] + diff[2] * tan[2];
    const diffLen = Math.sqrt(diff[0] ** 2 + diff[1] ** 2 + diff[2] ** 2);
    const tanLen = Math.sqrt(tan[0] ** 2 + tan[1] ** 2 + tan[2] ** 2);

    if (diffLen > 1e-10 && tanLen > 1e-10) {
      const cosine = Math.abs(dot) / (diffLen * tanLen);
      expect(cosine).toBeLessThan(1e-4);
    }
  });
});

describe("Surface closestParam (NURBS Book Section 6.1)", () => {
  const flatSurface = () =>
    NurbsSurface.byKnotsControlPointsWeights(
      2, 2,
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      [
        [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
        [[0, 1, 0], [1, 1, 0], [2, 1, 0]],
        [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
      ],
      [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
    );

  const bumpSurface = () =>
    NurbsSurface.byKnotsControlPointsWeights(
      2, 2,
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1],
      [
        [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
        [[0, 1, 0], [1, 1, 1], [2, 1, 0]],
        [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
      ],
      [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
    );

  it("finds exact point on flat surface", () => {
    const s = flatSurface();
    const uv = s.closestParam([1, 1, 0]); // center of surface
    expect(uv[0]).toBeCloseTo(0.5, 2);
    expect(uv[1]).toBeCloseTo(0.5, 2);
  });

  it("projects point above surface to correct UV", () => {
    const s = flatSurface();
    // Point [1, 1, 5] is directly above center — should project to (0.5, 0.5)
    const uv = s.closestParam([1, 1, 5]);
    expect(uv[0]).toBeCloseTo(0.5, 2);
    expect(uv[1]).toBeCloseTo(0.5, 2);
  });

  it("projects point near corner", () => {
    const s = flatSurface();
    const uv = s.closestParam([0, 0, 0.1]);
    expect(uv[0]).toBeCloseTo(0, 1);
    expect(uv[1]).toBeCloseTo(0, 1);
  });

  it("satisfies zero-cosine criterion on bumped surface", () => {
    const s = bumpSurface();
    const target = [1, 1, 2]; // above the bump
    const uv = s.closestParam(target);
    const pt = s.point(uv[0], uv[1]);
    // The tangent vectors should be perpendicular to diff
    // (equivalently, diff is approximately parallel to the normal)
    const diff = [target[0] - pt[0], target[1] - pt[1], target[2] - pt[2]];
    const diffLen = Math.sqrt(diff[0] ** 2 + diff[1] ** 2 + diff[2] ** 2);

    if (diffLen > 1e-10) {
      const ders = s.derivatives(uv[0], uv[1], 1);
      const Su = ders[1][0];
      const Sv = ders[0][1];

      let dotU = 0, dotV = 0, SuLen = 0, SvLen = 0;
      for (let d = 0; d < 3; d++) {
        dotU += Su[d] * diff[d];
        dotV += Sv[d] * diff[d];
        SuLen += Su[d] ** 2;
        SvLen += Sv[d] ** 2;
      }
      SuLen = Math.sqrt(SuLen);
      SvLen = Math.sqrt(SvLen);

      if (SuLen > 0) expect(Math.abs(dotU) / (SuLen * diffLen)).toBeLessThan(1e-3);
      if (SvLen > 0) expect(Math.abs(dotV) / (SvLen * diffLen)).toBeLessThan(1e-3);
    }
  });
});
