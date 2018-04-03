// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {withRouter} from 'react-router';

import ContractsEdit from './ContractsEdit';
import Divider from '$components/content/Divider';
import InspectionsEdit from './InspectionsEdit';
import DecisionsEdit from './DecisionsEdit';
import {fetchDecisions} from '$src/leases/actions';
import {getDecisionsOptions, getSearchQuery} from '$src/util/helpers';
import {getDecisions} from '$src/leases/selectors';

import type {Attributes, Decisions} from '$src/leases/types';
import type {RootState} from '$src/root/types';

type Props = {
  attributes: Attributes,
  contracts: Array<Object>,
  decisions: Array<Object>,
  decisionsOptionData: Decisions,
  fetchDecisions: Function,
  inspections: Array<Object>,
  params: Object,
}

class DecisionsMainEdit extends Component {
  props: Props

  componentWillMount() {
    const {
      fetchDecisions,
      params: {leaseId},
    } = this.props;
    const query = {
      lease: leaseId,
      limit: 1000,
    };
    const search = getSearchQuery(query);
    fetchDecisions(search);
  }

  render() {
    const {
      attributes,
      contracts,
      decisions,
      decisionsOptionData,
      inspections,
    } = this.props;
    const decisionOptions = getDecisionsOptions(decisionsOptionData);

    return(
      <div>
        <h2>Päätökset</h2>
        <Divider />
        <DecisionsEdit
          attributes={attributes}
          initialValues={{decisions: decisions}}
        />

        <h1>Sopimukset</h1>
        <Divider />
        <ContractsEdit
          attributes={attributes}
          decisionOptions={decisionOptions}
          initialValues={{contracts: contracts}}
        />

        <h1>Tarkastukset ja huomautukset</h1>
        <Divider />
        <InspectionsEdit
          attributes={attributes}
          initialValues={{inspections: inspections}}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    decisionsOptionData: getDecisions(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      fetchDecisions,
    }
  ),
  withRouter,
)(DecisionsMainEdit);
