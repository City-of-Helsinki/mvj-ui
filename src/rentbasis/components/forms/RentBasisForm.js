// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import FormSection from '$components/form/FormSection';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveFormValid} from '$src/rentbasis/actions';
import {FormNames} from '$src/rentbasis/enums';
import {getAttributes, getIsFormValid, getRentBasisInitialValues} from '$src/rentbasis/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/rentbasis/types';
import type {RootState} from '$src/root/types';


type PropertyIdentifiersProps = {
  attributes: Attributes,
  fields: any,
}

const renderPropertyIdentifiers = ({attributes, fields}: PropertyIdentifiersProps): Element<*> => {
  return (
    <div>
      <FormFieldLabel>Kiinteistötunnukset</FormFieldLabel>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={8}>
            <FormField
              fieldAttributes={get(attributes, 'property_identifiers.child.children.identifier')}
              name={`${field}.identifier`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={4}>
            <RemoveButton
              onClick={() => fields.remove(index)}
              title="Poista kiinteistötunnus"
            />
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää kiinteistötunnus'
            onClick={() => fields.push('')}
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
}

const renderDecisions = ({attributes, fields}: DecisionsProps): Element<*> => {
  return (
    <div>
      <SubTitle>Päätökset</SubTitle>
      <Row>
        <Column small={3} large={2}>
          <FormFieldLabel>Päättäjä</FormFieldLabel>
        </Column>
        <Column small={3} large={1}>
          <FormFieldLabel>Pvm</FormFieldLabel>
        </Column>
        <Column small={3} large={2}>
          <FormFieldLabel>Pykälä</FormFieldLabel>
        </Column>
        <Column small={3} large={2}>
          <FormFieldLabel>Hel diaarinumero</FormFieldLabel>
        </Column>
      </Row>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={3} large={2}>
            <FormField
              fieldAttributes={get(attributes, 'decisions.child.children.decision_maker')}
              name={`${field}.decision_maker`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={3} large={1}>
            <FormField
              fieldAttributes={get(attributes, 'decisions.child.children.decision_date')}
              name={`${field}.decision_date`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={3} large={2}>
            <FormField
              fieldAttributes={get(attributes, 'decisions.child.children.section')}
              name={`${field}.section`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={1} large={2}>
            <FormField
              fieldAttributes={get(attributes, 'decisions.child.children.reference_number')}
              name={`${field}.reference_number`}
              validate={referenceNumber}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={1}>
            <RemoveButton
              onClick={() => fields.remove(index)}
              title="Poista päätös"
            />
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää päätös'
            onClick={() => fields.push('')}
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
}

const renderRentRates = ({attributes, fields}: RentRatesProps): Element<*> => {
  return (
    <div>
      <SubTitle>Hinnat</SubTitle>
      {fields && !!fields.length &&
        <div>
          <Row>
            <Column small={4} medium={4} large={2}><FormFieldLabel>Pääkäyttötarkoitus</FormFieldLabel></Column>
            <Column small={3} medium={4} large={1}><FormFieldLabel>Euroa</FormFieldLabel></Column>
            <Column small={3} medium={4} large={1}><FormFieldLabel>Yksikkö</FormFieldLabel></Column>
          </Row>
          {fields.map((field, index) =>
            <Row key={index}>
              <Column small={4} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'rent_rates.child.children.build_permission_type')}
                  name={`${field}.build_permission_type`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={3} medium={2} large={1}>
                <FormField
                  fieldAttributes={get(attributes, 'rent_rates.child.children.amount')}
                  name={`${field}.amount`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={3} medium={2} large={1}>
                <FormField
                  fieldAttributes={get(attributes, 'rent_rates.child.children.area_unit')}
                  name={`${field}.area_unit`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={2} medium={2} large={1}>
                <RemoveButton
                  onClick={() => fields.remove(index)}
                  title="Poista hinta"
                />
              </Column>
            </Row>
          )}
        </div>
      }
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää hinta'
            onClick={() => fields.push({})}
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
  isFormValid: boolean,
  receiveFormValid: Function,
  valid: boolean,
}
class RentBasisForm extends Component<Props> {
  componentDidUpdate() {
    const {isFormValid, receiveFormValid, valid} = this.props;
    if(isFormValid !== valid) {
      receiveFormValid(valid);
    }
  }

  render() {
    const {attributes, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                fieldAttributes={get(attributes, 'plot_type')}
                name='plot_type'
                overrideValues={{
                  label: 'Tonttityyppi',
                }}
              />
            </Column>
            <Column  small={6} medium={8} large={4} offsetOnLarge={1}>
              <Row>
                <Column small={6}>
                  <FormField
                    fieldAttributes={get(attributes, 'start_date')}
                    name='start_date'
                    overrideValues={{
                      label: 'Alkupvm',
                    }}
                  />
                </Column>
                <Column small={6}>
                  <FormField
                    fieldAttributes={get(attributes, 'end_date')}
                    name='end_date'
                    overrideValues={{
                      label: 'Loppupvm',
                    }}
                  />
                </Column>
              </Row>
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={3}>
              <FieldArray
                attributes={attributes}
                component={renderPropertyIdentifiers}
                name="property_identifiers"
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                className='align-top'
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
                fieldAttributes={get(attributes, 'lease_rights_end_date')}
                name='lease_rights_end_date'
                overrideValues={{
                  label: 'Vuokraoikeus päättyy',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2} offsetOnLarge={1}>
              <FormField
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
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <FieldArray
                attributes={attributes}
                component={renderRentRates}
                name="rent_rates"
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <FormField
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
