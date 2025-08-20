import React, { useEffect, useMemo, useState } from "react";
import { Row, Column } from "react-foundation";
import { useDispatch, useSelector } from "react-redux";
import { initialize } from "redux-form";
import { ActionTypes } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import CreateLeaseModal from "@/leases/components/createLease/CreateLeaseModal";
import FormFieldLabel from "@/components/form/FormFieldLabel";
import LeaseSelectInput from "@/components/inputs/LeaseSelectInput";
import LeaseHistoryItem from "./LeaseHistoryItem";
import TitleH3 from "@/components/content/TitleH3";
import {
  createLease,
  hideCreateModal,
  showCreateModal,
} from "@/leases/actions";
import {
  createReleatedLease,
  deleteReleatedLease,
  createRelatedPlotApplication,
  deleteRelatedPlotApplication,
} from "@/relatedLease/actions";
import { ConfirmationModalTexts, FormNames, Methods } from "@/enums";
import { ButtonColors, ButtonLabels } from "@/components/enums";
import {
  LeaseFieldPaths,
  LeaseFieldTitles,
  LeaseHistoryContentTypes,
  LeaseHistoryItemTypes,
  RelationTypes,
} from "@/leases/enums";
import { RelatedLeasePaths } from "@/relatedLease/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  getContentRelatedLeasesFrom,
  getContentRelatedLeasesTo,
  isAnyLeaseFormDirty,
  sortRelatedLeasesFrom,
} from "@/leases/helpers";
import { getUiDataLeaseKey, getUiDataRelatedLeaseKey } from "@/uiData/helpers";
import {
  getFieldOptions,
  hasPermissions,
  isMethodAllowed,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getMethods as getLeaseMethods,
  getCurrentLease,
  getIsCreateModalOpen,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { restructureLease, sortRelatedHistoryItems } from "@/leases/helpers";
import type { UserServiceUnit } from "@/usersPermissions/types";

type Props = {
  serviceUnit: UserServiceUnit;
};

const LeaseHistoryEdit: React.FC<Props> = (props) => {
  const { serviceUnit } = props;

  const currentLease = useSelector(getCurrentLease);
  const isCreateModalOpen = useSelector(getIsCreateModalOpen);
  const hasAnyDirtyForms = useSelector(isAnyLeaseFormDirty);
  const leaseAttributes = useSelector(getLeaseAttributes);
  const leaseMethods = useSelector(getLeaseMethods);
  const usersPermissions = useSelector(getUsersPermissions);

  const dispatch = useDispatch();
  const [newLease, setNewLease] = useState<Record<string, any> | null>(null);
  const stateOptions = useMemo(() => {
    return getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE);
  }, [leaseAttributes]);

  const { relatedLeasesFrom, relatedLeasesTo, leaseHistoryItemsAll } =
    useMemo(() => {
      const from = sortRelatedLeasesFrom(
        getContentRelatedLeasesFrom(currentLease),
      );
      const to = getContentRelatedLeasesTo(currentLease);
      const all = [...from, { lease: currentLease }, ...to];

      return {
        relatedLeasesFrom: from,
        relatedLeasesTo: to,
        leaseHistoryItemsAll: all,
      };
    }, [currentLease]);

  useEffect(() => {
    setNewLease(null);
  }, [relatedLeasesTo]);

  const handleHistoryItemCreate = (newHistoryItem: Record<string, any>) => {
    setNewLease(newHistoryItem);

    switch (newHistoryItem.type) {
      case "lease":
        dispatch(
          createReleatedLease({
            from_lease: currentLease.id,
            to_lease: newHistoryItem.value,
          }),
        );
        break;

      case "related_plot_application":
        dispatch(
          createRelatedPlotApplication({
            object_id: newHistoryItem.value,
            content_type_model: newHistoryItem.content_type_model,
            lease: currentLease.id,
          }),
        );
        break;
    }
  };
  const handleRelatedLeaseDelete = (id: number) => {
    dispatch(
      deleteReleatedLease({
        id: id,
        leaseId: currentLease.id,
      }),
    );
  };
  const handleDeleteRelatedPlotApplication = (id: number) => {
    dispatch(
      deleteRelatedPlotApplication({
        id: id,
        leaseId: currentLease.id,
      }),
    );
  };
  const showCreateLeaseModal = () => {
    dispatch(initialize(FormNames.LEASE_CREATE_MODAL, {}));
    dispatch(showCreateModal());
  };
  const hideCreateLeaseModal = () => {
    dispatch(hideCreateModal());
  };
  const handleLeaseCreate = (payload: Record<string, any>) => {
    dispatch(
      createLease({
        ...payload,
        relate_to: currentLease.id,
        relation_type: RelationTypes.TRANSFER,
      }),
    );
  };

  const handleCreateLeaseModalSubmit = (payload: Record<string, any>) => {
    if (hasAnyDirtyForms) {
      dispatch({
        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
        confirmationFunction: () => {
          handleLeaseCreate(payload);
        },
        confirmationModalButtonClassName: ButtonColors.ALERT,
        confirmationModalButtonText:
          ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
        confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
        confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE,
      });
    } else {
      handleLeaseCreate(payload);
    }
  };

  const renderLeaseWithPlotSearchesAndApplications = (lease, active) => {
    const historyItems = [];

    if (lease.plot_searches?.length) {
      lease.plot_searches.forEach((plotSearch) => {
        historyItems.push({
          key: `plot-search-${plotSearch.name}-${Math.random().toString()}`,
          id: plotSearch.id,
          itemTitle: plotSearch.name,
          startDate: plotSearch.begin_at,
          endDate: plotSearch.end_at,
          plotSearchType: plotSearch.type,
          plotSearchSubtype: plotSearch.subtype,
          itemType: LeaseHistoryItemTypes.PLOTSEARCH,
        });
      });
    }

    if (lease.target_statuses?.length) {
      lease.target_statuses.forEach((plotApplication) => {
        historyItems.push({
          key: `plot-application-${plotApplication.application_identifier}-${Math.random().toString()}`,
          id: plotApplication.id,
          itemTitle: plotApplication.application_identifier,
          receivedAt: plotApplication.received_at,
          itemType: LeaseHistoryItemTypes.PLOT_APPLICATION,
        });
      });
    }

    if (lease.area_searches?.length) {
      lease.area_searches.forEach((areaSearch) => {
        historyItems.push({
          key: `area-search-${areaSearch.identifier}-${Math.random().toString()}`,
          id: areaSearch.id,
          itemTitle: areaSearch.identifier,
          receivedAt: areaSearch.received_date,
          applicantName: `${areaSearch.applicant_names.join(" ")}`,
          itemType: LeaseHistoryItemTypes.AREA_SEARCH,
        });
      });
    }

    if (lease.related_plot_applications?.length) {
      lease.related_plot_applications.forEach((relatedPlotApplication) => {
        if (
          relatedPlotApplication.content_type?.model ===
          LeaseHistoryContentTypes.PLOTSEARCH
        ) {
          const { content_object } = relatedPlotApplication;
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
            onDelete: handleDeleteRelatedPlotApplication,
          });
        }

        if (
          relatedPlotApplication.content_type?.model ===
          LeaseHistoryContentTypes.TARGET_STATUS
        ) {
          const { content_object } = relatedPlotApplication;
          historyItems.push({
            key: `related-plot-application-targetstatus-${content_object.id}-${Math.random().toString()}`,
            id: content_object.id,
            deleteId: relatedPlotApplication.id,
            itemTitle: content_object.application_identifier,
            receivedAt: content_object.received_at,
            itemType: LeaseHistoryItemTypes.PLOT_APPLICATION,
            onDelete: handleDeleteRelatedPlotApplication,
          });
        } else if (
          relatedPlotApplication.content_type?.model ===
          LeaseHistoryContentTypes.AREA_SEARCH
        ) {
          const { content_object } = relatedPlotApplication;
          historyItems.push({
            key: `related-plot-application-areasearch-${content_object.id}-${Math.random().toString()}`,
            id: content_object.id,
            deleteId: relatedPlotApplication.id,
            itemTitle: content_object.identifier,
            applicantName: `${content_object.applicant_names.join(" ")}`,
            receivedAt: content_object.received_date,
            itemType: LeaseHistoryItemTypes.AREA_SEARCH,
            onDelete: handleDeleteRelatedPlotApplication,
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
      onDelete: handleRelatedLeaseDelete,
    };

    // used for highlighting the current lease
    if (typeof active === "boolean") {
      leaseProps.active = active;
    }

    historyItems.push(leaseProps);
    historyItems.sort(sortRelatedHistoryItems);
    return historyItems.map((item) => {
      return <LeaseHistoryItem {...item} stateOptions={stateOptions} />;
    });
  };

  return (
    <div className="summary__related-leases">
      <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
        <CreateLeaseModal
          allowToChangeRelateTo={false}
          isOpen={isCreateModalOpen}
          onClose={hideCreateLeaseModal}
          onSubmit={handleCreateLeaseModalSubmit}
        />
      </Authorization>
      <TitleH3
        enableUiDataEdit
        uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HISTORY)}
      >
        {LeaseFieldTitles.HISTORY}
      </TitleH3>

      <Authorization
        allow={hasPermissions(
          usersPermissions,
          UsersPermissions.ADD_LEASE_HISTORY_ITEM,
        )}
      >
        <div className="summary__related-leases_input-wrapper">
          <FormFieldLabel
            htmlFor="related-lease"
            enableUiDataEdit
            uiDataKey={getUiDataRelatedLeaseKey(RelatedLeasePaths.TO_LEASE)}
          >
            Liitä vuokratunnukseen
          </FormFieldLabel>
          <Row>
            <Column>
              <LeaseSelectInput
                disabled={!!newLease}
                name="related-lease"
                onChange={handleHistoryItemCreate}
                leaseHistoryItems={leaseHistoryItemsAll}
                serviceUnit={serviceUnit}
                value={newLease}
              />
            </Column>
          </Row>
        </div>
      </Authorization>
      <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
        <AddButtonSecondary
          className="no-top-margin"
          label={ButtonLabels.CREATE_LEASE_IDENTIFIER}
          onClick={showCreateLeaseModal}
        />
      </Authorization>

      <div className="summary__related-leases_items">
        <div className="summary__related-leases_items_border-left" />
        {!!relatedLeasesTo &&
          !!relatedLeasesTo.length &&
          relatedLeasesTo
            .map(restructureLease)
            .map(renderLeaseWithPlotSearchesAndApplications)}

        {!!currentLease &&
          renderLeaseWithPlotSearchesAndApplications(currentLease, true)}

        {!!relatedLeasesFrom &&
          !!relatedLeasesFrom.length &&
          relatedLeasesFrom
            .map(restructureLease)
            .map(renderLeaseWithPlotSearchesAndApplications)}
      </div>
    </div>
  );
};

export default LeaseHistoryEdit;
