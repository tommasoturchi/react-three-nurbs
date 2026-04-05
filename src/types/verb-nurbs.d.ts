declare module "verb-nurbs" {
  namespace verb {
    namespace geom {
      class NurbsCurve {
        static byKnotsControlPointsWeights(
          degree: number,
          knots: number[],
          controlPoints: number[][],
          weights: number[]
        ): NurbsCurve;
        static byPoints(points: number[][], degree: number): NurbsCurve;

        point(t: number): number[];
        tangent(t: number): number[];
        derivatives(t: number, numDerivs: number): number[][];
        closestParam(point: number[]): number;
        closestPoint(point: number[]): number[];
        length(): number;
        lengthAtParam(u: number): number;
        paramAtLength(len: number, tolerance?: number): number;
        split(t: number): NurbsCurve[];
        reverse(): NurbsCurve;
        transform(matrix: number[][]): NurbsCurve;
        domain(): { min: number; max: number };
        knots(): number[];
        controlPoints(): number[][];
        weights(): number[];
        degree(): number;
        clone(): NurbsCurve;
        tessellate(tolerance?: number): number[][];
        divideByEqualArcLength(divisions: number): Array<{ u: number; pt: number[] }>;
        divideByArcLength(arcLength: number): Array<{ u: number; pt: number[] }>;
      }

      class NurbsSurface {
        static byKnotsControlPointsWeights(
          degreeU: number,
          degreeV: number,
          knotsU: number[],
          knotsV: number[],
          controlPoints: number[][][],
          weights: number[][]
        ): NurbsSurface;
        static byLoftingCurves(
          curves: NurbsCurve[],
          degreeV: number
        ): NurbsSurface;
        static byCorners(
          p0: number[],
          p1: number[],
          p2: number[],
          p3: number[]
        ): NurbsSurface;

        point(u: number, v: number): number[];
        normal(u: number, v: number): number[];
        derivatives(u: number, v: number, numDerivs: number): number[][][];
        closestParam(point: number[]): number[];
        closestPoint(point: number[]): number[];
        isocurve(param: number, useV: boolean): NurbsCurve;
        boundaries(): NurbsCurve[];
        tessellate(options?: Record<string, unknown>): {
          faces: number[][];
          normals: number[][];
          points: number[][];
        };
        split(u: number, useV: boolean): NurbsSurface[];
        reverse(useV: boolean): NurbsSurface;
        transform(matrix: number[][]): NurbsSurface;
        domainU(): { min: number; max: number };
        domainV(): { min: number; max: number };
        degreeU(): number;
        degreeV(): number;
        knotsU(): number[];
        knotsV(): number[];
        controlPoints(): number[][][];
        weights(): number[][];
        clone(): NurbsSurface;
      }

      class RevolvedSurface extends NurbsSurface {
        constructor(
          profile: NurbsCurve,
          center: [number, number, number],
          axis: [number, number, number],
          angle: number
        );
        profile(): NurbsCurve;
        center(): number[];
        axis(): number[];
        angle(): number;
      }

      class ExtrudedSurface extends NurbsSurface {
        constructor(profile: NurbsCurve, direction: number[]);
        profile(): NurbsCurve;
        direction(): number[];
      }

      class SweptSurface extends NurbsSurface {
        constructor(profile: NurbsCurve, rail: NurbsCurve);
        profile(): NurbsCurve;
        rail(): NurbsCurve;
      }

      class SphericalSurface extends NurbsSurface {
        constructor(
          center: number[],
          axis: number[],
          xaxis: number[],
          radius: number
        );
      }

      class CylindricalSurface extends NurbsSurface {
        constructor(
          axis: number[],
          xaxis: number[],
          base: number[],
          height: number,
          radius: number
        );
      }

      class ConicalSurface extends NurbsSurface {
        constructor(
          axis: number[],
          xaxis: number[],
          base: number[],
          height: number,
          radius: number
        );
      }

      class Arc extends NurbsCurve {
        constructor(
          center: number[],
          xaxis: number[],
          yaxis: number[],
          radius: number,
          minAngle: number,
          maxAngle: number
        );
      }

      class Circle extends NurbsCurve {
        constructor(
          center: number[],
          xaxis: number[],
          yaxis: number[],
          radius: number
        );
      }

      class EllipseArc extends NurbsCurve {
        constructor(
          center: number[],
          xaxis: number[],
          yaxis: number[],
          minAngle: number,
          maxAngle: number
        );
      }

      class Ellipse extends NurbsCurve {
        constructor(
          center: number[],
          xaxis: number[],
          yaxis: number[]
        );
      }
    }

    namespace eval {
      namespace Intersect {
        function surfaces(
          surface0: geom.NurbsSurface,
          surface1: geom.NurbsSurface,
          tolerance?: number
        ): Array<{
          points: number[][];
          uvs1: number[][];
          uvs2: number[][];
        }>;

        function curveAndSurface(
          curve: geom.NurbsCurve,
          surface: geom.NurbsSurface,
          tolerance?: number
        ): Array<{
          curveParameter: number;
          surfaceParameter: number[];
          point: number[];
        }>;

        function curves(
          curve1: geom.NurbsCurve,
          curve2: geom.NurbsCurve,
          tolerance?: number
        ): Array<{
          point0: number[];
          point1: number[];
          u0: number;
          u1: number;
        }>;
      }

      namespace Make {
        function rationalInterpCurve(
          points: number[][],
          degree: number,
          closed?: boolean
        ): geom.NurbsCurve;

        function arc(
          center: number[],
          xaxis: number[],
          yaxis: number[],
          radius: number,
          startAngle: number,
          endAngle: number
        ): { degree: number; knots: number[]; controlPoints: number[][]; weights: number[] };

        function ellipseArc(
          center: number[],
          xaxis: number[],
          yaxis: number[],
          startAngle: number,
          endAngle: number
        ): { degree: number; knots: number[]; controlPoints: number[][]; weights: number[] };

        function surfaceIsocurve(
          surface: geom.NurbsSurface,
          param: number,
          useV: boolean
        ): geom.NurbsCurve;

        function surfaceBoundaryCurves(
          surface: geom.NurbsSurface
        ): geom.NurbsCurve[];
      }

      namespace Modify {
        function curveKnotRefine(
          curve: { degree: number; knots: number[]; controlPoints: number[][]; weights: number[] },
          knotsToInsert: number[]
        ): { degree: number; knots: number[]; controlPoints: number[][]; weights: number[] };

        function surfaceKnotRefine(
          surface: { degreeU: number; degreeV: number; knotsU: number[]; knotsV: number[]; controlPoints: number[][][]; weights: number[][] },
          knotsToInsert: number[],
          useV: boolean
        ): { degreeU: number; degreeV: number; knotsU: number[]; knotsV: number[]; controlPoints: number[][][]; weights: number[][] };

        function curveElevateDegree(
          curve: { degree: number; knots: number[]; controlPoints: number[][]; weights: number[] },
          finalDegree: number
        ): { degree: number; knots: number[]; controlPoints: number[][]; weights: number[] };

        function unifyCurveKnotVectors(
          curves: Array<{ degree: number; knots: number[]; controlPoints: number[][]; weights: number[] }>
        ): Array<{ degree: number; knots: number[]; controlPoints: number[][]; weights: number[] }>;
      }
    }
  }

  const verb: typeof verb;
  export default verb;
}
