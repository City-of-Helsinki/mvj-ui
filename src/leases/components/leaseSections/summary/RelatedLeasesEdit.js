// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import FormFieldLabel from '$components/form/FormFieldLabel';
import LeaseSelectInput from '$components/inputs/LeaseSelectInput';
import RelatedLeasesItem from './RelatedLeasesItem';
import {createReleatedLease, deleteReleatedLease, hideDeleteRelatedLeaseModal, showDeleteRelatedLeaseModal} from '$src/leases/actions';
import {getContentRelatedLeasesFrom, getContentRelatedLeasesTo} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {getAttributes, getCurrentLease, getIsDeleteRelatedLeaseModalOpen} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

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
  selectedLease: number,
  stateOptions: Array<Object>,
}

class RelatedLeasesEdit extends Component<Props, State> {
  state = {
    newLease: null,
    relatedLeasesAll: [],
    relatedLeasesFrom: [],
    relatedLeasesTo: [],
    selectedLease: -1,
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

  handleRelatedLeaseItemDelete = (id: number) => {
    const {showDeleteRelatedLeaseModal} = this.props;
    showDeleteRelatedLeaseModal();
    this.setState({
      selectedLease: id,
    });
  }

  handleCancelDelete = () => {
    const {hideDeleteRelatedLeaseModal} = this.props;
    hideDeleteRelatedLeaseModal();
    this.setState({
      selectedLease: -1,
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

  handleDelete = () => {
    const {currentLease, deleteReleatedLease} = this.props;
    const {selectedLease} = this.state;
    deleteReleatedLease({id: selectedLease, leaseId: currentLease.id});
  }

  render() {
    const {currentLease, isDeleteRelatedLeaseModalOpen} = this.props;
    const {
      newLease,
      relatedLeasesAll,
      relatedLeasesFrom,
      relatedLeasesTo,
      stateOptions,
    } = this.state;

    return (
      <div className="related-leases__component">
        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteRelatedLeaseModalOpen}
          label='Haluatko varmasti poistaa vuokratunnusten välisen liitoksen?'
          onCancel={this.handleCancelDelete}
          onClose={this.handleCancelDelete}
          onSave={this.handleDelete}
          title='Poista liitos'
        />

        <h3>Historia</h3>
        <div className="related-leases__input-wrapper">
          <FormFieldLabel>Liitä vuokratunnukseen</FormFieldLabel>
          <Row>
            <Column>
              <LeaseSelectInput
                disabled={!!newLease}
                onChange={this.handleCreate}
                relatedLeases={relatedLeasesAll}
                value={newLease}
              />
            </Column>
          </Row>
        </div>
        <div className="related-leases__items">
          <div className="related-leases__items_border-left" />
          {!!relatedLeasesTo && !!relatedLeasesTo.length && relatedLeasesTo.map((lease, index) => {
            return (
              <RelatedLeasesItem
                key={index}
                active={false}
                allowDelete
                id={lease.id}
                indented
                onDelete={this.handleRelatedLeaseItemDelete}
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
                onDelete={this.handleRelatedLeaseItemDelete}
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
      isDeleteRelatedLeaseModalOpen: getIsDeleteRelatedLeaseModalOpen(state),
    };
  },
  {
    createReleatedLease,
    deleteReleatedLease,
    hideDeleteRelatedLeaseModal,
    showDeleteRelatedLeaseModal,
  }
)(RelatedLeasesEdit);
