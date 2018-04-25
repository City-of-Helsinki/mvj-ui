// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {withRouter} from 'react-router';

import Contracts from './Contracts';
import Divider from '$components/content/Divider';
import Inspections from './Inspections';
import Decisions from './Decisions';
import {fetchDecisions} from '../../../actions';
import {getSearchQuery} from '$src/util/helpers';

type Props = {
  fetchDecisions: Function,
  params: Object,
}
class DecisionsMain extends Component {
  props: Props

  componentWillMount() {
    const {fetchDecisions, params: {leaseId}} = this.props;
    const query = {
      lease: leaseId,
      limit: 1000,
    };

    fetchDecisions(getSearchQuery(query));
  }

  render () {
    return (
      <div>
        <h2>Päätökset</h2>
        <Divider />
        <Decisions />

        <h2>Sopimukset</h2>
        <Divider />
        <Contracts/>

        <h2>Tarkastukset ja huomautukset</h2>
        <Divider />
        <Inspections/>
      </div>
    );
  }
}


export default flowRight(
  connect(
    null,
    {
      fetchDecisions,
    }
  ),
  withRouter,
)(DecisionsMain);
