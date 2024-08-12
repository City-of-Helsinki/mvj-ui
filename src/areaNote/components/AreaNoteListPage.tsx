import React, { PureComponent } from "react";
import { Row, Column } from "react-foundation";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { initialize } from "redux-form";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import AreaNotesLayer from "./AreaNotesLayer";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import Search from "./search/Search";
import { fetchAreaNoteList, hideEditMode, initializeAreaNote, showEditMode } from "@/areaNote/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { FormNames, Methods, PermissionMissingTexts } from "@/enums";
import { getAreaNoteById, getAreaNoteCoordinates } from "@/areaNote/helpers";
import { getSearchQuery, getUrlParams, isMethodAllowed, setPageTitle } from "@/util/helpers";
import { getBoundsFromCoordinates, getCenterFromCoordinates } from "@/util/map";
import { getRouteById, Routes } from "@/root/routes";
import { getAreaNoteList, getIsEditMode, getIsFetching } from "@/areaNote/selectors";
import { withAreaNoteAttributes } from "@/components/attributes/AreaNoteAttributes";
import type { Methods as MethodsType } from "types";
import type { AreaNoteList } from "@/areaNote/types";
type Props = {
  areaNoteMethods: MethodsType;
  areaNotes: AreaNoteList;
  fetchAreaNoteList: (...args: Array<any>) => any;
  hideEditMode: (...args: Array<any>) => any;
  history: Record<string, any>;
  initialize: (...args: Array<any>) => any;
  initializeAreaNote: (...args: Array<any>) => any;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingCommonAttributes: boolean;
  location: Record<string, any>;
  plansUnderground: Array<Record<string, any>> | null | undefined;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  showEditMode: (...args: Array<any>) => any;
};
type State = {
  areaNoteMethods: MethodsType;
  areaNotes: AreaNoteList;
  bounds: Record<string, any> | null | undefined;
  center: Array<Record<string, any>> | null | undefined;
  isSearchInitialized: boolean;
  overlayLayers: Array<Record<string, any>>;
};

const getOverlayLayers = (areaNoteMethods: MethodsType, areaNotes: AreaNoteList, areaNoteId: number | null | undefined) => {
  const layers = [];
  {
    isMethodAllowed(areaNoteMethods, Methods.GET) && !isEmpty(areaNotes) && layers.push({
      checked: true,
      component: <AreaNotesLayer key='area_notes' allowToEdit={true} areaNotes={areaNotes} defaultAreaNote={areaNoteId} />,
      name: 'Muistettavat ehdot'
    });
  }
  return layers;
};

class AreaNoteListPage extends PureComponent<Props, State> {
  _isMounted: boolean;
  state = {
    areaNoteMethods: null,
    areaNotes: [],
    bounds: null,
    center: null,
    isSearchInitialized: false,
    overlayLayers: []
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings
    } = this.props;
    setPageTitle('Muistettavat ehdot');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.AREA_NOTES),
      pageTitle: 'Muistettavat ehdot',
      showSearch: false
    });
    this.search();
    this.setSearchFormValues();
    window.addEventListener('popstate', this.handlePopState);
    this._isMounted = true;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.areaNotes !== state.areaNotes || props.areaNoteMethods !== state.areaNoteMethods) {
      const {
        location: {
          search
        }
      } = props;
      const query = getUrlParams(search);
      const areaNoteId = query.area_note;
      newState.areaNotes = props.areaNotes;
      newState.overlayLayers = getOverlayLayers(props.areaNoteMethods, props.areaNotes, Number(areaNoteId));

      if (areaNoteId) {
        const areaNote = getAreaNoteById(props.areaNotes, Number(areaNoteId));
        const coordinates = getAreaNoteCoordinates(areaNote);
        newState.bounds = coordinates.length ? getBoundsFromCoordinates(coordinates) : undefined;
        newState.center = coordinates.length ? getCenterFromCoordinates(coordinates) : undefined;
      }
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        search: currentSearch
      }
    } = this.props;
    const {
      location: {
        search: prevSearch
      }
    } = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if (currentSearch !== prevSearch) {
      this.search();

      if (!Object.keys(searchQuery).length) {
        this.setSearchFormValues();
      }
    }
  }

  componentWillUnmount() {
    const {
      hideEditMode
    } = this.props;
    hideEditMode();
    window.removeEventListener('popstate', this.handlePopState);
    this._isMounted = false;
  }

  handlePopState = () => {
    this.setSearchFormValues();
  };
  setSearchFormValues = () => {
    const {
      location: {
        search
      },
      initialize
    } = this.props;
    const searchQuery = getUrlParams(search);

    const setSearchFormReady = () => {
      this.setState({
        isSearchInitialized: true
      });
    };

    const initializeSearchForm = async () => {
      const initialValues = { ...searchQuery
      };
      await initialize(FormNames.AREA_NOTE_SEARCH, initialValues);
    };

    this.setState({
      isSearchInitialized: false
    }, async () => {
      await initializeSearchForm();

      if (this._isMounted) {
        setSearchFormReady();
      }
    });
  };
  handleCreateButtonClick = () => {
    this.props.initializeAreaNote({
      geoJSON: {},
      id: -1,
      isNew: true,
      note: ''
    });
    this.props.showEditMode();
  };
  handleSearchChange = query => {
    const {
      history
    } = this.props;
    return history.push({
      pathname: getRouteById(Routes.AREA_NOTES),
      search: getSearchQuery(query)
    });
  };
  search = () => {
    const {
      fetchAreaNoteList,
      location: {
        search
      }
    } = this.props;
    fetchAreaNoteList(getUrlParams(search));
  };
  handleHideEdit = () => {
    this.props.hideEditMode();
  };

  render() {
    const {
      isEditMode,
      isFetching,
      isFetchingCommonAttributes,
      areaNoteMethods
    } = this.props;
    const {
      bounds,
      center,
      isSearchInitialized,
      overlayLayers
    } = this.state;
    if (isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!areaNoteMethods) return null;
    if (!isMethodAllowed(areaNoteMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.AREA_NOTE} /></PageContainer>;
    return <PageContainer>
        <Row>
          <Column small={12} large={4}>
            <Authorization allow={isMethodAllowed(areaNoteMethods, Methods.POST)}>
              <AddButtonSecondary className='no-top-margin' disabled={isEditMode} label='Luo muistettava ehto' onClick={this.handleCreateButtonClick} />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search isSearchInitialized={isSearchInitialized} onSearch={this.handleSearchChange} />
          </Column>
        </Row>

        <div style={{
        position: 'relative'
      }}>
          {isFetching && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>}

          <AreaNotesEditMap allowToEdit bounds={bounds} center={center} overlayLayers={overlayLayers} />
        </div>
      </PageContainer>;
  }

}

export default flowRight(withAreaNoteAttributes, withRouter, connect(state => {
  return {
    areaNotes: getAreaNoteList(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state)
  };
}, {
  fetchAreaNoteList,
  hideEditMode,
  initialize,
  initializeAreaNote,
  receiveTopNavigationSettings,
  showEditMode
}))(AreaNoteListPage);