// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveFormValid} from '$src/rentbasis/actions';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/rentbasis/enums';
import {validateRentBasisForm} from '$src/rentbasis/formValidators';
import {getAttributes, getIsFormValid, getIsSaveClicked, getRentBasisInitialValues} from '$src/rentbasis/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/rentbasis/types';
import type {RootState} from '$src/root/types';


type PropertyIdentifiersProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderPropertyIdentifiers = ({attributes, fields, isSaveClicked}: PropertyIdentifiersProps): Element<*> => {
  const handleAdd = () => fields.push({});
  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <FormTextTitle
              required={get(attributes, 'property_identifiers.child.children.identifier.required')}
              title='Kiinteistötunnukset'
            />
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
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'property_identifiers.child.children.identifier')}
                          invisibleLabel
                          name={`${field}.identifier`}
                        />
                      }
                      removeButton={
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title="Poista kiinteistötunnus"
                        />
                      }
                    />
                  </Column>
                </Row>
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää kiinteistötunnus'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>

  );
};

type DecisionsProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderDecisions = ({attributes, fields, isSaveClicked}: DecisionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <SubTitle>Päätökset</SubTitle>
            {fields && !!fields.length &&
              <Row>
                <Column small={3} large={2}>
                  <FormTextTitle
                    required={get(attributes, 'decisions.child.children.decision_maker.required')}
                    title='Päättäjä'
                  />
                </Column>
                <Column small={3} large={2}>
                  <FormTextTitle
                    required={get(attributes, 'decisions.child.children.decision_date.required')}
                    title='Pvm'
                  />
                </Column>
                <Column small={3} large={2}>
                  <FormTextTitle
                    required={get(attributes, 'decisions.child.children.section.required')}
                    title='Pykälä'
                  />
                </Column>
                <Column small={3} large={2}>
                  <FormTextTitle
                    required={get(attributes, 'decisions.child.children.reference_number.required')}
                    title='Hel diaarinumero'
                  />
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
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'decisions.child.children.decision_maker')}
                      invisibleLabel
                      name={`${field}.decision_maker`}
                    />
                  </Column>
                  <Column small={3} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'decisions.child.children.decision_date')}
                      invisibleLabel
                      name={`${field}.decision_date`}
                    />
                  </Column>
                  <Column small={3} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'decisions.child.children.section')}
                      invisibleLabel
                      name={`${field}.section`}
                      unit='§'
                    />
                  </Column>
                  <Column small={3} large={2}>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'decisions.child.children.reference_number')}
                          invisibleLabel
                          name={`${field}.reference_number`}
                          validate={referenceNumber}
                        />
                      }
                      removeButton={
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title="Poista päätös"
                        />
                      }
                    />
                  </Column>
                </Row>
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää päätös'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type RentRatesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderRentRates = ({attributes, fields, isSaveClicked}: RentRatesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <SubTitle>Hinnat</SubTitle>
            {fields && !!fields.length &&
              <div>
                <Row>
                  <Column small={3} large={2}>
                    <FormTextTitle
                      required={get(attributes, 'rent_rates.child.children.build_permission_type.required')}
                      title='Pääkäyttötarkoitus'
                    />
                  </Column>
                  <Column small={3} large={2}>
                    <FormTextTitle
                      required={get(attributes, 'rent_rates.child.children.amount.required')}
                      title='Euroa'
                    />
                  </Column>
                  <Column small={3} large={2}>
                    <FormTextTitle
                      required={get(attributes, 'rent_rates.child.children.area_unit.required')}
                      title='Yksikkö'
                    />
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
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rent_rates.child.children.build_permission_type')}
                          invisibleLabel
                          name={`${field}.build_permission_type`}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rent_rates.child.children.amount')}
                          invisibleLabel
                          name={`${field}.amount`}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FieldAndRemoveButtonWrapper
                          field={
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'rent_rates.child.children.area_unit')}
                              invisibleLabel
                              name={`${field}.area_unit`}
                            />
                          }
                          removeButton={
                            <RemoveButton
                              className='third-level'
                              onClick={handleRemove}
                              title="Poista hinta"
                            />
                          }
                        />
                      </Column>
                    </Row>
                  );
                })}
              </div>
            }
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää hinta'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  handleSubmit: Function,
  initialValues: Object,
  isFocusedOnMount?: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  receiveFormValid: Function,
  valid: boolean,
}
class RentBasisForm extends Component<Props> {
  firstField: any

  componentDidMount() {
    const {isFocusedOnMount} = this.props;

    if(isFocusedOnMount) {
      this.setFocusOnFirstField();
    }
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
    const {attributes, handleSubmit, isSaveClicked} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'plot_type')}
              name='plot_type'
              setRefForField={this.setRefForFirstField}
              overrideValues={{
                label: 'Tonttityyppi',
              }}
            />
          </Column>
          <Column  small={3} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'start_date')}
              name='start_date'
              overrideValues={{
                label: 'Alkupvm',
              }}
            />
          </Column>
          <Column  small={3} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'end_date')}
              name='end_date'
              overrideValues={{
                label: 'Loppupvm',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FieldArray
              attributes={attributes}
              component={renderPropertyIdentifiers}
              name='property_identifiers'
              isSaveClicked={isSaveClicked}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              className='align-top'
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'detailed_plan_identifier')}
              name='detailed_plan_identifier'
              overrideValues={{
                label: 'Asemakaava',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              className='align-top'
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'management')}
              name='management'
              overrideValues={{
                label: 'Hallintamuoto',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              className='align-top'
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'financing')}
              name='financing'
              overrideValues={{
                label: 'Rahoitusmuoto',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_rights_end_date')}
              name='lease_rights_end_date'
              overrideValues={{
                label: 'Vuokraoikeus päättyy',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'index')}
              name='index'
              overrideValues={{
                label: 'Indeksi',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <FieldArray
              attributes={attributes}
              component={renderDecisions}
              name="decisions"
              isSaveClicked={isSaveClicked}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <FieldArray
              attributes={attributes}
              component={renderRentRates}
              name="rent_rates"
              isSaveClicked={isSaveClicked}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'note')}
              name='note'
              overrideValues={{
                label: 'Huomautus',
              }}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    initialValues: getRentBasisInitialValues(state),
    isFormValid: getIsFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
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
