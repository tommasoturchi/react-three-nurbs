/**
 * Lazy loader for the custom OpenCASCADE WASM module.
 * The WASM (~5MB) is only loaded when boolean operations are first used.
 */

let ocInstance: any = null;
let loading: Promise<any> | null = null;

/**
 * Get the OpenCASCADE instance. Loads the WASM on first call.
 * Subsequent calls return the cached instance.
 */
export async function getOC(): Promise<any> {
  if (ocInstance) return ocInstance;
  if (loading) return loading;

  loading = (async () => {
    try {
      const initModule = await import("./occtBooleans.js");
      const init = initModule.default || initModule;
      ocInstance = await init();
      return ocInstance;
    } catch (error) {
      loading = null;
      throw new Error(`Failed to load OpenCASCADE WASM. Error: ${error}`);
    }
  })();

  return loading;
}

/**
 * Initialize with a user-provided OpenCASCADE instance.
 */
export function setOC(instance: any): void {
  ocInstance = instance;
}

/**
 * Check if OpenCASCADE is loaded.
 */
export function isOCLoaded(): boolean {
  return ocInstance !== null;
}
