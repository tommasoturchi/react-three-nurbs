import { Vector3 } from "three";
import verb from "verb-nurbs";

export function projectPointToSurface(
  surface: verb.geom.NurbsSurface,
  u: number,
  v: number
): Vector3 {
  const pt = surface.point(u, v);
  return new Vector3(pt[0], pt[1], pt[2]);
}

export function computeNormal(
  surface: verb.geom.NurbsSurface,
  u: number,
  v: number,
  epsilon = 0.0001
): Vector3 {
  const p = surface.point(u, v);
  const pu = surface.point(u + epsilon, v);
  const pv = surface.point(u, v + epsilon);

  const du = new Vector3().subVectors(new Vector3(...pu), new Vector3(...p));
  const dv = new Vector3().subVectors(new Vector3(...pv), new Vector3(...p));

  return new Vector3().crossVectors(du, dv).normalize();
}

export function sampleNurbsCurve2D(
  curve: any,
  numPoints = 100
): [number, number][] {
  return Array.from({ length: numPoints }, (_, i) => {
    const t = i / (numPoints - 1);
    const pt = curve.point(t);
    return [pt[0], pt[1]];
  });
} 