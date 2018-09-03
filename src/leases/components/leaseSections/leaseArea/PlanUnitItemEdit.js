// @flow
import React from 'react';
import {FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonThird from '$components/form/AddButtonThird';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';

import type {Attributes} from '$src/leases/types';

type AddressesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

const AddressItems = ({attributes, fields, isSaveClicked, onOpenDeleteModal}: AddressesProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <div>
      <SubTitle>Osoite</SubTitle>
      {fields && !!fields.length &&
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
      }
      {fields && !!fields.length && fields.map((field, index) => {
        const handleOpenDeleteModal = () => {
          onOpenDeleteModal(
            () => fields.remove(index),
            DeleteModalTitles.ADDRESS,
            DeleteModalLabels.ADDRESS,
          );
        };

        return (
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
              <FieldAndRemoveButtonWrapper
                field={
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.addresses.child.children.city')}
                    name={`${field}.city`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                }
                removeButton={
                  <RemoveButton
                    className='third-level'
                    onClick={handleOpenDeleteModal}
                    title="Poista osoite"
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
            label='Lisää osoite'
            onClick={handleAdd}
            title='Lisää osoite'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  field: string,
  index: number,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
  onRemove: Function,
}

const PlanUnitItemEdit = ({
  attributes,
  field,
  index,
  isSaveClicked,
  onOpenDeleteModal,
  onRemove,
}: Props) => {
  const handleRemove = () => onRemove(index);

  return (
    <BoxItem>
      <BoxContentWrapper>
        <RemoveButton
          className='position-topright'
          onClick={handleRemove}
          title="Poista kaavayksikkö"
        />
        <Row>
          <Column small={12} medium={6} large={6}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.identifier')}
              name={`${field}.identifier`}
              overrideValues={{
                label: 'Tunnus',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.type')}
              name={`${field}.type`}
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
          name={`${field}.addresses`}
          onOpenDeleteModal={onOpenDeleteModal}
        />

        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.area')}
              name={`${field}.area`}
              unit='m²'
              overrideValues={{
                label: 'Kokonaisala',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.section_area')}
              name={`${field}.section_area`}
              unit='m²'
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
              name={`${field}.detailed_plan_identifier`}
              overrideValues={{
                label: 'Asemakaava',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date')}
              name={`${field}.detailed_plan_latest_processing_date`}
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
              name={`${field}.detailed_plan_latest_processing_date_note`}
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
              name={`${field}.plot_division_identifier`}
              overrideValues={{
                label: 'Tonttijaon tunnus',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_state')}
              name={`${field}.plot_division_state`}
              overrideValues={{
                label: 'Tonttijaon olotila',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_date_of_approval')}
              name={`${field}.plot_division_date_of_approval`}
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
              name={`${field}.plan_unit_type`}
              overrideValues={{
                label: 'Kaavayksikön laji',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_state')}
              name={`${field}.plan_unit_state`}
              overrideValues={{
                label: 'Kaavayksikön olotila',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use')}
              name={`${field}.plan_unit_intended_use`}
              overrideValues={{
                label: 'Kaavayksikön käyttötarkoitus',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}></Column>
        </Row>
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default PlanUnitItemEdit;
