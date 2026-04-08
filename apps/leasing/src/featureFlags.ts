/**
 * Build-time feature flags.
 *
 * Each flag is read from the build environment via Vite's `VITE_` prefix
 * convention. Set the corresponding env var before building to enable a flag.
 *
 * Example (local dev):  create apps/leasing/.env with VITE_FLAG_LANDUSE=true
 * Example (CI/CD):      set the VITE_FLAG_LANDUSE pipeline variable
 */
export const FLAG_LANDUSE = import.meta.env.VITE_FLAG_LANDUSE === "true";
