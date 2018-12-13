// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import FormFieldLabel from '$components/form/FormFieldLabel';
import LeaseSelectInput from '$components/inputs/LeaseSelectInput';
import RelatedLeasesItem from './RelatedLeasesItem';
import {createReleatedLease, deleteReleatedLease} from '$src/leases/actions';
import {getContentRelatedLeasesFrom, getContentRelatedLeasesTo} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  createReleatedLease: Function,
  currentLease: Lease,
  deleteReleatedLease: Function,
  isDeleteRelatedLeaseModalOpen: boolean,
  hideDeleteRelatedLeaseModal: Function,
  showDeleteRelatedLeaseModal: Function,
}

type State = {
  newLease: ?Object,
  relatedLeasesAll: Array<Object>,
  relatedLeasesFrom: Array<Object>,
  relatedLeasesTo: Array<Object>,
  stateOptions: Array<Object>,
}

class RelatedLeasesEdit extends Component<Props, State> {
  state = {
    newLease: null,
    relatedLeasesAll: [],
    relatedLeasesFrom: [],
    relatedLeasesTo: [],
    stateOptions: [],
  }

  componentWillMount() {
    const {attributes, currentLease} = this.props;

    if(!isEmpty(attributes)) {
      this.updateOptions();
    }

    if(!isEmpty(currentLease)) {
      this.updateRelatedLeases();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.currentLease !== prevProps.currentLease) {
      this.updateRelatedLeases();
    }
    if(this.state.relatedLeasesTo !== prevState.relatedLeasesTo) {
      this.clearNewLease();
    }
  }

  clearNewLease = () => {
    this.setState({
      newLease: null,
    });
  }

  updateOptions = () => {
    const {attributes} = this.props;
    this.setState({
      stateOptions: getAttributeFieldOptions(attributes, 'state'),
    });
  }

  updateRelatedLeases = () => {
    const {currentLease} = this.props;
    const relatedLeasesFrom = getContentRelatedLeasesFrom(currentLease);
    const relatedLeasesTo = getContentRelatedLeasesTo(currentLease);
    const relatedLeasesAll = [...relatedLeasesFrom, {lease: currentLease}, ...relatedLeasesTo];
    this.setState({
      relatedLeasesAll: relatedLeasesAll,
      relatedLeasesFrom: relatedLeasesFrom,
      relatedLeasesTo: relatedLeasesTo,
    });
  }

  handleCreate = (toLease: Object) => {
    const {createReleatedLease, currentLease} = this.props;
    this.setState({
      newLease: toLease,
    });
    createReleatedLease({
      from_lease: currentLease.id,
      to_lease: toLease.value,
    });
  }

  handleDelete = (id: number) => {
    const {currentLease, deleteReleatedLease} = this.props;

    deleteReleatedLease({id: id, leaseId: currentLease.id});
  }

  render() {
    const {currentLease} = this.props;
    const {
      newLease,
      relatedLeasesAll,
      relatedLeasesFrom,
      relatedLeasesTo,
      stateOptions,
    } = this.state;

    return (
      <div className="summary__related-leases">
        <h3>Historia</h3>
        <div className="summary__related-leases_input-wrapper">
          <FormFieldLabel htmlFor='related-lease'>Liitä vuokratunnukseen</FormFieldLabel>
          <Row>
            <Column>
              <LeaseSelectInput
                disabled={!!newLease}
                name='related-lease'
                onChange={this.handleCreate}
                relatedLeases={relatedLeasesAll}
                value={newLease}
              />
            </Column>
          </Row>
        </div>
        <div className="summary__related-leases_items">
          <div className="summary__related-leases_items_border-left" />
          {!!relatedLeasesTo && !!relatedLeasesTo.length && relatedLeasesTo.map((lease, index) => {
            return (
              <RelatedLeasesItem
                key={index}
                active={false}
                allowDelete
                id={lease.id}
                indented
                onDelete={this.handleDelete}
                lease={lease.lease}
                stateOptions={stateOptions}
              />
            );
          })}
          {!!currentLease &&
            <RelatedLeasesItem
              active={true}
              lease={currentLease}
              stateOptions={stateOptions}
            />
          }
          {!!relatedLeasesFrom && !!relatedLeasesFrom.length && relatedLeasesFrom.map((lease, index) => {
            return (
              <RelatedLeasesItem
                key={index}
                active={false}
                allowDelete
                id={lease.id}
                onDelete={this.handleDelete}
                lease={lease.lease}
                stateOptions={stateOptions}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  },
  {
    createReleatedLease,
    deleteReleatedLease,
  }
)(RelatedLeasesEdit);
