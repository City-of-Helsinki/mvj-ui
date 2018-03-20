// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';

type Props = {
  fields: any,
  title: string,
  typeOptions: Array<Object>,
}

const PlotItemsEdit = ({fields, title, typeOptions}: Props) => {
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
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label='Kokonaisala'
                  name={`${plot}.area`}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label='Leikkausala'
                  name={`${plot}.section_area`}
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
                />
              </Column>
              <Column medium={2}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label="Postinumero"
                  name={`${plot}.postal_code`}
                />
              </Column>
              <Column medium={3}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label='Kaupunki'
                  name={`${plot}.city`}
                />
              </Column>
              <Column medium={3}>
                <Field
                  className='no-margin'
                  component={FieldTypeDatePicker}
                  label='Rekisteröintipäivä'
                  name={`${plot}.registration_date`}
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
