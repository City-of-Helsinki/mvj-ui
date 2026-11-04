const LEGACY_LAND_USE_DB_NAME = "landUseDb";

export const removeLegacyLandUseDb = (): void => {
  try {
    const request = indexedDB.deleteDatabase(LEGACY_LAND_USE_DB_NAME);

    request.onerror = () => {
      console.warn(
        "Could not remove legacy land-use browser data",
        request.error,
      );
    };
    request.onblocked = () => {
      console.warn(
        "Legacy land-use browser data is still open in another tab; it will be removed after the tab closes.",
      );
    };
  } catch (error) {
    console.warn("Could not request removal of legacy land-use browser data", error);
  }
};
