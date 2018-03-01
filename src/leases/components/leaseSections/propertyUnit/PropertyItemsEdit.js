// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';


type Props = {
  areas: Array<Object>,
  fields: any,
  title: string,
}

const PropertyItemsEdit = ({areas, fields, title}: Props) => {
  return (
    <div className='green-box'>
      {fields.length > 0 &&
        <Row>
          <Column>
            <h2>{title}</h2>
          </Column>
        </Row>
      }
      {fields.length > 0 && fields.map((property, index) =>
        <div key={index} className='green-box-item'>
          <button
            className='remove-button'
            type="button"
            title="Poista kiinteistö / määräala"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={4} style={{paddingRight: '30px'}}>
              <Row>
                <Column>
                  <label className='mvj-form-field-label'>Tunnus</label>
                </Column>
              </Row>
              <Row>
                <div className='identifier-column'>
                  <Field
                    name={`${property}.municipality`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                <div className='identifier-column'>
                  <Field
                    name={`${property}.district`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                <div className='identifier-column'>
                  <Field
                    name={`${property}.group_number`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                <div className='identifier-column'>
                  <Field
                    name={`${property}.unit_number`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                {get({areas: areas}, `${property}.explanation`) === 'määräala' &&
                <div className='identifier-column'>
                  <Field
                    name={`${property}.unseparate_parcel_number`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                }
              </Row>
            </Column>
            <Column medium={2}>
              <Field
                name={`${property}.explanation`}
                component={FieldTypeSelect}
                label='Selite'
                options={[
                  {value: 'kiinteistö', label: 'Kiinteistö'},
                  {value: 'määräala', label: 'Määräala'},
                ]}
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
        </div>
      )}
      <Row>
        {title === 'Kiinteistöt / määräalat sopimushetkellä' &&
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää kiinteistö /määräala sopimushetkellä</span></a>
        </Column>}
        {title === 'Kiinteistöt / määräalat nykyhetkellä' &&
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää kiinteistö /määräala nykyhetkellä</span></a>
        </Column>}
      </Row>
    </div>
  );
};

export default PropertyItemsEdit;
