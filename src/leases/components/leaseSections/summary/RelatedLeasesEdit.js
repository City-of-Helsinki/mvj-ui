// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import CreateLeaseModal from '$src/leases/components/createLease/CreateLeaseModal';
import FormFieldLabel from '$components/form/FormFieldLabel';
import LeaseSelectInput from '$components/inputs/LeaseSelectInput';
import RelatedLeaseItem from './RelatedLeaseItem';
import TitleH3 from '$components/content/TitleH3';
import {createLease, hideCreateModal, showCreateModal} from '$src/leases/actions';
import {createReleatedLease, deleteReleatedLease} from '$src/relatedLease/actions';
import {ConfirmationModalTexts, FormNames, Methods} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {LeaseFieldPaths, LeaseFieldTitles, RelationTypes} from '$src/leases/enums';
import {RelatedLeasePaths} from '$src/relatedLease/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContentRelatedLeasesFrom, getContentRelatedLeasesTo, isAnyLeaseFormDirty} from '$src/leases/helpers';
import {getUiDataLeaseKey, getUiDataRelatedLeaseKey} from '$src/uiData/helpers';
import {getFieldOptions, hasPermissions, isMethodAllowed} from '$src/util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getMethods as getLeaseMethods,
  getCurrentLease,
  getIsCreateModalOpen,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  createLease: Function,
  createReleatedLease: Function,
  currentLease: Lease,
  deleteReleatedLease: Function,
  hasAnyDirtyForms: boolean,
  hideCreateModal: Function,
  initialize: Function,
  isCreateModalOpen: boolean,
  leaseAttributes: Attributes,
  leaseMethods: MethodsType,
  showCreateModal: Function,
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

  showCreateLeaseModal = () => {
    const {initialize, showCreateModal} = this.props;

    initialize(FormNames.LEASE_CREATE_MODAL, {});
    showCreateModal();
  }

  hideCreateLeaseModal = () => {
    const {hideCreateModal} = this.props;

    hideCreateModal();
  }

  handleCreateLease = (payload: Object) => {
    const {createLease, currentLease} = this.props;

    createLease({
      ...payload,
      relate_to: currentLease.id,
      relation_type: RelationTypes.TRANSFER,
    });
  }

  render() {
    const {
      currentLease,
      hasAnyDirtyForms,
      isCreateModalOpen,
      leaseMethods,
      usersPermissions,
    } = this.props;
    const {
      newLease,
      relatedLeasesAll,
      relatedLeasesFrom,
      relatedLeasesTo,
      stateOptions,
    } = this.state;

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleCreate = (payload: Object) => {
            if(hasAnyDirtyForms) {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  this.handleCreateLease(payload);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE,
              });
            } else {
              this.handleCreateLease(payload);
            }
          };

          return (
            <div className="summary__related-leases">
              <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
                <CreateLeaseModal
                  allowToChangeRelateTo={false}
                  isOpen={isCreateModalOpen}
                  onClose={this.hideCreateLeaseModal}
                  onSubmit={handleCreate}
                />
              </Authorization>
              <TitleH3 enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HISTORY)}>
                {LeaseFieldTitles.HISTORY }
              </TitleH3>

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
              <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
                <AddButtonSecondary
                  className='no-top-margin'
                  label='Luo vuokraustunnus'
                  onClick={this.showCreateLeaseModal}
                />
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
        }}
      </AppConsumer>
    );
  }
}

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
      isCreateModalOpen: getIsCreateModalOpen(state),
      hasAnyDirtyForms: isAnyLeaseFormDirty(state),
      leaseAttributes: getLeaseAttributes(state),
      leaseMethods: getLeaseMethods(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    createLease,
    createReleatedLease,
    deleteReleatedLease,
    hideCreateModal,
    initialize,
    showCreateModal,
  }
)(RelatedLeasesEdit);
