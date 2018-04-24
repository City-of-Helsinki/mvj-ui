// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import ContractsEdit from './ContractsEdit';
import Divider from '$components/content/Divider';
import InspectionsEdit from './InspectionsEdit';
import DecisionsEdit from './DecisionsEdit';
import {fetchDecisions} from '$src/leases/actions';
import {getSearchQuery} from '$src/util/helpers';

type Props = {
  fetchDecisions: Function,
  params: Object,
}

class DecisionsMainEdit extends Component {
  props: Props

  componentWillMount() {
    const {fetchDecisions, params: {leaseId}} = this.props;
    const query = {
      lease: leaseId,
      limit: 1000,
    };

    fetchDecisions(getSearchQuery(query));
  }

  render() {
    return(
      <div>
        <h2>Päätökset</h2>
        <Divider />
        <DecisionsEdit />

        <h2>Sopimukset</h2>
        <Divider />
        <ContractsEdit/>

        <h2>Tarkastukset ja huomautukset</h2>
        <Divider />
        <InspectionsEdit />
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
)(DecisionsMainEdit);
