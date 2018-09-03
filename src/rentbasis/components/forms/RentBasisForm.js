// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonThird from '$components/form/AddButtonThird';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import FormSection from '$components/form/FormSection';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveFormValid} from '$src/rentbasis/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/rentbasis/enums';
import {getAttributes, getIsFormValid, getIsSaveClicked, getRentBasisInitialValues} from '$src/rentbasis/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/rentbasis/types';
import type {RootState} from '$src/root/types';


type PropertyIdentifiersProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

const renderPropertyIdentifiers = ({attributes, fields, isSaveClicked, onOpenDeleteModal}: PropertyIdentifiersProps): Element<*> => {
  const handleAdd = () => fields.push({});
  return (
    <div>
      <FormFieldLabel required={get(attributes, 'property_identifiers.child.children.identifier.required')}>Kiinteistötunnukset</FormFieldLabel>
      {fields && !!fields.length && fields.map((field, index) => {
        const handleOpenDeleteModal = () => {
          onOpenDeleteModal(
            () => fields.remove(index),
            DeleteModalTitles.IDENTIFIER,
            DeleteModalLabels.IDENTIFIER,
          );
        };

        return (
          <Row key={index}>
            <Column>
              <FieldAndRemoveButtonWrapper
                field={
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'property_identifiers.child.children.identifier')}
                    name={`${field}.identifier`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                }
                removeButton={
                  <RemoveButton
                    className='third-level'
                    onClick={handleOpenDeleteModal}
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
            title='Lisää kiinteistötunnus'
          />
        </Column>
      </Row>
    </div>
  );
};

type DecisionsProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

const renderDecisions = ({attributes, fields, isSaveClicked, onOpenDeleteModal}: DecisionsProps): Element<*> => {
  const handleAdd = () => fields.push({});
  return (
    <div>
      <SubTitle>Päätökset</SubTitle>
      <Row>
        <Column small={3} large={2}>
          <FormFieldLabel required={get(attributes, 'decisions.child.children.decision_maker.required')}>Päättäjä</FormFieldLabel>
        </Column>
        <Column small={3} large={2}>
          <FormFieldLabel required={get(attributes, 'decisions.child.children.decision_date.required')}>Pvm</FormFieldLabel>
        </Column>
        <Column small={3} large={2}>
          <FormFieldLabel required={get(attributes, 'decisions.child.children.section.required')}>Pykälä</FormFieldLabel>
        </Column>
        <Column small={3} large={2}>
          <FormFieldLabel required={get(attributes, 'decisions.child.children.reference_number.required')}>Hel diaarinumero</FormFieldLabel>
        </Column>
      </Row>
      {fields && !!fields.length && fields.map((field, index) => {
        const handleOpenDeleteModal = () => {
          onOpenDeleteModal(
            () => fields.remove(index),
            DeleteModalTitles.DECISION,
            DeleteModalLabels.DECISION,
          );
        };

        return(
          <Row key={index}>
            <Column small={3} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'decisions.child.children.decision_maker')}
                name={`${field}.decision_maker`}
                overrideValues={{
                  label: '',
                }}
              />
            </Column>
            <Column small={3} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'decisions.child.children.decision_date')}
                name={`${field}.decision_date`}
                overrideValues={{
                  label: '',
                }}
              />
            </Column>
            <Column small={3} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'decisions.child.children.section')}
                name={`${field}.section`}
                unit='§'
                overrideValues={{
                  label: '',
                }}
              />
            </Column>
            <Column small={3} large={2}>
              <FieldAndRemoveButtonWrapper
                field={
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'decisions.child.children.reference_number')}
                    name={`${field}.reference_number`}
                    validate={referenceNumber}
                    overrideValues={{
                      label: '',
                    }}
                  />
                }
                removeButton={
                  <RemoveButton
                    className='third-level'
                    onClick={handleOpenDeleteModal}
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
            title='Lisää päätös'
          />
        </Column>
      </Row>
    </div>
  );
};

type RentRatesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

const renderRentRates = ({attributes, fields, isSaveClicked, onOpenDeleteModal}: RentRatesProps): Element<*> => {
  const handleAdd = () => fields.push({});
  return (
    <div>
      <SubTitle>Hinnat</SubTitle>
      {fields && !!fields.length &&
        <div>
          <Row>
            <Column small={3} large={2}><FormFieldLabel required={get(attributes, 'rent_rates.child.children.build_permission_type.required')}>Pääkäyttötarkoitus</FormFieldLabel></Column>
            <Column small={3} large={2}><FormFieldLabel required={get(attributes, 'rent_rates.child.children.amount.required')}>Euroa</FormFieldLabel></Column>
            <Column small={3} large={2}><FormFieldLabel required={get(attributes, 'rent_rates.child.children.area_unit.required')}>Yksikkö</FormFieldLabel></Column>
          </Row>
          {fields.map((field, index) => {
            const handleOpenDeleteModal = () => {
              onOpenDeleteModal(
                () => fields.remove(index),
                DeleteModalTitles.RENT_RATE,
                DeleteModalLabels.RENT_RATE,
              );
            };

            return(
              <Row key={index}>
                <Column small={3} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rent_rates.child.children.build_permission_type')}
                    name={`${field}.build_permission_type`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={3} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rent_rates.child.children.amount')}
                    name={`${field}.amount`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={3} large={2}>
                  <FieldAndRemoveButtonWrapper
                    field={
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'rent_rates.child.children.area_unit')}
                        name={`${field}.area_unit`}
                        overrideValues={{
                          label: '',
                        }}
                      />
                    }
                    removeButton={
                      <RemoveButton
                        className='third-level'
                        onClick={handleOpenDeleteModal}
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
            title='Lisää hinta'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  handleSubmit: Function,
  initialValues: Object,
  isFocusedOnMount?: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
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
    const {attributes, handleSubmit, isSaveClicked, onOpenDeleteModal} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
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
                onOpenDeleteModal={onOpenDeleteModal}
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
                onOpenDeleteModal={onOpenDeleteModal}
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
                onOpenDeleteModal={onOpenDeleteModal}
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
        </FormSection>
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
  }),
)(RentBasisForm);
