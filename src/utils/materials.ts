import { isValidElement } from "react";
import type { ReactElement } from "react";

/**
 * R3F intrinsic element names that correspond to Three.js materials.
 */
const MATERIAL_ELEMENT_NAMES = new Set([
  "meshBasicMaterial",
  "meshStandardMaterial",
  "meshPhongMaterial",
  "meshLambertMaterial",
  "meshToonMaterial",
  "meshNormalMaterial",
  "meshMatcapMaterial",
  "meshDepthMaterial",
  "meshDistanceMaterial",
  "meshPhysicalMaterial",
  "pointsMaterial",
  "lineBasicMaterial",
  "lineDashedMaterial",
  "spriteMaterial",
  "shadowMaterial",
  "rawShaderMaterial",
  "shaderMaterial",
]);

/**
 * Checks whether a React element is a Three.js material.
 * Handles both:
 * - R3F JSX intrinsic elements (e.g. <meshPhongMaterial>) where type is a string
 * - Class-based material components where type has isMaterial on prototype
 */
export function isMaterialElement(child: unknown): child is ReactElement {
  if (!isValidElement(child)) return false;

  // R3F intrinsic elements: type is a string like "meshPhongMaterial"
  if (typeof child.type === "string") {
    return MATERIAL_ELEMENT_NAMES.has(child.type);
  }

  // Class-based Three.js materials
  if (
    child.type &&
    (child.type as any).prototype &&
    "isMaterial" in (child.type as any).prototype
  ) {
    return true;
  }

  return false;
}
