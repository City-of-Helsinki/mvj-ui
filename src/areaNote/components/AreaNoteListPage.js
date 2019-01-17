// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
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
import {getSearchQuery} from '$util/helpers';
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

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      initialize,
      location: {query},
      receiveTopNavigationSettings,
    } = this.props;

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
    const {location: {query, search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;

    if(currentSearch !== prevSearch) {
      this.search();

      const searchQuery = {...query};

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
    const {router} = this.context;

    return router.push({
      pathname: getRouteById(Routes.AREA_NOTES),
      query,
    });
  }

  search = () => {
    const {fetchAreaNoteList, location: {query}} = this.props;

    fetchAreaNoteList(getSearchQuery(query));
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
