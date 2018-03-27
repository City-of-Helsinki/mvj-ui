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
import {getDecisionsOptions, getSearchQuery} from '$src/util/helpers';
import {getDecisions} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';
import type {RootState} from '$src/root/types';

type Props = {
  attributes: Attributes,
  contracts: Array<Object>,
  decisions: Array<Object>,
  decisionsOptionData: Array<Object>,
  fetchDecisions: Function,
  inspections: Array<Object>,
  params: Object,
}
class DecisionsMain extends Component {
  props: Props

  componentWillMount() {
    const {
      fetchDecisions,
      params: {leaseId},
    } = this.props;
    const query = {
      lease: leaseId,
      imit: 1000,
    };
    const search = getSearchQuery(query);
    fetchDecisions(search);
  }

  render () {
    const {
      attributes,
      contracts,
      decisions,
      decisionsOptionData,
      inspections,
    } = this.props;
    const decisionOptions = getDecisionsOptions(decisionsOptionData);

    return (
      <div>
        <h1>Päätökset</h1>
        <Divider />
        <Decisions
          attributes={attributes}
          decisions={decisions}
        />

        <h1>Sopimukset</h1>
        <Divider />
        <Contracts
          attributes={attributes}
          contracts={contracts}
          decisionOptions={decisionOptions}
        />

        <h1>Tarkastukset ja huomautukset</h1>
        <Divider />
        <Inspections inspections={inspections}/>
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
)(DecisionsMain);
