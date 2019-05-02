// @flow
import React, {Fragment, PureComponent} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchBatchRuns} from '$src/batchJobs/actions';
import {getUrlParams} from '$util/helpers';

type Props = {
  fetchBatchRuns: Function,
  location: Object,
}

class Runs extends PureComponent<Props> {
  componentDidMount() {
    this.search();
  }

  search = () => {
    const {fetchBatchRuns, location: {search}} = this.props;
    const query = getUrlParams(search);

    delete query.tab;

    fetchBatchRuns(query);
  }

  render() {
    return (
      <Fragment>

      </Fragment>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    () => {
      return {

      };
    },
    {
      fetchBatchRuns,
    }
  ),
)(Runs);
