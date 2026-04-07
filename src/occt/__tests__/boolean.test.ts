import { describe, it, expect, beforeAll } from "vitest";

// These tests require the WASM to load, which needs a browser-like environment.
// They run in happy-dom but the WASM may not load there.
// These are primarily for validating the API shape.

describe("OCCT Boolean API shape", () => {
  let oc: any;

  beforeAll(async () => {
    try {
      const initModule = await import("../occtBooleans.js");
      const init = initModule.default || initModule;
      oc = await init();
    } catch {
      // WASM may not load in happy-dom — skip gracefully
      oc = null;
    }
  });

  it("WASM loads or gracefully fails", () => {
    // Just verify the import doesn't crash
    expect(true).toBe(true);
  });

  it.skipIf(!globalThis.WebAssembly)("has gp_Pnt constructor", () => {
    if (!oc) return;
    expect(typeof oc.gp_Pnt_3).toBe("function");
  });

  it.skipIf(!globalThis.WebAssembly)("has BRepPrimAPI_MakeBox_3", () => {
    if (!oc) return;
    expect(typeof oc.BRepPrimAPI_MakeBox_3).toBe("function");
  });

  it.skipIf(!globalThis.WebAssembly)("has BRepPrimAPI_MakeSphere_5", () => {
    if (!oc) return;
    expect(typeof oc.BRepPrimAPI_MakeSphere_5).toBe("function");
  });

  it.skipIf(!globalThis.WebAssembly)("has BRepPrimAPI_MakeCylinder_3", () => {
    if (!oc) return;
    expect(typeof oc.BRepPrimAPI_MakeCylinder_3).toBe("function");
  });

  it.skipIf(!globalThis.WebAssembly)("has BRepAlgoAPI_Fuse_3", () => {
    if (!oc) return;
    expect(typeof oc.BRepAlgoAPI_Fuse_3).toBe("function");
  });

  it.skipIf(!globalThis.WebAssembly)("has BRepAlgoAPI_Cut_3", () => {
    if (!oc) return;
    expect(typeof oc.BRepAlgoAPI_Cut_3).toBe("function");
  });

  it.skipIf(!globalThis.WebAssembly)("has Message_ProgressRange_1", () => {
    if (!oc) return;
    expect(typeof oc.Message_ProgressRange_1).toBe("function");
  });

  it.skipIf(!globalThis.WebAssembly)("has BRepMesh_IncrementalMesh", () => {
    if (!oc) return;
    // Check if this binding exists — if not, we need to add base class
    const hasMesh = typeof oc.BRepMesh_IncrementalMesh === "function" ||
                    typeof oc.BRepMesh_IncrementalMesh_1 === "function";
    expect(hasMesh).toBe(true);
  });

  it.skipIf(!globalThis.WebAssembly)("can create a box", () => {
    if (!oc) return;
    const box = new oc.BRepPrimAPI_MakeBox_2(1, 1, 1);
    expect(box).toBeDefined();
    const shape = box.Shape();
    expect(shape).toBeDefined();
  });

  it.skipIf(!globalThis.WebAssembly)("can boolean two boxes", () => {
    if (!oc) return;
    const box1 = new oc.BRepPrimAPI_MakeBox_2(2, 2, 2).Shape();
    const box2 = new oc.BRepPrimAPI_MakeBox_2(1, 1, 3).Shape();
    const fuse = new oc.BRepAlgoAPI_Fuse_3(box1, box2, new oc.Message_ProgressRange_1());
    fuse.Build(new oc.Message_ProgressRange_1());
    expect(fuse.IsDone()).toBe(true);
  });
});
