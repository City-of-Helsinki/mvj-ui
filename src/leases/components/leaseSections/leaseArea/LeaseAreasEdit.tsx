import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import {
  FieldArray,
  formValueSelector,
  getFormValues,
  initialize,
  reduxForm,
} from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButton from "@/components/form/AddButton";
import ArchiveAreaModal from "./ArchiveAreaModal";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import Divider from "@/components/content/Divider";
import LeaseAreaWithArchiveInfoEdit from "./LeaseAreaWithArchiveInfoEdit";
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
  getDecisionOptions,
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
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type AreaItemProps = {
  decisionOptions: Array<Record<string, any>>;
  fields: any;
  isActive: boolean;
  onArchive: (...args: Array<any>) => any;
  onUnarchive: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

class renderLeaseAreas extends PureComponent<AreaItemProps> {
  handleAdd = () => {
    const { fields } = this.props;
    fields.push({
      addresses: [{}],
      location: AreaLocation.SURFACE,
    });
  };
  removeArea = (index: number) => {
    const { fields } = this.props;
    fields.remove(index);
  };

  render() {
    const {
      decisionOptions,
      fields,
      isActive,
      onArchive,
      onUnarchive,
      usersPermissions,
    } = this.props;
    return (
      <AppConsumer>
        {({ dispatch }) => {
          return (
            <Fragment>
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
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
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
                      decisionOptions={decisionOptions}
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
                      <AddButton label="Lisää kohde" onClick={this.handleAdd} />
                    </Column>
                  </Row>
                </Authorization>
              )}
            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

type Props = {
  change: (...args: Array<any>) => any;
  copyAreasToContract: (...args: Array<any>) => any;
  currentLease: Lease;
  editedActiveAreas: Array<Record<string, any>>;
  editedArchivedAreas: Array<Record<string, any>>;
  initialize: (...args: Array<any>) => any;
  leaseAttributes: Attributes;
  receiveFormValidFlags: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
};
type State = {
  areasSum: number | null | undefined;
  areaToArchive: Record<string, any> | null | undefined;
  areaIndexToArchive: number | null | undefined;
  currentLease: Lease;
  decisionOptions: Array<Record<string, any>>;
  showArchiveAreaModal: boolean;
};

class LeaseAreasEdit extends PureComponent<Props, State> {
  activeAreasComponent: any;
  archivedAreasComponent: any;
  state = {
    areasSum: null,
    areaToArchive: null,
    areaIndexToArchive: null,
    currentLease: {},
    decisionOptions: [],
    showArchiveAreaModal: false,
  };
  setActiveAreasRef = (el: any) => {
    this.activeAreasComponent = el;
  };
  setArchivedAreasRef = (el: any) => {
    this.archivedAreasComponent = el;
  };

  static getDerivedStateFromProps(props, state) {
    const newState: any = {};

    if (props.currentLease !== state.currentLease) {
      const areas = getContentLeaseAreas(props.currentLease),
        activeAreas = areas.filter((area) => !area.archived_at);
      newState.areas = areas;
      newState.areasSum = calculateAreasSum(activeAreas);
      newState.currentLease = props.currentLease;
      newState.decisionOptions = getDecisionOptions(props.currentLease);
    }

    return newState;
  }

  componentDidUpdate(prevProps: Props) {
    const { receiveFormValidFlags } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LEASE_AREAS]: this.props.valid,
      });
    }

    if (prevProps.currentLease !== this.props.currentLease) {
      this.addCopiedPlotsAndPlanUnits();
    }
  }

  addCopiedPlotsAndPlanUnits = () => {
    const { change, currentLease } = this.props;
    const formValues = getFormValues(formName)(store.getState());

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

    change(
      "lease_areas_active",
      formValues.lease_areas_active.map((area) => addContractItemsToArea(area)),
    );
    change(
      "lease_areas_archived",
      formValues.lease_areas_archived.map((area) =>
        addContractItemsToArea(area),
      ),
    );
  };
  showArchiveAreaModal = (index: number, area: Record<string, any>) => {
    const { initialize } = this.props;
    this.setState({
      areaToArchive: area,
      areaIndexToArchive: index,
      showArchiveAreaModal: true,
    });
    initialize(FormNames.LEASE_ARCHIVE_AREA, {});
  };
  handleHideArchiveAreaModal = () => {
    this.setState({
      areaIndexToArchive: null,
      areaToArchive: null,
      showArchiveAreaModal: false,
    });
  };
  handleArchive = (archiveInfo: Record<string, any>) => {
    const { areaToArchive, areaIndexToArchive } = this.state;
    this.activeAreasComponent
      .getRenderedComponent()
      .removeArea(areaIndexToArchive);
    this.addArchivedItemToActiveItems({ ...areaToArchive, ...archiveInfo });
    this.handleHideArchiveAreaModal();
  };
  addArchivedItemToActiveItems = (item: Record<string, any>) => {
    const { change, editedArchivedAreas } = this.props,
      newItems = [...editedArchivedAreas, item];
    change("lease_areas_archived", newItems);
  };
  handleUnarchive = (index: number, item: Record<string, any>) => {
    this.archivedAreasComponent.getRenderedComponent().removeArea(index);
    this.addUnarchivedItemToArchivedItems(item);
  };
  addUnarchivedItemToArchivedItems = (item: Record<string, any>) => {
    const { change, editedActiveAreas } = this.props,
      newItems = [
        ...editedActiveAreas,
        {
          ...item,
          archived_at: null,
          archived_note: null,
          archived_decision: null,
        },
      ];
    change("lease_areas_active", newItems);
  };

  render() {
    const { areasSum, decisionOptions, showArchiveAreaModal } = this.state;
    const { leaseAttributes, usersPermissions } = this.props;
    return (
      <AppConsumer>
        {({ dispatch }) => {
          const handleCopyAreasToContract = () => {
            const { copyAreasToContract, currentLease } = this.props;
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                copyAreasToContract(currentLease.id);
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

          const handleUnarchive = (
            index: number,
            area: Record<string, any>,
          ) => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.handleUnarchive(index, area);
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
                  decisionOptions={decisionOptions}
                  onArchive={this.handleArchive}
                  onCancel={this.handleHideArchiveAreaModal}
                  onClose={this.handleHideArchiveAreaModal}
                  open={showArchiveAreaModal}
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
                ref={this.setActiveAreasRef}
                component={renderLeaseAreas}
                decisionOptions={decisionOptions}
                isActive={true}
                name="lease_areas_active"
                onArchive={this.showArchiveAreaModal}
                usersPermissions={usersPermissions}
                forwardRef
              />

              {/* Archived lease areas */}
              <FieldArray
                ref={this.setArchivedAreasRef}
                component={renderLeaseAreas}
                decisionOptions={decisionOptions}
                isActive={false}
                name="lease_areas_archived"
                onUnarchive={handleUnarchive}
                usersPermissions={usersPermissions}
                forwardRef
              />
            </form>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);
export default flowRight(
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
        editedActiveAreas: selector(state, "lease_areas_active"),
        editedArchivedAreas: selector(state, "lease_areas_archived"),
        leaseAttributes: getLeaseAttributes(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      copyAreasToContract,
      initialize,
      receiveFormValidFlags,
    },
  ),
)(LeaseAreasEdit) as React.ComponentType<any>;
