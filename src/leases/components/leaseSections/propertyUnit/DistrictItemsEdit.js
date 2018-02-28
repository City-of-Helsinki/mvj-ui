// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import PlanUnitItemsEdit from './PlanUnitItemsEdit';
import PropertyItemsEdit from './PropertyItemsEdit';

type Props = {
  areas: Array<Object>,
  fields: any,
}

const DistrictItemsEdit = ({areas, fields}: Props) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((district, index) => {
        return (
          <div key={index} className='item'>
            <div className='white-box'>
              <button
                className='remove-button'
                type="button"
                title="Poista vuokra-alue"
                onClick={() => fields.remove(index)}>
                <img src={trashIcon} alt='Poista' />
              </button>
              <Row>
                <Column medium={4}>
                  <Row>
                    <Column>
                      <label className='mvj-form-field-label'>Kohteen tunnus</label>
                    </Column>
                  </Row>
                  <Row>
                    <div className='identifier-column'>
                      <Field
                        name={`${district}.municipality`}
                        type="text"
                        component={FieldTypeText}/>
                    </div>
                    <div className='identifier-column'>
                      <Field
                        name={`${district}.district`}
                        type="text"
                        component={FieldTypeText}/>
                    </div>
                    <div className='identifier-column'>
                      <Field
                        name={`${district}.group_number`}
                        type="text"
                        component={FieldTypeText}/>
                    </div>
                    <div className='identifier-column'>
                      <Field
                        name={`${district}.unit_number`}
                        type="text"
                        component={FieldTypeText}/>
                    </div>
                    {get({areas: areas}, `${district}.explanation`) === 'määräala' &&
                      <div className='identifier-column'>
                        <Field
                          name={`${district}.unseparate_parcel_number`}
                          type="text"
                          component={FieldTypeText}/>
                      </div>
                    }
                  </Row>
                </Column>
                <Column medium={2}>
                  <Field
                    name={`${district}.explanation`}
                    component={FieldTypeSelect}
                    label='Selite'
                    options={[
                      {value: 'kaavayksikkö', label: 'Kaavayksikkö'},
                      {value: 'kiinteistö', label: 'Kiinteisto'},
                      {value: 'määräala', label: 'Määräala'},
                      {value: 'muu', label: 'Muu'},
                    ]}
                  />
                </Column>
                <Column medium={3}>
                  <Field
                    name={`${district}.full_area`}
                    type="text"
                    component={FieldTypeText}
                    label="Pinta-ala"
                    placeholder="Pinta-ala"/>
                </Column>
                <Column medium={3}>
                  <Field
                    name={`${district}.position`}
                    component={FieldTypeSelect}
                    label='Sijainti'
                    options={[
                      {value: 'aboveground', label: 'Maanpäällinen'},
                      {value: 'underground', label: 'Maanalainen'},
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column medium={6}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label="Osoite"
                    name={`${district}.address`}
                    placeholder="Osoite"/>
                </Column>
                <Column medium={3}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label="Postinumero"
                    name={`${district}.zip_code`}
                    placeholder="Postinumero"/>
                </Column>
                <Column medium={3}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label="Kaupunki"
                    name={`${district}.town`}
                    placeholder="Kaupunki"/>
                </Column>
              </Row>
            </div>

            <FieldArray title='Kiinteistöt / määräalat sopimushetkellä' areas={areas} name={`${district}.plots_in_contract`} component={PropertyItemsEdit}/>
            <FieldArray title='Kiinteistöt / määräalat nykyhetkellä' areas={areas} name={`${district}.plots_at_present`} component={PropertyItemsEdit}/>
            <FieldArray title='Kaavayksiköt sopimushetkellä' name={`${district}.plan_plots_in_contract`} component={PlanUnitItemsEdit}/>
            <FieldArray title='Kaavayksiköt nykyhetkellä' name={`${district}.plan_plots_at_present`} component={PlanUnitItemsEdit}/>
          </div>
        );
      })}
      <Row>
        <Column>
          <button type="button" onClick={() => fields.push({})} className='add-button'>Lisää uusi kohde</button>
        </Column>
      </Row>
    </div>
  );
};

export default DistrictItemsEdit;
