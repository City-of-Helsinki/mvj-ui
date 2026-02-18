import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "react-foundation";

import { Link, useLocation } from "react-router-dom";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import Collapse from "@/components/collapse/Collapse";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import PlanUnitItemEdit from "./PlanUnitItemEdit";
import PlotItemEdit from "./PlotItemEdit";
import RemoveButton from "@/components/form/RemoveButton";
import SubTitle from "@/components/content/SubTitle";
import { receiveCollapseStates } from "@/leases/actions";
import {
  ConfirmationModalTexts,
  FieldTypes,
  FormNames,
  ViewModes,
} from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  LeaseAreaAddressesFieldPaths,
  LeaseAreaAddressesFieldTitles,
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
  LeasePlanUnitsFieldPaths,
  LeasePlotsFieldPaths,
  LeaseAreaCustomDetailedPlanFieldPaths,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  getSearchQuery,
  getUrlParams,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from "@/util/helpers";
import {
  getAttributes,
  getCollapseStateByKey,
  getErrorsByFormName,
  getIsSaveClicked,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import CustomDetailedPlanEdit from "./CustomDetailedPlanEdit";
import FormField from "@/components/form/final-form/FormField";
import { FieldArray } from "react-final-form-arrays";
import { useField } from "react-final-form";
import { FormApi } from "final-form";

type PlanUnitsProps = {
  formApi: FormApi;
  buttonTitle: string;
  collapseState: boolean;
  errors: Record<string, any>;
  fields: any;
  noDataText: string;
  onCollapseToggle: (...args: Array<any>) => any;
  title: string;
  uiDataKey: string;
};

const formName = FormNames.LEASE_AREAS;

const PlanUnits = ({
  formApi,
  buttonTitle,
  collapseState,
  errors,
  fields,
  fields: { name },
  noDataText,
  onCollapseToggle,
  title,
  uiDataKey,
}: PlanUnitsProps): ReactElement => {
  const attributes: Attributes = useSelector(getAttributes);
  const isSaveClicked: boolean = useSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const handleAdd = () => {
    fields.push({
      addresses: [{}],
    });
  };

  const handleCollapseToggle = (val: boolean) => {
    onCollapseToggle(val);
  };

  const planUnitErrors = errors?.[name];
  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        return (
          <Collapse
            className="collapse__secondary"
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && JSON.stringify(planUnitErrors) !== "{}"}
            headerTitle={title}
            onToggle={handleCollapseToggle}
            enableUiDataEdit
            uiDataKey={uiDataKey}
          >
            {!isFieldAllowedToEdit(
              attributes,
              LeasePlanUnitsFieldPaths.PLAN_UNITS,
            ) &&
              (!fields || !fields.length) && <FormText>{noDataText}</FormText>}

            {!!fields.length && (
              <BoxItemContainer>
                {fields.map((planunit, index) => {
                  const handleRemove = () => {
                    appDispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText:
                        ConfirmationModalTexts.DELETE_PLAN_UNIT.BUTTON,
                      confirmationModalLabel:
                        ConfirmationModalTexts.DELETE_PLAN_UNIT.LABEL,
                      confirmationModalTitle:
                        ConfirmationModalTexts.DELETE_PLAN_UNIT.TITLE,
                    });
                  };

                  return (
                    <PlanUnitItemEdit
                      formApi={formApi}
                      key={index}
                      field={planunit}
                      onRemove={handleRemove}
                    />
                  );
                })}
              </BoxItemContainer>
            )}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_PLANUNIT,
              )}
            >
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={!fields.length ? "no-top-margin" : ""}
                    label={buttonTitle}
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type PlotsProps = {
  formApi: FormApi;
  buttonTitle: string;
  collapseState: boolean;
  errors: Record<string, any> | undefined;
  fields: any;
  noDataText: string;
  onCollapseToggle: (...args: Array<any>) => any;
  plotsData: Array<Record<string, any>>;
  title: string;
  uiDataKey: string;
};

const Plots = ({
  formApi,
  buttonTitle,
  collapseState,
  errors,
  fields,
  fields: { name },
  noDataText,
  onCollapseToggle,
  plotsData,
  title,
  uiDataKey,
}: PlotsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({
      addresses: [{}],
    });
  };

  const attributes: Attributes = useSelector(getAttributes);
  const isSaveClicked: boolean = useSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const handleCollapseToggle = (val: boolean) => {
    onCollapseToggle(val);
  };

  const plotErrors = errors?.[name];
  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        return (
          <Collapse
            className="collapse__secondary"
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && plotErrors && plotErrors.length > 0}
            headerTitle={title}
            onToggle={handleCollapseToggle}
            enableUiDataEdit
            uiDataKey={uiDataKey}
          >
            {!isFieldAllowedToEdit(attributes, LeasePlotsFieldPaths.PLOTS) &&
              (!fields || !fields.length) && <FormText>{noDataText}</FormText>}

            {!!fields.length && (
              <BoxItemContainer>
                {fields.map((plot, index) => {
                  const handleDelete = () => {
                    appDispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText:
                        ConfirmationModalTexts.DELETE_PLOT.BUTTON,
                      confirmationModalLabel:
                        ConfirmationModalTexts.DELETE_PLOT.LABEL,
                      confirmationModalTitle:
                        ConfirmationModalTexts.DELETE_PLOT.TITLE,
                    });
                  };

                  return (
                    <PlotItemEdit
                      formApi={formApi}
                      key={index}
                      field={plot}
                      plotId={plot.id}
                      geometry={plot.geometry}
                      onRemove={handleDelete}
                      plotsData={plotsData}
                    />
                  );
                })}
              </BoxItemContainer>
            )}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_PLOT,
              )}
            >
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={!fields.length ? "no-top-margin" : ""}
                    label={buttonTitle}
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type AddressProps = {
  formApi: FormApi;
  field: string;
  onRemove: (...args: Array<any>) => any;
};

const Address = ({ formApi, field, onRemove }: AddressProps) => {
  const attributes: Attributes = useSelector(getAttributes);
  const isSaveClicked: boolean = useSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const handleAddressChange = (details: Record<string, any>) => {
    formApi.change(`${field}.postal_code`, details.postalCode);
    formApi.change(`${field}.city`, details.city);
  };

  return (
    <Row>
      <Column small={3} large={4}>
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreaAddressesFieldPaths.ADDRESS,
          )}
        >
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(
              attributes,
              LeaseAreaAddressesFieldPaths.ADDRESS,
            )}
            invisibleLabel
            name={`${field}.address`}
            valueSelectedCallback={handleAddressChange}
            overrideValues={{
              fieldType: FieldTypes.ADDRESS,
              label: LeaseAreaAddressesFieldTitles.ADDRESS,
            }}
          />
        </Authorization>
      </Column>
      <Column small={3} large={2}>
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreaAddressesFieldPaths.POSTAL_CODE,
          )}
        >
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(
              attributes,
              LeaseAreaAddressesFieldPaths.POSTAL_CODE,
            )}
            invisibleLabel
            name={`${field}.postal_code`}
            overrideValues={{
              label: LeaseAreaAddressesFieldTitles.POSTAL_CODE,
            }}
          />
        </Authorization>
      </Column>
      <Column small={3} large={2}>
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreaAddressesFieldPaths.CITY,
          )}
        >
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(
              attributes,
              LeaseAreaAddressesFieldPaths.CITY,
            )}
            invisibleLabel
            name={`${field}.city`}
            overrideValues={{
              label: LeaseAreaAddressesFieldTitles.CITY,
            }}
          />
        </Authorization>
      </Column>
      <Column small={3} large={2}>
        <FieldAndRemoveButtonWrapper
          field={
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreaAddressesFieldPaths.IS_PRIMARY,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseAreaAddressesFieldPaths.IS_PRIMARY,
                )}
                invisibleLabel
                name={`${field}.is_primary`}
                overrideValues={{
                  label: LeaseAreaAddressesFieldTitles.IS_PRIMARY,
                }}
              />
            </Authorization>
          }
          removeButton={
            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.DELETE_LEASEAREAADDRESS,
              )}
            >
              <RemoveButton
                className="third-level"
                onClick={onRemove}
                title="Poista osoite"
              />
            </Authorization>
          }
        />
      </Column>
    </Row>
  );
};

type AddressesProps = {
  formApi: FormApi;
  fields: any;
};

const AddressItems = ({ formApi, fields }: AddressesProps): ReactElement => {
  const attributes: Attributes = useSelector(getAttributes);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        return (
          <>
            <SubTitle
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseAreaAddressesFieldPaths.ADDRESSES,
              )}
            >
              {LeaseAreaAddressesFieldTitles.ADDRESSES}
            </SubTitle>
            {fields && !!fields.length && (
              <Row>
                <Column small={3} large={4}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      attributes,
                      LeaseAreaAddressesFieldPaths.ADDRESS,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        attributes,
                        LeaseAreaAddressesFieldPaths.ADDRESS,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        LeaseAreaAddressesFieldPaths.ADDRESS,
                      )}
                    >
                      {LeaseAreaAddressesFieldTitles.ADDRESS}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      attributes,
                      LeaseAreaAddressesFieldPaths.POSTAL_CODE,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        attributes,
                        LeaseAreaAddressesFieldPaths.POSTAL_CODE,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        LeaseAreaAddressesFieldPaths.POSTAL_CODE,
                      )}
                    >
                      {LeaseAreaAddressesFieldTitles.POSTAL_CODE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      attributes,
                      LeaseAreaAddressesFieldPaths.CITY,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        attributes,
                        LeaseAreaAddressesFieldPaths.CITY,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        LeaseAreaAddressesFieldPaths.CITY,
                      )}
                    >
                      {LeaseAreaAddressesFieldTitles.CITY}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      attributes,
                      LeaseAreaAddressesFieldPaths.IS_PRIMARY,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        attributes,
                        LeaseAreaAddressesFieldPaths.IS_PRIMARY,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        LeaseAreaAddressesFieldPaths.IS_PRIMARY,
                      )}
                    >
                      {LeaseAreaAddressesFieldTitles.IS_PRIMARY}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            )}
            {fields &&
              !!fields.length &&
              fields.map((field, index) => {
                const handleRemove = () => {
                  appDispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_ADDRESS.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_ADDRESS.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_ADDRESS.TITLE,
                  });
                };

                return (
                  <Address
                    formApi={formApi}
                    key={index}
                    field={field}
                    onRemove={handleRemove}
                  />
                );
              })}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_LEASEAREAADDRESS,
              )}
            >
              <Row>
                <Column>
                  <AddButtonThird label="Lisää osoite" onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  formApi: FormApi;
  field: string;
  index: number;
  savedArea: Record<string, any>;
  areaId: number;
};

const LeaseAreaEdit: React.FC<Props> = ({
  formApi,
  areaId,
  index,
  field,
  savedArea,
}) => {
  const dispatch = useDispatch();

  const attributes = useSelector(getAttributes);
  const isSaveClicked = useSelector(getIsSaveClicked);
  const usersPermissions = useSelector(getUsersPermissions);
  const errors = useSelector((state) => getErrorsByFormName(state, formName));
  const location = useLocation();

  const geometry = savedArea?.geometry;

  const {
    input: { value: custom_detailed_plan },
  } = useField(`${field}.custom_detailed_plan`, {
    subscription: { value: true },
  });

  const planUnitsContractCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${formName}.${areaId}.plan_units_contract`,
    ),
  );
  const planUnitsCurrentCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${formName}.${areaId}.plan_units_current`,
    ),
  );
  const plotsContractCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${formName}.${areaId}.plots_contract`,
    ),
  );
  const plotsCurrentCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${formName}.${areaId}.plots_current`,
    ),
  );
  const customDetailedPlanCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${formName}.${areaId}.custom_detailed_plan`,
    ),
  );

  const handleCollapseToggle = (key: string, val: boolean) => {
    if (!areaId) {
      return;
    }
    dispatch(
      receiveCollapseStates({
        [ViewModes.EDIT]: {
          [formName]: {
            [areaId]: {
              [key]: val,
            },
          },
        },
      }),
    );
  };
  const handlePlanUnitContractCollapseToggle = (val: boolean) => {
    handleCollapseToggle("plan_units_contract", val);
  };
  const handlePlanUnitCurrentCollapseToggle = (val: boolean) => {
    handleCollapseToggle("plan_units_current", val);
  };
  const handleCustomDetailedPlanCollapseToggle = (val: boolean) => {
    handleCollapseToggle("custom_detailed_plan", val);
  };
  const handlePlotsContractCollapseToggle = (val: boolean) => {
    handleCollapseToggle("plots_contract", val);
  };
  const handlePlotsCurrentCollapseToggle = (val: boolean) => {
    handleCollapseToggle("plots_current", val);
  };

  const getMapLinkUrl = () => {
    const { pathname, search } = location;
    const searchQuery = getUrlParams(search);
    delete searchQuery.plan_unit;
    delete searchQuery.plot;
    searchQuery.lease_area = areaId;
    searchQuery.tab = 7;
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };
  const mapLinkUrl = getMapLinkUrl();

  return (
    <>
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.IDENTIFIER,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseAreasFieldPaths.IDENTIFIER,
                )}
                name={`${field}.identifier`}
                overrideValues={{
                  label: LeaseAreasFieldTitles.IDENTIFIER,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.IDENTIFIER)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.TYPE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseAreasFieldPaths.TYPE,
                )}
                name={`${field}.type`}
                overrideValues={{
                  label: LeaseAreasFieldTitles.TYPE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.TYPE)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.AREA,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseAreasFieldPaths.AREA,
                )}
                name={`${field}.area`}
                unit="m²"
                overrideValues={{
                  label: LeaseAreasFieldTitles.AREA,
                }}
                enableUiDataEdit
                tooltipStyle={{
                  right: 22,
                }}
                uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.AREA)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.LOCATION,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseAreasFieldPaths.LOCATION,
                )}
                name={`${field}.location`}
                overrideValues={{
                  label: LeaseAreasFieldTitles.LOCATION,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.LOCATION)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.GEOMETRY,
              )}
            >
              {JSON.stringify(geometry) !== "{}" ? (
                <Link to={mapLinkUrl}>{LeaseAreasFieldTitles.GEOMETRY}</Link>
              ) : null}
            </Authorization>
          </Column>
        </Row>
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreaAddressesFieldPaths.ADDRESSES,
          )}
        >
          <FieldArray name={`${field}.addresses`}>
            {(fieldArrayProps) => (
              <AddressItems {...fieldArrayProps} formApi={formApi} />
            )}
          </FieldArray>
        </Authorization>
      </BoxContentWrapper>

      <Authorization
        allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.PLOTS)}
      >
        <Row>
          <Column small={12} large={6}>
            <FieldArray name={`${field}.plots_contract`}>
              {(fieldArrayProps) =>
                Plots({
                  ...fieldArrayProps,
                  formApi,
                  buttonTitle: "Lisää kiinteistö/määräala",
                  collapseState: plotsContractCollapseState,
                  errors: { errors },
                  noDataText: "Ei kiinteistöjä/määräaloja sopimuksessa",
                  onCollapseToggle: handlePlotsContractCollapseToggle,
                  plotsData: savedArea ? savedArea["plots_contract"] : [],
                  title: "Kiinteistöt / määräalat sopimuksessa",
                  uiDataKey: getUiDataLeaseKey(
                    LeasePlotsFieldPaths.PLOTS_CONTRACT,
                  ),
                })
              }
            </FieldArray>
          </Column>
          <Column small={12} large={6}>
            <FieldArray name={`${field}.plots_current`}>
              {(fieldArrayProps) =>
                Plots({
                  ...fieldArrayProps,
                  formApi,
                  buttonTitle: "Lisää kiinteistö/määräala",
                  collapseState: plotsCurrentCollapseState,
                  errors: { errors },
                  noDataText: "Ei kiinteistöjä/määräaloja nykyhetkellä",
                  onCollapseToggle: handlePlotsCurrentCollapseToggle,
                  plotsData: savedArea ? savedArea["plots_current"] : [],
                  title: "Kiinteistöt / määräalat nykyhetkellä",
                  uiDataKey: getUiDataLeaseKey(LeasePlotsFieldPaths.PLOTS),
                })
              }
            </FieldArray>
          </Column>
        </Row>
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeasePlanUnitsFieldPaths.PLAN_UNITS,
        )}
      >
        <Row>
          <Column small={12} large={6}>
            <FieldArray name={`${field}.plan_units_contract`}>
              {(fieldArrayProps) =>
                PlanUnits({
                  ...fieldArrayProps,
                  formApi,
                  buttonTitle: "Lisää kaavayksikkö",
                  collapseState: planUnitsContractCollapseState,
                  errors: { errors },
                  noDataText: "Ei kaavayksiköitä sopimuksessa",
                  onCollapseToggle: handlePlanUnitContractCollapseToggle,
                  title: "Kaavayksiköt sopimuksessa",
                  uiDataKey: getUiDataLeaseKey(
                    LeasePlanUnitsFieldPaths.PLAN_UNITS_CONTRACT,
                  ),
                })
              }
            </FieldArray>
          </Column>
          <Column small={12} large={6}>
            <FieldArray name={`${field}.plan_units_current`}>
              {(fieldArrayProps) =>
                PlanUnits({
                  ...fieldArrayProps,
                  formApi,
                  buttonTitle: "Lisää kaavayksikkö",
                  collapseState: planUnitsCurrentCollapseState,
                  errors: { errors },
                  noDataText: "Ei kaavayksiköitä nykyhetkellä",
                  onCollapseToggle: handlePlanUnitCurrentCollapseToggle,
                  title: "Kaavayksiköt nykyhetkellä",
                  uiDataKey: getUiDataLeaseKey(
                    LeasePlanUnitsFieldPaths.PLAN_UNITS,
                  ),
                })
              }
            </FieldArray>
          </Column>
          <Column small={0} large={6} /> {/* Force next column to right */}
          <Column small={12} large={6}>
            <FieldArray name={`${field}.plan_units_pending`}>
              {(fieldArrayProps) =>
                PlanUnits({
                  ...fieldArrayProps,
                  formApi,
                  buttonTitle: "Vireillä olevat kaavayksiköt",
                  collapseState: planUnitsCurrentCollapseState,
                  errors: { errors },
                  noDataText: "Ei vireillä olevia kaavayksiköitä",
                  onCollapseToggle: handlePlanUnitCurrentCollapseToggle,
                  title: "Vireillä olevat kaavayksiköt",
                  uiDataKey: null, // No uiDataKey
                })
              }
            </FieldArray>
          </Column>
        </Row>
      </Authorization>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeasePlotsFieldPaths.CUSTOM_DETAILED_PLAN,
        )}
      >
        <Row>
          <Column small={12} large={6} /> {/* Force next column to right */}
          <Column small={12} large={6}>
            <Collapse
              className="collapse__secondary"
              defaultOpen={
                customDetailedPlanCollapseState !== undefined
                  ? customDetailedPlanCollapseState
                  : true
              }
              hasErrors={
                isSaveClicked &&
                JSON.stringify(customDetailedPlanCollapseState) !== "{}"
              }
              headerTitle={"Oma muu alue"}
              onToggle={(val) => handleCustomDetailedPlanCollapseToggle(val)}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseAreaCustomDetailedPlanFieldPaths.CUSTOM_DETAILED_PLAN,
              )}
            >
              {custom_detailed_plan && (
                <BoxItemContainer>
                  <CustomDetailedPlanEdit
                    formApi={formApi}
                    field={`${field}.custom_detailed_plan`}
                    onRemove={() =>
                      formApi.change(`${field}.custom_detailed_plan`, null)
                    }
                  />
                </BoxItemContainer>
              )}
              <Authorization
                allow={
                  hasPermissions(
                    usersPermissions,
                    UsersPermissions.ADD_CUSTOMDETAILEDPLAN,
                  ) && !custom_detailed_plan
                }
              >
                <Row>
                  <Column>
                    <AddButtonSecondary
                      className={"no-top-margin"}
                      label={"Lisää oma muu alue"}
                      onClick={() =>
                        formApi.change(`${field}.custom_detailed_plan`, {})
                      }
                    />
                  </Column>
                </Row>
              </Authorization>
            </Collapse>
          </Column>
        </Row>
      </Authorization>
    </>
  );
};

export default LeaseAreaEdit;
