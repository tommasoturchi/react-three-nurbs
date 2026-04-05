import { describe, it, expect } from "vitest";
import { NurbsSurface } from "../surface";

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

describe("NurbsSurface", () => {
  describe("point", () => {
    it("evaluates corners of flat surface", () => {
      const s = flatSurface();
      expect(s.point(0, 0)).toEqual([0, 0, 0]);
      const p11 = s.point(1, 1);
      expect(p11[0]).toBeCloseTo(2, 6);
      expect(p11[1]).toBeCloseTo(2, 6);
      expect(p11[2]).toBeCloseTo(0, 6);
    });

    it("evaluates center of bumped surface", () => {
      const s = bumpSurface();
      const mid = s.point(0.5, 0.5);
      expect(mid[0]).toBeCloseTo(1, 4);
      expect(mid[1]).toBeCloseTo(1, 4);
      expect(mid[2]).toBeGreaterThan(0); // bump
    });
  });

  describe("normal", () => {
    it("returns Z-up normal for flat XY surface", () => {
      const s = flatSurface();
      const n = s.normal(0.5, 0.5);
      const len = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
      expect(len).toBeGreaterThan(0);
      // Should point in Z direction
      expect(Math.abs(n[2]) / len).toBeGreaterThan(0.9);
    });
  });

  describe("isocurve", () => {
    it("extracts a V-direction isocurve that matches surface sampling", () => {
      const s = flatSurface();
      const iso = s.isocurve(0.5, false); // fix u=0.5, get curve in V
      // Verify by comparing with direct surface evaluation
      for (const v of [0, 0.25, 0.5, 0.75, 1]) {
        const fromSurface = s.point(0.5, v);
        const fromCurve = iso.point(v);
        for (let d = 0; d < 3; d++) {
          expect(fromCurve[d]).toBeCloseTo(fromSurface[d], 3);
        }
      }
    });

    it("extracts a U-direction isocurve that matches surface sampling", () => {
      const s = flatSurface();
      const iso = s.isocurve(0.5, true); // fix v=0.5, get curve in U
      for (const u of [0, 0.25, 0.5, 0.75, 1]) {
        const fromSurface = s.point(u, 0.5);
        const fromCurve = iso.point(u);
        for (let d = 0; d < 3; d++) {
          expect(fromCurve[d]).toBeCloseTo(fromSurface[d], 3);
        }
      }
    });
  });

  describe("byCorners", () => {
    it("creates bilinear surface", () => {
      const s = NurbsSurface.byCorners([0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]);
      const mid = s.point(0.5, 0.5);
      expect(mid[0]).toBeCloseTo(0.5, 6);
      expect(mid[1]).toBeCloseTo(0.5, 6);
    });
  });
});
