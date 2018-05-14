// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import PageContainer from '$components/content/PageContainer';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getRouteById} from '$src/root/routes';

type Props = {
  receiveTopNavigationSettings: Function,
}

class RememberableTermsList extends Component<Props> {

  componentWillMount() {
    const {receiveTopNavigationSettings} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rememberableTerms'),
      pageTitle: 'Muistettavat ehdot',
      showSearch: false,
    });
  }

  render() {
    return (
      <PageContainer>

      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    null,
    {
      receiveTopNavigationSettings,
    },
  ),
)(RememberableTermsList);
