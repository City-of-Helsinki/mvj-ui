import React, { useEffect, useMemo } from "react";
import { isEmpty } from "lodash-es";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import AreaNotesLayer from "@/areaNote/components/AreaNotesLayer";
import { fetchAreaNoteList } from "@/areaNote/slice";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions } from "@/util/helpers";
import { getAreaNoteList } from "@/areaNote/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
const ApplicationMap = () => {
  const dispatch = useAppDispatch();
  const areaNotes = useAppSelector(getAreaNoteList);
  const usersPermissions = useAppSelector(getUsersPermissions);

  useEffect(() => {
    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      dispatch(fetchAreaNoteList({}));
    }
  }, [dispatch, usersPermissions]);

  const overlayLayers = useMemo(() => {
    if (
      !hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) ||
      isEmpty(areaNotes)
    ) {
      return [];
    }

    return [
      {
        checked: false,
        component: (
          <AreaNotesLayer
            key="area_notes"
            allowToEdit={false}
            areaNotes={areaNotes}
          />
        ),
        name: "Muistettavat ehdot",
      },
    ];
  }, [areaNotes, usersPermissions]);

  return <AreaNotesEditMap allowToEdit={false} overlayLayers={overlayLayers} />;
};

export default ApplicationMap;
