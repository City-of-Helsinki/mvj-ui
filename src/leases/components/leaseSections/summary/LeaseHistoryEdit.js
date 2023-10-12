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
import LeaseHistoryItem from './LeaseHistoryItem';
import TitleH3 from '$components/content/TitleH3';
import {createLease, hideCreateModal, showCreateModal} from '$src/leases/actions';
import {createReleatedLease, deleteReleatedLease} from '$src/relatedLease/actions';
import {ConfirmationModalTexts, FormNames, Methods} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {LeaseFieldPaths, LeaseFieldTitles, RelationTypes} from '$src/leases/enums';
import {RelatedLeasePaths} from '$src/relatedLease/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContentRelatedLeasesFrom, getContentRelatedLeasesTo, isAnyLeaseFormDirty, sortRelatedLeasesFrom} from '$src/leases/helpers';
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
  leaseHistoryItemsAll: Array<Object>,
  leaseHistoryItemsFrom: Array<Object>,
  leaseHistoryItemsTo: Array<Object>,
  stateOptions: Array<Object>,
}

class LeaseHistoryEdit extends Component<Props, State> {
  state = {
    currentLease: {},
    leaseAttributes: null,
    newLease: null,
    leaseHistoryItemsAll: [],
    leaseHistoryItemsFrom: [],
    leaseHistoryItemsTo: [],
    stateOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.stateOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.STATE);
    }

    if(props.currentLease !== state.currentLease) {
      const leaseHistoryItemsFrom = sortRelatedLeasesFrom(getContentRelatedLeasesFrom(props.currentLease));
      const leaseHistoryItemsTo = getContentRelatedLeasesTo(props.currentLease);
      const leaseHistoryItemsAll = [...leaseHistoryItemsFrom, {lease: props.currentLease}, ...leaseHistoryItemsTo];

      newState.currentLease = props.currentLease;
      newState.leaseHistoryItemsAll = leaseHistoryItemsAll;
      newState.leaseHistoryItemsFrom = leaseHistoryItemsFrom;
      newState.leaseHistoryItemsTo = leaseHistoryItemsTo;
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.leaseHistoryItemsTo !== prevState.leaseHistoryItemsTo) {
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
      leaseHistoryItemsAll,
      leaseHistoryItemsFrom,
      leaseHistoryItemsTo,
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
                        leaseHistoryItems={leaseHistoryItemsAll}
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
                {!!leaseHistoryItemsTo && !!leaseHistoryItemsTo.length && leaseHistoryItemsTo.map((lease, index) => {
                  return (
                    <LeaseHistoryItem
                      key={index}
                      active={false}
                      id={lease.id}
                      indented
                      onDelete={this.handleDelete}
                      lease={lease.lease}
                      startDate={lease.lease.start_date}
                      endDate={lease.lease.end_date}
                      stateOptions={stateOptions}
                    />
                  );
                })}
                {!!currentLease &&
                  <LeaseHistoryItem
                    active={true}
                    lease={currentLease}
                    startDate={currentLease.start_date}
                    endDate={currentLease.end_date}
                    stateOptions={stateOptions}
                  />
                }
                {!!leaseHistoryItemsFrom && !!leaseHistoryItemsFrom.length && leaseHistoryItemsFrom.map((lease, index) => {
                  const historyItems = []
                  if (lease.lease && lease.lease.target_statuses.length) {
                    lease.lease.target_statuses.forEach((plotSearch) => {
                      historyItems.push({
                        key: plotSearch.plot_search_name,
                        id: plotSearch.plot_search_id,
                        itemTitle: plotSearch.plot_search_name,
                        startDate: plotSearch.start_date,
                        endDate: plotSearch.end_date,
                        // join plotsearch__plotsearchsubtype__plotsearchtype
                        plotSearchType: "Search Type",
                        plotSearchSubtype: "Search Subtype",
                        itemType: "plotsearch",
                        stateOptions: stateOptions,
                      })
                    })
                  }
                  historyItems.push({
                    key: index,
                    id: lease.id,
                    lease: lease.lease,
                    startDate: lease.lease.start_date,
                    endDate: lease.lease.end_date,
                    stateOptions: stateOptions
                  })
                  return historyItems.map((item) => { return <LeaseHistoryItem {...item} />})
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
)(LeaseHistoryEdit);
