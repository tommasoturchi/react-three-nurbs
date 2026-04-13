import { useState, useEffect, useRef } from "react";
import type { BooleanOperation, BooleanMeshResult, ShapeDescriptor } from "../occt/boolean";

export interface UseBooleanOperationOptions {
  shapeA: ShapeDescriptor | null;
  shapeB: ShapeDescriptor | null;
  operation: BooleanOperation;
  meshDeflection?: number;
}

export interface UseBooleanOperationResult {
  mesh: BooleanMeshResult | null;
  isComputing: boolean;
  error: string | null;
}

export function useBooleanOperation({
  shapeA,
  shapeB,
  operation,
  meshDeflection = 0.1,
}: UseBooleanOperationOptions): UseBooleanOperationResult {
  const [mesh, setMesh] = useState<BooleanMeshResult | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(0);

  useEffect(() => {
    if (!shapeA || !shapeB) {
      setMesh(null);
      return;
    }

    const requestId = ++abortRef.current;
    setIsComputing(true);
    setError(null);

    (async () => {
      try {
        const { booleanOperation } = await import("../occt/boolean");
        const result = await booleanOperation(shapeA, shapeB, operation, meshDeflection);

        if (abortRef.current === requestId) {
          setMesh(result);
          setIsComputing(false);
        }
      } catch (err) {
        if (abortRef.current === requestId) {
          setError(err instanceof Error ? err.message : String(err));
          setMesh(null);
          setIsComputing(false);
        }
      }
    })();

    const ref = abortRef;
    return () => { ref.current++; };
  }, [shapeA, shapeB, operation, meshDeflection]);

  return { mesh, isComputing, error };
}
