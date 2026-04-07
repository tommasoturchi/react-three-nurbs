import { useMemo } from "react";
import { NurbsSolid } from "../core";
import type { SolidData, FaceData } from "../core";

export type SolidPrimitive =
  | { type: "box"; dx: number; dy: number; dz: number; origin?: [number, number, number] }
  | { type: "cylinder"; radius: number; height: number; axis?: [number, number, number]; origin?: [number, number, number] }
  | { type: "sphere"; radius: number; center?: [number, number, number] }
  | { type: "custom"; faces: FaceData[] };

export interface UseNurbsSolidOptions {
  primitive: SolidPrimitive;
}

export interface UseNurbsSolidResult {
  solid: NurbsSolid | null;
  data: SolidData | null;
  faces: FaceData[];
}

export function useNurbsSolid({
  primitive,
}: UseNurbsSolidOptions): UseNurbsSolidResult {
  const solid = useMemo(() => {
    try {
      switch (primitive.type) {
        case "box":
          return NurbsSolid.makeBox(
            primitive.dx, primitive.dy, primitive.dz,
            primitive.origin
          );
        case "cylinder":
          return NurbsSolid.makeCylinder(
            primitive.radius, primitive.height,
            primitive.axis, primitive.origin
          );
        case "sphere":
          return NurbsSolid.makeSphere(
            primitive.radius, primitive.center
          );
        case "custom":
          return NurbsSolid.fromFaces(primitive.faces);
        default:
          return null;
      }
    } catch (error) {
      console.error("useNurbsSolid: Error creating solid:", error);
      return null;
    }
  }, [primitive]);

  return {
    solid,
    data: solid?.asData() ?? null,
    faces: solid?.faces() ?? [],
  };
}
