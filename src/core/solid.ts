/**
 * NURBS solid — a closed volume bounded by oriented NURBS faces.
 */

import type { FaceData, SolidData, CurveData, SurfaceData } from "./types";
import {
  createBoxSolid,
  createCylinderSolid,
  createSphereSolid,
  createRevolvedSurface,
  createExtrudedSurface,
} from "./construct";
import { NurbsSurface } from "./surface";

export class NurbsSolid {
  private _faces: FaceData[];

  constructor(data: SolidData) {
    this._faces = data.faces;
  }

  // --- Construction ---

  static fromFaces(faces: FaceData[]): NurbsSolid {
    return new NurbsSolid({ faces });
  }

  static makeBox(
    dx: number,
    dy: number,
    dz: number,
    origin: [number, number, number] = [0, 0, 0]
  ): NurbsSolid {
    return new NurbsSolid(createBoxSolid(dx, dy, dz, origin));
  }

  static makeCylinder(
    radius: number,
    height: number,
    axis: [number, number, number] = [0, 1, 0],
    origin: [number, number, number] = [0, 0, 0]
  ): NurbsSolid {
    return new NurbsSolid(createCylinderSolid(radius, height, axis, origin));
  }

  static makeSphere(
    radius: number,
    center: [number, number, number] = [0, 0, 0]
  ): NurbsSolid {
    return new NurbsSolid(createSphereSolid(radius, center));
  }

  // --- Curve/Surface → Solid bridges ---

  /**
   * Create a solid by revolving a closed curve profile around an axis.
   * The profile should be a closed loop (or the revolution will close it).
   * Result: 1 revolved surface face.
   */
  static fromRevolution(
    profile: CurveData,
    center: [number, number, number] = [0, 0, 0],
    axis: [number, number, number] = [0, 1, 0],
    angle: number = 2 * Math.PI,
    capped = false
  ): NurbsSolid {
    const surface = createRevolvedSurface(profile, center, axis, angle);
    const faces: FaceData[] = [{ surface, orientation: "forward" }];

    if (capped && angle < 2 * Math.PI - 0.01) {
      const axLen = Math.sqrt(axis[0] ** 2 + axis[1] ** 2 + axis[2] ** 2);
      const nx = axis[0] / axLen, ny = axis[1] / axLen, nz = axis[2] / axLen;

      // Start wall: ruled surface from axis to profile
      const startCap = makeCapFromProfile(profile, center);
      faces.push({ surface: startCap, orientation: "reversed" });

      // End wall: rotate profile, then cap
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const endProfile: CurveData = {
        ...profile,
        controlPoints: profile.controlPoints.map(pt => {
          const dx = pt[0] - center[0], dy = pt[1] - center[1], dz = pt[2] - center[2];
          const dot = dx * nx + dy * ny + dz * nz;
          const rx = dx * cosA + (ny * dz - nz * dy) * sinA + nx * dot * (1 - cosA);
          const ry = dy * cosA + (nz * dx - nx * dz) * sinA + ny * dot * (1 - cosA);
          const rz = dz * cosA + (nx * dy - ny * dx) * sinA + nz * dot * (1 - cosA);
          return [center[0] + rx, center[1] + ry, center[2] + rz];
        }),
      };
      const endCap = makeCapFromProfile(endProfile, center);
      faces.push({ surface: endCap, orientation: "forward" });
    }

    return new NurbsSolid({ faces });
  }

  /**
   * Create a solid by extruding a closed curve profile along a direction.
   * Result: 1 extruded surface (sides) + 2 caps.
   * Caps use a degenerate surface where one edge matches the profile exactly
   * and the opposite edge collapses to the centroid.
   */
  static fromExtrusion(
    profile: CurveData,
    direction: [number, number, number],
    capped = false
  ): NurbsSolid {
    const sideSurface = createExtrudedSurface(profile, direction);
    const faces: FaceData[] = [{ surface: sideSurface, orientation: "forward" }];

    if (capped) {
      // Centroid from control points (weighted average)
      const n = profile.controlPoints.length;
      const wSum = profile.weights.reduce((s, w) => s + w, 0);
      const centroid = [0, 0, 0];
      for (let i = 0; i < n; i++) {
        const w = profile.weights[i] / wSum;
        centroid[0] += profile.controlPoints[i][0] * w;
        centroid[1] += profile.controlPoints[i][1] * w;
        centroid[2] += profile.controlPoints[i][2] * w;
      }

      const bottomCap = makeCapFromProfile(profile, centroid);
      faces.push({ surface: bottomCap, orientation: "reversed" });

      const topCenter = [
        centroid[0] + direction[0],
        centroid[1] + direction[1],
        centroid[2] + direction[2],
      ];
      const topProfile: CurveData = {
        ...profile,
        controlPoints: profile.controlPoints.map(pt => [
          pt[0] + direction[0],
          pt[1] + direction[1],
          pt[2] + direction[2],
        ]),
      };
      const topCap = makeCapFromProfile(topProfile, topCenter);
      faces.push({ surface: topCap, orientation: "forward" });
    }

    return new NurbsSolid({ faces });
  }

  /**
   * Create a solid by thickening a surface.
   * Offsets the surface by `thickness` along its normal direction,
   * creating two faces (original + offset) connected by side surfaces.
   * Simplified version: returns original + offset face only.
   */
  static fromSurface(
    surface: SurfaceData,
    thickness: number
  ): NurbsSolid {
    // Create offset surface by shifting control points along approximate normals
    const surf = new NurbsSurface(surface);

    const offsetCP = surface.controlPoints.map((row, i) =>
      row.map((pt, j) => {
        const u = i / (surface.controlPoints.length - 1);
        const v = j / (row.length - 1);
        try {
          const n = surf.normal(u, v);
          const len = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
          if (len > 0) {
            return [
              pt[0] + (n[0] / len) * thickness,
              pt[1] + (n[1] / len) * thickness,
              pt[2] + (n[2] / len) * thickness,
            ];
          }
        } catch {
          // fallback
        }
        return [pt[0], pt[1] + thickness, pt[2]];
      })
    );

    const offsetSurface: SurfaceData = {
      ...surface,
      controlPoints: offsetCP,
    };

    // Build 4 side walls connecting the original and offset surface edges.
    // Each side wall is a ruled (degree 1) surface between matching boundary rows/columns.
    const nU = surface.controlPoints.length;
    const nV = surface.controlPoints[0].length;
    const sideWalls: FaceData[] = [];

    // Bottom edge (u varies, v=0): original row 0 → offset row 0
    const bottomOriginal = surface.controlPoints.map(row => row[0]);
    const bottomOffset = offsetCP.map(row => row[0]);
    sideWalls.push({
      surface: makeRuledSurface(bottomOriginal, bottomOffset, surface.degreeU, surface.knotsU),
      orientation: "forward",
    });

    // Top edge (u varies, v=1): original last col → offset last col
    const topOriginal = surface.controlPoints.map(row => row[nV - 1]);
    const topOffset = offsetCP.map(row => row[nV - 1]);
    sideWalls.push({
      surface: makeRuledSurface(topOriginal, topOffset, surface.degreeU, surface.knotsU),
      orientation: "reversed",
    });

    // Left edge (v varies, u=0): original col 0 → offset col 0
    const leftOriginal = surface.controlPoints[0];
    const leftOffset = offsetCP[0];
    sideWalls.push({
      surface: makeRuledSurface(leftOriginal, leftOffset, surface.degreeV, surface.knotsV),
      orientation: "reversed",
    });

    // Right edge (v varies, u=1): original last row → offset last row
    const rightOriginal = surface.controlPoints[nU - 1];
    const rightOffset = offsetCP[nU - 1];
    sideWalls.push({
      surface: makeRuledSurface(rightOriginal, rightOffset, surface.degreeV, surface.knotsV),
      orientation: "forward",
    });

    return new NurbsSolid({
      faces: [
        { surface, orientation: "forward" },
        { surface: offsetSurface, orientation: "reversed" },
        ...sideWalls,
      ],
    });
  }

  /**
   * Create a solid face from a surface (wraps it as a FaceData).
   * Useful for composing solids from individual surfaces.
   */
  static faceFromSurface(
    surface: SurfaceData,
    orientation: "forward" | "reversed" = "forward",
    trimCurves?: CurveData[]
  ): FaceData {
    return {
      surface,
      outerWire: trimCurves,
      orientation,
    };
  }

  // --- Accessors ---

  faces(): FaceData[] {
    return this._faces;
  }

  numFaces(): number {
    return this._faces.length;
  }

  asData(): SolidData {
    return {
      faces: this._faces.map((f) => ({
        surface: {
          degreeU: f.surface.degreeU,
          degreeV: f.surface.degreeV,
          knotsU: [...f.surface.knotsU],
          knotsV: [...f.surface.knotsV],
          controlPoints: f.surface.controlPoints.map((row) =>
            row.map((pt) => [...pt])
          ),
          weights: f.surface.weights.map((row) => [...row]),
        },
        outerWire: f.outerWire?.map((c) => ({
          degree: c.degree,
          knots: [...c.knots],
          controlPoints: c.controlPoints.map((pt) => [...pt]),
          weights: [...c.weights],
        })),
        holes: f.holes?.map((loop) =>
          loop.map((c) => ({
            degree: c.degree,
            knots: [...c.knots],
            controlPoints: c.controlPoints.map((pt) => [...pt]),
            weights: [...c.weights],
          }))
        ),
        orientation: f.orientation,
      })),
    };
  }

  clone(): NurbsSolid {
    return new NurbsSolid(this.asData());
  }
}

/**
 * Create a cap surface that exactly matches a curve profile on one edge
 * and collapses to a center point on the other.
 *
 * The key: use the SAME degree, knots, and weights as the profile curve
 * in the U direction. In V direction, it's degree 1 (linear) from center to rim.
 * This guarantees the V=1 edge of the surface IS the profile curve.
 */
function makeCapFromProfile(
  profile: CurveData,
  center: number[]
): SurfaceData {
  return {
    degreeU: profile.degree,
    degreeV: 1,
    knotsU: [...profile.knots],
    knotsV: [0, 0, 1, 1],
    // Each row has 2 points: [center, profileControlPoint]
    // At V=0 all points collapse to center, at V=1 they trace the profile
    controlPoints: profile.controlPoints.map(pt => [[...center], [...pt]]),
    // Weights match the profile in U, uniform in V
    weights: profile.weights.map(w => [1, w]),
  };
}

/**
 * Create a ruled (degree 1 in V) surface between two rows of points.
 * Used for side walls when thickening a surface.
 */
function makeRuledSurface(
  row0: number[][],
  row1: number[][],
  degreeU: number,
  knotsU: number[]
): SurfaceData {
  return {
    degreeU,
    degreeV: 1,
    knotsU: [...knotsU],
    knotsV: [0, 0, 1, 1],
    controlPoints: row0.map((pt, i) => [pt, row1[i]]),
    weights: row0.map(() => [1, 1]),
  };
}
