// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
}

const BasisOfRentsEdit = ({attributes, fields}: Props) => {
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
                  className='position-topright'
                  onClick={() => fields.remove(index)}
                  title="Poista vuokranperuste"
                />
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'basis_of_rents.child.children.intended_use')}
                      name={`${item}.intended_use`}
                      overrideValues={{
                        label: 'Käyttötarkoitus',
                      }}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <FormField
                      fieldAttributes={get(attributes, 'basis_of_rents.child.children.floor_m2')}
                      name={`${item}.floor_m2`}
                      overrideValues={{
                        label: 'K-m2',
                      }}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <FormField
                      fieldAttributes={get(attributes, 'basis_of_rents.child.children.index')}
                      name={`${item}.index`}
                      overrideValues={{
                        label: 'Indeksi',
                      }}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <FormField
                      fieldAttributes={get(attributes, 'basis_of_rents.child.children.amount_per_floor_m2_index_100')}
                      name={`${item}.amount_per_floor_m2_index_100`}
                      overrideValues={{
                        label: '€/k-m2 (ind 100)',
                      }}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <FormField
                      fieldAttributes={get(attributes, 'basis_of_rents.child.children.amount_per_floor_m2_index')}
                      name={`${item}.amount_per_floor_m2_index`}
                      overrideValues={{
                        label: '€/k-m2 (ind)',
                      }}
                    />
                  </Column>
                  <Column small={3} medium={2} large={1}>
                    <FormField
                      fieldAttributes={get(attributes, 'basis_of_rents.child.children.percent')}
                      name={`${item}.percent`}
                      overrideValues={{
                        label: 'Prosenttia',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'basis_of_rents.child.children.year_rent_index_100')}
                      name={`${item}.year_rent_index_100`}
                      overrideValues={{
                        label: 'Perusvuosivuokra €/v (ind 100)',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'basis_of_rents.child.children.year_rent_index')}
                      name={`${item}.year_rent_index`}
                      overrideValues={{
                        label: 'Perusvuosivuokra €/v (ind)',
                      }}
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

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(BasisOfRentsEdit);
