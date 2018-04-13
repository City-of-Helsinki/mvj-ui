// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {genericValidator} from '$components/form/validations';

type Props = {
  attributes: Object,
  buttonTitle: string,
  title: string,
  fields: any,
}

const PlanUnitItemsEdit = ({attributes, buttonTitle, title, fields}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.type');
  const planUnitTypeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_type');
  const planUnitStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_state');

  return (
    <div>
      {(!fields || !fields.length) &&
        <Row>
          <Column>
            <AddButtonSecondary
              label={buttonTitle}
              onClick={() => fields.push({})}
              title={buttonTitle}
            />
          </Column>
        </Row>
      }
      {(fields && !!fields.length) &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={true}
          header={
            <Row>
              <Column small={12}>
                <h4 className='collapse__header-title'>{title}</h4>
              </Column>
            </Row>
          }
        >
          <BoxItemContainer>
            {fields.map((planunit, index) =>
              <BoxItem className='no-border-on-first-child' key={planunit.id ? planunit.id : `index_${index}`}>
                <BoxContentWrapper>
                  <RemoveButton
                    className='position-topright'
                    onClick={() => fields.remove(index)}
                    title="Poista kaavayksikkö"
                  />
                  <Row>
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={12} medium={12} large={4}>
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
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
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
                  </Row>
                  <Row>
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={6} large={4}>
                      <Field
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
                    <Column small={6} medium={6} large={2}>
                      <Field
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
              </BoxItem>
            )}
          </BoxItemContainer>
          <Row>
            <Column>
              <AddButtonSecondary
                label='Lisää kaavayksikkö'
                onClick={() => fields.push({})}
                title='Lisää kaavayksikkö'
              />
            </Column>
          </Row>
        </Collapse>
      }
    </div>
  );
};

export default PlanUnitItemsEdit;
