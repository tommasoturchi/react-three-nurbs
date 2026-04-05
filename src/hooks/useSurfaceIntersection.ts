import { useMemo } from "react";
import { Vector3 } from "three";
import verb from "verb-nurbs";
import { generateUniformKnots } from "../utils/nurbs";

export interface SurfaceDefinition {
  controlPoints: number[][][];
  weights: number[][];
  degreeU: number;
  degreeV: number;
  knotsU?: number[];
  knotsV?: number[];
}

export interface IntersectionCurve {
  points: Vector3[];
}

export interface UseSurfaceIntersectionOptions {
  surface0: SurfaceDefinition | null;
  surface1: SurfaceDefinition | null;
  tolerance?: number;
}

export interface UseSurfaceIntersectionResult {
  curves: IntersectionCurve[];
}

function buildSurface(def: SurfaceDefinition): verb.geom.NurbsSurface {
  const knotsU = def.knotsU ?? generateUniformKnots(def.controlPoints.length, def.degreeU);
  const knotsV = def.knotsV ?? generateUniformKnots(def.controlPoints[0].length, def.degreeV);
  return verb.geom.NurbsSurface.byKnotsControlPointsWeights(
    def.degreeU,
    def.degreeV,
    knotsU,
    knotsV,
    def.controlPoints,
    def.weights
  );
}

export function useSurfaceIntersection({
  surface0,
  surface1,
  tolerance = 1e-3,
}: UseSurfaceIntersectionOptions): UseSurfaceIntersectionResult {
  const curves = useMemo((): IntersectionCurve[] => {
    if (!surface0 || !surface1) return [];

    try {
      const verbSurface0 = buildSurface(surface0);
      const verbSurface1 = buildSurface(surface1);

      const intersections = verb.eval.Intersect.surfaces(
        verbSurface0,
        verbSurface1,
        tolerance
      );

      return intersections.map((isect) => ({
        points: isect.points.map(
          (pt: number[]) => new Vector3(pt[0], pt[1], pt[2])
        ),
      }));
    } catch (error) {
      console.error("useSurfaceIntersection: Error computing intersection:", error);
      return [];
    }
  }, [surface0, surface1, tolerance]);

  return { curves };
}
