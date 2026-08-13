import React, { memo, useCallback, useEffect, useMemo } from "react";
import { Row, Column } from "@/components/grid/Grid";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { isEmpty } from "lodash-es";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import AreaNotesLayer from "./AreaNotesLayer";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import Search from "@/areaNote/components/search/Search";
import {
  fetchAreaNoteList,
  fetchAttributes as fetchAreaNoteAttributes,
  hideEditMode,
  initializeAreaNote,
  showEditMode,
} from "@/areaNote/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { Methods, PermissionMissingTexts } from "@/enums";
import { getAreaNoteById, getAreaNoteCoordinates } from "@/areaNote/helpers";
import {
  getSearchQuery,
  getUrlParams,
  isMethodAllowed,
  setPageTitle,
} from "@/util/helpers";
import { getBoundsFromCoordinates, getCenterFromCoordinates } from "@/util/map";
import { getRouteById, Routes } from "@/root/routes";
import {
  getAreaNoteList,
  getIsEditMode,
  getIsFetching,
  getIsFetchingAttributes as getIsFetchingAreaNoteAttributes,
  getMethods as getAreaNoteMethods,
} from "@/areaNote/selectors";
import type { Methods as MethodsType } from "types";
import type { AreaNoteList } from "@/areaNote/types";

const getOverlayLayers = (
  areaNoteMethods: MethodsType,
  areaNotes: AreaNoteList,
  areaNoteId: number | null | undefined,
) => {
  const layers = [];

  if (isMethodAllowed(areaNoteMethods, Methods.GET) && !isEmpty(areaNotes)) {
    layers.push({
      checked: true,
      component: (
        <AreaNotesLayer
          key="area_notes"
          allowToEdit={true}
          areaNotes={areaNotes}
          defaultAreaNote={areaNoteId}
        />
      ),
      name: "Muistettavat ehdot",
    });
  }

  return layers;
};

const AreaNoteListPage: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const areaNotes = useSelector(getAreaNoteList);
  const isEditMode = useSelector(getIsEditMode);
  const isFetching = useSelector(getIsFetching);
  const areaNoteMethods = useSelector(getAreaNoteMethods);
  const isFetchingAreaNoteAttributes = useSelector(
    getIsFetchingAreaNoteAttributes,
  );

  const searchQuery = useMemo(
    () => getUrlParams(location.search),
    [location.search],
  );

  const searchInitialValues = useMemo(() => {
    return { ...searchQuery };
  }, [searchQuery]);

  const areaNoteId = useMemo(() => {
    return searchQuery.area_note ? Number(searchQuery.area_note) : null;
  }, [searchQuery.area_note]);

  const selectedAreaNote = useMemo(() => {
    if (!areaNoteId) {
      return null;
    }

    return getAreaNoteById(areaNotes, areaNoteId);
  }, [areaNoteId, areaNotes]);

  const coordinates = useMemo(() => {
    return selectedAreaNote ? getAreaNoteCoordinates(selectedAreaNote) : [];
  }, [selectedAreaNote]);

  const bounds = useMemo(() => {
    return coordinates.length
      ? getBoundsFromCoordinates(coordinates)
      : undefined;
  }, [coordinates]);

  const center = useMemo(() => {
    return coordinates.length
      ? getCenterFromCoordinates(coordinates)
      : undefined;
  }, [coordinates]);

  const overlayLayers = useMemo(() => {
    if (!areaNoteMethods) {
      return [];
    }

    return getOverlayLayers(areaNoteMethods, areaNotes, areaNoteId);
  }, [areaNoteId, areaNoteMethods, areaNotes]);

  useEffect(() => {
    setPageTitle("Muistettavat ehdot");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.AREA_NOTES),
        pageTitle: "Muistettavat ehdot",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (!isFetchingAreaNoteAttributes && !areaNoteMethods) {
      dispatch(fetchAreaNoteAttributes());
    }
  }, [dispatch, isFetchingAreaNoteAttributes, areaNoteMethods]);

  useEffect(() => {
    dispatch(fetchAreaNoteList(getUrlParams(location.search)));
  }, [dispatch, location.search]);

  useEffect(() => {
    return () => {
      dispatch(hideEditMode());
    };
  }, [dispatch]);

  const handleCreateButtonClick = useCallback(() => {
    dispatch(
      initializeAreaNote({
        geoJSON: {},
        id: -1,
        isNew: true,
        note: "",
      }),
    );
    dispatch(showEditMode());
  }, [dispatch]);

  const handleSearchChange = useCallback(
    (query: Record<string, any>) => {
      return navigate({
        pathname: getRouteById(Routes.AREA_NOTES),
        search: getSearchQuery(query),
      });
    },
    [navigate],
  );

  if (isFetchingAreaNoteAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!areaNoteMethods) return null;
  if (!isMethodAllowed(areaNoteMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.AREA_NOTE} />
      </PageContainer>
    );

  return (
    <PageContainer>
      <Row>
        <Column small={12} large={4}>
          <Authorization allow={isMethodAllowed(areaNoteMethods, Methods.POST)}>
            <AddButtonSecondary
              className="no-top-margin"
              disabled={isEditMode}
              label="Luo muistettava ehto"
              onClick={handleCreateButtonClick}
            />
          </Authorization>
        </Column>
        <Column small={12} large={8}>
          <Search
            initialValues={searchInitialValues}
            onSearch={handleSearchChange}
          />
        </Column>
      </Row>

      <div
        style={{
          position: "relative",
        }}
      >
        {isFetching && (
          <LoaderWrapper className="relative-overlay-wrapper">
            <Loader isLoading={isFetching} />
          </LoaderWrapper>
        )}

        <AreaNotesEditMap
          allowToEdit
          bounds={bounds}
          center={center}
          overlayLayers={overlayLayers}
        />
      </div>
    </PageContainer>
  );
};

export default memo(AreaNoteListPage);
