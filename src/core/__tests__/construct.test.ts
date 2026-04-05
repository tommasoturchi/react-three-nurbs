import { describe, it, expect } from "vitest";
import { NurbsCurve } from "../curve";
import { createArc, createCircle, createExtrudedSurface } from "../construct";
import { NurbsSurface } from "../surface";

describe("createCircle", () => {
  it("creates a circle with correct radius", () => {
    const data = createCircle([0, 0, 0], [1, 0, 0], [0, 1, 0], 2);
    const curve = new NurbsCurve(data);

    // Sample points and check they're all at distance 2 from center
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const pt = curve.point(t);
      const r = Math.sqrt(pt[0] ** 2 + pt[1] ** 2 + pt[2] ** 2);
      expect(r).toBeCloseTo(2, 3);
    }
  });

  it("lies in the XY plane", () => {
    const data = createCircle([0, 0, 0], [1, 0, 0], [0, 1, 0], 1);
    const curve = new NurbsCurve(data);
    for (let i = 0; i <= 10; i++) {
      const pt = curve.point(i / 10);
      expect(pt[2]).toBeCloseTo(0, 8);
    }
  });
});

describe("createArc", () => {
  it("creates a 90° arc", () => {
    const data = createArc([0, 0, 0], [1, 0, 0], [0, 1, 0], 1, 0, Math.PI / 2);
    const curve = new NurbsCurve(data);
    const p0 = curve.point(0);
    const p1 = curve.point(1);
    expect(p0[0]).toBeCloseTo(1, 4);
    expect(p0[1]).toBeCloseTo(0, 4);
    expect(p1[0]).toBeCloseTo(0, 4);
    expect(p1[1]).toBeCloseTo(1, 4);
  });

  it("maintains constant radius along the arc", () => {
    const data = createArc([0, 0, 0], [1, 0, 0], [0, 1, 0], 3, 0, Math.PI);
    const curve = new NurbsCurve(data);
    for (let i = 0; i <= 20; i++) {
      const pt = curve.point(i / 20);
      const r = Math.sqrt(pt[0] ** 2 + pt[1] ** 2);
      expect(r).toBeCloseTo(3, 2);
    }
  });
});

describe("createExtrudedSurface", () => {
  it("extrudes a line segment into a flat quad", () => {
    const profile = {
      degree: 1,
      knots: [0, 0, 1, 1],
      controlPoints: [[0, 0, 0], [1, 0, 0]],
      weights: [1, 1],
    };
    const data = createExtrudedSurface(profile, [0, 0, 2]);
    const surf = new NurbsSurface(data);
    const mid = surf.point(0.5, 0.5);
    expect(mid[0]).toBeCloseTo(0.5, 6);
    expect(mid[1]).toBeCloseTo(0, 6);
    expect(mid[2]).toBeCloseTo(1, 6);
  });
});
