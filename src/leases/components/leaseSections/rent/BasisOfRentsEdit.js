// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$util/helpers';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
}

const BasisOfRentsEdit = ({attributes, fields}: Props) => {
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'basis_of_rents.child.children.intended_use');
  return (
    <div>
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((item, index) => {
          return (
            <BoxItem
              key={index}
              className='no-border-on-first-child'>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright-no-padding'
                  onClick={() => fields.remove(index)}
                  title="Poista vuokranperuste"
                />
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Käyttötarkoitus'
                      name={`${item}.intended_use`}
                      options={intendedUseOptions}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'basis_of_rents.child.children.intended_use')),
                      ]}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <Field
                      component={FieldTypeText}
                      label='K-m2'
                      name={`${item}.floor_m2`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'basis_of_rents.child.children.floor_m2')),
                      ]}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <Field
                      component={FieldTypeText}
                      label='Indeksi'
                      name={`${item}.index`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'basis_of_rents.child.children.index')),
                      ]}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <Field
                      component={FieldTypeText}
                      label='€/k-m2 (ind 100)'
                      name={`${item}.amount_per_floor_m2_index_100`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'basis_of_rents.child.children.amount_per_floor_m2_index_100')),
                      ]}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <Field
                      component={FieldTypeText}
                      label='€/k-m2 (ind)'
                      name={`${item}.amount_per_floor_m2_index`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'basis_of_rents.child.children.amount_per_floor_m2_index')),
                      ]}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <Field
                      component={FieldTypeText}
                      label='Prosenttia'
                      name={`${item}.percent`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'basis_of_rents.child.children.percent')),
                      ]}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Perusvuosivuokra €/v (ind 100)'
                      name={`${item}.year_rent_index_100`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'basis_of_rents.child.children.year_rent_index_100')),
                      ]}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Perusvuosivuokra €/v (ind)'
                      name={`${item}.year_rent_index`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'basis_of_rents.child.children.year_rent_index')),
                      ]}
                    />
                  </Column>
                </Row>
              </BoxContentWrapper>
            </BoxItem>
          );
        })}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää vuokranperuste'
            onClick={() => fields.push({agreed: false, index: 1880})}
            title='Lisää vuokranperuste'
          />
        </Column>
      </Row>
    </div>
  );
};

export default BasisOfRentsEdit;
