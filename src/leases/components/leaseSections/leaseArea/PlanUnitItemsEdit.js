// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {genericValidator} from '$components/form/validations';

type Props = {
  attributes: Object,
  title: string,
  fields: any,
}

const PlanUnitItemsEdit = ({attributes, title, fields}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.type');
  const planUnitTypeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_type');
  const planUnitStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_state');

  return (
    <GreenBoxEdit>
      <h2>{title}</h2>
      {fields && fields.length > 0 && fields.map((planunit, index) =>
        <GreenBoxItem key={index}>
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright-no-padding'
              onClick={() => fields.remove(index)}
              title="Poista kaavayksikkö"
            />
            <Row>
              <Column medium={4}>
                <Field
                  component={FieldTypeText}
                  label='Tunnus'
                  name={`${planunit}.identifier`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.identifier')),
                  ]}
                />
              </Column>
              <Column medium={2}>
                <Field
                  component={FieldTypeSelect}
                  label='Käyttötarkoitus'
                  name={`${planunit}.type`}
                  options={typeOptions}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.type')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label='Kokonaisala'
                  name={`${planunit}.area`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.area')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label='Leikkausala'
                  name={`${planunit}.section_area`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.section_area')),
                  ]}
                />
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <Field
                  component={FieldTypeText}
                  label='Osoite'
                  name={`${planunit}.address`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.address')),
                  ]}
                />
              </Column>
              <Column medium={2}>
                <Field
                  component={FieldTypeText}
                  label='Postinumero'
                  name={`${planunit}.postal_code`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.postal_code')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label='Kaupunki'
                  name={`${planunit}.city`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.city')),
                  ]}
                />
              </Column>
              {/* <Column medium={3}>
                <Field
                  component={FieldTypeSelect}
                  label='Olotila'
                  name={`${planunit}.state`}
                  options={planUnitStateOptions}
                />
              </Column> */}
            </Row>
            <Row>
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label='Tonttijaon tunnus'
                  name={`${planunit}.plot_division_identifier`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_identifier')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Tonttijaon hyväksymispvm'
                  name={`${planunit}.plot_division_date_of_approval`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_date_of_approval')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label='Asemakaava'
                  name={`${planunit}.detailed_plan_identifier`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_identifier')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Asemakaavan vahvistumispvm'
                  name={`${planunit}.detailed_plan_date_of_approval`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_date_of_approval')),
                  ]}
                />
              </Column>
            </Row>
            <Row>
              <Column medium={6}>
                <Field
                  className='no-margin'
                  component={FieldTypeSelect}
                  label='Kaavayksikön laji'
                  name={`${planunit}.plan_unit_type`}
                  options={planUnitTypeOptions}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_type')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  className='no-margin'
                  component={FieldTypeSelect}
                  label='Kaavayksikön olotila'
                  name={`${planunit}.plan_unit_state`}
                  options={planUnitStateOptions}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_state')),
                  ]}
                />
              </Column>
            </Row>
          </BoxContentWrapper>
        </GreenBoxItem>
      )}
      <Row>
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää kaavayksikkö'
            onClick={() => fields.push({})}
            title='Lisää kaavayksikkö'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

export default PlanUnitItemsEdit;
