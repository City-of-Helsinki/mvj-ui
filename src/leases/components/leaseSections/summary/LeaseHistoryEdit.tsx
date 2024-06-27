import React, { Component } from "react";
import { Row, Column } from "react-foundation";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonSecondary from "/src/components/form/AddButtonSecondary";
import Authorization from "/src/components/authorization/Authorization";
import CreateLeaseModal from "/src/leases/components/createLease/CreateLeaseModal";
import FormFieldLabel from "/src/components/form/FormFieldLabel";
import LeaseSelectInput from "/src/components/inputs/LeaseSelectInput";
import LeaseHistoryItem from "./LeaseHistoryItem";
import TitleH3 from "/src/components/content/TitleH3";
import { createLease, hideCreateModal, showCreateModal } from "/src/leases/actions";
import { createReleatedLease, deleteReleatedLease, createRelatedPlotApplication, deleteRelatedPlotApplication } from "relatedLease/actions";
import { ConfirmationModalTexts, FormNames, Methods } from "enums";
import { ButtonColors } from "/src/components/enums";
import { LeaseFieldPaths, LeaseFieldTitles, LeaseHistoryContentTypes, LeaseHistoryItemTypes, RelationTypes } from "/src/leases/enums";
import { RelatedLeasePaths } from "relatedLease/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getContentRelatedLeasesFrom, getContentRelatedLeasesTo, isAnyLeaseFormDirty, sortRelatedLeasesFrom } from "/src/leases/helpers";
import { getUiDataLeaseKey, getUiDataRelatedLeaseKey } from "uiData/helpers";
import { getFieldOptions, hasPermissions, isMethodAllowed } from "util/helpers";
import { getAttributes as getLeaseAttributes, getMethods as getLeaseMethods, getCurrentLease, getIsCreateModalOpen } from "/src/leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes, Methods as MethodsType } from "types";
import type { Lease } from "/src/leases/types";
import { restructureLease, sortRelatedHistoryItems } from "/src/leases/helpers";
import PlotApplication from "/src/plotApplications/components/PlotApplication";
import type { UsersPermissions as UsersPermissionsType, UserServiceUnit } from "usersPermissions/types";
type Props = {
  createLease: (...args: Array<any>) => any;
  createReleatedLease: (...args: Array<any>) => any;
  createRelatedPlotApplication: (...args: Array<any>) => any;
  currentLease: Lease;
  deleteReleatedLease: (...args: Array<any>) => any;
  deleteRelatedPlotApplication: (...args: Array<any>) => any;
  hasAnyDirtyForms: boolean;
  hideCreateModal: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  isCreateModalOpen: boolean;
  leaseAttributes: Attributes;
  leaseMethods: MethodsType;
  serviceUnit: UserServiceUnit;
  showCreateModal: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};
type State = {
  currentLease: Lease;
  leaseAttributes: Attributes;
  newLease: Record<string, any> | null | undefined;
  leaseHistoryItemsAll: Array<Record<string, any>>;
  relatedLeasesFrom: Array<Record<string, any>>;
  relatedLeasesTo: Array<Record<string, any>>;
  stateOptions: Array<Record<string, any>>;
};

class LeaseHistoryEdit extends Component<Props, State> {
  state = {
    currentLease: {},
    leaseAttributes: null,
    newLease: null,
    leaseHistoryItemsAll: [],
    relatedLeasesFrom: [],
    relatedLeasesTo: [],
    stateOptions: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.stateOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.STATE);
    }

    if (props.currentLease !== state.currentLease) {
      const relatedLeasesFrom = sortRelatedLeasesFrom(getContentRelatedLeasesFrom(props.currentLease));
      const relatedLeasesTo = getContentRelatedLeasesTo(props.currentLease);
      const leaseHistoryItemsAll = [...relatedLeasesFrom, {
        lease: props.currentLease
      }, ...relatedLeasesTo];
      newState.currentLease = props.currentLease;
      newState.leaseHistoryItemsAll = leaseHistoryItemsAll;
      newState.relatedLeasesFrom = relatedLeasesFrom;
      newState.relatedLeasesTo = relatedLeasesTo;
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.relatedLeasesTo !== prevState.relatedLeasesTo) {
      this.clearNewLease();
    }
  }

  clearNewLease = () => {
    this.setState({
      newLease: null
    });
  };
  handleCreate = (newHistoryItem: Record<string, any>) => {
    const {
      createReleatedLease,
      createRelatedPlotApplication,
      currentLease
    } = this.props;
    this.setState({
      newLease: newHistoryItem
    });

    switch (newHistoryItem.type) {
      case 'lease':
        createReleatedLease({
          from_lease: currentLease.id,
          to_lease: newHistoryItem.value
        });
        break;

      case 'related_plot_application':
        createRelatedPlotApplication({
          object_id: newHistoryItem.value,
          content_type_model: newHistoryItem.content_type_model,
          lease: currentLease.id
        });
        break;
    }
  };
  handleDelete = (id: number) => {
    const {
      currentLease,
      deleteReleatedLease
    } = this.props;
    deleteReleatedLease({
      id: id,
      leaseId: currentLease.id
    });
  };
  handleDeleteRelatedPlotApplication = (id: number) => {
    const {
      currentLease,
      deleteRelatedPlotApplication
    } = this.props;
    deleteRelatedPlotApplication({
      id: id,
      leaseId: currentLease.id
    });
  };
  showCreateLeaseModal = () => {
    const {
      initialize,
      showCreateModal
    } = this.props;
    initialize(FormNames.LEASE_CREATE_MODAL, {});
    showCreateModal();
  };
  hideCreateLeaseModal = () => {
    const {
      hideCreateModal
    } = this.props;
    hideCreateModal();
  };
  handleCreateLease = (payload: Record<string, any>) => {
    const {
      createLease,
      currentLease
    } = this.props;
    createLease({ ...payload,
      relate_to: currentLease.id,
      relation_type: RelationTypes.TRANSFER
    });
  };

  render() {
    const {
      currentLease,
      hasAnyDirtyForms,
      isCreateModalOpen,
      leaseMethods,
      serviceUnit,
      usersPermissions
    } = this.props;
    const {
      newLease,
      leaseHistoryItemsAll,
      relatedLeasesFrom,
      relatedLeasesTo,
      stateOptions
    } = this.state;
    const handleDelete = this.handleDelete;
    const handleDeleteRelatedPlotApplication = this.handleDeleteRelatedPlotApplication;

    const renderLeaseWithPlotSearchesAndApplications = (lease, active) => {
      const historyItems = [];

      if (lease.plot_searches?.length) {
        lease.plot_searches.forEach(plotSearch => {
          historyItems.push({
            key: `plot-search-${plotSearch.name}-${Math.random().toString()}`,
            id: plotSearch.id,
            itemTitle: plotSearch.name,
            startDate: plotSearch.begin_at,
            endDate: plotSearch.end_at,
            plotSearchType: plotSearch.type,
            plotSearchSubtype: plotSearch.subtype,
            itemType: LeaseHistoryItemTypes.PLOTSEARCH
          });
        });
      }

      if (lease.target_statuses?.length) {
        lease.target_statuses.forEach(plotApplication => {
          historyItems.push({
            key: `plot-application-${plotApplication.application_identifier}-${Math.random().toString()}`,
            id: plotApplication.id,
            itemTitle: plotApplication.application_identifier,
            receivedAt: plotApplication.received_at,
            itemType: LeaseHistoryItemTypes.PLOT_APPLICATION
          });
        });
      }

      if (lease.area_searches?.length) {
        lease.area_searches.forEach(areaSearch => {
          historyItems.push({
            key: `area-search-${areaSearch.identifier}-${Math.random().toString()}`,
            id: areaSearch.id,
            itemTitle: areaSearch.identifier,
            receivedAt: areaSearch.received_date,
            applicantName: `${areaSearch.applicant_names.join(" ")}`,
            itemType: LeaseHistoryItemTypes.AREA_SEARCH
          });
        });
      }

      if (lease.related_plot_applications?.length) {
        lease.related_plot_applications.forEach(relatedPlotApplication => {
          if (relatedPlotApplication.content_type?.model === LeaseHistoryContentTypes.PLOTSEARCH) {
            const {
              content_object
            } = relatedPlotApplication;
            historyItems.push({
              key: `related-plot-application-plotsearch-${content_object.id}-${Math.random().toString()}`,
              id: content_object.id,
              deleteId: relatedPlotApplication.id,
              itemTitle: content_object.name,
              startDate: content_object.begin_at,
              endDate: content_object.end_at,
              plotSearchType: content_object.type,
              plotSearchSubtype: content_object.subtype,
              itemType: LeaseHistoryItemTypes.PLOTSEARCH,
              onDelete: handleDeleteRelatedPlotApplication
            });
          }

          if (relatedPlotApplication.content_type?.model === LeaseHistoryContentTypes.TARGET_STATUS) {
            const {
              content_object
            } = relatedPlotApplication;
            historyItems.push({
              key: `related-plot-application-targetstatus-${content_object.id}-${Math.random().toString()}`,
              id: content_object.id,
              deleteId: relatedPlotApplication.id,
              itemTitle: content_object.application_identifier,
              receivedAt: content_object.received_at,
              itemType: LeaseHistoryItemTypes.PLOT_APPLICATION,
              onDelete: handleDeleteRelatedPlotApplication
            });
          } else if (relatedPlotApplication.content_type?.model === LeaseHistoryContentTypes.AREA_SEARCH) {
            const {
              content_object
            } = relatedPlotApplication;
            historyItems.push({
              key: `related-plot-application-areasearch-${content_object.id}-${Math.random().toString()}`,
              id: content_object.id,
              deleteId: relatedPlotApplication.id,
              itemTitle: content_object.identifier,
              applicantName: `${content_object.applicant_names.join(" ")}`,
              receivedAt: content_object.received_date,
              itemType: LeaseHistoryItemTypes.AREA_SEARCH,
              onDelete: handleDeleteRelatedPlotApplication
            });
          }
        });
      }

      let leaseProps: any = {
        key: `lease-${lease.id}-${Math.random().toString()}`,
        id: lease.id,
        deleteId: lease.related_lease_id,
        lease: lease,
        startDate: lease.start_date,
        endDate: lease.end_date,
        onDelete: handleDelete
      };

      // used for highlighting the current lease
      if (typeof active === "boolean") {
        leaseProps.active = active;
      }

      historyItems.push(leaseProps);
      historyItems.sort(sortRelatedHistoryItems);
      return historyItems.map(item => {
        return <LeaseHistoryItem {...item} stateOptions={this.state.stateOptions} />;
      });
    };

    return <AppConsumer>
        {({
        dispatch
      }) => {
        const handleCreate = (payload: Record<string, any>) => {
          if (hasAnyDirtyForms) {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.handleCreateLease(payload);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE
            });
          } else {
            this.handleCreateLease(payload);
          }
        };

        return <div className="summary__related-leases">
              <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
                <CreateLeaseModal allowToChangeRelateTo={false} isOpen={isCreateModalOpen} onClose={this.hideCreateLeaseModal} onSubmit={handleCreate} />
              </Authorization>
              <TitleH3 enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HISTORY)}>
                {LeaseFieldTitles.HISTORY}
              </TitleH3>

              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASE_HISTORY_ITEM)}>
                <div className="summary__related-leases_input-wrapper">
                  <FormFieldLabel htmlFor='related-lease' enableUiDataEdit uiDataKey={getUiDataRelatedLeaseKey(RelatedLeasePaths.TO_LEASE)}>Liitä vuokratunnukseen</FormFieldLabel>
                  <Row>
                    <Column>
                      <LeaseSelectInput disabled={!!newLease} name='related-lease' onChange={this.handleCreate} leaseHistoryItems={leaseHistoryItemsAll} serviceUnit={serviceUnit} value={newLease} />
                    </Column>
                  </Row>
                </div>
              </Authorization>
              <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
                <AddButtonSecondary className='no-top-margin' label='Luo vuokraustunnus' onClick={this.showCreateLeaseModal} />
              </Authorization>

              <div className="summary__related-leases_items">
                <div className="summary__related-leases_items_border-left" />
                {!!relatedLeasesTo && !!relatedLeasesTo.length && relatedLeasesTo.map(restructureLease).map(renderLeaseWithPlotSearchesAndApplications)}

                {!!currentLease && renderLeaseWithPlotSearchesAndApplications(currentLease, true)}

                {!!relatedLeasesFrom && !!relatedLeasesFrom.length && relatedLeasesFrom.map(restructureLease).map(renderLeaseWithPlotSearchesAndApplications)}
              </div>
            </div>;
      }}
      </AppConsumer>;
  }

}

export default connect(state => {
  return {
    currentLease: getCurrentLease(state),
    isCreateModalOpen: getIsCreateModalOpen(state),
    hasAnyDirtyForms: isAnyLeaseFormDirty(state),
    leaseAttributes: getLeaseAttributes(state),
    leaseMethods: getLeaseMethods(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  createLease,
  createReleatedLease,
  createRelatedPlotApplication,
  deleteReleatedLease,
  deleteRelatedPlotApplication,
  hideCreateModal,
  initialize,
  showCreateModal
})(LeaseHistoryEdit);