// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$util/helpers';
import {genericValidator} from '$components/form/validations';
import {receiveFormValid} from '$src/rentbasis/actions';
import {getIsFormValid, getRentBasisInitialValues} from '$src/rentbasis/selectors';

import type {Attributes} from '$src/rentbasis/types';
import type {RootState} from '$src/root/types';


type PropertyIdentifiersProps = {
  attributes: Attributes,
  fields: any,
}

const renderPropertyIdentifiers = ({attributes, fields}: PropertyIdentifiersProps) => {
  return (
    <div>
      <label className="mvj-form-field-label">Kiinteisötunnukset</label>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={8}>
            <Field
              component={FieldTypeText}
              name={`${field}.identifier`}
              validate={[
                (value) => genericValidator(value, get(attributes, 'property_identifiers.child.children.identifier')),
              ]}
            />
          </Column>
          <Column small={4}>
            <RemoveButton
              onClick={() => fields.remove(index)}
              title="Poista hinta"
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

const renderDecisions = ({attributes, fields}: DecisionsProps) => {
  return (
    <div>
      <label className="mvj-form-field-label">Päätökset</label>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={8}>
            <Field
              component={FieldTypeText}
              name={`${field}.identifier`}
              validate={[
                (value) => genericValidator(value, get(attributes, 'decisions.child.children.identifier')),
              ]}
            />
          </Column>
          <Column small={4}>
            <RemoveButton
              onClick={() => fields.remove(index)}
              title="Poista hinta"
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

const renderRentRates = ({attributes, fields}: RentRatesProps) => {
  const intendedUseOptions = getAttributeFieldOptions(attributes, 'rent_rates.child.children.intended_use');
  const periodOptions = getAttributeFieldOptions(attributes, 'rent_rates.child.children.period');

  return (
    <div>
      <p className="sub-title">Hinnat</p>
      {fields && !!fields.length &&
        <div>
          <Row>
            <Column small={4} medium={4} large={2}><label className="mvj-form-field-label">Pääkäyttötarkoitus</label></Column>
            <Column small={3} medium={4} large={1}><label className="mvj-form-field-label">Euroa</label></Column>
            <Column small={3} medium={4} large={1}><label className="mvj-form-field-label">Yksikkö</label></Column>
          </Row>
          {fields.map((field, index) =>
            <Row key={index}>
              <Column small={4} medium={4} large={2}>
                <Field
                  component={FieldTypeSelect}
                  name={`${field}.intended_use`}
                  options={intendedUseOptions}
                  validate={[
                    (value) => genericValidator(value, get(attributes, 'rent_rates.child.children.intended_use')),
                  ]}
                />
              </Column>
              <Column small={3} medium={2} large={1}>
                <Field
                  component={FieldTypeText}
                  name={`${field}.amount`}
                  validate={[
                    (value) => genericValidator(value, get(attributes, 'rent_rates.child.children.amount')),
                  ]}
                />
              </Column>
              <Column small={3} medium={2} large={1}>
                <Field
                  component={FieldTypeSelect}
                  name={`${field}.period`}
                  options={periodOptions}
                  validate={[
                    (value) => genericValidator(value, get(attributes, 'rent_rates.child.children.period')),
                  ]}
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
  initialValues: Object,
  isFormValid: boolean,
  handleSubmit: Function,
  receiveFormValid: Function,
  valid: boolean,
}
class RentBasisForm extends Component {
  props: Props

  componentDidUpdate() {
    const {isFormValid, receiveFormValid, valid} = this.props;
    if(isFormValid !== valid) {
      receiveFormValid(valid);
    }
  }

  render() {
    const {attributes, handleSubmit} = this.props;

    const plotTypeOptions = getAttributeFieldOptions(attributes, 'plot_type');
    const managementOptions = getAttributeFieldOptions(attributes, 'management');
    const financingOptions = getAttributeFieldOptions(attributes, 'financing');

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeSelect}
                label='Tonttityyppi'
                name='plot_type'
                options={plotTypeOptions}
                validate={[
                  (value) => genericValidator(value, get(attributes, 'plot_type')),
                ]}
              />
            </Column>
            <Column  small={6} medium={8} large={4} offsetOnLarge={1}>
              <Row>
                <Column small={6}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Alkupvm'
                    name='start_date'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'start_date')),
                    ]}
                  />
                </Column>
                <Column small={6}>
                  <Field
                    className='with-dash'
                    component={FieldTypeDatePicker}
                    label='Loppupvm'
                    name='end_date'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'end_date')),
                    ]}
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
              <Field
                component={FieldTypeText}
                label="Asemakaava"
                name="detailed_plan_identifier"
                validate={[
                  (value) => genericValidator(value, get(attributes, 'detailed_plan_identifier')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeSelect}
                label='Hallintamuoto'
                name='management'
                options={managementOptions}
                validate={[
                  (value) => genericValidator(value, get(attributes, 'management')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeSelect}
                label='Rahoitusmuoto'
                name='financing'
                options={financingOptions}
                validate={[
                  (value) => genericValidator(value, get(attributes, 'financing')),
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={3}>
              <FieldArray
                attributes={attributes}
                component={renderDecisions}
                name="decisions"
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeDatePicker}
                label='Vuokraoikeus päättyy'
                name='lease_rights_end_date'
                validate={[
                  (value) => genericValidator(value, get(attributes, 'lease_rights_end_date')),
                ]}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <Field
                component={FieldTypeText}
                label="Indeksi"
                name="index"
                validate={[
                  (value) => genericValidator(value, get(attributes, 'index')),
                ]}
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
              <Field
                component={FieldTypeText}
                label="Kommentti"
                name="note"
                validate={[
                  (value) => genericValidator(value, get(attributes, 'note')),
                ]}
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
    initialValues: getRentBasisInitialValues(state),
    isFormValid: getIsFormValid(state),
  };
};

const formName = 'rent-basis-form';

export default flowRight(
  connect(
    mapStateToProps,
    {
      receiveFormValid,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(RentBasisForm);
