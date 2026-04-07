/**
 * Boolean operations on solids using OpenCASCADE WASM.
 * All operations are async because WASM loading is async.
 */

import { getOC } from "./loader";
import { occtShapeToMesh } from "./convert";

export type BooleanOperation = "union" | "difference" | "intersection";

export type ShapeDescriptor =
  | { type: "box"; dx: number; dy: number; dz: number; origin?: [number, number, number] }
  | { type: "cylinder"; radius: number; height: number; origin?: [number, number, number]; axis?: [number, number, number] }
  | { type: "sphere"; radius: number; center?: [number, number, number] };

export interface BooleanMeshResult {
  vertices: Float32Array;
  indices: Uint32Array;
  normals: Float32Array;
}

/**
 * Build an OCCT shape from a descriptor using native OCCT primitives.
 */
function buildShape(oc: any, desc: ShapeDescriptor): any {
  switch (desc.type) {
    case "box": {
      const [ox, oy, oz] = desc.origin ?? [0, 0, 0];
      const origin = new oc.gp_Pnt_3(ox, oy, oz);
      const shape = new oc.BRepPrimAPI_MakeBox_3(origin, desc.dx, desc.dy, desc.dz).Shape();
      console.log("Built box shape:", shape);
      return shape;
    }
    case "cylinder": {
      const [ox, oy, oz] = desc.origin ?? [0, 0, 0];
      const [ax, ay, az] = desc.axis ?? [0, 0, 1];
      const origin = new oc.gp_Pnt_3(ox, oy, oz);
      const dir = new oc.gp_Dir_4(ax, ay, az);
      const axis = new oc.gp_Ax2_3(origin, dir);
      const shape = new oc.BRepPrimAPI_MakeCylinder_3(axis, desc.radius, desc.height).Shape();
      console.log("Built cylinder shape:", shape);
      return shape;
    }
    case "sphere": {
      const [cx, cy, cz] = desc.center ?? [0, 0, 0];
      const center = new oc.gp_Pnt_3(cx, cy, cz);
      const shape = new oc.BRepPrimAPI_MakeSphere_5(center, desc.radius).Shape();
      console.log("Built sphere shape:", shape);
      return shape;
    }
  }
}

/**
 * Perform a boolean operation between two shape descriptors.
 */
export async function booleanOperation(
  shapeA: ShapeDescriptor,
  shapeB: ShapeDescriptor,
  operation: BooleanOperation,
  meshDeflection = 0.1
): Promise<BooleanMeshResult> {
  console.log("booleanOperation: loading OCCT...");
  const oc = await getOC();
  console.log("booleanOperation: OCCT loaded, building shapes...");

  const a = buildShape(oc, shapeA);
  const b = buildShape(oc, shapeB);

  console.log("booleanOperation: performing", operation, "...");

  let builder: any;
  switch (operation) {
    case "union":
      builder = new oc.BRepAlgoAPI_Fuse_3(a, b, new oc.Message_ProgressRange_1());
      break;
    case "difference":
      builder = new oc.BRepAlgoAPI_Cut_3(a, b, new oc.Message_ProgressRange_1());
      break;
    case "intersection":
      builder = new oc.BRepAlgoAPI_Common_3(a, b, new oc.Message_ProgressRange_1());
      break;
  }

  builder.Build(new oc.Message_ProgressRange_1());

  if (!builder.IsDone()) {
    throw new Error(`Boolean ${operation} failed: IsDone() returned false`);
  }

  const resultShape = builder.Shape();
  console.log("booleanOperation: boolean done, meshing result...");

  const mesh = occtShapeToMesh(oc, resultShape, meshDeflection);
  console.log("booleanOperation: mesh result:", {
    vertices: mesh.vertices.length / 3,
    indices: mesh.indices.length / 3,
    normals: mesh.normals.length / 3,
  });

  return mesh;
}
