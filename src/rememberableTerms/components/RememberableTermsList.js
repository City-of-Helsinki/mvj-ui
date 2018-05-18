// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';

import Button from '$components/button/Button';
import EditableMap from '$src/rememberableTerms/components/EditableMap';
import PageContainer from '$components/content/PageContainer';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import {fetchRememberableTermList, hideEditMode, initializeRememberableTerm, showEditMode} from '$src/rememberableTerms/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/rememberableTerms/enums';
import {getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getIsEditMode, getRememberableTermList} from '$src/rememberableTerms/selectors';

import type {RememberableTermList} from '$src/rememberableTerms/types';

type Props = {
  initialize: Function,
  fetchRememberableTermList: Function,
  hideEditMode: Function,
  initializeRememberableTerm: Function,
  isEditMode: boolean,
  plansUnderground: ?Array<Object>,
  receiveTopNavigationSettings: Function,
  rememberableTerms: RememberableTermList,
  router: Object,
  showEditMode: Function,
}

class RememberableTermsList extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      fetchRememberableTermList,
      receiveTopNavigationSettings,
      router: {location: {query}},
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rememberableTerms'),
      pageTitle: 'Muistettavat ehdot',
      showSearch: false,
    });

    fetchRememberableTermList(getSearchQuery(query));
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
    this.props.initializeRememberableTerm({
      comment: '',
      geoJSON: {},
      id: -1,
      isNew: true,
    });

    this.props.showEditMode();
  }

  handleSearchChange = (query) => {
    const {router} = this.context;
    const {fetchRememberableTermList} = this.props;

    fetchRememberableTermList(getSearchQuery(query));

    return router.push({
      pathname: getRouteById('rememberableTerms'),
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
              label='Luo muistettava ehto'
              onClick={this.handleCreateButtonClick}
              title='Luo muistettava ehto'
            />
          }
          searchComponent={
            <Search
              onSearch={(query) => this.handleSearchChange(query)}
            />
          }
        />
        <EditableMap allowEditing/>
      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        isEditMode: getIsEditMode(state),
        rememberableTerms: getRememberableTermList(state),
      };
    },
    {
      fetchRememberableTermList,
      hideEditMode,
      initialize,
      initializeRememberableTerm,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
)(RememberableTermsList);
