declare module 'verb-nurbs' {
  namespace verb {
    namespace geom {
      class NurbsCurve {
        static byKnotsControlPointsWeights(
          degree: number,
          knots: number[],
          controlPoints: number[][],
          weights: number[]
        ): NurbsCurve;
        point(t: number): number[];
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
        static byLoftingCurves(curves: NurbsCurve[], degreeV: number): NurbsSurface;
        point(u: number, v: number): number[];
      }
      class RevolvedSurface {
        constructor(
          profile: NurbsCurve,
          center: [number, number, number],
          axis: [number, number, number],
          angle: number
        );
        point(u: number, v: number): number[];
      }
    }
  }
  const verb: typeof verb;
  export default verb;
} 