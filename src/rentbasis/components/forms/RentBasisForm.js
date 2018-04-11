// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$util/helpers';
import {getRentBasisInitialValues} from '$src/rentbasis/selectors';

import type {Attributes} from '$src/rentbasis/types';
import type {RootState} from '$src/root/types';


type PropertyIdentifiersProps = {
  fields: any,
}

const renderPropertyIdentifiers = ({fields}: PropertyIdentifiersProps) => {
  return (
    <div>
      <label className="mvj-form-field-label">Kiinteisötunnukset</label>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={8}>
            <Field
              className='list-item'
              component={FieldTypeText}
              name={`${field}.identifier`}
            />
          </Column>
          <Column small={4}>
            {fields.length > 1 &&
              <RemoveButton
                onClick={() => fields.remove(index)}
                title="Poista hinta"
              />
            }
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
  fields: any,
}

const renderDecisions = ({fields}: DecisionsProps) => {
  return (
    <div>
      <label className="mvj-form-field-label">Päätökset</label>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={8}>
            <Field
              className='list-item'
              component={FieldTypeText}
              name={`${field}.identifier`}
            />
          </Column>
          <Column small={4}>
            {fields.length > 1 &&
              <RemoveButton
                onClick={() => fields.remove(index)}
                title="Poista hinta"
              />
            }
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
                />
              </Column>
              <Column small={3} medium={2} large={1}>
                <Field
                  component={FieldTypeText}
                  name={`${field}.amount`}
                />
              </Column>
              <Column small={3} medium={2} large={1}>
                <Field
                  component={FieldTypeSelect}
                  name={`${field}.period`}
                  options={periodOptions}
                />
              </Column>
              <Column small={2} medium={2} large={1}>
                {fields.length > 1 &&
                  <RemoveButton
                    onClick={() => fields.remove(index)}
                    title="Poista hinta"
                  />
                }
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
  handleSubmit: Function,
}

const RentBasisForm = ({attributes, handleSubmit}: Props) => {
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
            />
          </Column>
          <Column  small={6} medium={8} large={4} offsetOnLarge={1}>
            <Row>
              <Column small={6}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Alkupvm'
                  name='start_date'
                />
              </Column>
              <Column small={6}>
                <Field
                  className='with-dash'
                  component={FieldTypeDatePicker}
                  label='Loppupvm'
                  name='end_date'
                />
              </Column>
            </Row>

          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <FieldArray
              component={renderPropertyIdentifiers}
              name="property_identifiers"
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <Field
              component={FieldTypeText}
              label="Asemakaava"
              name="detailed_plan_identifier"
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <Field
              component={FieldTypeSelect}
              label='Hallintamuoto'
              name='management'
              options={managementOptions}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <Field
              component={FieldTypeSelect}
              label='Rahoitusmuoto'
              name='financing'
              options={financingOptions}
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <FieldArray
              component={renderDecisions}
              name="decisions"
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <Field
              component={FieldTypeDatePicker}
              label='Vuokraoikeus päättyy'
              name='lease_rights_end_date'
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <Field
              component={FieldTypeText}
              label="Indeksi"
              name="index"
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
            />
          </Column>
        </Row>
      </FormSection>
    </form>
  );
};

const formName = 'rent-basis-form';

const mapStateToProps = (state: RootState) => {
  return {
    initialValues: getRentBasisInitialValues(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps
  ),
  reduxForm({
    form: formName,
  }),
)(RentBasisForm);
