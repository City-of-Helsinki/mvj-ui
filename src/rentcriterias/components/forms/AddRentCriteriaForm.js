// @flow
import React from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import FieldTypeCheckbox from '../../../components/form/FieldTypeCheckbox';
import FieldTypeDatePicker from '../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../components/form/FieldTypeText';
import RemoveButton from '../../../components/form/RemoveButton';
import {decisionOptions,
  financialMethodOptions,
  managementMethodOptions,
  priceTypeOptions,
  purposeOptions} from '../../../constants';

type RealEstateIdProps = {
  fields: any,
}

const renderRealEstateIds = ({fields}: RealEstateIdProps) => {
  return (
    <div>
      <label className="mvj-form-field-label">Kiinteisötunnukset</label>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row>
          <Column small={10}>
            <Field
              component={FieldTypeText}
              name={field}
            />
          </Column>
          <Column small={2}>
            <RemoveButton
              onClick={() => fields.remove(index)}
              title="Poista hinta"
            />
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <a onClick={() => fields.push('')} className='add-button-secondary'><i /><span>Lisää kiinteistötunnus</span></a>
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
        <Row>
          <Column small={10}>
            <Field
              component={FieldTypeSelect}
              name={field}
              options={decisionOptions}
            />
          </Column>
          <Column small={2}>
            <RemoveButton
              onClick={() => fields.remove(index)}
              title="Poista hinta"
            />
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <a onClick={() => fields.push('')} className='add-button-secondary'><i /><span>Lisää päätös</span></a>
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
      <label className="mvj-form-field-label">Hinnat</label>
      {fields && !!fields.length &&
        <div>
          <Row>
            <Column small={2}><label className="mvj-form-field-label">Pääkäyttötarkoitus</label></Column>
            <Column small={1}><label className="mvj-form-field-label">Euroa</label></Column>
            <Column small={1}><label className="mvj-form-field-label">Yksikkö</label></Column>
          </Row>
          {fields.map((field, index) =>
            <Row>
              <Column small={2}>
                <Field
                  component={FieldTypeSelect}
                  name={`${field}.purpose`}
                  options={purposeOptions}
                />
              </Column>
              <Column small={1}>
                <Field
                  component={FieldTypeText}
                  name={`${field}.amount`}
                />
              </Column>
              <Column small={1}>
                <Field
                  component={FieldTypeSelect}
                  name={`${field}.unit`}
                  options={priceTypeOptions}
                />
              </Column>
              <Column small={1}>
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
          <a onClick={() => fields.push('')} className='add-button-secondary'><i /><span>Lisää hinta</span></a>
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  handleSubmit: Function,
}

const AddRentCriteriaForm = ({handleSubmit}: Props) => {
  return (
    <form onSubmit={handleSubmit} className="form-section">
      <Row>
        <Column medium={3}>
          <Field
            component={FieldTypeSelect}
            label='Tonttityyppi'
            name='plot_type'
            options={[]}
          />
        </Column>
        <Column medium={3}>
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
                component={FieldTypeDatePicker}
                label='Loppupvm'
                name='end_date'
              />
            </Column>
          </Row>
        </Column>
        <Column medium={3}>
          <Field
            component={FieldTypeDatePicker}
            label='Vuokraoikeus päättyy'
            name='rental_right_end_date'
          />
        </Column>
      </Row>
      <Row>
        <Column medium={3}>
          <Field
            component={FieldTypeSelect}
            label='Hallintamuoto'
            name='management_method'
            options={managementMethodOptions}
          />
        </Column>
        <Column medium={3}>
          <Field
            component={FieldTypeSelect}
            label='Rahoitusmuoto'
            name='financial_method'
            options={financialMethodOptions}
          />
        </Column>
        <Column medium={3}>
          <Field
            component={FieldTypeCheckbox}
            label='Hitas'
            name='hitas'
            options={[
              {value: 'hitas', label: 'Hitas'},
            ]}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={3}>
          <FieldArray
            component={renderRealEstateIds}
            name="real_estate_ids"
          />
        </Column>
        <Column medium={3}>
          <FieldArray
            component={renderDecisions}
            name="decisions"
          />

        </Column>
        <Column medium={3}>
          <Field
            component={FieldTypeText}
            label="Indeksi"
            name="index"
          />
        </Column>
        <Column medium={3}>
          <Field
            component={FieldTypeText}
            label="Asemakaava"
            name="plan"
          />
        </Column>
      </Row>
      <Row style={{marginTop: '10px'}}>
        <Column>
          <FieldArray
            component={renderPrices}
            name="prices"
          />
        </Column>
      </Row>
    </form>
  );
};

const formName = 'add-rent-criteria-form';

export default flowRight(
  reduxForm({
    form: formName,
    initialValues: {
      decisions: [''],
      prices: [{}],
      real_estate_ids: [''],
    },
  }),
)(AddRentCriteriaForm);
