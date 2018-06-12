// @flow
import React from 'react';
import {FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';

import type {Attributes} from '$src/leases/types';

type AddressesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const AddressItems = ({attributes, fields, isSaveClicked}: AddressesProps): Element<*> => {
  return (
    <div>
      <Row>
        <Column small={6} large={6}>
          <FormFieldLabel required>Osoite</FormFieldLabel>
        </Column>
        <Column small={3} large={3}>
          <FormFieldLabel>Postinumero</FormFieldLabel>
        </Column>
        <Column small={3} large={3}>
          <FormFieldLabel>Kaupunki</FormFieldLabel>
        </Column>
      </Row>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={6} large={6}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.addresses.child.children.address')}
              name={`${field}.address`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={3} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.addresses.child.children.postal_code')}
              name={`${field}.postal_code`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={3} large={3}>
            <div style={{display: 'flex'}}>
              <div style={{flex: '1 1 0%'}}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.addresses.child.children.city')}
                  name={`${field}.city`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </div>
              <div style={{paddingLeft: '7.5px'}}>
                <RemoveButton
                  onClick={() => fields.remove(index)}
                  title="Poista osoite"
                />
              </div>
            </div>
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää osoite'
            onClick={() => fields.push({})}
            title='Lisää osoite'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  buttonTitle: string,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  title: string,
}

const PlanUnitItemsEdit = ({
  attributes,
  buttonTitle,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  title,
}: Props) => {
  const planUnitErrors = get(errors, name);

  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        hasErrors={!isEmpty(planUnitErrors)}
        headerTitle={
          <h4 className='collapse__header-title'>{title}</h4>
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
                  <Column small={12} medium={6} large={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.identifier')}
                      name={`${planunit}.identifier`}
                      overrideValues={{
                        label: 'Tunnus',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.type')}
                      name={`${planunit}.type`}
                      overrideValues={{
                        label: 'Määritelmä',
                      }}
                    />
                  </Column>
                </Row>

                <FieldArray
                  attributes={attributes}
                  component={AddressItems}
                  isSaveClicked={isSaveClicked}
                  name={`${planunit}.addresses`}
                />

                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.area')}
                      name={`${planunit}.area`}
                      overrideValues={{
                        label: 'Kokonaisala',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.section_area')}
                      name={`${planunit}.section_area`}
                      overrideValues={{
                        label: 'Leikkausala',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_identifier')}
                      name={`${planunit}.detailed_plan_identifier`}
                      overrideValues={{
                        label: 'Asemakaava',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date')}
                      name={`${planunit}.detailed_plan_latest_processing_date`}
                      overrideValues={{
                        label: 'Asemakaavan viimeisin käsittelypvm',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date_note')}
                      name={`${planunit}.detailed_plan_latest_processing_date_note`}
                      overrideValues={{
                        label: 'Asemakaavan viimeisin käsittelypvm huomautus',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_identifier')}
                      name={`${planunit}.plot_division_identifier`}
                      overrideValues={{
                        label: 'Tonttijaon tunnus',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_state')}
                      name={`${planunit}.plot_division_state`}
                      overrideValues={{
                        label: 'Tonttijaon olotila',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_date_of_approval')}
                      name={`${planunit}.plot_division_date_of_approval`}
                      overrideValues={{
                        label: 'Tonttijaon hyväksymispvm',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_type')}
                      name={`${planunit}.plan_unit_type`}
                      overrideValues={{
                        label: 'Kaavayksikön laji',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_state')}
                      name={`${planunit}.plan_unit_state`}
                      overrideValues={{
                        label: 'Kaavayksikön olotila',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use')}
                      name={`${planunit}.plan_unit_intended_use`}
                      overrideValues={{
                        label: 'Kaavayksikön käyttötarkoitus',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}></Column>
                </Row>
              </BoxContentWrapper>
            </BoxItem>
          )}
        </BoxItemContainer>
        <Row>
          <Column>
            <AddButtonSecondary
              label={buttonTitle}
              onClick={() => fields.push({
                addresses: [{}],
              })}
              title={buttonTitle}
            />
          </Column>
        </Row>
      </Collapse>
    </div>
  );
};

export default PlanUnitItemsEdit;
