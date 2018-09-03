// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {change, formValueSelector} from 'redux-form';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getAttributes} from '$src/leases/selectors';
import {formatDecimalNumberForDb} from '$util/helpers';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  basisOfRents: Array<Object>,
  change: Function,
  fields: any,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

class BasisOfRentsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    if(prevProps.basisOfRents !== this.props.basisOfRents) {
      const calculateRentBasisValues = this.calculateRentBasisValues;

      this.props.basisOfRents.forEach((basis, index) => {
        const prevBasis = get(prevProps, `basisOfRents[${index}]`);
        if(prevBasis && (
          prevBasis.amount_per_floor_m2_index_100 !== basis.amount_per_floor_m2_index_100 ||
          prevBasis.floor_m2 !== basis.floor_m2 ||
          prevBasis.index !== basis.index ||
          prevBasis.percent !== basis.percent)
        ) {
          calculateRentBasisValues(basis, index);
        }
      });
    }
  }

  calculateRentBasisValues = (basis, i) => {
    const {amount_per_floor_m2_index_100, floor_m2, index, percent} = basis;
    const {change} = this.props;

    if(formatDecimalNumberForDb(amount_per_floor_m2_index_100) &&
      formatDecimalNumberForDb(floor_m2) &&
      Number.isInteger(Number(index)) &&
      formatDecimalNumberForDb(percent)
    ) {
      const amount_per_floor_m2_index = Math.round(
        formatDecimalNumberForDb(amount_per_floor_m2_index_100) *
        (Number(index) / 100));

      const year_rent_index_100 = Math.round(
        formatDecimalNumberForDb(amount_per_floor_m2_index_100) *
        formatDecimalNumberForDb(floor_m2) *
        (formatDecimalNumberForDb(percent) / 100));

      const year_rent_index = Math.round(
        formatDecimalNumberForDb(amount_per_floor_m2_index_100) *
        formatDecimalNumberForDb(floor_m2) *
        (Number(index) / 100) *
        (formatDecimalNumberForDb(percent) / 100));

      change(FormNames.RENTS, `basis_of_rents[${i}].amount_per_floor_m2_index`, amount_per_floor_m2_index);
      change(FormNames.RENTS, `basis_of_rents[${i}].year_rent_index_100`, year_rent_index_100);
      change(FormNames.RENTS, `basis_of_rents[${i}].year_rent_index`, year_rent_index);

    } else {
      change(FormNames.RENTS, `basis_of_rents[${i}].amount_per_floor_m2_index`, '');
      change(FormNames.RENTS, `basis_of_rents[${i}].year_rent_index_100`, '');
      change(FormNames.RENTS, `basis_of_rents[${i}].year_rent_index`, '');
    }
  }

  render() {
    const {attributes, fields, isSaveClicked, onOpenDeleteModal} = this.props;
    return (
      <div>
        <BoxItemContainer>
          {fields && !!fields.length && fields.map((item, index) => {
            const handleOpenDeleteModal = () => {
              onOpenDeleteModal(
                () => fields.remove(index),
                DeleteModalTitles.BASIS_OF_RENT,
                DeleteModalLabels.BASIS_OF_RENT,
              );
            };

            return (
              <BoxItem
                key={index}
                className='no-border-on-first-child'>
                <BoxContentWrapper>
                  <RemoveButton
                    className='position-topright'
                    onClick={handleOpenDeleteModal}
                    title="Poista vuokranperuste"
                  />
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'basis_of_rents.child.children.intended_use')}
                        name={`${item}.intended_use`}
                        overrideValues={{
                          label: 'Käyttötarkoitus',
                        }}
                      />
                    </Column>
                    <Column small={3} medium={2} large={1}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'basis_of_rents.child.children.floor_m2')}
                        name={`${item}.floor_m2`}
                        unit='k-m²'
                        overrideValues={{
                          label: 'Pinta-ala',
                        }}
                      />
                    </Column>
                    <Column small={3} medium={2} large={1}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'basis_of_rents.child.children.index')}
                        name={`${item}.index`}
                        overrideValues={{
                          label: 'Indeksi',
                        }}
                      />
                    </Column>
                    <Column small={3} medium={2} large={2}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'basis_of_rents.child.children.amount_per_floor_m2_index_100')}
                        name={`${item}.amount_per_floor_m2_index_100`}
                        unit='€/k-m²'
                        overrideValues={{
                          label: 'Yksikköhinta (ind 100)',
                        }}
                      />
                    </Column>
                    <Column small={3} medium={2} large={1}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'basis_of_rents.child.children.percent')}
                        name={`${item}.percent`}
                        unit='%'
                        overrideValues={{
                          label: 'Prosenttia',
                        }}
                      />
                    </Column>
                  </Row>
                  <Row>
                    <Column small={3} medium={4} large={2}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'basis_of_rents.child.children.amount_per_floor_m2_index')}
                        name={`${item}.amount_per_floor_m2_index`}
                        disabled
                        disableDirty
                        unit='€/k-m²'
                        overrideValues={{
                          label: 'Yksikköhinta (ind)',
                        }}
                      />
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'basis_of_rents.child.children.year_rent_index_100')}
                        name={`${item}.year_rent_index_100`}
                        disabled
                        disableDirty
                        unit='€/v'
                        overrideValues={{
                          label: 'Perusvuosivuokra (ind 100)',
                        }}
                      />
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'basis_of_rents.child.children.year_rent_index')}
                        name={`${item}.year_rent_index`}
                        disabled
                        disableDirty
                        unit='€/v'
                        overrideValues={{
                          label: 'Alkuvuosivuokra (ind)',
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
              onClick={() => fields.push({index: 1935})}
              title='Lisää vuokranperuste'
            />
          </Column>
        </Row>
      </div>
    );
  }
}

const selector = formValueSelector(FormNames.RENTS);

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      basisOfRents: selector(state, 'basis_of_rents'),
    };
  },
  {
    change,
  }
)(BasisOfRentsEdit);
