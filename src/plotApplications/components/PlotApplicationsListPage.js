// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import PageContainer from '$components/content/PageContainer';

type Props = {
}

type State = {
}

class PlotApplicationsListPage extends PureComponent<Props, State> {
  _isMounted: boolean

  state = {
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
  }

  render() {
    return (
      <PageContainer>
      </PageContainer>
    );
  }
}


export default flowRight(
  withRouter,
  connect(
    () => {
      return {
      };
    }
  ),
)(PlotApplicationsListPage);
