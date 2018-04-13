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
  fields: any,
  title: string,
}

const PlotItemsEdit = ({attributes, buttonTitle, fields, title}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plots.child.children.type');

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
            {fields.map((plot, index) =>
              <BoxItem className='no-border-on-first-child'  key={plot.id ? plot.id : `index_${index}`}>
                <BoxContentWrapper>
                  <RemoveButton
                    className='position-topright'
                    onClick={() => fields.remove(index)}
                    title="Poista kiinteistö / määräala"
                  />
                  <Row>
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
                      <Field
                        component={FieldTypeSelect}
                        label='Selite'
                        name={`${plot}.type`}
                        options={typeOptions}
                        validate={[
                          (value) => genericValidator(value,
                            get(attributes, 'lease_areas.child.children.plots.child.children.type')),
                        ]}
                      />
                    </Column>
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
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
                    <Column small={6} medium={4} large={2}>
                      <Field
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
                  <Row>
                    <Column small={12} medium={12} large={4}>
                      <Field
                        component={FieldTypeText}
                        label='Osoite'
                        name={`${plot}.address`}
                        validate={[
                          (value) => genericValidator(value,
                            get(attributes, 'lease_areas.child.children.plots.child.children.address')),
                        ]}
                      />
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <Field
                        component={FieldTypeText}
                        label="Postinumero"
                        name={`${plot}.postal_code`}
                        validate={[
                          (value) => genericValidator(value,
                            get(attributes, 'lease_areas.child.children.plots.child.children.postal_code')),
                        ]}
                      />
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <Field
                        component={FieldTypeText}
                        label='Kaupunki'
                        name={`${plot}.city`}
                        validate={[
                          (value) => genericValidator(value,
                            get(attributes, 'lease_areas.child.children.plots.child.children.city')),
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
                label='Lisää kiinteistö /määräala'
                onClick={() => fields.push({})}
                title='Lisää kiinteistö /määräala'
              />
            </Column>
          </Row>
        </Collapse>
      }
    </div>
  );
};

export default PlotItemsEdit;
