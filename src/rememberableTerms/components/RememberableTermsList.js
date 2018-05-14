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
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '../enums';
import {getRouteById} from '$src/root/routes';

type Props = {
  initialize: Function,
  receiveTopNavigationSettings: Function,
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
    this.setState({showEditTools: true});
  }

  handleSearchChange = (query) => {
    const {router} = this.context;

    return router.push({
      pathname: getRouteById('rememberableTerms'),
      query,
    });
  }

  handleHideEdit = () => {
    this.setState({showEditTools: false});
  }

  render() {
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
          showEditTools={showEditTools}
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
