// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import FullWidthContainer from '$components/content/FullWidthContainer';

type Props = {
}

type State = {
}

class PlotApplicationsPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isRestoreModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  timerAutoSave: any

  componentDidMount() {
  }

  render() {
    return(
      <FullWidthContainer>
      </FullWidthContainer>
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
)(PlotApplicationsPage);
