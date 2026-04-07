import { useState, useEffect } from "react";
import type { Meta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from "three";
import { NurbsSolid } from "../core";
import { NurbsSolidComponent } from "../components/NurbsSolidComponent";
import type { BooleanMeshResult, ShapeDescriptor, BooleanOperation } from "../occt/boolean";

const meta = {
  title: "Solids/Boolean Operations",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
  argTypes: {
    operation: {
      control: { type: "select" },
      options: ["union", "difference", "intersection"],
      description: "Boolean operation type",
    },
    wireframe: { control: "boolean", description: "Wireframe rendering" },
    showInputs: { control: "boolean", description: "Show input solids as transparent" },
  },
} satisfies Meta;

export default meta;

/**
 * Standalone mesh renderer — takes pre-computed BooleanMeshResult.
 * No OCCT dependency at render time.
 */
function MeshRenderer({ mesh, wireframe = false }: { mesh: BooleanMeshResult; wireframe?: boolean }) {
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(mesh.vertices, 3));
  geo.setIndex(Array.from(mesh.indices));
  geo.computeVertexNormals();
  geo.computeBoundingSphere();

  return (
    <mesh geometry={geo}>
      <meshPhongMaterial color="#4488ff" wireframe={wireframe} side={DoubleSide} />
    </mesh>
  );
}

function BooleanDemo({
  shapeA,
  shapeB,
  solidA,
  solidB,
  operation = "difference",
  wireframe = false,
  showInputs = true,
}: Record<string, any>) {
  const [mesh, setMesh] = useState<BooleanMeshResult | null>(null);
  const [status, setStatus] = useState("Loading OCCT WASM (~5MB)...");

  useEffect(() => {
    let cancelled = false;
    setStatus("Loading OCCT WASM (~5MB)...");
    setMesh(null);

    (async () => {
      try {
        const { booleanOperation } = await import("../occt/boolean");
        if (cancelled) return;
        setStatus(`Computing ${operation}...`);
        const result = await booleanOperation(shapeA, shapeB, operation as BooleanOperation, 0.1);
        if (cancelled) return;
        if (result.vertices.length === 0) {
          setStatus("Boolean produced empty result");
        } else {
          setMesh(result);
          setStatus("");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus(`Error: ${err instanceof Error ? err.message : err}`);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [shapeA, shapeB, operation]);

  if (status) {
    // Show status as 3D text placeholder
    return (
      <mesh>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshBasicMaterial color="#888888" wireframe />
      </mesh>
    );
  }

  if (!mesh) return null;

  return (
    <>
      {showInputs && solidA && (
        <NurbsSolidComponent solid={solidA} resolutionU={8} resolutionV={8}>
          <meshPhongMaterial color="#ff4444" transparent opacity={0.15} side={DoubleSide} depthWrite={false} />
        </NurbsSolidComponent>
      )}
      {showInputs && solidB && (
        <NurbsSolidComponent solid={solidB} resolutionU={12} resolutionV={8}>
          <meshPhongMaterial color="#44ff44" transparent opacity={0.15} side={DoubleSide} depthWrite={false} />
        </NurbsSolidComponent>
      )}
      <MeshRenderer mesh={mesh} wireframe={wireframe} />
    </>
  );
}

const boxShape: ShapeDescriptor = { type: "box", dx: 2, dy: 2, dz: 2, origin: [-1, -1, -1] };
const cylShape: ShapeDescriptor = { type: "cylinder", radius: 0.6, height: 3, origin: [0, 0, -1.5], axis: [0, 0, 1] };
const sphere1Shape: ShapeDescriptor = { type: "sphere", radius: 1, center: [-0.5, 0, 0] };
const sphere2Shape: ShapeDescriptor = { type: "sphere", radius: 1, center: [0.5, 0, 0] };

const boxSolid = NurbsSolid.makeBox(2, 2, 2, [-1, -1, -1]).asData();
const cylSolid = NurbsSolid.makeCylinder(0.6, 3, [0, 0, 1], [0, 0, -1.5]).asData();
const sphere1Solid = NurbsSolid.makeSphere(1, [-0.5, 0, 0]).asData();
const sphere2Solid = NurbsSolid.makeSphere(1, [0.5, 0, 0]).asData();

export const BoxMinusCylinder = {
  args: { operation: "difference", wireframe: true, showInputs: true },
  render: ({ operation = "difference", wireframe = false, showInputs = true }: Record<string, any>) => (
    <BooleanDemo shapeA={boxShape} shapeB={cylShape} solidA={boxSolid} solidB={cylSolid}
      operation={operation} wireframe={wireframe} showInputs={showInputs} />
  ),
};

export const TwoSpheres = {
  args: { operation: "union", wireframe: true, showInputs: true },
  render: ({ operation = "union", wireframe = false, showInputs = true }: Record<string, any>) => (
    <BooleanDemo shapeA={sphere1Shape} shapeB={sphere2Shape} solidA={sphere1Solid} solidB={sphere2Solid}
      operation={operation} wireframe={wireframe} showInputs={showInputs} />
  ),
};
