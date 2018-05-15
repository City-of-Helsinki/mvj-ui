// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';

import Button from '$components/button/Button';
import EditableMap from '$components/map/EditableMap';
import PageContainer from '$components/content/PageContainer';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import {fetchRememberableTermList} from '$src/rememberableTerms/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/rememberableTerms/enums';
import {getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getRememberableTermList} from '$src/rememberableTerms/selectors';

import type {RememberableTermList} from '$src/rememberableTerms/types';

type Props = {
  initialize: Function,
  fetchRememberableTermList: Function,
  receiveTopNavigationSettings: Function,
  rememberableTerms: RememberableTermList,
  router: Object,
}

type State = {
  showEditTools: boolean,
}

class RememberableTermsList extends Component<Props, State> {
  state = {
    showEditTools: false,
  }

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

  componentDidMount = () => {
    const {initialize, router: {location: {query}}} = this.props;
    initialize(FormNames.SEARCH, query);
  }

  handleCreateButtonClick = () => {
    this.setState({showEditTools: true});
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
    this.setState({showEditTools: false});
  }

  render() {
    const {rememberableTerms} = this.props;
    const {showEditTools} = this.state;

    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              disabled={showEditTools}
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

        <EditableMap
          onHideEdit={this.handleHideEdit}
          rememberableTerms={rememberableTerms}
          showEditTools={showEditTools}
        />

      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        rememberableTerms: getRememberableTermList(state),
      };
    },
    {
      initialize,
      fetchRememberableTermList,
      receiveTopNavigationSettings,
    },
  ),
)(RememberableTermsList);
