import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { ACTIVE_SERVICE_UNIT_STORAGE_KEY } from "@/usersPermissions/constants";
import { setUserActiveServiceUnit } from "@/usersPermissions/slice";
import { getUserServiceUnits } from "@/usersPermissions/selectors";
import { buildStorageKey } from "@/util/storage";

/**
 * Applies active service unit changes made in other tabs.
 * The storage event fires only in tabs other than the one that wrote the value.
 */
const useActiveServiceUnitSync = () => {
  const dispatch = useAppDispatch();
  const userServiceUnits = useAppSelector(getUserServiceUnits);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== buildStorageKey(ACTIVE_SERVICE_UNIT_STORAGE_KEY)) {
        return;
      }
      const selected = userServiceUnits.find(
        (unit) => String(unit.id) === event.newValue,
      );
      if (selected) {
        dispatch(setUserActiveServiceUnit(selected));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch, userServiceUnits]);
};

export default useActiveServiceUnitSync;
