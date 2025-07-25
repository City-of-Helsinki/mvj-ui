import React, { Fragment, PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { FieldArray, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import flowRight from "lodash/flowRight";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import RemoveButton from "@/components/form/RemoveButton";
import SubTitle from "@/components/content/SubTitle";
import { receiveFormValid } from "@/rentbasis/actions";
import { ConfirmationModalTexts, FieldTypes, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  RentBasisFieldPaths,
  RentBasisFieldTitles,
  RentBasisDecisionsFieldPaths,
  RentBasisDecisionsFieldTitles,
  RentBasisPropertyIdentifiersFieldPaths,
  RentBasisPropertyIdentifiersFieldTitles,
  RentBasisRentRatesFieldPaths,
  RentBasisRentRatesFieldTitles,
} from "@/rentbasis/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataRentBasisKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  getFieldOptions,
  hasPermissions,
  isEmptyValue,
  isFieldAllowedToRead,
  isFieldRequired,
} from "@/util/helpers";
import { validateRentBasisForm } from "@/rentbasis/formValidators";
import {
  getAttributes as getRentBasisAttributes,
  getIsFormValid,
  getIsSaveClicked,
  getRentBasisInitialValues,
} from "@/rentbasis/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { referenceNumber } from "@/components/form/validations";
import type { Attributes } from "types";
import type { RootState } from "@/root/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type PropertyIdentifiersProps = {
  fields: any;
  isSaveClicked: boolean;
  rentBasisAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

const renderPropertyIdentifiers = ({
  fields,
  isSaveClicked,
  rentBasisAttributes,
  usersPermissions,
}: PropertyIdentifiersProps): ReactNode => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Fragment>
            <FormTextTitle
              required={isFieldRequired(
                rentBasisAttributes,
                RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER,
              )}
              enableUiDataEdit
              tooltipStyle={{
                right: 20,
              }}
              uiDataKey={getUiDataRentBasisKey(
                RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS,
              )}
            >
              {RentBasisPropertyIdentifiersFieldTitles.PROPERTY_IDENTIFIERS}
            </FormTextTitle>
            {!hasPermissions(
              usersPermissions,
              UsersPermissions.ADD_BASISOFRENTPROPERTYIDENTIFIER,
            ) &&
              (!fields || !fields.length) && (
                <FormText>Ei kiinteistötunnuksia</FormText>
              )}

            {fields &&
              !!fields.length &&
              fields.map((field, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_PROPERTY_IDENTIFIER.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_PROPERTY_IDENTIFIER.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_PROPERTY_IDENTIFIER.TITLE,
                  });
                };

                return (
                  <Row key={index}>
                    <Column>
                      <FieldAndRemoveButtonWrapper
                        field={
                          <Authorization
                            allow={isFieldAllowedToRead(
                              rentBasisAttributes,
                              RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER,
                            )}
                          >
                            <FormFieldLegacy
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(
                                rentBasisAttributes,
                                RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER,
                              )}
                              invisibleLabel
                              name={`${field}.identifier`}
                              overrideValues={{
                                label:
                                  RentBasisPropertyIdentifiersFieldTitles.IDENTIFIER,
                              }}
                              enableUiDataEdit
                              uiDataKey={getUiDataRentBasisKey(
                                RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER,
                              )}
                            />
                          </Authorization>
                        }
                        removeButton={
                          <Authorization
                            allow={hasPermissions(
                              usersPermissions,
                              UsersPermissions.DELETE_BASISOFRENTPROPERTYIDENTIFIER,
                            )}
                          >
                            <RemoveButton
                              className="third-level"
                              onClick={handleRemove}
                              title="Poista kiinteistötunnus"
                            />
                          </Authorization>
                        }
                      />
                    </Column>
                  </Row>
                );
              })}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_BASISOFRENTPROPERTYIDENTIFIER,
              )}
            >
              <Row>
                <Column>
                  <AddButtonThird
                    label="Lisää kiinteistötunnus"
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type DecisionsProps = {
  fields: any;
  isSaveClicked: boolean;
  rentBasisAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

const renderDecisions = ({
  fields,
  isSaveClicked,
  rentBasisAttributes,
  usersPermissions,
}: DecisionsProps): ReactNode => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Fragment>
            <SubTitle
              enableUiDataEdit
              uiDataKey={getUiDataRentBasisKey(
                RentBasisDecisionsFieldPaths.DECISIONS,
              )}
            >
              {RentBasisDecisionsFieldTitles.DECISIONS}
            </SubTitle>
            {!hasPermissions(
              usersPermissions,
              UsersPermissions.ADD_BASISOFRENTDECISION,
            ) &&
              (!fields || !fields.length) && <FormText>Ei sopimuksia</FormText>}
            {fields && !!fields.length && (
              <Row>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      rentBasisAttributes,
                      RentBasisDecisionsFieldPaths.DECISION_MAKER,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        rentBasisAttributes,
                        RentBasisDecisionsFieldPaths.DECISION_MAKER,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataRentBasisKey(
                        RentBasisDecisionsFieldPaths.DECISION_MAKER,
                      )}
                    >
                      {RentBasisDecisionsFieldTitles.DECISION_MAKER}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      rentBasisAttributes,
                      RentBasisDecisionsFieldPaths.DECISION_DATE,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        rentBasisAttributes,
                        RentBasisDecisionsFieldPaths.DECISION_DATE,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataRentBasisKey(
                        RentBasisDecisionsFieldPaths.DECISION_DATE,
                      )}
                    >
                      {RentBasisDecisionsFieldTitles.DECISION_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      rentBasisAttributes,
                      RentBasisDecisionsFieldPaths.SECTION,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        rentBasisAttributes,
                        RentBasisDecisionsFieldPaths.SECTION,
                      )}
                      enableUiDataEdit
                      tooltipStyle={{
                        right: 12,
                      }}
                      uiDataKey={getUiDataRentBasisKey(
                        RentBasisDecisionsFieldPaths.SECTION,
                      )}
                    >
                      {RentBasisDecisionsFieldTitles.SECTION}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      rentBasisAttributes,
                      RentBasisDecisionsFieldPaths.REFERENCE_NUMBER,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        rentBasisAttributes,
                        RentBasisDecisionsFieldPaths.REFERENCE_NUMBER,
                      )}
                      enableUiDataEdit
                      tooltipStyle={{
                        right: 20,
                      }}
                      uiDataKey={getUiDataRentBasisKey(
                        RentBasisDecisionsFieldPaths.REFERENCE_NUMBER,
                      )}
                    >
                      {RentBasisDecisionsFieldTitles.REFERENCE_NUMBER}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            )}

            {fields &&
              !!fields.length &&
              fields.map((field, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_DECISION.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_DECISION.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_DECISION.TITLE,
                  });
                };

                return (
                  <Row key={index}>
                    <Column small={3} large={2}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          rentBasisAttributes,
                          RentBasisDecisionsFieldPaths.DECISION_MAKER,
                        )}
                      >
                        <FormFieldLegacy
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(
                            rentBasisAttributes,
                            RentBasisDecisionsFieldPaths.DECISION_MAKER,
                          )}
                          invisibleLabel
                          name={`${field}.decision_maker`}
                          overrideValues={{
                            label: RentBasisDecisionsFieldTitles.DECISION_MAKER,
                          }}
                        />
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          rentBasisAttributes,
                          RentBasisDecisionsFieldPaths.DECISION_DATE,
                        )}
                      >
                        <FormFieldLegacy
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(
                            rentBasisAttributes,
                            RentBasisDecisionsFieldPaths.DECISION_DATE,
                          )}
                          invisibleLabel
                          name={`${field}.decision_date`}
                          overrideValues={{
                            label: RentBasisDecisionsFieldTitles.DECISION_DATE,
                          }}
                        />
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          rentBasisAttributes,
                          RentBasisDecisionsFieldPaths.SECTION,
                        )}
                      >
                        <FormFieldLegacy
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(
                            rentBasisAttributes,
                            RentBasisDecisionsFieldPaths.SECTION,
                          )}
                          invisibleLabel
                          name={`${field}.section`}
                          unit="§"
                          overrideValues={{
                            label: RentBasisDecisionsFieldTitles.SECTION,
                          }}
                        />
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <FieldAndRemoveButtonWrapper
                        field={
                          <Authorization
                            allow={isFieldAllowedToRead(
                              rentBasisAttributes,
                              RentBasisDecisionsFieldPaths.REFERENCE_NUMBER,
                            )}
                          >
                            <FormFieldLegacy
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(
                                rentBasisAttributes,
                                RentBasisDecisionsFieldPaths.REFERENCE_NUMBER,
                              )}
                              invisibleLabel
                              name={`${field}.reference_number`}
                              validate={referenceNumber}
                              overrideValues={{
                                label:
                                  RentBasisDecisionsFieldTitles.REFERENCE_NUMBER,
                                fieldType: FieldTypes.REFERENCE_NUMBER,
                              }}
                            />
                          </Authorization>
                        }
                        removeButton={
                          <Authorization
                            allow={hasPermissions(
                              usersPermissions,
                              UsersPermissions.DELETE_BASISOFRENTDECISION,
                            )}
                          >
                            <RemoveButton
                              className="third-level"
                              onClick={handleRemove}
                              title="Poista päätös"
                            />
                          </Authorization>
                        }
                      />
                    </Column>
                  </Row>
                );
              })}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_BASISOFRENTDECISION,
              )}
            >
              <Row>
                <Column>
                  <AddButtonThird label="Lisää päätös" onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type RentRatesProps = {
  areaUnitOptions: Array<Record<string, any>>;
  fields: any;
  isSaveClicked: boolean;
  rentBasisAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

const renderRentRates = ({
  areaUnitOptions,
  fields,
  isSaveClicked,
  rentBasisAttributes,
  usersPermissions,
}: RentRatesProps): ReactNode => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Fragment>
            <SubTitle
              enableUiDataEdit
              uiDataKey={getUiDataRentBasisKey(
                RentBasisRentRatesFieldPaths.RENT_RATES,
              )}
            >
              {RentBasisRentRatesFieldTitles.RENT_RATES}
            </SubTitle>

            {!hasPermissions(
              usersPermissions,
              UsersPermissions.ADD_BASISOFRENTRATE,
            ) &&
              (!fields || !fields.length) && <FormText>Ei hintoja</FormText>}
            {fields && !!fields.length && (
              <Fragment>
                <Row>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        rentBasisAttributes,
                        RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE,
                      )}
                    >
                      <FormTextTitle
                        required={isFieldRequired(
                          rentBasisAttributes,
                          RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE,
                        )}
                        enableUiDataEdit
                        uiDataKey={getUiDataRentBasisKey(
                          RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE,
                        )}
                      >
                        {RentBasisRentRatesFieldTitles.BUILD_PERMISSION_TYPE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        rentBasisAttributes,
                        RentBasisRentRatesFieldPaths.AMOUNT,
                      )}
                    >
                      <FormTextTitle
                        required={isFieldRequired(
                          rentBasisAttributes,
                          RentBasisRentRatesFieldPaths.AMOUNT,
                        )}
                        enableUiDataEdit
                        tooltipStyle={{
                          right: 12,
                        }}
                        uiDataKey={getUiDataRentBasisKey(
                          RentBasisRentRatesFieldPaths.AMOUNT,
                        )}
                      >
                        {RentBasisRentRatesFieldTitles.AMOUNT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        rentBasisAttributes,
                        RentBasisRentRatesFieldPaths.AREA_UNIT,
                      )}
                    >
                      <FormTextTitle
                        required={isFieldRequired(
                          rentBasisAttributes,
                          RentBasisRentRatesFieldPaths.AREA_UNIT,
                        )}
                        enableUiDataEdit
                        tooltipStyle={{
                          right: 20,
                        }}
                        uiDataKey={getUiDataRentBasisKey(
                          RentBasisRentRatesFieldPaths.AREA_UNIT,
                        )}
                      >
                        {RentBasisRentRatesFieldTitles.AREA_UNIT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>

                {fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText:
                        ConfirmationModalTexts.DELETE_RENT_RATE.BUTTON,
                      confirmationModalLabel:
                        ConfirmationModalTexts.DELETE_RENT_RATE.LABEL,
                      confirmationModalTitle:
                        ConfirmationModalTexts.DELETE_RENT_RATE.TITLE,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            rentBasisAttributes,
                            RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE,
                          )}
                        >
                          <FormFieldLegacy
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(
                              rentBasisAttributes,
                              RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE,
                            )}
                            invisibleLabel
                            name={`${field}.build_permission_type`}
                            overrideValues={{
                              label:
                                RentBasisRentRatesFieldTitles.BUILD_PERMISSION_TYPE,
                            }}
                          />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            rentBasisAttributes,
                            RentBasisRentRatesFieldPaths.AMOUNT,
                          )}
                        >
                          <FormFieldLegacy
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(
                              rentBasisAttributes,
                              RentBasisRentRatesFieldPaths.AMOUNT,
                            )}
                            invisibleLabel
                            name={`${field}.amount`}
                            unit="€"
                            overrideValues={{
                              label: RentBasisRentRatesFieldTitles.AMOUNT,
                            }}
                          />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <FieldAndRemoveButtonWrapper
                          field={
                            <Authorization
                              allow={isFieldAllowedToRead(
                                rentBasisAttributes,
                                RentBasisRentRatesFieldPaths.AREA_UNIT,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(
                                  rentBasisAttributes,
                                  RentBasisRentRatesFieldPaths.AREA_UNIT,
                                )}
                                invisibleLabel
                                name={`${field}.area_unit`}
                                overrideValues={{
                                  label:
                                    RentBasisRentRatesFieldTitles.AREA_UNIT,
                                  options: areaUnitOptions,
                                }}
                              />
                            </Authorization>
                          }
                          removeButton={
                            <Authorization
                              allow={hasPermissions(
                                usersPermissions,
                                UsersPermissions.DELETE_BASISOFRENTRATE,
                              )}
                            >
                              <RemoveButton
                                className="third-level"
                                onClick={handleRemove}
                                title="Poista hinta"
                              />
                            </Authorization>
                          }
                        />
                      </Column>
                    </Row>
                  );
                })}
              </Fragment>
            )}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_BASISOFRENTRATE,
              )}
            >
              <Row>
                <Column>
                  <AddButtonThird label="Lisää hinta" onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  handleSubmit: (...args: Array<any>) => any;
  initialValues: Record<string, any>;
  isFocusedOnMount?: boolean;
  isFormValid: boolean;
  isSaveClicked: boolean;
  receiveFormValid: (...args: Array<any>) => any;
  rentBasisAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
};
type State = {
  areaUnitOptions: Array<Record<string, any>>;
  indexOptions: Array<Record<string, any>>;
  rentBasisAttributes: Attributes;
};

class RentBasisForm extends PureComponent<Props, State> {
  firstField: any;
  state = {
    areaUnitOptions: [],
    indexOptions: [],
    rentBasisAttributes: null,
  };

  componentDidMount() {
    const { isFocusedOnMount } = this.props;

    if (isFocusedOnMount) {
      this.setFocusOnFirstField();
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.rentBasisAttributes !== state.rentBasisAttributes) {
      newState.rentBasisAttributes = props.rentBasisAttributes;
      newState.areaUnitOptions = getFieldOptions(
        props.rentBasisAttributes,
        RentBasisRentRatesFieldPaths.AREA_UNIT,
        true,
        (option) =>
          !isEmptyValue(option.display_name)
            ? option.display_name.replace(/\^2/g, "²")
            : option.display_name,
      );
      newState.indexOptions = getFieldOptions(
        props.rentBasisAttributes,
        RentBasisFieldPaths.INDEX,
        true,
      );
    }

    return newState;
  }

  componentDidUpdate() {
    const { isFormValid, receiveFormValid, valid } = this.props;

    if (isFormValid !== valid) {
      receiveFormValid(valid);
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  };
  setFocusOnFirstField = () => {
    this.firstField.focus();
  };

  render() {
    const {
      handleSubmit,
      isSaveClicked,
      rentBasisAttributes,
      usersPermissions,
    } = this.props;
    const { areaUnitOptions, indexOptions } = this.state;
    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisFieldPaths.PLOT_TYPE,
              )}
            >
              <FormFieldLegacy
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  rentBasisAttributes,
                  RentBasisFieldPaths.PLOT_TYPE,
                )}
                name="plot_type"
                setRefForField={this.setRefForFirstField}
                overrideValues={{
                  label: RentBasisFieldTitles.PLOT_TYPE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.PLOT_TYPE)}
              />
            </Authorization>
          </Column>
          <Column small={3} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisFieldPaths.START_DATE,
              )}
            >
              <FormFieldLegacy
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  rentBasisAttributes,
                  RentBasisFieldPaths.START_DATE,
                )}
                name="start_date"
                overrideValues={{
                  label: RentBasisFieldTitles.START_DATE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(
                  RentBasisFieldPaths.START_DATE,
                )}
              />
            </Authorization>
          </Column>
          <Column small={3} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisFieldPaths.END_DATE,
              )}
            >
              <FormFieldLegacy
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  rentBasisAttributes,
                  RentBasisFieldPaths.END_DATE,
                )}
                name="end_date"
                overrideValues={{
                  label: RentBasisFieldTitles.END_DATE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.END_DATE)}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS,
              )}
            >
              <FieldArray
                component={renderPropertyIdentifiers}
                name="property_identifiers"
                isSaveClicked={isSaveClicked}
                rentBasisAttributes={rentBasisAttributes}
                usersPermissions={usersPermissions}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisFieldPaths.DETAILED_PLAN_IDENTIFIER,
              )}
            >
              <FormFieldLegacy
                className="align-top"
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  rentBasisAttributes,
                  RentBasisFieldPaths.DETAILED_PLAN_IDENTIFIER,
                )}
                name="detailed_plan_identifier"
                overrideValues={{
                  label: RentBasisFieldTitles.DETAILED_PLAN_IDENTIFIER,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(
                  RentBasisFieldPaths.DETAILED_PLAN_IDENTIFIER,
                )}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisFieldPaths.MANAGEMENT,
              )}
            >
              <FormFieldLegacy
                className="align-top"
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  rentBasisAttributes,
                  RentBasisFieldPaths.MANAGEMENT,
                )}
                name="management"
                overrideValues={{
                  label: RentBasisFieldTitles.MANAGEMENT,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(
                  RentBasisFieldPaths.MANAGEMENT,
                )}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisFieldPaths.FINANCING,
              )}
            >
              <FormFieldLegacy
                className="align-top"
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  rentBasisAttributes,
                  RentBasisFieldPaths.FINANCING,
                )}
                name="financing"
                overrideValues={{
                  label: RentBasisFieldTitles.FINANCING,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.FINANCING)}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisFieldPaths.LEASE_RIGHTS_END_DATE,
              )}
            >
              <FormFieldLegacy
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  rentBasisAttributes,
                  RentBasisFieldPaths.LEASE_RIGHTS_END_DATE,
                )}
                name="lease_rights_end_date"
                overrideValues={{
                  label: RentBasisFieldTitles.LEASE_RIGHTS_END_DATE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(
                  RentBasisFieldPaths.LEASE_RIGHTS_END_DATE,
                )}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisFieldPaths.INDEX,
              )}
            >
              <FormFieldLegacy
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  rentBasisAttributes,
                  RentBasisFieldPaths.INDEX,
                )}
                name="index"
                overrideValues={{
                  label: RentBasisFieldTitles.INDEX,
                  options: indexOptions,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.INDEX)}
              />
            </Authorization>
          </Column>
        </Row>

        <Authorization
          allow={isFieldAllowedToRead(
            rentBasisAttributes,
            RentBasisDecisionsFieldPaths.DECISIONS,
          )}
        >
          <Row>
            <Column>
              <FieldArray
                component={renderDecisions}
                name="decisions"
                isSaveClicked={isSaveClicked}
                rentBasisAttributes={rentBasisAttributes}
                usersPermissions={usersPermissions}
              />
            </Column>
          </Row>
        </Authorization>

        <Authorization
          allow={isFieldAllowedToRead(
            rentBasisAttributes,
            RentBasisRentRatesFieldPaths.RENT_RATES,
          )}
        >
          <Row>
            <Column>
              <FieldArray
                component={renderRentRates}
                name="rent_rates"
                areaUnitOptions={areaUnitOptions}
                isSaveClicked={isSaveClicked}
                rentBasisAttributes={rentBasisAttributes}
                usersPermissions={usersPermissions}
              />
            </Column>
          </Row>
        </Authorization>

        <Authorization
          allow={isFieldAllowedToRead(
            rentBasisAttributes,
            RentBasisFieldPaths.NOTE,
          )}
        >
          <Row>
            <Column>
              <FormFieldLegacy
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  rentBasisAttributes,
                  RentBasisFieldPaths.NOTE,
                )}
                name="note"
                overrideValues={{
                  label: RentBasisFieldTitles.NOTE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.NOTE)}
              />
            </Column>
          </Row>
        </Authorization>
      </form>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    initialValues: getRentBasisInitialValues(state),
    isFormValid: getIsFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
    rentBasisAttributes: getRentBasisAttributes(state),
    usersPermissions: getUsersPermissions(state),
  };
};

const formName = FormNames.RENT_BASIS;
export default flowRight(
  connect(mapStateToProps, {
    receiveFormValid,
  }),
  reduxForm({
    destroyOnUnmount: false,
    form: formName,
    enableReinitialize: true,
    validate: validateRentBasisForm,
  }),
)(RentBasisForm) as React.ComponentType<any>;
