import React, { useEffect, useMemo } from "react";
import { isEmpty } from "lodash-es";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import AreaNotesLayer from "@/areaNote/components/AreaNotesLayer";
import { fetchAreaNoteList } from "@/areaNote/slice";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions } from "@/util/helpers";
import { getAreaNoteList } from "@/areaNote/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";

export type MapOverlayLayer = {
  checked: boolean;
  component: React.ReactNode;
  name: string;
};

type Options = {
  fetchOnMount?: boolean;
  showWhenEmpty?: boolean;
};

const useAreaNotesOverlay = ({
  fetchOnMount = false,
  showWhenEmpty = false,
}: Options = {}) => {
  const dispatch = useAppDispatch();
  const areaNotes = useAppSelector(getAreaNoteList);
  const usersPermissions = useAppSelector(getUsersPermissions);
  const canViewAreaNotes = hasPermissions(
    usersPermissions,
    UsersPermissions.VIEW_AREANOTE,
  );

  useEffect(() => {
    if (fetchOnMount && canViewAreaNotes) {
      dispatch(fetchAreaNoteList({}));
    }
  }, [canViewAreaNotes, dispatch, fetchOnMount]);

  return useMemo<MapOverlayLayer | undefined>(() => {
    if (!canViewAreaNotes || (!showWhenEmpty && isEmpty(areaNotes))) {
      return undefined;
    }

    return {
      checked: false,
      component: (
        <AreaNotesLayer
          key="area_notes"
          allowToEdit={false}
          areaNotes={areaNotes}
        />
      ),
      name: "Muistettavat ehdot",
    };
  }, [areaNotes, canViewAreaNotes, showWhenEmpty]);
};

export default useAreaNotesOverlay;
