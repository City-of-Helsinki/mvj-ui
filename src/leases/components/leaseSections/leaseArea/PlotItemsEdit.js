// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type AddressesProps = {
  attributes: Attributes,
  fields: any,
}

const AddressItems = ({attributes, fields}: AddressesProps): Element<*> => {
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
              fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.addresses.child.children.address')}
              name={`${field}.address`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={3} large={3}>
            <FormField
              fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.addresses.child.children.postal_code')}
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
                  fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.addresses.child.children.city')}
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
  fields: any,
  title: string,
}

const PlotItemsEdit = ({attributes, buttonTitle, fields, title}: Props) => {
  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        headerTitle={
          <h4 className='collapse__header-title'>{title}</h4>
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
                  <Column small={12} medium={6} large={6}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.identifier')}
                      name={`${plot}.identifier`}
                      overrideValues={{
                        label: 'Tunnus',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.type')}
                      name={`${plot}.type`}
                      overrideValues={{
                        label: 'Määritelmä',
                      }}
                    />
                  </Column>
                </Row>

                <FieldArray
                  attributes={attributes}
                  component={AddressItems}
                  name={`${plot}.addresses`}
                />
                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.area')}
                      name={`${plot}.area`}
                      overrideValues={{
                        label: 'Kokonaisala',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.section_area')}
                      name={`${plot}.section_area`}
                      overrideValues={{
                        label: 'Leikkausala',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.registration_date')}
                      name={`${plot}.registration_date`}
                      overrideValues={{
                        label: 'Rekisteröintipvm',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.repeal_date')}
                      name={`${plot}.repeal_date`}
                      overrideValues={{
                        label: 'Kumoamispvm',
                      }}
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

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(PlotItemsEdit);
