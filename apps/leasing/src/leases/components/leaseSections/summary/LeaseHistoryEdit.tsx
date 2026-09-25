import React, { useEffect, useMemo, useState } from "react";
import { Row, Column } from "@/components/grid/Grid";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { ActionTypes, ModalConsumer } from "@/app/ModalContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import CreateLeaseModal from "@/leases/components/createLease/CreateLeaseModal";
import FormFieldLabel from "@/components/form/FormFieldLabel";
import LeaseSelectInput from "@/components/inputs/LeaseSelectInput";
import LeaseHistoryNode from "./LeaseHistoryNode";
import TitleH3 from "@/components/content/TitleH3";
import { createLease, hideCreateModal, showCreateModal } from "@/leases/slice";
import {
  createReleatedLease,
  deleteReleatedLease,
  createRelatedPlotApplication,
  deleteRelatedPlotApplication,
} from "@/relatedLease/actions";
import { ConfirmationModalTexts, Methods } from "@/enums";
import { ButtonColors, ButtonLabels } from "@/components/enums";
import {
  LeaseFieldPaths,
  LeaseFieldTitles,
  RelationTypes,
} from "@/leases/enums";
import { RelatedLeasePaths } from "@/relatedLease/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { isAnyLeaseFormDirty } from "@/leases/helpers";
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
import {
  buildLeaseHistoryNodes,
  groupHistoryNodesByServiceUnit,
} from "@/leases/leaseHistory";
import type { UserServiceUnit } from "@/usersPermissions/types";

type Props = {
  serviceUnit: UserServiceUnit;
};

const LeaseHistoryEdit: React.FC<Props> = (props) => {
  const { serviceUnit } = props;

  const currentLease = useAppSelector(getCurrentLease);
  const isCreateModalOpen = useAppSelector(getIsCreateModalOpen);
  const hasAnyDirtyForms = useAppSelector(isAnyLeaseFormDirty);
  const leaseAttributes = useAppSelector(getLeaseAttributes);
  const leaseMethods = useAppSelector(getLeaseMethods);
  const usersPermissions = useAppSelector(getUsersPermissions);

  const dispatch = useAppDispatch();
  const [newLease, setNewLease] = useState<Record<string, any> | null>(null);
  const stateOptions = useMemo(() => {
    return getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE);
  }, [leaseAttributes]);

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

  const { historyGroups, leaseHistoryItemsAll } = useMemo(() => {
    const nodes = buildLeaseHistoryNodes(currentLease, {
      onDeleteRelatedLease: handleRelatedLeaseDelete,
      onDeleteRelatedPlotApplication: handleDeleteRelatedPlotApplication,
    });
    const groups = groupHistoryNodesByServiceUnit(nodes);
    // LeaseSelectInput expects `{ lease: { id } }` wrappers to exclude already-linked leases.
    const all = nodes.map((node) => ({ lease: node.lease }));

    return { historyGroups: groups, leaseHistoryItemsAll: all };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLease]);

  const showServiceUnitHeadings = historyGroups.length > 1;

  useEffect(() => {
    setNewLease(null);
  }, [currentLease]);

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
  const showCreateLeaseModal = () => {
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

  return (
    <ModalConsumer>
      {({ modalDispatch }) => {
        const handleCreateLeaseModalSubmit = (payload: Record<string, any>) => {
          if (hasAnyDirtyForms) {
            modalDispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                handleLeaseCreate(payload);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText:
                ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
              confirmationModalLabel:
                ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
              confirmationModalTitle:
                ConfirmationModalTexts.CANCEL_CHANGES.TITLE,
            });
          } else {
            handleLeaseCreate(payload);
          }
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
                  uiDataKey={getUiDataRelatedLeaseKey(
                    RelatedLeasePaths.TO_LEASE,
                  )}
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
              {historyGroups.map((group) => (
                <div
                  className="summary__related-leases_group"
                  key={`service-unit-${group.serviceUnitId}`}
                >
                  {showServiceUnitHeadings && (
                    <h4 className="summary__related-leases_service-unit">
                      {group.serviceUnitName}
                    </h4>
                  )}
                  <div className="summary__related-leases_group_items">
                    <div className="summary__related-leases_items_border-left" />
                    {group.nodes.map((node, index) => (
                      <LeaseHistoryNode
                        key={node.key}
                        node={node}
                        stateOptions={stateOptions}
                        onDeleteRelatedLease={handleRelatedLeaseDelete}
                        isFirstNode={index === 0}
                        isLastNode={index === group.nodes.length - 1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </ModalConsumer>
  );
};

export default LeaseHistoryEdit;
