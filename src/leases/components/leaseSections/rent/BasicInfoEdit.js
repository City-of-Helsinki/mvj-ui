// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$util/helpers';
import {RentTypes, RentDueDateTypes} from '$src/leases/enums';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type DueDatesProps = {
  attributes: Attributes,
  fields: any,
}

const renderDueDates = ({attributes, fields}: DueDatesProps) => {
  return (
    <div>
      <Row>
        <Column>
          <label className="mvj-form-field-label">Eräpäivät</label>
        </Column>
      </Row>
      {fields && fields.length > 0 && fields.map((due_date, index) => {
        return (
          <Row key={index}>
            <Column small={9}>
              <Row>
                <Column small={6}>
                  <Field
                    component={FieldTypeText}
                    name={`${due_date}.day`}
                    placeholder='pv'
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'rents.child.children.due_dates.child.children.day')),
                    ]}
                  />
                </Column>
                <Column small={6}>
                  <Field
                    component={FieldTypeText}
                    name={`${due_date}.month`}
                    placeholder='kk'
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'rents.child.children.due_dates.child.children.month')),
                    ]}
                  />
                </Column>
              </Row>
            </Column>
            <Column small={3}>
              <RemoveButton
                onClick={() => fields.remove(index)}
                title="Poista eräpäivä"
              />
            </Column>
          </Row>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää eräpäivä'
            onClick={() => fields.push('')}
            title='Lisää eräpäivä'
          />
        </Column>
      </Row>
    </div>
  );
};

type FixedInitialYearRentsProps = {
  attributes: Attributes,
  fields: any,
}

const renderFixedInitialYearRents = ({attributes, fields}: FixedInitialYearRentsProps) => {
  return (
    <div>
      <Row>
        <Column><p className="sub-title">Kiinteät alkuvuosivuokrat</p></Column>
      </Row>
      {fields && !!fields.length &&
        <Row>
          <Column small={3} medium={2}><label className="mvj-form-field-label">Vuokra</label></Column>
          <Column small={3} medium={2}><label className="mvj-form-field-label">Alkupvm</label></Column>
          <Column small={3} medium={2}><label className="mvj-form-field-label">Loppupvm</label></Column>
        </Row>
      }
      {fields && !!fields.length && fields.map((rent, index) => {
        return (
          <div key={index}>
            <Row>
              <Column small={3} medium={2}>
                <Field
                  component={FieldTypeText}
                  name={`${rent}.amount`}
                  validate={[
                    (value) => genericValidator(value, get(attributes,
                      'rents.child.children.fixed_initial_year_rents.child.children.amount')),
                  ]}
                />
              </Column>
              <Column small={3} medium={2}>
                <Field
                  component={FieldTypeDatePicker}
                  name={`${rent}.start_date`}
                  validate={[
                    (value) => genericValidator(value, get(attributes,
                      'rents.child.children.fixed_initial_year_rents.child.children.start_date')),
                  ]}
                />
              </Column>
              <Column small={3} medium={2}>
                <Field
                  className='with-dash'
                  component={FieldTypeDatePicker}
                  name={`${rent}.end_date`}
                  validate={[
                    (value) => genericValidator(value, get(attributes,
                      'rents.child.children.fixed_initial_year_rents.child.children.end_date')),
                  ]}
                />
              </Column>
              <Column>
                <RemoveButton
                  onClick={() => fields.remove(index)}
                  title="Poista alennus/korotus"
                />
              </Column>
            </Row>
          </div>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää kiinteä alkuvuosivuokra'
            onClick={() => fields.push({})}
            title='Lisää kiinteä alkuvuosivuokra'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  rents: Object,
  rentType: ?string,
}

const BasicInfoEmpty = ({attributes}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeSelect}
            label="Vuokralaji"
            name="type"
            options={typeOptions}
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.type')),
            ]}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoIndex = ({attributes, rents}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const cycleOptions = getAttributeFieldOptions(attributes, 'rents.child.children.cycle');
  const indexTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.index_type');
  const dueDatesTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.due_dates_type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeSelect}
            label="Vuokralaji"
            name="type"
            options={typeOptions}
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.type')),
            ]}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeSelect}
            label="Vuokrakausi"
            name="cycle"
            options={cycleOptions}
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.cycle')),
            ]}
          />
        </Column>
        <Column small={6} medium={4} large={4}>
          <Field
            component={FieldTypeSelect}
            label="Indeksin tunnusnumero (laskentalaji)"
            name="index_type"
            options={indexTypeOptions}
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.index_type')),
            ]}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeSelect}
            label="Laskutusjako"
            name="due_dates_type"
            options={dueDatesTypeOptions}
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.due_dates_type')),
            ]}
          />
        </Column>
        {rents.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FieldArray
              attributes={attributes}
              component={renderDueDates}
              name="due_dates"
            />
          </Column>
        }
        {rents.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <Field
              component={FieldTypeText}
              label="Laskut kpl / vuodessa"
              name="due_dates_per_year"
              validate={[
                (value) => genericValidator(value, get(attributes,
                  'rents.child.children.due_dates_per_year')),
              ]}
            />
          </Column>
        }
      </Row>
      <Row>
        <Column small={12} medium={4} large={2}>
          <Row>
            <Column small={6}>
              <Field
                component={FieldTypeText}
                label='Perusindeksi'
                name="elementary_index"
                validate={[
                  (value) => genericValidator(value, get(attributes,
                    'rents.child.children.elementary_index')),
                ]}
              />
            </Column>
            <Column small={6}>
              <Field
                component={FieldTypeText}
                label='Pyöristys'
                name="index_rounding"
                validate={[
                  (value) => genericValidator(value, get(attributes,
                    'rents.child.children.index_rounding')),
                ]}
              />
            </Column>
          </Row>
        </Column>
        <Column small={4} medium={2} large={1}>
          <Field
            component={FieldTypeText}
            label="X-luku"
            name="x_value"
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.x_value')),
            ]}
          />
        </Column>
        <Column small={4} medium={2} large={1}>
          <Field
            component={FieldTypeText}
            label="Y-luku"
            name="y_value"
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.y_value')),
            ]}
          />
        </Column>
        <Column small={4} medium={2} large={1}>
          <Field
            component={FieldTypeText}
            label="Y-alkaen"
            name="y_value_start"
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.y_value_start')),
            ]}
          />
        </Column>
        <Column small={12} medium={4} large={2}>
          <label>Tasaus pvm</label>
          <Row>
            <Column small={6}>
              <Field
                component={FieldTypeDatePicker}
                name="equalization_start_date"
                validate={[
                  (value) => genericValidator(value, get(attributes,
                    'rents.child.children.equalization_start_date')),
                ]}
              />
            </Column>
            <Column small={6}>
              <Field
                className='with-dash'
                component={FieldTypeDatePicker}
                name="equalization_end_date"
                validate={[
                  (value) => genericValidator(value, get(attributes,
                    'rents.child.children.equalization_end_date')),
                ]}
              />
            </Column>
          </Row>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <FieldArray
            component={renderFixedInitialYearRents}
            name="fixed_initial_year_rents"
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
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.note')),
            ]}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoOneTime = ({attributes}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeSelect}
            label="Vuokralaji"
            name="type"
            options={typeOptions}
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.type')),
            ]}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeText}
            label="Kertakaikkinen vuokra"
            name="amount"
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.amount')),
            ]}
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
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.note')),
            ]}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFixed = ({attributes, rents}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const dueDatesTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.due_dates_type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeSelect}
            label="Vuokralaji"
            name="type"
            options={typeOptions}
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.type')),
            ]}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeText}
            label="Kertakaikkinen vuokra"
            name="amount"
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.amount')),
            ]}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeSelect}
            label="Laskutusjako"
            name="due_dates_type"
            options={dueDatesTypeOptions}
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.due_dates_type')),
            ]}
          />
        </Column>
        {rents.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FieldArray
              attributes={attributes}
              component={renderDueDates}
              name="due_dates"
            />
          </Column>
        }
        {rents.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <Field
              component={FieldTypeText}
              label="Laskut kpl / vuodessa"
              name="due_dates_per_year"
              validate={[
                (value) => genericValidator(value, get(attributes,
                  'rents.child.children.due_dates_per_year')),
              ]}
            />
          </Column>
        }
      </Row>
      <Row>
        <Column>
          <Field
            component={FieldTypeText}
            label="Kommentti"
            name="note"
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.note')),
            ]}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFree = ({attributes}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Field
            component={FieldTypeSelect}
            label="Vuokralaji"
            name="type"
            options={typeOptions}
            validate={[
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.type')),
            ]}
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
              (value) => genericValidator(value, get(attributes,
                'rents.child.children.note')),
            ]}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoEdit = ({attributes, rents, rentType}: Props) => {
  return (
    <div>
      {!rentType &&
        <BasicInfoEmpty
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.INDEX &&
        <BasicInfoIndex
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.ONE_TIME &&
        <BasicInfoOneTime
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FIXED &&
        <BasicInfoFixed
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FREE &&
        <BasicInfoFree
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.MANUAL &&
        <BasicInfoIndex
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
    </div>
  );
};

export default BasicInfoEdit;
