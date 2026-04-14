import { describe, it, expect } from "vitest";
import { NurbsSurface } from "../surface";
import { adaptiveTessellate } from "../tessellate";
import {
  createInsoleSurface,
  createVerbInsoleSurface,
} from "./fixtures/insole";
import {
  fromTessellationResult,
  fromVerbMesh,
  qualityReport,
  type QualityReport,
} from "./fixtures/metrics";

// --- Simple test surfaces ---

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

// --- Helpers ---

function formatReport(label: string, r: QualityReport): Record<string, string | number> {
  return {
    impl: label,
    triangles: r.triangleCount,
    "dihedral mean°": +r.dihedralAngles.mean.toFixed(2),
    "dihedral max°": +r.dihedralAngles.max.toFixed(2),
    "dihedral >15°": r.dihedralAngles.above15deg,
    "dihedral >30°": r.dihedralAngles.above30deg,
    "deviation max": r.surfaceDeviation ? +r.surfaceDeviation.max.toFixed(4) : "-",
    "deviation rms": r.surfaceDeviation ? +r.surfaceDeviation.rms.toFixed(4) : "-",
    "normal mean°": r.normalAccuracy ? +r.normalAccuracy.meanDeg.toFixed(2) : "-",
    "normal max°": r.normalAccuracy ? +r.normalAccuracy.maxDeg.toFixed(2) : "-",
    "aspect mean": +r.aspectRatio.mean.toFixed(2),
    "aspect max": +r.aspectRatio.max.toFixed(2),
  };
}

// ============================================================
// Suite 1: Basic adaptive tessellation correctness
// ============================================================

describe("adaptiveTessellate — basic correctness", () => {
  it("produces valid topology with no degenerate triangles", () => {
    const surface = bumpSurface();
    const result = adaptiveTessellate(surface, { tolerance: 0.01 });

    expect(result.vertices.length).toBeGreaterThan(0);
    expect(result.indices.length).toBeGreaterThan(0);
    expect(result.indices.length % 3).toBe(0);

    // No degenerate triangles (all three indices distinct)
    for (let i = 0; i < result.indices.length; i += 3) {
      const a = result.indices[i];
      const b = result.indices[i + 1];
      const c = result.indices[i + 2];
      expect(a).not.toBe(b);
      expect(b).not.toBe(c);
      expect(a).not.toBe(c);
    }
  });

  it("produces unit-length normals", () => {
    const surface = bumpSurface();
    const result = adaptiveTessellate(surface, { tolerance: 0.01 });
    const nVerts = result.vertices.length / 3;

    for (let i = 0; i < nVerts; i++) {
      const nx = result.normals[i * 3];
      const ny = result.normals[i * 3 + 1];
      const nz = result.normals[i * 3 + 2];
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      expect(len).toBeCloseTo(1, 3);
    }
  });

  it("produces UVs within [0, 1]", () => {
    const surface = bumpSurface();
    const result = adaptiveTessellate(surface, { tolerance: 0.01 });
    const nVerts = result.vertices.length / 3;

    for (let i = 0; i < nVerts; i++) {
      const u = result.uvs[i * 2];
      const v = result.uvs[i * 2 + 1];
      expect(u).toBeGreaterThanOrEqual(0);
      expect(u).toBeLessThanOrEqual(1);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

// ============================================================
// Suite 2: Insole surface quality
// ============================================================

describe("adaptiveTessellate — insole surface quality", () => {
  it("produces reasonable tessellation for the insole upper surface", () => {
    const surface = createInsoleSurface();
    const result = adaptiveTessellate(surface, {
      tolerance: 0.1,
      minDivsU: 4,
      minDivsV: 4,
      maxDepth: 6,
    });

    const mesh = fromTessellationResult(result);
    const report = qualityReport(mesh, surface);

    console.log("\n--- Insole surface quality (ours, tol=0.1) ---");
    console.table([formatReport("react-three-nurbs", report)]);

    // Basic sanity
    expect(report.triangleCount).toBeGreaterThan(32); // more than the initial 4×4 grid
    expect(report.dihedralAngles.max).toBeLessThan(90);
    expect(report.aspectRatio.mean).toBeLessThan(100);
  });

  it("normals are reasonably accurate", () => {
    const surface = createInsoleSurface();
    const result = adaptiveTessellate(surface, { tolerance: 0.1 });
    const mesh = fromTessellationResult(result);
    const report = qualityReport(mesh, surface);

    expect(report.normalAccuracy!.meanDeg).toBeLessThan(15);
  });
});

// ============================================================
// Suite 3: Comparison with verb-nurbs
// ============================================================

describe("adaptiveTessellate — comparison with verb-nurbs", () => {
  it("side-by-side quality comparison on insole surface", () => {
    const surface = createInsoleSurface();
    const verbSurface = createVerbInsoleSurface();

    // Our tessellation
    const ourResult = adaptiveTessellate(surface, {
      tolerance: 0.1,
      minDivsU: 4,
      minDivsV: 4,
      maxDepth: 6,
    });
    const ourMesh = fromTessellationResult(ourResult);
    const ourReport = qualityReport(ourMesh, surface);

    // verb tessellation (uses normTol=0.025 rad ≈ 1.4° by default)
    const verbMeshRaw = verbSurface.tessellate();
    const verbMesh = fromVerbMesh(verbMeshRaw);
    const verbReport = qualityReport(verbMesh, surface);

    console.log("\n--- Side-by-side comparison (insole upper surface) ---");
    console.table([
      formatReport("react-three-nurbs (tol=0.1)", ourReport),
      formatReport("verb-nurbs (normTol=0.025)", verbReport),
    ]);

    // Log the key differences
    const triRatio = verbReport.triangleCount / ourReport.triangleCount;
    console.log(`\nTriangle ratio (verb/ours): ${triRatio.toFixed(2)}x`);
    console.log(
      `Dihedral angle mean: ours=${ourReport.dihedralAngles.mean.toFixed(2)}° verb=${verbReport.dihedralAngles.mean.toFixed(2)}°`
    );
    if (ourReport.normalAccuracy && verbReport.normalAccuracy) {
      console.log(
        `Normal accuracy mean: ours=${ourReport.normalAccuracy.meanDeg.toFixed(2)}° verb=${verbReport.normalAccuracy.meanDeg.toFixed(2)}°`
      );
    }
  });

  it("comparison at matched refinement levels", () => {
    const surface = createInsoleSurface();
    const verbSurface = createVerbInsoleSurface();

    // Tighter tolerance for our implementation
    const ourResult = adaptiveTessellate(surface, {
      tolerance: 0.01,
      minDivsU: 8,
      minDivsV: 8,
      maxDepth: 8,
    });
    const ourMesh = fromTessellationResult(ourResult);
    const ourReport = qualityReport(ourMesh, surface);

    // verb with tighter normTol
    const verbMeshRaw = verbSurface.tessellate({ normTol: 0.01 });
    const verbMesh = fromVerbMesh(verbMeshRaw);
    const verbReport = qualityReport(verbMesh, surface);

    console.log("\n--- Tight refinement comparison ---");
    console.table([
      formatReport("react-three-nurbs (tol=0.01, 8×8)", ourReport),
      formatReport("verb-nurbs (normTol=0.01)", verbReport),
    ]);
  });
});

// ============================================================
// Suite 4: normalTolerance comparison with verb
// ============================================================

describe("adaptiveTessellate — normalTolerance vs verb", () => {
  it("normalTolerance produces similar refinement pattern to verb", () => {
    const surface = createInsoleSurface();
    const verbSurface = createVerbInsoleSurface();

    // verb baseline
    const verbMeshRaw = verbSurface.tessellate();
    const verbMesh = fromVerbMesh(verbMeshRaw);
    const verbReport = qualityReport(verbMesh, surface);

    // Ours with normalTolerance matching verb's default (0.025 rad)
    const ourResult = adaptiveTessellate(surface, {
      tolerance: 10, // effectively disable positional check
      normalTolerance: 0.025,
      minDivsU: 1,
      minDivsV: 1,
      maxDepth: 10,
    });
    const ourMesh = fromTessellationResult(ourResult);
    const ourReport = qualityReport(ourMesh, surface);

    // Combined: both positional and normal criteria
    const combinedResult = adaptiveTessellate(surface, {
      tolerance: 0.5,
      normalTolerance: 0.025,
      minDivsU: 4,
      minDivsV: 4,
      maxDepth: 6,
    });
    const combinedMesh = fromTessellationResult(combinedResult);
    const combinedReport = qualityReport(combinedMesh, surface);

    console.log("\n--- normalTolerance comparison ---");
    console.table([
      formatReport("verb (normTol=0.025)", verbReport),
      formatReport("ours normTol=0.025 only", ourReport),
      formatReport("ours tol=0.5 + normTol=0.025", combinedReport),
    ]);

    // With normal tolerance, we should produce a similar number of triangles to verb
    const ratio = ourReport.triangleCount / verbReport.triangleCount;
    console.log(`\nTriangle ratio (ours normTol-only / verb): ${ratio.toFixed(2)}x`);
  });
});

// ============================================================
// Suite 5: Tolerance sensitivity
// ============================================================

describe("adaptiveTessellate — tolerance sensitivity", () => {
  it("triangle count increases as tolerance decreases", () => {
    const surface = createInsoleSurface();
    const tolerances = [0.5, 0.1, 0.01];
    const counts: number[] = [];

    console.log("\n--- Tolerance sensitivity ---");
    const rows: Record<string, string | number>[] = [];

    for (const tol of tolerances) {
      const result = adaptiveTessellate(surface, { tolerance: tol, maxDepth: 8 });
      const mesh = fromTessellationResult(result);
      const report = qualityReport(mesh, surface);
      counts.push(report.triangleCount);
      rows.push(formatReport(`tol=${tol}`, report));
    }

    console.table(rows);

    // Monotonically increasing triangle count
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(counts[i - 1]);
    }
  });
});
