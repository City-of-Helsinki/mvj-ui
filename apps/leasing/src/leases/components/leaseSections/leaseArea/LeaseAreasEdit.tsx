import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
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
import { copyAreasToContract } from "@/leases/actions";
import { ConfirmationModalTexts } from "@/enums";
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
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import type { Lease } from "@/leases/types";
import { Attributes } from "@/types";

type AreaItemProps = {
  fields: any;
  isActive: boolean;
  onArchive: (index: number, area: Record<string, any>) => void;
  onUnarchive: (
    index: number,
    area: Record<string, any>,
    appDispatch: (...args: Array<any>) => any,
  ) => void;
  formApi: FormApi;
};

const InnerLeaseAreasBase: React.FC<AreaItemProps> = ({
  fields,
  isActive,
  onArchive,
  onUnarchive,
  formApi,
}) => {
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

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
                  formApi={formApi}
                  key={index}
                  field={area}
                  index={index}
                  isActive={isActive}
                  onArchive={onArchive}
                  onRemove={handleRemove}
                  onUnarchive={(idx, areaData) =>
                    onUnarchive(idx, areaData, appDispatch)
                  }
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

const InnerLeaseAreas = memo(InnerLeaseAreasBase);

type Props = {
  formApi: FormApi;
};

const ATTR_LEASE_AREAS_ACTIVE = "lease_areas_active";
const ATTR_LEASE_AREAS_ARCHIVED = "lease_areas_archived";

const LeaseAreasEdit: React.FC<Props> = ({ formApi }) => {
  const currentLease: Lease = useSelector(getCurrentLease);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const { activeAreas, archivedAreas, areasSum } = useMemo(() => {
    if (!currentLease) {
      return {
        activeAreas: [],
        archivedAreas: [],
        areasSum: 0,
      };
    }
    const currentAreas = getContentLeaseAreas(currentLease);
    const currentlyActive = currentAreas.filter((area) => !area.archived_at);
    const currentlyArchived = currentAreas.filter((area) => area.archived_at);
    const sum = calculateAreasSum(currentlyActive);

    return {
      activeAreas: currentlyActive,
      archivedAreas: currentlyArchived,
      areasSum: sum,
    };
  }, [currentLease]);

  const isFirstRender = useRef(true);

  useEffect(() => {
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

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (formApi.getFieldState(ATTR_LEASE_AREAS_ACTIVE)?.value) {
      formApi.change(
        ATTR_LEASE_AREAS_ACTIVE,
        formApi
          .getState()
          .values.lease_areas_active.map((area) =>
            addContractItemsToArea(area),
          ),
      );
    }

    if (formApi.getFieldState(ATTR_LEASE_AREAS_ARCHIVED)?.value) {
      formApi.change(
        ATTR_LEASE_AREAS_ARCHIVED,
        formApi
          .getState()
          .values.lease_areas_archived.map((area) =>
            addContractItemsToArea(area),
          ),
      );
    }
  }, [currentLease, formApi]);

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
    },
    [],
  );

  const hideArchiveAreaModal = useCallback(() => {
    setAreaToArchive(null);
    setAreaIndexToArchive(null);
    setShowModal(false);
  }, []);

  const handleArchive = useCallback(
    (archiveInfo: Record<string, any>) => {
      if (areaIndexToArchive === null || !areaToArchive) return;

      const editedActiveAreas =
        formApi.getState().values?.[ATTR_LEASE_AREAS_ACTIVE] || [];
      const editedArchivedAreas =
        formApi.getState().values?.[ATTR_LEASE_AREAS_ARCHIVED] || [];

      // Remove from active areas
      const newActiveAreas = editedActiveAreas.filter(
        (_, idx) => idx !== areaIndexToArchive,
      );
      formApi.change(ATTR_LEASE_AREAS_ACTIVE, newActiveAreas);

      // Add to archived areas
      const newArchivedItems = [
        ...editedArchivedAreas,
        { ...areaToArchive, ...archiveInfo },
      ];
      formApi.change(ATTR_LEASE_AREAS_ARCHIVED, newArchivedItems);
      hideArchiveAreaModal();
    },
    [areaIndexToArchive, areaToArchive, formApi, hideArchiveAreaModal],
  );

  const handleUnarchiving = useCallback(
    (index: number, item: Record<string, any>) => {
      const editedActiveAreas =
        formApi.getState().values?.[ATTR_LEASE_AREAS_ACTIVE] || [];
      const editedArchivedAreas =
        formApi.getState().values?.[ATTR_LEASE_AREAS_ARCHIVED] || [];

      // Remove from archived areas
      const newArchivedAreas = editedArchivedAreas.filter(
        (_, idx) => idx !== index,
      );
      formApi.change(ATTR_LEASE_AREAS_ARCHIVED, newArchivedAreas);

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
      formApi.change(ATTR_LEASE_AREAS_ACTIVE, newActiveItems);
    },
    [formApi],
  );

  const handleUnarchive = useCallback(
    (
      index: number,
      area: Record<string, any>,
      appDispatch: (...args: Array<any>) => any,
    ) => {
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
    },
    [handleUnarchiving],
  );

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

        return (
          <Form
            form={formApi}
            onSubmit={formApi.submit}
            initialValues={{
              [ATTR_LEASE_AREAS_ACTIVE]: activeAreas,
              [ATTR_LEASE_AREAS_ARCHIVED]: archivedAreas,
            }}
          >
            {({ handleSubmit, valid }) => (
              <form onSubmit={handleSubmit}>
                <Authorization
                  allow={isFieldAllowedToEdit(
                    leaseAttributes,
                    LeaseAreasFieldPaths.ARCHIVED_AT,
                  )}
                >
                  <ArchiveAreaModal
                    formApi={formApi}
                    onArchive={handleArchive}
                    onCancel={hideArchiveAreaModal}
                    onClose={hideArchiveAreaModal}
                    open={showModal}
                    valid={valid}
                  />
                </Authorization>

                <Title
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.LEASE_AREAS,
                  )}
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

                <FieldArray name={ATTR_LEASE_AREAS_ACTIVE}>
                  {(fieldArrayProps) => (
                    <InnerLeaseAreas
                      {...fieldArrayProps}
                      formApi={formApi}
                      isActive={true}
                      onArchive={showArchiveAreaModal}
                      onUnarchive={handleUnarchive}
                    />
                  )}
                </FieldArray>

                <FieldArray name={ATTR_LEASE_AREAS_ARCHIVED}>
                  {(fieldArrayProps) => (
                    <InnerLeaseAreas
                      {...fieldArrayProps}
                      formApi={formApi}
                      isActive={false}
                      onArchive={showArchiveAreaModal}
                      onUnarchive={handleUnarchive}
                    />
                  )}
                </FieldArray>
              </form>
            )}
          </Form>
        );
      }}
    </AppConsumer>
  );
};

export default LeaseAreasEdit;
