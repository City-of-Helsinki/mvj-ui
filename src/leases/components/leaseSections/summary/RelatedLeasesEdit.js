// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';

import Authorization from '$components/authorization/Authorization';
import FormFieldLabel from '$components/form/FormFieldLabel';
import LeaseSelectInput from '$components/inputs/LeaseSelectInput';
import RelatedLeaseItem from './RelatedLeaseItem';
import {createReleatedLease, deleteReleatedLease} from '$src/relatedLease/actions';
import {LeaseFieldPaths} from '$src/leases/enums';
import {RelatedLeasePaths} from '$src/relatedLease/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContentRelatedLeasesFrom, getContentRelatedLeasesTo} from '$src/leases/helpers';
import {getUiDataRelatedLeaseKey} from '$src/uiData/helpers';
import {getFieldOptions, hasPermissions} from '$src/util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  createReleatedLease: Function,
  currentLease: Lease,
  deleteReleatedLease: Function,
  isDeleteRelatedLeaseModalOpen: boolean,
  hideDeleteRelatedLeaseModal: Function,
  leaseAttributes: Attributes,
  showDeleteRelatedLeaseModal: Function,
  usersPermissions: UsersPermissionsType,
}

type State = {
  currentLease: Lease,
  leaseAttributes: Attributes,
  newLease: ?Object,
  relatedLeasesAll: Array<Object>,
  relatedLeasesFrom: Array<Object>,
  relatedLeasesTo: Array<Object>,
  stateOptions: Array<Object>,
}

class RelatedLeasesEdit extends Component<Props, State> {
  state = {
    currentLease: {},
    leaseAttributes: null,
    newLease: null,
    relatedLeasesAll: [],
    relatedLeasesFrom: [],
    relatedLeasesTo: [],
    stateOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.stateOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.STATE);
    }

    if(props.currentLease !== state.currentLease) {
      const relatedLeasesFrom = getContentRelatedLeasesFrom(props.currentLease);
      const relatedLeasesTo = getContentRelatedLeasesTo(props.currentLease);
      const relatedLeasesAll = [...relatedLeasesFrom, {lease: props.currentLease}, ...relatedLeasesTo];

      newState.currentLease = props.currentLease;
      newState.relatedLeasesAll = relatedLeasesAll;
      newState.relatedLeasesFrom = relatedLeasesFrom;
      newState.relatedLeasesTo = relatedLeasesTo;
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.relatedLeasesTo !== prevState.relatedLeasesTo) {
      this.clearNewLease();
    }
  }

  clearNewLease = () => {
    this.setState({
      newLease: null,
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
    const {currentLease, usersPermissions} = this.props;
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

        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_RELATEDLEASE)}>
          <div className="summary__related-leases_input-wrapper">
            <FormFieldLabel
              htmlFor='related-lease'
              enableUiDataEdit
              uiDataKey={getUiDataRelatedLeaseKey(RelatedLeasePaths.TO_LEASE)}
            >Liitä vuokratunnukseen</FormFieldLabel>
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
        </Authorization>

        <div className="summary__related-leases_items">
          <div className="summary__related-leases_items_border-left" />
          {!!relatedLeasesTo && !!relatedLeasesTo.length && relatedLeasesTo.map((lease, index) => {
            return (
              <RelatedLeaseItem
                key={index}
                active={false}
                id={lease.id}
                indented
                onDelete={this.handleDelete}
                lease={lease.lease}
                stateOptions={stateOptions}
              />
            );
          })}
          {!!currentLease &&
            <RelatedLeaseItem
              active={true}
              lease={currentLease}
              stateOptions={stateOptions}
            />
          }
          {!!relatedLeasesFrom && !!relatedLeasesFrom.length && relatedLeasesFrom.map((lease, index) => {
            return (
              <RelatedLeaseItem
                key={index}
                active={false}
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
      currentLease: getCurrentLease(state),
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    createReleatedLease,
    deleteReleatedLease,
  }
)(RelatedLeasesEdit);
