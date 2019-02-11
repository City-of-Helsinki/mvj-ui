
// @flow
import React, {PureComponent} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
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
import {getSearchQuery, getUrlParams} from '$util/helpers';
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
  isSearchInitialized: boolean,
}

class AreaNoteListPage extends PureComponent<Props, State> {
  state = {
    isSearchInitialized: false,
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
    const {isSearchInitialized} = this.state;

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

          <AreaNotesEditMap allowEditing/>
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
