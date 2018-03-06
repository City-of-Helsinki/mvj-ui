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
import {financialMethodOptions,
  managementMethodOptions,
  priceTypeOptions,
  purposeOptions} from '$src/constants';
import type {RootState} from '$src/root/types';
import {getRentCriteriaInitialValues} from '$src/rentcriterias/selectors';

type RealEstateIdProps = {
  fields: any,
}

const renderRealEstateIds = ({fields}: RealEstateIdProps) => {
  return (
    <div>
      <label className="mvj-form-field-label">Kiinteisötunnukset</label>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={8}>
            <Field
              className='list-item'
              component={FieldTypeText}
              name={field}
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
              name={field}
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

type PricesProps = {
  fields: any,
}

const renderPrices = ({fields}: PricesProps) => {
  return (
    <div>
      <p className="sub-title">Hinnat</p>
      {fields && !!fields.length &&
        <div>
          <Row>
            <Column medium={4} large={2}><label className="mvj-form-field-label">Pääkäyttötarkoitus</label></Column>
            <Column medium={2} large={1}><label className="mvj-form-field-label">Euroa</label></Column>
            <Column medium={2} large={1}><label className="mvj-form-field-label">Yksikkö</label></Column>
          </Row>
          {fields.map((field, index) =>
            <Row key={index}>
              <Column medium={4} large={2}>
                <Field
                  className='list-item'
                  component={FieldTypeSelect}
                  name={`${field}.purpose`}
                  options={purposeOptions}
                />
              </Column>
              <Column medium={2} large={1}>
                <Field
                  className='list-item'
                  component={FieldTypeText}
                  name={`${field}.amount`}
                />
              </Column>
              <Column medium={2} large={1}>
                <Field
                  className='list-item'
                  component={FieldTypeSelect}
                  name={`${field}.unit`}
                  options={priceTypeOptions}
                />
              </Column>
              <Column small={4} medium={2}>
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
  initialValues: Object,
  handleSubmit: Function,
}

const EditRentCriteriaForm = ({handleSubmit}: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormSection>
        <Row>
          <Column medium={4} large={2}>
            <Field
              component={FieldTypeSelect}
              label='Tonttityyppi'
              name='plot_type'
              options={[]}
            />
          </Column>
          <Column medium={2} offsetOnLarge={1}>
            <Field
              component={FieldTypeDatePicker}
              label='Alkupvm'
              name='start_date'
            />
          </Column>
          <Column medium={2}>
            <Field
              className='with-dash'
              component={FieldTypeDatePicker}
              label='Loppupvm'
              name='end_date'
            />
          </Column>
        </Row>
        <Row>
          <Column medium={4} large={3}>
            <FieldArray
              component={renderRealEstateIds}
              name="real_estate_ids"
            />
          </Column>
          <Column medium={2}>
            <Field
              component={FieldTypeText}
              label="Asemakaava"
              name="plan"
            />
          </Column>
          <Column medium={2}>
            <Field
              component={FieldTypeSelect}
              label='Hallintamuoto'
              name='management_method'
              options={managementMethodOptions}
            />
          </Column>
          <Column medium={2}>
            <Field
              component={FieldTypeSelect}
              label='Rahoitusmuoto'
              name='financial_method'
              options={financialMethodOptions}
            />
          </Column>
        </Row>
        <Row>
          <Column medium={4} large={3}>
            <FieldArray
              component={renderDecisions}
              name="decisions"
            />
          </Column>
          <Column medium={2}>
            <Field
              component={FieldTypeDatePicker}
              label='Vuokraoikeus päättyy'
              name='rental_right_end_date'
            />
          </Column>
          <Column medium={2}>
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
              component={renderPrices}
              name="prices"
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Field
              className='no-margin'
              component={FieldTypeText}
              label="Kommentti"
              name="comment"
            />
          </Column>
        </Row>
      </FormSection>
    </form>
  );
};

const formName = 'edit-rent-criteria-form';

const mapStateToProps = (state: RootState) => {
  return {
    initialValues: getRentCriteriaInitialValues(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps
  ),
  reduxForm({
    form: formName,
  }),
)(EditRentCriteriaForm);
