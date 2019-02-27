// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormText from '$src/components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveFormValid} from '$src/rentbasis/actions';
import {ButtonColors, FieldTypes} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  RentBasisFieldPaths,
  RentBasisFieldTitles,
  RentBasisDecisionsFieldPaths,
  RentBasisDecisionsFieldTitles,
  RentBasisPropertyIdentifiersFieldPaths,
  RentBasisPropertyIdentifiersFieldTitles,
  RentBasisRentRatesFieldPaths,
  RentBasisRentRatesFieldTitles,
} from '$src/rentbasis/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getUiDataRentBasisKey} from '$src/uiData/helpers';
import {
  getFieldAttributes,
  getFieldOptions,
  hasPermissions,
  isEmptyValue,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {validateRentBasisForm} from '$src/rentbasis/formValidators';
import {
  getAttributes as getRentBasisAttributes,
  getIsFormValid,
  getIsSaveClicked,
  getRentBasisInitialValues,
} from '$src/rentbasis/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/types';
import type {RootState} from '$src/root/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type PropertyIdentifiersProps = {
  fields: any,
  isSaveClicked: boolean,
  rentBasisAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
}

const renderPropertyIdentifiers = ({fields, isSaveClicked, rentBasisAttributes, usersPermissions}: PropertyIdentifiersProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <FormTextTitle
              required={isFieldRequired(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER)}
              enableUiDataEdit
              uiDataKey={getUiDataRentBasisKey(RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS)}
            >
              {RentBasisPropertyIdentifiersFieldTitles.PROPERTY_IDENTIFIERS}
            </FormTextTitle>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_BASISOFRENTPROPERTYIDENTIFIER) &&
              (!fields || !fields.length) &&
              <FormText>Ei kiinteistötunnuksia</FormText>
            }

            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.IDENTIFIER,
                  confirmationModalTitle: DeleteModalTitles.IDENTIFIER,
                });
              };

              return (
                <Row key={index}>
                  <Column>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER)}
                            invisibleLabel
                            name={`${field}.identifier`}
                            overrideValues={{label: RentBasisPropertyIdentifiersFieldTitles.IDENTIFIER}}
                            enableUiDataEdit
                            uiDataKey={getUiDataRentBasisKey(RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER)}
                          />
                        </Authorization>
                      }
                      removeButton={
                        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_BASISOFRENTPROPERTYIDENTIFIER)}>
                          <RemoveButton
                            className='third-level'
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

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_BASISOFRENTPROPERTYIDENTIFIER)}>
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää kiinteistötunnus'
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
  fields: any,
  isSaveClicked: boolean,
  rentBasisAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
}

const renderDecisions = ({fields, isSaveClicked, rentBasisAttributes, usersPermissions}: DecisionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <SubTitle enableUiDataEdit uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.DECISIONS)}>
              {RentBasisDecisionsFieldTitles.DECISIONS}
            </SubTitle>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_BASISOFRENTDECISION) &&
              (!fields || !fields.length) &&
              <FormText>Ei sopimuksia</FormText>
            }
            {fields && !!fields.length &&
              <Row>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER)}>
                    <FormTextTitle
                      required={isFieldRequired(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER)}
                      enableUiDataEdit
                      uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.DECISION_MAKER)}
                    >
                      {RentBasisDecisionsFieldTitles.DECISION_MAKER}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_DATE)}>
                    <FormTextTitle
                      required={isFieldRequired(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_DATE)}
                      enableUiDataEdit
                      uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.DECISION_DATE)}
                    >
                      {RentBasisDecisionsFieldTitles.DECISION_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.SECTION)}>
                    <FormTextTitle
                      required={isFieldRequired(rentBasisAttributes, RentBasisDecisionsFieldPaths.SECTION)}
                      enableUiDataEdit
                      uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.SECTION)}
                    >
                      {RentBasisDecisionsFieldTitles.SECTION}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.REFERENCE_NUMBER)}>
                    <FormTextTitle
                      required={isFieldRequired(rentBasisAttributes, RentBasisDecisionsFieldPaths.REFERENCE_NUMBER)}
                      enableUiDataEdit
                      uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.REFERENCE_NUMBER)}
                    >
                      {RentBasisDecisionsFieldTitles.REFERENCE_NUMBER}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            }

            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.DECISION,
                  confirmationModalTitle: DeleteModalTitles.DECISION,
                });
              };

              return(
                <Row key={index}>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER)}
                        invisibleLabel
                        name={`${field}.decision_maker`}
                        overrideValues={{label: RentBasisDecisionsFieldTitles.DECISION_MAKER}}
                      />
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_DATE)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_DATE)}
                        invisibleLabel
                        name={`${field}.decision_date`}
                        overrideValues={{label: RentBasisDecisionsFieldTitles.DECISION_DATE}}
                      />
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.SECTION)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisDecisionsFieldPaths.SECTION)}
                        invisibleLabel
                        name={`${field}.section`}
                        unit='§'
                        overrideValues={{label: RentBasisDecisionsFieldTitles.SECTION}}
                      />
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.REFERENCE_NUMBER)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisDecisionsFieldPaths.REFERENCE_NUMBER)}
                            invisibleLabel
                            name={`${field}.reference_number`}
                            validate={referenceNumber}
                            overrideValues={{
                              label: RentBasisDecisionsFieldTitles.REFERENCE_NUMBER,
                              fieldType: FieldTypes.REFERENCE_NUMBER,
                            }}
                          />
                        </Authorization>
                      }
                      removeButton={
                        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_BASISOFRENTDECISION)}>
                          <RemoveButton
                            className='third-level'
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

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_BASISOFRENTDECISION)}>
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää päätös'
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

type RentRatesProps = {
  areaUnitOptions: Array<Object>,
  fields: any,
  isSaveClicked: boolean,
  rentBasisAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
}

const renderRentRates = ({areaUnitOptions, fields, isSaveClicked, rentBasisAttributes, usersPermissions}: RentRatesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <SubTitle enableUiDataEdit uiDataKey={getUiDataRentBasisKey(RentBasisRentRatesFieldPaths.RENT_RATES)}>
              {RentBasisRentRatesFieldTitles.RENT_RATES}
            </SubTitle>

            {!hasPermissions(usersPermissions, UsersPermissions.ADD_BASISOFRENTRATE) &&
              (!fields || !fields.length) &&
              <FormText>Ei hintoja</FormText>
            }
            {fields && !!fields.length &&
              <Fragment>
                <Row>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}>
                      <FormTextTitle
                        required={isFieldRequired(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}
                        enableUiDataEdit
                        uiDataKey={getUiDataRentBasisKey(RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}
                      >
                        {RentBasisRentRatesFieldTitles.BUILD_PERMISSION_TYPE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AMOUNT)}>
                      <FormTextTitle
                        required={isFieldRequired(rentBasisAttributes, RentBasisRentRatesFieldPaths.AMOUNT)}
                        enableUiDataEdit
                        uiDataKey={getUiDataRentBasisKey(RentBasisRentRatesFieldPaths.AMOUNT)}
                      >
                        {RentBasisRentRatesFieldTitles.AMOUNT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT)}>
                      <FormTextTitle
                        required={isFieldRequired(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT)}
                        enableUiDataEdit
                        uiDataKey={getUiDataRentBasisKey(RentBasisRentRatesFieldPaths.AREA_UNIT)}
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
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.RENT_RATE,
                      confirmationModalTitle: DeleteModalTitles.RENT_RATE,
                    });
                  };

                  return(
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}
                            invisibleLabel
                            name={`${field}.build_permission_type`}
                            overrideValues={{label: RentBasisRentRatesFieldTitles.BUILD_PERMISSION_TYPE}}
                          />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AMOUNT)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisRentRatesFieldPaths.AMOUNT)}
                            invisibleLabel
                            name={`${field}.amount`}
                            overrideValues={{label: RentBasisRentRatesFieldTitles.AMOUNT}}
                          />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <FieldAndRemoveButtonWrapper
                          field={
                            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT)}
                                invisibleLabel
                                name={`${field}.area_unit`}
                                overrideValues={{
                                  label: RentBasisRentRatesFieldTitles.AREA_UNIT,
                                  options: areaUnitOptions,
                                }}
                              />
                            </Authorization>
                          }
                          removeButton={
                            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_BASISOFRENTRATE)}>
                              <RemoveButton
                                className='third-level'
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
            }

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_BASISOFRENTRATE)}>
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää hinta'
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

type Props = {
  handleSubmit: Function,
  initialValues: Object,
  isFocusedOnMount?: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  receiveFormValid: Function,
  rentBasisAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
  valid: boolean,
}

type State = {
  areaUnitOptions: Array<Object>,
  indexOptions: Array<Object>,
  rentBasisAttributes: Attributes,
}

class RentBasisForm extends PureComponent<Props, State> {
  firstField: any

  state = {
    areaUnitOptions: [],
    indexOptions: [],
    rentBasisAttributes: null,
  }

  componentDidMount() {
    const {isFocusedOnMount} = this.props;

    if(isFocusedOnMount) {
      this.setFocusOnFirstField();
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.rentBasisAttributes !== state.rentBasisAttributes) {
      newState.rentBasisAttributes = props.rentBasisAttributes;
      newState.areaUnitOptions = getFieldOptions(props.rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT, true, (option) =>
        !isEmptyValue(option.display_name) ? option.display_name.replace(/\^2/g, '²') : option.display_name
      );
      newState.indexOptions = getFieldOptions(props.rentBasisAttributes, RentBasisFieldPaths.INDEX, true);
    }

    return newState;
  }

  componentDidUpdate() {
    const {isFormValid, receiveFormValid, valid} = this.props;
    if(isFormValid !== valid) {
      receiveFormValid(valid);
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  }

  setFocusOnFirstField = () => {
    this.firstField.focus();
  }

  render() {
    const {handleSubmit, isSaveClicked, rentBasisAttributes, usersPermissions} = this.props;
    const {areaUnitOptions, indexOptions} = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.PLOT_TYPE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.PLOT_TYPE)}
                name='plot_type'
                setRefForField={this.setRefForFirstField}
                overrideValues={{label: RentBasisFieldTitles.PLOT_TYPE}}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.PLOT_TYPE)}
              />
            </Authorization>
          </Column>
          <Column  small={3} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.START_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.START_DATE)}
                name='start_date'
                overrideValues={{label: RentBasisFieldTitles.START_DATE}}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.START_DATE)}
              />
            </Authorization>
          </Column>
          <Column  small={3} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.END_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.END_DATE)}
                name='end_date'
                overrideValues={{label: RentBasisFieldTitles.END_DATE}}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.END_DATE)}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS)}>
              <FieldArray
                component={renderPropertyIdentifiers}
                name='property_identifiers'
                isSaveClicked={isSaveClicked}
                rentBasisAttributes={rentBasisAttributes}
                usersPermissions={usersPermissions}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.DETAILED_PLAN_IDENTIFIER)}>
              <FormField
                className='align-top'
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.DETAILED_PLAN_IDENTIFIER)}
                name='detailed_plan_identifier'
                overrideValues={{label: RentBasisFieldTitles.DETAILED_PLAN_IDENTIFIER}}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.DETAILED_PLAN_IDENTIFIER)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.MANAGEMENT)}>
              <FormField
                className='align-top'
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.MANAGEMENT)}
                name='management'
                overrideValues={{label: RentBasisFieldTitles.MANAGEMENT}}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.MANAGEMENT)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.FINANCING)}>
              <FormField
                className='align-top'
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.FINANCING)}
                name='financing'
                overrideValues={{label: RentBasisFieldTitles.FINANCING}}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.FINANCING)}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.LEASE_RIGHTS_END_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.LEASE_RIGHTS_END_DATE)}
                name='lease_rights_end_date'
                overrideValues={{label: RentBasisFieldTitles.LEASE_RIGHTS_END_DATE}}
                enableUiDataEdit
                uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.LEASE_RIGHTS_END_DATE)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.INDEX)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.INDEX)}
                name='index'
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

        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISIONS)}>
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

        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.RENT_RATES)}>
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

        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.NOTE)}>
          <Row>
            <Column>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.NOTE)}
                name='note'
                overrideValues={{label: RentBasisFieldTitles.NOTE}}
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
  connect(
    mapStateToProps,
    {
      receiveFormValid,
    }
  ),
  reduxForm({
    destroyOnUnmount: false,
    form: formName,
    enableReinitialize: true,
    validate: validateRentBasisForm,
  }),
)(RentBasisForm);
