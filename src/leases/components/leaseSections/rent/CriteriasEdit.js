// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';
import {purposeOptions} from '$src/constants';

type Props = {
  fields: any,
}

const CriteriasEdit = ({fields}: Props) => {
  return (
    <div>
      {fields && !!fields.length && fields.map((item, index) => {
        return (
          <GreenBoxItem
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
                    name={`${item}.purpose`}
                    options={purposeOptions}
                  />
                </Column>
                <Column small={3} medium={2} large={1}>
                  <Field
                    component={FieldTypeText}
                    label='K-m2'
                    name={`${item}.km2`}
                  />
                </Column>
                <Column small={3} medium={2} large={1}>
                  <Field
                    component={FieldTypeText}
                    label='Indeksi'
                    name={`${item}.index`}
                  />
                </Column>
                <Column small={3} medium={2} large={1}>
                  <Field
                    component={FieldTypeText}
                    label='€/k-m2 (ind 100)'
                    name={`${item}.ekm2ind100`}
                  />
                </Column>
                <Column small={3} medium={2} large={1}>
                  <Field
                    component={FieldTypeText}
                    label='€/k-m2 (ind)'
                    name={`${item}.ekm2ind`}
                  />
                </Column>
                <Column small={3} medium={2} large={1}>
                  <Field
                    component={FieldTypeText}
                    label='Prosenttia'
                    name={`${item}.percentage`}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Perusvuosivuokra €/v (ind 100)'
                    name={`${item}.basic_rent`}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Perusvuosivuokra €/v (ind)'
                    name={`${item}.start_rent`}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
          </GreenBoxItem>
        );
      })}
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

export default CriteriasEdit;
