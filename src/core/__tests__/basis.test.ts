import { describe, it, expect } from "vitest";
import { findSpan, basisFunctions, derivBasisFunctions } from "../basis";

describe("findSpan", () => {
  const knots = [0, 0, 0, 0.5, 1, 1, 1]; // degree 2, 4 control points

  it("finds correct span for interior value", () => {
    expect(findSpan(3, 2, 0.25, knots)).toBe(2);
    expect(findSpan(3, 2, 0.5, knots)).toBe(3);
    expect(findSpan(3, 2, 0.75, knots)).toBe(3);
  });

  it("handles lower boundary", () => {
    expect(findSpan(3, 2, 0, knots)).toBe(2);
  });

  it("handles upper boundary", () => {
    expect(findSpan(3, 2, 1, knots)).toBe(3);
  });
});

describe("basisFunctions", () => {
  const knots = [0, 0, 0, 1, 1, 1]; // degree 2, 3 control points

  it("sums to 1 (partition of unity)", () => {
    for (const u of [0, 0.25, 0.5, 0.75, 1]) {
      const span = findSpan(2, 2, u, knots);
      const N = basisFunctions(span, u, 2, knots);
      const sum = N.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1, 10);
    }
  });

  it("all values non-negative", () => {
    for (const u of [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1]) {
      const span = findSpan(2, 2, u, knots);
      const N = basisFunctions(span, u, 2, knots);
      for (const val of N) {
        expect(val).toBeGreaterThanOrEqual(-1e-14);
      }
    }
  });

  it("endpoint interpolation: N_0(0) = 1", () => {
    const span = findSpan(2, 2, 0, knots);
    const N = basisFunctions(span, 0, 2, knots);
    expect(N[0]).toBeCloseTo(1, 10);
  });

  it("endpoint interpolation: N_n(1) = 1", () => {
    const span = findSpan(2, 2, 1, knots);
    const N = basisFunctions(span, 1, 2, knots);
    expect(N[2]).toBeCloseTo(1, 10);
  });
});

describe("derivBasisFunctions", () => {
  const knots = [0, 0, 0, 1, 1, 1]; // degree 2, 3 control points

  it("zeroth derivative matches basisFunctions", () => {
    const u = 0.4;
    const span = findSpan(2, 2, u, knots);
    const N = basisFunctions(span, u, 2, knots);
    const ders = derivBasisFunctions(span, u, 2, 1, knots);
    for (let j = 0; j <= 2; j++) {
      expect(ders[0][j]).toBeCloseTo(N[j], 10);
    }
  });

  it("first derivatives sum to 0 (partition of unity differentiated)", () => {
    for (const u of [0.2, 0.5, 0.8]) {
      const span = findSpan(2, 2, u, knots);
      const ders = derivBasisFunctions(span, u, 2, 1, knots);
      const sum = ders[1].reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(0, 8);
    }
  });
});
