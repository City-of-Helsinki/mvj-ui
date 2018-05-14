// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';

import Button from '$components/button/Button';
import PageContainer from '$components/content/PageContainer';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '../enums';
import {getRouteById} from '$src/root/routes';

type Props = {
  initialize: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
}

class RememberableTermsList extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {receiveTopNavigationSettings} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rememberableTerms'),
      pageTitle: 'Muistettavat ehdot',
      showSearch: false,
    });
  }

  componentDidMount = () => {
    const {initialize, router: {location: {query}}} = this.props;
    initialize(FormNames.SEARCH, query);
  }

  handleCreateButtonClick = () => {
    console.log('Create new rememberable term');
  }

  handleSearchChange = (query) => {
    const {router} = this.context;

    return router.push({
      pathname: getRouteById('rememberableTerms'),
      query,
    });
  }

  render() {
    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
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

      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    null,
    {
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(RememberableTermsList);
