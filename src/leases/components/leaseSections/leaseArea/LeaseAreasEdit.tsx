import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FieldArray,
  formValueSelector,
  getFormValues,
  initialize,
  InjectedFormProps,
  reduxForm,
} from "redux-form";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "@/app/AppContext";

import AddButton from "@/components/form/AddButton";
import ArchiveAreaModal from "./ArchiveAreaModal";
import LeaseAreaWithArchiveInfoEdit from "./LeaseAreaWithArchiveInfoEdit";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import Divider from "@/components/content/Divider";
import Title from "@/components/content/Title";
import WarningContainer from "@/components/content/WarningContainer";
import { copyAreasToContract, receiveFormValidFlags } from "@/leases/actions";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { AreaLocation, LeaseAreasFieldPaths } from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  calculateAreasSum,
  getContentLeaseAreas,
  getLeaseAreaById,
} from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatNumber,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { store } from "@/index";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";

type AreaItemProps = {
  fields: any;
  isActive: boolean;
  onArchive: (index: number, area: Record<string, any>) => void;
  onUnarchive: (index: number, area: Record<string, any>) => void;
  usersPermissions: UsersPermissionsType;
};
const InnerLeaseAreas: React.FC<AreaItemProps> = ({
  fields,
  isActive,
  onArchive,
  onUnarchive,
  usersPermissions,
}) => {
  const handleAdd = useCallback(() => {
    fields.push({
      addresses: [{}],
      location: AreaLocation.SURFACE,
    });
  }, [fields]);

  const removeArea = useCallback(
    (index: number) => {
      fields.remove(index);
    },
    [fields],
  );

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => (
        <>
          {!isActive && !!fields && !!fields.length && (
            <h3
              style={{
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              Arkisto
            </h3>
          )}

          {fields &&
            !!fields.length &&
            fields.map((area, index) => {
              const handleRemove = () => {
                appDispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    removeArea(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText:
                    ConfirmationModalTexts.DELETE_LEASE_AREA.BUTTON,
                  confirmationModalLabel:
                    ConfirmationModalTexts.DELETE_LEASE_AREA.LABEL,
                  confirmationModalTitle:
                    ConfirmationModalTexts.DELETE_LEASE_AREA.TITLE,
                });
              };

              return (
                <LeaseAreaWithArchiveInfoEdit
                  key={index}
                  field={area}
                  index={index}
                  isActive={isActive}
                  onArchive={onArchive}
                  onRemove={handleRemove}
                  onUnarchive={onUnarchive}
                />
              );
            })}

          {isActive && (
            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_LEASEAREA,
              )}
            >
              <Row>
                <Column>
                  <AddButton label="Lisää kohde" onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          )}
        </>
      )}
    </AppConsumer>
  );
};

type Props = {
  valid: boolean;
};

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);
const LeaseAreasEdit: React.FC<Props & InjectedFormProps> = ({
  valid,
  change,
}) => {
  const dispatch = useDispatch();

  const currentLease = useSelector(getCurrentLease);
  const editedActiveAreas = useSelector((state) =>
    selector(state, "lease_areas_active"),
  );
  const editedArchivedAreas = useSelector((state) =>
    selector(state, "lease_areas_archived"),
  );
  const leaseAttributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);

  const { areas, activeAreas, areasSum } = useMemo(() => {
    if (!currentLease) {
      return {
        areas: [],
        activeAreas: [],
        areasSum: 0,
      };
    }
    const currentAreas = getContentLeaseAreas(currentLease);
    const currentlyActive = currentAreas.filter((area) => !area.archived_at);
    const sum = calculateAreasSum(currentlyActive);

    return {
      areas: currentAreas,
      activeAreas: currentlyActive,
      areasSum: sum,
    };
  }, [currentLease]);

  useEffect(() => {
    const formValues = getFormValues(formName)(store.getState()) as any;

    const addContractItemsToArea = (area: Record<string, any>) => {
      const savedArea = getLeaseAreaById(currentLease, area.id);

      if (savedArea) {
        return {
          ...area,
          plan_units_contract: savedArea.plan_units_contract,
          plots_contract: savedArea.plots_contract,
        };
      }

      return { ...area, plan_units_contract: [], plots_contract: [] };
    };

    if (formValues?.lease_areas_active) {
      dispatch(
        change(
          "lease_areas_active",
          formValues.lease_areas_active.map((area) =>
            addContractItemsToArea(area),
          ),
        ),
      );
    }

    if (formValues?.lease_areas_archived) {
      dispatch(
        change(
          "lease_areas_archived",
          formValues.lease_areas_archived.map((area) =>
            addContractItemsToArea(area),
          ),
        ),
      );
    }
  }, [currentLease, change, dispatch]);

  const [areaToArchive, setAreaToArchive] = useState<Record<
    string,
    any
  > | null>(null);

  const [areaIndexToArchive, setAreaIndexToArchive] = useState<number | null>(
    null,
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  const showArchiveAreaModal = useCallback(
    (index: number, area: Record<string, any>) => {
      setAreaToArchive(area);
      setAreaIndexToArchive(index);
      setShowModal(true);
      dispatch(initialize(FormNames.LEASE_ARCHIVE_AREA, {}));
    },
    [dispatch],
  );

  const hideArchiveAreaModal = useCallback(() => {
    setAreaToArchive(null);
    setAreaIndexToArchive(null);
    setShowModal(false);
  }, []);

  const handleArchive = useCallback(
    (archiveInfo: Record<string, any>) => {
      if (areaIndexToArchive === null || !areaToArchive) return;

      // Remove from active areas
      const newActiveAreas = editedActiveAreas.filter(
        (_, idx) => idx !== areaIndexToArchive,
      );
      change("lease_areas_active", newActiveAreas);

      // Add to archived areas
      const newArchivedItems = [
        ...editedArchivedAreas,
        { ...areaToArchive, ...archiveInfo },
      ];
      change("lease_areas_archived", newArchivedItems);

      hideArchiveAreaModal();
    },
    [
      areaIndexToArchive,
      areaToArchive,
      editedActiveAreas,
      editedArchivedAreas,
      change,
      hideArchiveAreaModal,
    ],
  );

  const handleUnarchiving = useCallback(
    (index: number, item: Record<string, any>) => {
      // Remove from archived areas
      const newArchivedAreas = editedArchivedAreas.filter(
        (_, idx) => idx !== index,
      );
      change("lease_areas_archived", newArchivedAreas);

      // Add to active areas
      const newActiveItems = [
        ...editedActiveAreas,
        {
          ...item,
          archived_at: null,
          archived_note: null,
          archived_decision: null,
        },
      ];
      change("lease_areas_active", newActiveItems);
    },
    [editedActiveAreas, editedArchivedAreas, change],
  );

  useEffect(() => {
    dispatch(
      receiveFormValidFlags({
        [formName]: valid,
      }),
    );
  }, [valid, dispatch]);

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        const handleCopyAreasToContract = () => {
          appDispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              dispatch(copyAreasToContract(currentLease.id));
            },
            confirmationModalButtonClassName: ButtonColors.SUCCESS,
            confirmationModalButtonText:
              ConfirmationModalTexts.COPY_AREAS_TO_CONTRACT.BUTTON,
            confirmationModalLabel:
              ConfirmationModalTexts.COPY_AREAS_TO_CONTRACT.LABEL,
            confirmationModalTitle:
              ConfirmationModalTexts.COPY_AREAS_TO_CONTRACT.TITLE,
          });
        };

        const handleUnarchive = (index: number, area: Record<string, any>) => {
          appDispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              handleUnarchiving(index, area);
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText:
              ConfirmationModalTexts.UNARCHIVE_LEASE_AREA.BUTTON,
            confirmationModalLabel:
              ConfirmationModalTexts.UNARCHIVE_LEASE_AREA.LABEL,
            confirmationModalTitle:
              ConfirmationModalTexts.UNARCHIVE_LEASE_AREA.TITLE,
          });
        };

        return (
          <form>
            <Authorization
              allow={isFieldAllowedToEdit(
                leaseAttributes,
                LeaseAreasFieldPaths.ARCHIVED_AT,
              )}
            >
              <ArchiveAreaModal
                onArchive={handleArchive}
                onCancel={hideArchiveAreaModal}
                onClose={hideArchiveAreaModal}
                open={showModal}
                valid={valid}
              />
            </Authorization>

            <Title
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.LEASE_AREAS)}
            >
              Vuokra-alue
            </Title>
            <WarningContainer
              alignCenter
              hideIcon
              buttonComponent={
                <Authorization
                  allow={hasPermissions(
                    usersPermissions,
                    UsersPermissions.ADD_LEASEAREA,
                  )}
                >
                  <Button
                    className={ButtonColors.NEUTRAL}
                    onClick={handleCopyAreasToContract}
                    text="Kopioi sopimukseen"
                  />
                </Authorization>
              }
            >
              <Authorization
                allow={isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseAreasFieldPaths.AREA,
                )}
              >
                <>
                  Kokonaispinta-ala {formatNumber(areasSum) || "-"} m
                  <sup>2</sup>
                </>
              </Authorization>
            </WarningContainer>
            <Divider />

            <FieldArray
              component={InnerLeaseAreas}
              isActive={true}
              name="lease_areas_active"
              onArchive={showArchiveAreaModal}
              usersPermissions={usersPermissions}
            />

            {/* Archived lease areas */}
            <FieldArray
              component={InnerLeaseAreas}
              isActive={false}
              name="lease_areas_archived"
              onUnarchive={handleUnarchive}
              usersPermissions={usersPermissions}
            />
          </form>
        );
      }}
    </AppConsumer>
  );
};

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
})(LeaseAreasEdit);
