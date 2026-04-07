/**
 * Conversion layer between react-three-nurbs data types and OpenCASCADE WASM objects.
 */

import type { SurfaceData, CurveData, FaceData, SolidData } from "../core/types";

type OC = any;

/**
 * Convert our CurveData to an OCCT Geom_BSplineCurve.
 */
export function curveDataToOCCT(oc: OC, curve: CurveData): any {
  const { degree, knots, controlPoints, weights } = curve;
  const numPoles = controlPoints.length;
  const dim = controlPoints[0].length;

  const poles = new oc.TColgp_Array1OfPnt_2(1, numPoles);
  for (let i = 0; i < numPoles; i++) {
    const pt = controlPoints[i];
    poles.SetValue(i + 1, new oc.gp_Pnt_3(pt[0], pt[1], dim >= 3 ? pt[2] : 0));
  }

  const weightsArr = new oc.TColStd_Array1OfReal_2(1, numPoles);
  for (let i = 0; i < numPoles; i++) {
    weightsArr.SetValue(i + 1, weights[i]);
  }

  const { uniqueKnots, multiplicities } = computeKnotMultiplicities(knots);

  const knotsArr = new oc.TColStd_Array1OfReal_2(1, uniqueKnots.length);
  const multsArr = new oc.TColStd_Array1OfInteger_2(1, multiplicities.length);
  for (let i = 0; i < uniqueKnots.length; i++) {
    knotsArr.SetValue(i + 1, uniqueKnots[i]);
    multsArr.SetValue(i + 1, multiplicities[i]);
  }

  return new oc.Geom_BSplineCurve_2(poles, weightsArr, knotsArr, multsArr, degree, false);
}

/**
 * Convert our SurfaceData to an OCCT Geom_BSplineSurface.
 */
export function surfaceDataToOCCT(oc: OC, surface: SurfaceData): any {
  const { degreeU, degreeV, knotsU, knotsV, controlPoints, weights } = surface;
  const numU = controlPoints.length;
  const numV = controlPoints[0].length;

  const poles = new oc.TColgp_Array2OfPnt_2(1, numU, 1, numV);
  for (let i = 0; i < numU; i++) {
    for (let j = 0; j < numV; j++) {
      const pt = controlPoints[i][j];
      poles.SetValue(i + 1, j + 1, new oc.gp_Pnt_3(pt[0], pt[1], pt[2]));
    }
  }

  const weightsArr = new oc.TColStd_Array2OfReal_2(1, numU, 1, numV);
  for (let i = 0; i < numU; i++) {
    for (let j = 0; j < numV; j++) {
      weightsArr.SetValue(i + 1, j + 1, weights[i][j]);
    }
  }

  const { uniqueKnots: uKnots, multiplicities: uMults } = computeKnotMultiplicities(knotsU);
  const knotsUArr = new oc.TColStd_Array1OfReal_2(1, uKnots.length);
  const multsUArr = new oc.TColStd_Array1OfInteger_2(1, uMults.length);
  for (let i = 0; i < uKnots.length; i++) {
    knotsUArr.SetValue(i + 1, uKnots[i]);
    multsUArr.SetValue(i + 1, uMults[i]);
  }

  const { uniqueKnots: vKnots, multiplicities: vMults } = computeKnotMultiplicities(knotsV);
  const knotsVArr = new oc.TColStd_Array1OfReal_2(1, vKnots.length);
  const multsVArr = new oc.TColStd_Array1OfInteger_2(1, vMults.length);
  for (let i = 0; i < vKnots.length; i++) {
    knotsVArr.SetValue(i + 1, vKnots[i]);
    multsVArr.SetValue(i + 1, vMults[i]);
  }

  return new oc.Geom_BSplineSurface_2(
    poles, weightsArr,
    knotsUArr, knotsVArr,
    multsUArr, multsVArr,
    degreeU, degreeV,
    false, false
  );
}

/**
 * Convert a FaceData to an OCCT TopoDS_Face.
 */
export function faceDataToOCCT(oc: OC, face: FaceData): any {
  const geomSurface = surfaceDataToOCCT(oc, face.surface);
  const handleSurface = new oc.Handle_Geom_Surface_2(geomSurface);
  const makeFace = new oc.BRepBuilderAPI_MakeFace_8(handleSurface, 1e-6);
  return makeFace.Face();
}

/**
 * Convert a SolidData to an OCCT TopoDS_Shape by sewing faces.
 */
export function solidToOCCT(oc: OC, solid: SolidData): any {
  const sewing = new oc.BRepBuilderAPI_Sewing_1(1e-6, true, true, true, false);

  for (const face of solid.faces) {
    const occtFace = faceDataToOCCT(oc, face);
    sewing.Add(occtFace);
  }

  sewing.Perform(new oc.Message_ProgressRange_1());
  const sewedShape = sewing.SewedShape();

  const shellExplorer = new oc.TopExp_Explorer_2(sewedShape, oc.TopAbs_ShapeEnum.TopAbs_SHELL, oc.TopAbs_ShapeEnum.TopAbs_SHAPE);
  if (shellExplorer.More()) {
    const shell = oc.TopoDS.Shell_1(shellExplorer.Current());
    const makeSolid = new oc.BRepBuilderAPI_MakeSolid_3(shell);
    if (makeSolid.IsDone()) {
      return makeSolid.Solid();
    }
  }

  return sewedShape;
}

/**
 * Extract tessellated mesh from an OCCT TopoDS_Shape.
 */
export function occtShapeToMesh(
  oc: OC,
  shape: any,
  deflection = 0.1
): { vertices: Float32Array; indices: Uint32Array; normals: Float32Array } {
  // Mesh the shape
  console.log("occtShapeToMesh: meshing with deflection", deflection);
  const mesher = new oc.BRepMesh_IncrementalMesh_2(shape, deflection, false, 0.5, false);
  console.log("occtShapeToMesh: mesher created, IsDone:", mesher.IsDone());

  const vertices: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];
  let indexOffset = 0;
  let faceCount = 0;

  const explorer = new oc.TopExp_Explorer_2(shape, oc.TopAbs_ShapeEnum.TopAbs_FACE, oc.TopAbs_ShapeEnum.TopAbs_SHAPE);
  while (explorer.More()) {
    faceCount++;
    const face = oc.TopoDS.Face_1(explorer.Current());
    const location = new oc.TopLoc_Location_1();

    let handleTriangulation: any = null;
    try {
      handleTriangulation = oc.BRep_Tool.Triangulation(face, location, 0);
    } catch (e1) {
      console.log("occtShapeToMesh: Triangulation(3 args) failed:", e1);
      try {
        handleTriangulation = oc.BRep_Tool.Triangulation(face, location);
      } catch (e2) {
        console.log("occtShapeToMesh: Triangulation(2 args) failed:", e2);
        explorer.Next();
        continue;
      }
    }

    console.log("occtShapeToMesh: face", faceCount, "triangulation:", handleTriangulation, "isNull:", handleTriangulation?.IsNull?.());

    if (handleTriangulation && !handleTriangulation.IsNull()) {
      try {
        const triangulation = handleTriangulation.get();
        const nbNodes = triangulation.NbNodes();
        const nbTriangles = triangulation.NbTriangles();
        console.log("occtShapeToMesh: face", faceCount, "nodes:", nbNodes, "triangles:", nbTriangles);

        for (let i = 1; i <= nbNodes; i++) {
          const node = triangulation.Node(i);
          vertices.push(node.X(), node.Y(), node.Z());
          normals.push(0, 0, 1);
        }

        for (let i = 1; i <= nbTriangles; i++) {
          const triangle = triangulation.Triangle(i);
          const i1 = triangle.Value(1) - 1 + indexOffset;
          const i2 = triangle.Value(2) - 1 + indexOffset;
          const i3 = triangle.Value(3) - 1 + indexOffset;
          indices.push(i1, i2, i3);
        }

        indexOffset += nbNodes;
      } catch (extractErr) {
        console.error("occtShapeToMesh: extraction failed for face", faceCount, extractErr);
      }
    }

    explorer.Next();
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    normals: new Float32Array(normals),
  };
}

// --- Helpers ---

function computeKnotMultiplicities(flatKnots: number[]): {
  uniqueKnots: number[];
  multiplicities: number[];
} {
  const uniqueKnots: number[] = [];
  const multiplicities: number[] = [];

  let i = 0;
  while (i < flatKnots.length) {
    const val = flatKnots[i];
    let mult = 0;
    while (i < flatKnots.length && Math.abs(flatKnots[i] - val) < 1e-14) {
      mult++;
      i++;
    }
    uniqueKnots.push(val);
    multiplicities.push(mult);
  }

  return { uniqueKnots, multiplicities };
}
