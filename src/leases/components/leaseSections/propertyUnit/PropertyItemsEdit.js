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

import {propertyItemExplanationOptions} from '$src/constants';

type Props = {
  areas: Array<Object>,
  fields: any,
  title: string,
}

const PropertyItemsEdit = ({areas, fields, title}: Props) => {
  return (
    <GreenBoxEdit>
      <h2>{title}</h2>
      {fields.length > 0 && fields.map((property, index) =>
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
                    <label className='mvj-form-field-label'>Tunnus</label>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Field
                      name={`${property}.municipality`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column>
                    <Field
                      name={`${property}.district`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column>
                    <Field
                      name={`${property}.group_number`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column>
                    <Field
                      name={`${property}.unit_number`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column>
                    {get({areas: areas}, `${property}.explanation`) === 'määräala' &&
                      <Field
                        name={`${property}.unseparate_parcel_number`}
                        type="text"
                        component={FieldTypeText}
                      />
                    }
                  </Column>
                </Row>
              </Column>
              <Column medium={2}>
                <Field
                  name={`${property}.explanation`}
                  component={FieldTypeSelect}
                  label='Selite'
                  options={propertyItemExplanationOptions}
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${property}.full_area`}
                  type="text"
                  component={FieldTypeText}
                  label='Kokonaisala'
                  placeholder='Kokonaisala'/>
              </Column>
              <Column medium={3}>
                <Field
                  name={`${property}.intersection_area`}
                  type="text"
                  component={FieldTypeText}
                  label='Leikkausala'
                  placeholder='Leikkausala'/>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label='Osoite'
                  name={`${property}.address`}
                  placeholder='Osoite'/>
              </Column>
              <Column medium={2}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label="Postinumero"
                  name={`${property}.zip_code`}
                  placeholder="Postinumero"/>
              </Column>
              <Column medium={3}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label='Kaupunki'
                  name={`${property}.town`}
                  placeholder='Kaupunki'/>
              </Column>
              <Column medium={3}>
                <Field
                  className='no-margin'
                  component={FieldTypeDatePicker}
                  label='Rekisteröintipäivä'
                  name={`${property}.registration_date`}
                  placeholder='Rekisteröintipäivä'/>
              </Column>
            </Row>
          </BoxContentWrapper>
        </GreenBoxItem>
      )}
      <Row>
        {title === 'Kiinteistöt / määräalat sopimushetkellä' &&
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää kiinteistö /määräala sopimushetkellä'
            onClick={() => fields.push({})}
            title='Lisää kiinteistö /määräala sopimushetkellä'
          />
        </Column>}
        {title === 'Kiinteistöt / määräalat nykyhetkellä' &&
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää kiinteistö /määräala nykyhetkellä'
            onClick={() => fields.push({})}
            title='Lisää kiinteistö /määräala nykyhetkellä'
          />
        </Column>}
      </Row>
    </GreenBoxEdit>
  );
};

export default PropertyItemsEdit;
