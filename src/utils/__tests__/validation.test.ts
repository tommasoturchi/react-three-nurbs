import { describe, it, expect } from "vitest";
import {
  validateControlPoints,
  validateKnots,
  validateWeights2D,
  validateWeights1D,
  validateDegree,
} from "../validation";

describe("validateControlPoints", () => {
  it("returns null for valid control points", () => {
    const cp = [
      [[0, 0, 0], [1, 0, 0]],
      [[0, 1, 0], [1, 1, 0]],
    ];
    expect(validateControlPoints(cp, 1, 1)).toBeNull();
  });

  it("rejects empty array", () => {
    expect(validateControlPoints([], 1, 1)).toContain("non-empty");
  });

  it("rejects inconsistent row lengths", () => {
    const cp = [
      [[0, 0, 0], [1, 0, 0]],
      [[0, 1, 0]],
    ];
    expect(validateControlPoints(cp, 1, 0)).toContain("row 1");
  });

  it("rejects when rows < degreeU + 1", () => {
    const cp = [[[0, 0, 0], [1, 0, 0]]];
    expect(validateControlPoints(cp, 2, 1)).toContain("degreeU");
  });

  it("rejects when columns < degreeV + 1", () => {
    const cp = [
      [[0, 0, 0]],
      [[0, 1, 0]],
      [[0, 2, 0]],
    ];
    expect(validateControlPoints(cp, 1, 2)).toContain("degreeV");
  });
});

describe("validateKnots", () => {
  it("returns null for valid knots", () => {
    expect(validateKnots([0, 0, 0, 1, 1, 1], 3, 2)).toBeNull();
  });

  it("rejects wrong length", () => {
    expect(validateKnots([0, 0, 1, 1], 3, 2)).toContain("length");
  });

  it("rejects non-decreasing violation", () => {
    expect(validateKnots([0, 0, 0.5, 0.3, 1, 1], 3, 2)).toContain("non-decreasing");
  });
});

describe("validateWeights2D", () => {
  it("returns null for matching dimensions", () => {
    const cp = [[[0, 0, 0], [1, 0, 0]], [[0, 1, 0], [1, 1, 0]]];
    const w = [[1, 1], [1, 1]];
    expect(validateWeights2D(w, cp)).toBeNull();
  });

  it("rejects mismatched row count", () => {
    const cp = [[[0, 0, 0]], [[0, 1, 0]]];
    const w = [[1]];
    expect(validateWeights2D(w, cp)).toContain("rows");
  });
});

describe("validateWeights1D", () => {
  it("returns null for correct length", () => {
    expect(validateWeights1D([1, 1, 1], 3)).toBeNull();
  });

  it("rejects wrong length", () => {
    expect(validateWeights1D([1, 1], 3)).toContain("length");
  });
});

describe("validateDegree", () => {
  it("returns null for valid degree", () => {
    expect(validateDegree(2, 4)).toBeNull();
  });

  it("rejects degree < 1", () => {
    expect(validateDegree(0, 4)).toContain(">= 1");
  });

  it("rejects degree >= numControlPoints", () => {
    expect(validateDegree(3, 3)).toContain("must be <");
  });
});
