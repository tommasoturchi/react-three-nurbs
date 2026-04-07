/**
 * Geometric construction: circles, arcs, revolved/extruded/swept surfaces.
 * Implements algorithms from "The NURBS Book" Chapters 7-8.
 */

import type { CurveData, SurfaceData, FaceData, SolidData } from "./types";

// --- Vector helpers ---

function vecAdd(a: number[], b: number[]): number[] {
  return a.map((v, i) => v + b[i]);
}

function vecSub(a: number[], b: number[]): number[] {
  return a.map((v, i) => v - b[i]);
}

function vecScale(a: number[], s: number): number[] {
  return a.map(v => v * s);
}

function vecDot(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function vecCross(a: number[], b: number[]): number[] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function vecNormalize(a: number[]): number[] {
  const len = Math.sqrt(vecDot(a, a));
  return len > 0 ? vecScale(a, 1 / len) : a;
}

function vecLength(a: number[]): number {
  return Math.sqrt(vecDot(a, a));
}

// --- Circle / Arc (Chapter 7) ---

/**
 * Create a NURBS arc (rational quadratic Bézier segments).
 * Algorithm: split arc into segments of ≤90°, each a rational quadratic
 * with weight = cos(halfAngle).
 */
export function createArc(
  center: number[],
  xaxis: number[],
  yaxis: number[],
  radius: number,
  startAngle: number,
  endAngle: number
): CurveData {
  const X = vecNormalize(xaxis);
  const Y = vecNormalize(yaxis);

  let theta = endAngle - startAngle;
  if (theta < 0) theta += 2 * Math.PI;

  // Number of arc segments (each ≤ 90°)
  let narcs: number;
  if (theta <= Math.PI / 2) narcs = 1;
  else if (theta <= Math.PI) narcs = 2;
  else if (theta <= 3 * Math.PI / 2) narcs = 3;
  else narcs = 4;

  const dtheta = theta / narcs;
  const w1 = Math.cos(dtheta / 2);

  // Starting point
  let P0 = vecAdd(center, vecAdd(vecScale(X, radius * Math.cos(startAngle)), vecScale(Y, radius * Math.sin(startAngle))));
  let T0 = vecAdd(vecScale(X, -Math.sin(startAngle)), vecScale(Y, Math.cos(startAngle)));

  const controlPoints: number[][] = [P0];
  const weights: number[] = [1];

  let angle = startAngle;
  for (let i = 0; i < narcs; i++) {
    angle += dtheta;
    const P2 = vecAdd(center, vecAdd(vecScale(X, radius * Math.cos(angle)), vecScale(Y, radius * Math.sin(angle))));
    const T2 = vecAdd(vecScale(X, -Math.sin(angle)), vecScale(Y, Math.cos(angle)));

    // Intersect tangent lines to find P1
    // P1 = P0 + a*T0 = P2 + b*T2
    // Solve for a using the intersection
    const dP = vecSub(P2, P0);
    const denom = T0[0] * T2[1] - T0[1] * T2[0];
    let a: number;
    if (Math.abs(denom) > 1e-14) {
      a = (dP[0] * T2[1] - dP[1] * T2[0]) / denom;
    } else {
      // Fallback for parallel tangents (180° arc)
      const denom2 = T0[0] * T2[2] - T0[2] * T2[0];
      if (Math.abs(denom2) > 1e-14) {
        a = (dP[0] * T2[2] - dP[2] * T2[0]) / denom2;
      } else {
        a = (dP[1] * T2[2] - dP[2] * T2[1]) / (T0[1] * T2[2] - T0[2] * T2[1]);
      }
    }
    const P1 = vecAdd(P0, vecScale(T0, a));

    controlPoints.push(P1, P2);
    weights.push(w1, 1);

    P0 = P2;
    T0 = T2;
  }

  // Build knot vector for degree 2
  const knots: number[] = [];
  // Clamped at start
  knots.push(0, 0, 0);
  // Interior knots
  for (let i = 1; i < narcs; i++) {
    const knotVal = i / narcs;
    knots.push(knotVal, knotVal);
  }
  // Clamped at end
  knots.push(1, 1, 1);

  return { degree: 2, knots, controlPoints, weights };
}

/**
 * Create a full NURBS circle.
 */
export function createCircle(
  center: number[],
  xaxis: number[],
  yaxis: number[],
  radius: number
): CurveData {
  return createArc(center, xaxis, yaxis, radius, 0, 2 * Math.PI);
}

/**
 * Create a NURBS elliptical arc.
 * xaxis and yaxis define the semi-axes (their lengths are the radii).
 */
export function createEllipseArc(
  center: number[],
  xaxis: number[],
  yaxis: number[],
  startAngle: number,
  endAngle: number
): CurveData {
  const rx = vecLength(xaxis);
  const ry = vecLength(yaxis);
  const X = vecNormalize(xaxis);
  const Y = vecNormalize(yaxis);

  let theta = endAngle - startAngle;
  if (theta < 0) theta += 2 * Math.PI;

  let narcs: number;
  if (theta <= Math.PI / 2) narcs = 1;
  else if (theta <= Math.PI) narcs = 2;
  else if (theta <= 3 * Math.PI / 2) narcs = 3;
  else narcs = 4;

  const dtheta = theta / narcs;
  const w1 = Math.cos(dtheta / 2);

  let P0 = vecAdd(center, vecAdd(vecScale(X, rx * Math.cos(startAngle)), vecScale(Y, ry * Math.sin(startAngle))));
  let T0 = vecAdd(vecScale(X, -rx * Math.sin(startAngle)), vecScale(Y, ry * Math.cos(startAngle)));

  const controlPoints: number[][] = [P0];
  const weights: number[] = [1];

  let angle = startAngle;
  for (let i = 0; i < narcs; i++) {
    angle += dtheta;
    const P2 = vecAdd(center, vecAdd(vecScale(X, rx * Math.cos(angle)), vecScale(Y, ry * Math.sin(angle))));
    const T2 = vecAdd(vecScale(X, -rx * Math.sin(angle)), vecScale(Y, ry * Math.cos(angle)));

    const dP = vecSub(P2, P0);
    const denom = T0[0] * T2[1] - T0[1] * T2[0];
    let a: number;
    if (Math.abs(denom) > 1e-14) {
      a = (dP[0] * T2[1] - dP[1] * T2[0]) / denom;
    } else {
      const denom2 = T0[0] * T2[2] - T0[2] * T2[0];
      if (Math.abs(denom2) > 1e-14) {
        a = (dP[0] * T2[2] - dP[2] * T2[0]) / denom2;
      } else {
        a = (dP[1] * T2[2] - dP[2] * T2[1]) / (T0[1] * T2[2] - T0[2] * T2[1]);
      }
    }
    const P1 = vecAdd(P0, vecScale(T0, a));

    controlPoints.push(P1, P2);
    weights.push(w1, 1);

    P0 = P2;
    T0 = T2;
  }

  const knots: number[] = [];
  knots.push(0, 0, 0);
  for (let i = 1; i < narcs; i++) {
    const knotVal = i / narcs;
    knots.push(knotVal, knotVal);
  }
  knots.push(1, 1, 1);

  return { degree: 2, knots, controlPoints, weights };
}

/**
 * Create a full NURBS ellipse.
 */
export function createEllipse(
  center: number[],
  xaxis: number[],
  yaxis: number[]
): CurveData {
  return createEllipseArc(center, xaxis, yaxis, 0, 2 * Math.PI);
}

/**
 * Create a cylindrical surface.
 */
export function createCylindricalSurface(
  axis: number[],
  xaxis: number[],
  base: number[],
  height: number,
  radius: number
): SurfaceData {
  const axisNorm = vecNormalize(axis);
  const xNorm = vecNormalize(xaxis);
  const yNorm = vecCross(axisNorm, xNorm);

  // Circle at base, extruded along axis
  const bottomCircle = createArc(base, xNorm, yNorm, radius, 0, 2 * Math.PI);

  // Extrude along axis
  const direction = vecScale(axisNorm, height);
  return createExtrudedSurface(bottomCircle, direction);
}

// --- Extruded Surface ---

/**
 * Create an extruded surface by translating a profile curve along a direction.
 * Degree 1 in the extrusion direction.
 */
export function createExtrudedSurface(
  profile: CurveData,
  direction: number[]
): SurfaceData {
  const cp0 = profile.controlPoints;
  const cp1 = cp0.map(pt => vecAdd(pt, direction));

  return {
    degreeU: profile.degree,
    degreeV: 1,
    knotsU: [...profile.knots],
    knotsV: [0, 0, 1, 1],
    controlPoints: cp0.map((pt, i) => [pt, cp1[i]]),
    weights: profile.weights.map(w => [w, w]),
  };
}

// --- Revolved Surface (Algorithm A8.1) ---

/**
 * Create a surface of revolution by rotating a profile curve around an axis.
 */
export function createRevolvedSurface(
  profile: CurveData,
  center: number[],
  axis: number[],
  angle: number
): SurfaceData {
  // Create the circular arc data for the revolution
  const axisNorm = vecNormalize(axis);

  // For each profile control point, create a circular arc
  const arcData = createArc(
    [0, 0, 0], [1, 0, 0], [0, 1, 0], 1, 0, angle
  );
  const numArcPts = arcData.controlPoints.length;

  // Build surface control points
  const surfCP: number[][][] = [];
  const surfW: number[][] = [];

  for (let j = 0; j < profile.controlPoints.length; j++) {
    const P = profile.controlPoints[j];
    const wProf = profile.weights[j];

    // Project P onto axis to find the rotation center for this point
    const OP = vecSub(P, center);
    const proj = vecDot(OP, axisNorm);
    const onAxis = vecAdd(center, vecScale(axisNorm, proj));
    const radVec = vecSub(P, onAxis);
    const radius = vecLength(radVec);

    if (radius < 1e-14) {
      // Point is on the axis — all arc points are the same
      surfCP[j] = [];
      surfW[j] = [];
      for (let i = 0; i < numArcPts; i++) {
        surfCP[j][i] = [...P];
        surfW[j][i] = wProf * arcData.weights[i];
      }
      continue;
    }

    // Local coordinate frame for the arc
    const X = vecScale(radVec, 1 / radius);
    const Y = vecCross(axisNorm, X);

    // Create arc control points for this profile point
    const localArc = createArc(onAxis, X, Y, radius, 0, angle);

    surfCP[j] = [];
    surfW[j] = [];
    for (let i = 0; i < localArc.controlPoints.length; i++) {
      surfCP[j][i] = localArc.controlPoints[i];
      surfW[j][i] = wProf * localArc.weights[i];
    }
  }

  // Transpose: surface is [arc_direction][profile_direction]
  // but we built it as [profile][arc], need to transpose for U=arc, V=profile convention
  const cpT: number[][][] = [];
  const wT: number[][] = [];
  for (let i = 0; i < numArcPts; i++) {
    cpT[i] = [];
    wT[i] = [];
    for (let j = 0; j < profile.controlPoints.length; j++) {
      cpT[i][j] = surfCP[j][i];
      wT[i][j] = surfW[j][i];
    }
  }

  return {
    degreeU: 2, // arc degree
    degreeV: profile.degree,
    knotsU: arcData.knots,
    knotsV: [...profile.knots],
    controlPoints: cpT,
    weights: wT,
  };
}

// --- Swept Surface (translational) ---

/**
 * Create a swept surface by translating a profile along a rail.
 * Simple translational sweep: at each rail point, place the profile.
 */
export function createSweptSurface(
  profile: CurveData,
  rail: CurveData
): SurfaceData {
  const numProf = profile.controlPoints.length;
  const numRail = rail.controlPoints.length;
  const origin = rail.controlPoints[0];

  const cp: number[][][] = [];
  const w: number[][] = [];

  for (let i = 0; i < numRail; i++) {
    cp[i] = [];
    w[i] = [];
    const offset = vecSub(rail.controlPoints[i], origin);
    for (let j = 0; j < numProf; j++) {
      cp[i][j] = vecAdd(profile.controlPoints[j], offset);
      w[i][j] = rail.weights[i] * profile.weights[j];
    }
  }

  return {
    degreeU: rail.degree,
    degreeV: profile.degree,
    knotsU: [...rail.knots],
    knotsV: [...profile.knots],
    controlPoints: cp,
    weights: w,
  };
}

// --- Solid Primitives ---

/**
 * Helper: create a planar (degree 1) surface from 4 corner points.
 */
function createPlanarFace(
  p00: number[], p10: number[], p11: number[], p01: number[],
  orientation: "forward" | "reversed" = "forward"
): FaceData {
  return {
    surface: {
      degreeU: 1,
      degreeV: 1,
      knotsU: [0, 0, 1, 1],
      knotsV: [0, 0, 1, 1],
      controlPoints: [[p00, p01], [p10, p11]],
      weights: [[1, 1], [1, 1]],
    },
    orientation,
  };
}

/**
 * Create a box solid with 6 planar faces.
 */
export function createBoxSolid(
  dx: number,
  dy: number,
  dz: number,
  origin: [number, number, number] = [0, 0, 0]
): SolidData {
  const [ox, oy, oz] = origin;
  // 8 corner points
  const p000 = [ox, oy, oz];
  const p100 = [ox + dx, oy, oz];
  const p010 = [ox, oy + dy, oz];
  const p110 = [ox + dx, oy + dy, oz];
  const p001 = [ox, oy, oz + dz];
  const p101 = [ox + dx, oy, oz + dz];
  const p011 = [ox, oy + dy, oz + dz];
  const p111 = [ox + dx, oy + dy, oz + dz];

  return {
    faces: [
      // Bottom (z=0), normal pointing -Z
      createPlanarFace(p000, p100, p110, p010, "reversed"),
      // Top (z=dz), normal pointing +Z
      createPlanarFace(p001, p101, p111, p011, "forward"),
      // Front (y=0), normal pointing -Y
      createPlanarFace(p000, p100, p101, p001, "reversed"),
      // Back (y=dy), normal pointing +Y
      createPlanarFace(p010, p110, p111, p011, "forward"),
      // Left (x=0), normal pointing -X
      createPlanarFace(p000, p010, p011, p001, "forward"),
      // Right (x=dx), normal pointing +X
      createPlanarFace(p100, p110, p111, p101, "reversed"),
    ],
  };
}

/**
 * Create a cylinder solid: 1 cylindrical face + 2 circular disk caps.
 */
export function createCylinderSolid(
  radius: number,
  height: number,
  axis: [number, number, number] = [0, 1, 0],
  origin: [number, number, number] = [0, 0, 0]
): SolidData {
  const axisNorm = vecNormalize(axis);

  // Find perpendicular vectors for local coordinate frame
  const up = Math.abs(axisNorm[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const xaxis = vecNormalize(vecCross(axisNorm, up));
  const yaxis = vecCross(axisNorm, xaxis);

  // Cylindrical surface: circle extruded along axis
  const bottomCircle = createArc(origin, xaxis, yaxis, radius, 0, 2 * Math.PI);
  const direction = vecScale(axisNorm, height);
  const cylSurface = createExtrudedSurface(bottomCircle, direction);

  // Disk caps: revolve a radial line segment around the cylinder axis.
  // A line from center to rim, revolved 360°, produces a perfect circular disk.
  const topCenter = vecAdd(origin, direction);

  // Bottom cap: line from center to rim point along xaxis
  const bottomLine: CurveData = {
    degree: 1,
    knots: [0, 0, 1, 1],
    controlPoints: [
      [...origin],
      vecAdd(origin, vecScale(xaxis, radius)),
    ],
    weights: [1, 1],
  };
  const bottomCapSurface = createRevolvedSurface(
    bottomLine, origin, axisNorm, 2 * Math.PI
  );

  // Top cap: line from center to rim point along xaxis
  const topLine: CurveData = {
    degree: 1,
    knots: [0, 0, 1, 1],
    controlPoints: [
      [...topCenter],
      vecAdd(topCenter, vecScale(xaxis, radius)),
    ],
    weights: [1, 1],
  };
  const topCapSurface = createRevolvedSurface(
    topLine, topCenter, axisNorm, 2 * Math.PI
  );

  return {
    faces: [
      { surface: cylSurface, orientation: "forward" },
      { surface: bottomCapSurface, orientation: "reversed" },
      { surface: topCapSurface, orientation: "forward" },
    ],
  };
}

/**
 * Create a sphere solid: 1 revolved surface.
 */
export function createSphereSolid(
  radius: number,
  center: [number, number, number] = [0, 0, 0]
): SolidData {
  // Semicircle profile in the XY plane:
  // Arc from (radius,0,0) through (0,radius,0) to (-radius,0,0)
  // This profile, when revolved around Y, creates a sphere because:
  // - Each point (x,y,0) has distance |x| from the Y axis → circle of radius |x|
  // - The y coordinate stays fixed → the circles stack vertically
  // Full semicircle from south pole (0,-R,0) through equator (R,0,0) to north pole (0,R,0)
  // Start angle -π/2 (pointing down), end angle π/2 (pointing up)
  const profileData = createArc(
    center,
    [1, 0, 0],    // xaxis
    [0, 1, 0],    // yaxis
    radius,
    -Math.PI / 2, // start at south pole (0, -R, 0)
    Math.PI / 2   // end at north pole (0, R, 0)
  );

  // Revolve around Y axis through the center
  const sphereSurface = createRevolvedSurface(
    profileData,
    center,
    [0, 1, 0],    // Y axis
    2 * Math.PI
  );

  return {
    faces: [
      { surface: sphereSurface, orientation: "forward" },
    ],
  };
}
