/**
 * Surface-surface intersection using marching squares on sampled grids.
 */

import { NurbsSurface } from "./surface";

export interface IntersectionResult {
  points: number[][];
}

/**
 * Compute intersection curves between two surfaces.
 * Samples surface0 on a grid, evaluates distance to surface1, finds zero-crossings.
 */
export function intersectSurfaces(
  s0: NurbsSurface,
  s1: NurbsSurface,
  tolerance = 1e-3,
  resolution = 40
): IntersectionResult[] {
  // Sample s0 on a grid, at each point find closest point on s1 and compute signed distance
  const n = resolution;
  const distGrid: number[][] = [];
  const ptGrid: number[][][] = [];

  for (let i = 0; i <= n; i++) {
    distGrid[i] = [];
    ptGrid[i] = [];
    for (let j = 0; j <= n; j++) {
      const u = i / n;
      const v = j / n;
      const pt0 = s0.point(u, v);
      const uv1 = s1.closestParam(pt0);
      const pt1 = s1.point(uv1[0], uv1[1]);

      // Signed distance: use s0's normal direction
      const normal0 = s0.normal(u, v);
      const nLen = Math.sqrt(normal0[0] ** 2 + normal0[1] ** 2 + normal0[2] ** 2);

      const diff = [pt0[0] - pt1[0], pt0[1] - pt1[1], pt0[2] - pt1[2]];
      const dist = Math.sqrt(diff[0] ** 2 + diff[1] ** 2 + diff[2] ** 2);

      let signedDist = dist;
      if (nLen > 1e-14) {
        const dot = (diff[0] * normal0[0] + diff[1] * normal0[1] + diff[2] * normal0[2]) / nLen;
        signedDist = dot;
      }

      distGrid[i][j] = signedDist;
      ptGrid[i][j] = pt0;
    }
  }

  // Marching squares: find contour where distGrid ≈ 0
  const contourPoints: number[][] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const corners = [
        { d: distGrid[i][j], pt: ptGrid[i][j] },
        { d: distGrid[i + 1][j], pt: ptGrid[i + 1][j] },
        { d: distGrid[i + 1][j + 1], pt: ptGrid[i + 1][j + 1] },
        { d: distGrid[i][j + 1], pt: ptGrid[i][j + 1] },
      ];

      for (let e = 0; e < 4; e++) {
        const a = corners[e];
        const b = corners[(e + 1) % 4];
        if ((a.d >= 0) !== (b.d >= 0)) {
          const t = a.d / (a.d - b.d);
          contourPoints.push([
            a.pt[0] + t * (b.pt[0] - a.pt[0]),
            a.pt[1] + t * (b.pt[1] - a.pt[1]),
            a.pt[2] + t * (b.pt[2] - a.pt[2]),
          ]);
        }
      }
    }
  }

  if (contourPoints.length < 2) return [];

  // Sort into connected curves by proximity
  const curves = sortIntoChains(contourPoints, tolerance * 10);

  return curves.map(chain => ({ points: chain }));
}

function sortIntoChains(points: number[][], maxGap: number): number[][][] {
  if (points.length === 0) return [];

  const used = new Set<number>();
  const chains: number[][][] = [];

  while (used.size < points.length) {
    // Find an unused starting point
    let startIdx = -1;
    for (let i = 0; i < points.length; i++) {
      if (!used.has(i)) { startIdx = i; break; }
    }
    if (startIdx === -1) break;

    const chain: number[][] = [points[startIdx]];
    used.add(startIdx);

    // Grow the chain by finding nearest unused neighbor
    let growing = true;
    while (growing) {
      growing = false;
      const last = chain[chain.length - 1];
      let bestIdx = -1;
      let bestDist = maxGap * maxGap;

      for (let i = 0; i < points.length; i++) {
        if (used.has(i)) continue;
        const dx = points[i][0] - last[0];
        const dy = points[i][1] - last[1];
        const dz = points[i][2] - last[2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < bestDist) {
          bestDist = d2;
          bestIdx = i;
        }
      }

      if (bestIdx >= 0) {
        chain.push(points[bestIdx]);
        used.add(bestIdx);
        growing = true;
      }
    }

    if (chain.length >= 2) {
      chains.push(chain);
    }
  }

  return chains;
}
