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
  fields: any,
  title: string,
}

const PlotItemsEdit = ({attributes, fields, title}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plots.child.children.type');

  return (
    <GreenBoxEdit>
      <h2 className='no-margin'>{title}</h2>
      {fields.length > 0 && fields.map((plot, index) =>
        <GreenBoxItem key={index}>
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright-no-padding'
              label="Poista kiinteistö / määräala"
              onClick={() => fields.remove(index)}
              title="Poista kiinteistö / määräala"
            />
            <Row>
              <Column medium={4}>
                <Row>
                  <Column>
                    <Field
                      component={FieldTypeText}
                      label='Tunnus'
                      name={`${plot}.identifier`}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'lease_areas.child.children.plots.child.children.identifier')),
                      ]}
                    />
                  </Column>
                </Row>
              </Column>
              <Column medium={2}>
                <Field
                  name={`${plot}.type`}
                  component={FieldTypeSelect}
                  label='Selite'
                  options={typeOptions}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plots.child.children.type')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label='Kokonaisala'
                  name={`${plot}.area`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plots.child.children.area')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label='Leikkausala'
                  name={`${plot}.section_area`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plots.child.children.section_area')),
                  ]}
                />
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label='Osoite'
                  name={`${plot}.address`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plots.child.children.address')),
                  ]}
                />
              </Column>
              <Column medium={2}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label="Postinumero"
                  name={`${plot}.postal_code`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plots.child.children.postal_code')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label='Kaupunki'
                  name={`${plot}.city`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plots.child.children.city')),
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  className='no-margin'
                  component={FieldTypeDatePicker}
                  label='Rekisteröintipäivä'
                  name={`${plot}.registration_date`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'lease_areas.child.children.plots.child.children.registration_date')),
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
            label='Lisää kiinteistö /määräala'
            onClick={() => fields.push({})}
            title='Lisää kiinteistö /määräala'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

export default PlotItemsEdit;
