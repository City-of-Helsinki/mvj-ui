// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';

import Button from '$components/button/Button';
import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import PageContainer from '$components/content/PageContainer';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import {fetchAreaNoteList, hideEditMode, initializeAreaNote, showEditMode} from '$src/areaNote/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/areaNote/enums';
import {getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAreaNoteList, getIsEditMode} from '$src/areaNote/selectors';

import type {AreaNoteList} from '$src/areaNote/types';

type Props = {
  areaNotes: AreaNoteList,
  fetchAreaNoteList: Function,
  hideEditMode: Function,
  initialize: Function,
  initializeAreaNote: Function,
  isEditMode: boolean,
  plansUnderground: ?Array<Object>,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

class AreaNotesList extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      fetchAreaNoteList,
      receiveTopNavigationSettings,
      router: {location: {query}},
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('areaNotes'),
      pageTitle: 'Muistettavat ehdot',
      showSearch: false,
    });

    fetchAreaNoteList(getSearchQuery(query));
  }

  componentDidMount() {
    const {initialize, router: {location: {query}}} = this.props;
    initialize(FormNames.SEARCH, query);
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
    const {fetchAreaNoteList} = this.props;

    fetchAreaNoteList(getSearchQuery(query));

    return router.push({
      pathname: getRouteById('areaNotes'),
      query,
    });
  }

  handleHideEdit = () => {
    this.props.hideEditMode();
  }

  render() {
    const {isEditMode} = this.props;

    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              disabled={isEditMode}
              onClick={this.handleCreateButtonClick}
              text='Luo muistettava ehto'
            />
          }
          searchComponent={
            <Search
              onSearch={(query) => this.handleSearchChange(query)}
            />
          }
        />
        <AreaNotesEditMap allowEditing/>
      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        areaNotes: getAreaNoteList(state),
        isEditMode: getIsEditMode(state),
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
)(AreaNotesList);
