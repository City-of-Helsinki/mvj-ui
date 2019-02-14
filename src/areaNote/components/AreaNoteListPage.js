
// @flow
import React, {PureComponent} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import AreaNotesLayer from './AreaNotesLayer';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Search from './search/Search';
import {fetchAreaNoteList, hideEditMode, initializeAreaNote, showEditMode} from '$src/areaNote/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {PermissionMissingTexts} from '$src/enums';
import {FormNames} from '$src/areaNote/enums';
import {getAreaNoteById, getAreaNoteCoordinates} from '$src/areaNote/helpers';
import {getSearchQuery, getUrlParams} from '$util/helpers';
import {getCoordinatesBounds, getCoordinatesCenter} from '$util/map';
import {getRouteById, Routes} from '$src/root/routes';
import {getAreaNoteList, getIsEditMode, getIsFetching} from '$src/areaNote/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Methods} from '$src/types';
import type {AreaNoteList} from '$src/areaNote/types';

type Props = {
  areaNoteMethods: Methods,
  areaNotes: AreaNoteList,
  fetchAreaNoteList: Function,
  hideEditMode: Function,
  history: Object,
  initialize: Function,
  initializeAreaNote: Function,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean,
  location: Object,
  plansUnderground: ?Array<Object>,
  receiveTopNavigationSettings: Function,
  showEditMode: Function,
}

type State = {
  areaNoteMethods: Methods,
  areaNotes: AreaNoteList,
  bounds: ?Object,
  center: ?Array<Object>,
  isSearchInitialized: boolean,
  overlayLayers: Array<Object>,
}

const getOverlayLayers = (areaNoteMethods: Methods, areaNotes: AreaNoteList, areaNoteId: ?number) => {
  const layers = [];

  {areaNoteMethods.GET && !isEmpty(areaNotes) &&
    layers.push({
      checked: true,
      component: <AreaNotesLayer
        key='area_notes'
        allowToEdit={true}
        areaNotes={areaNotes}
        defaultAreaNote={areaNoteId}
      />,
      name: 'Muistettavat ehdot',
    });
  }

  return layers;
};

class AreaNoteListPage extends PureComponent<Props, State> {
  state = {
    areaNoteMethods: {},
    areaNotes: [],
    bounds: null,
    center: null,
    isSearchInitialized: false,
    overlayLayers: [],
  }

  componentDidMount() {
    const {
      initialize,
      location: {search},
      receiveTopNavigationSettings,
    } = this.props;
    const query = getUrlParams(search);

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.AREA_NOTES),
      pageTitle: 'Muistettavat ehdot',
      showSearch: false,
    });

    this.search();

    const setSearchFormReadyFlag = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      try {
        await initialize(FormNames.SEARCH, query);

        setSearchFormReadyFlag();
      } catch(e) {
        console.error(`Failed to initialize search form with error, ${e}`);
      }
    };

    initializeSearchForm();
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.areaNotes !== state.areaNotes || props.areaNoteMethods !== state.areaNoteMethods) {
      const {location: {search}} = props;
      const query = getUrlParams(search);
      const areaNoteId = query.area_note;

      newState.areaNotes = props.areaNotes;
      newState.overlayLayers = getOverlayLayers(props.areaNoteMethods, props.areaNotes, Number(areaNoteId));

      if(areaNoteId) {
        const areaNote = getAreaNoteById(props.areaNotes, Number(areaNoteId));
        const coordinates = getAreaNoteCoordinates(areaNote);

        newState.bounds = coordinates.length ? getCoordinatesBounds(coordinates) : undefined;
        newState.center = coordinates.length ? getCoordinatesCenter(coordinates) : undefined;
      }
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if(currentSearch !== prevSearch) {
      this.search();

      if(!Object.keys(searchQuery).length) {
        initialize(FormNames.SEARCH, {});
      }
    }
  }

  componentWillUnmount() {
    const {hideEditMode} = this.props;

    hideEditMode();
  }

  handleCreateButtonClick = () => {
    this.props.initializeAreaNote({
      geoJSON: {},
      id: -1,
      isNew: true,
      note: '',
    });

    this.props.showEditMode();
  }

  handleSearchChange = (query) => {
    const {history} = this.props;

    return history.push({
      pathname: getRouteById(Routes.AREA_NOTES),
      search: getSearchQuery(query),
    });
  }

  search = () => {
    const {fetchAreaNoteList, location: {search}} = this.props;

    fetchAreaNoteList(getUrlParams(search));
  }

  handleHideEdit = () => {
    this.props.hideEditMode();
  }

  render() {
    const {isEditMode, isFetching, isFetchingCommonAttributes, areaNoteMethods} = this.props;
    const {bounds, center, isSearchInitialized, overlayLayers} = this.state;

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!areaNoteMethods.GET) return <PageContainer><AuthorizationError text={PermissionMissingTexts.AREA_NOTE} /></PageContainer>;

    return (
      <PageContainer>
        <Row>
          <Column small={12} large={6}>
            <Authorization allow={areaNoteMethods.POST}>
              <AddButtonSecondary
                className='no-top-margin'
                disabled={isEditMode}
                label='Luo muistettava ehto'
                onClick={this.handleCreateButtonClick}
              />
            </Authorization>
          </Column>
          <Column small={12} large={6}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
            />
          </Column>
        </Row>

        <div style={{position: 'relative'}}>
          {isFetching && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>}

          <AreaNotesEditMap
            allowToEdit
            bounds={bounds}
            center={center}
            overlayLayers={overlayLayers}
          />
        </div>
      </PageContainer>
    );
  }
}

export default flowRight(
  withCommonAttributes,
  withRouter,
  connect(
    (state) => {
      return {
        areaNotes: getAreaNoteList(state),
        isEditMode: getIsEditMode(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchAreaNoteList,
      hideEditMode,
      initialize,
      initializeAreaNote,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
)(AreaNoteListPage);
