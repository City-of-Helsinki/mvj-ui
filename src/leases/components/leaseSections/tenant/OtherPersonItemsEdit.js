// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeCheckbox from '../../../../components/form/FieldTypeCheckbox';
import FieldTypeText from '../../../../components/form/FieldTypeText';

type Props = {
  fields: any,
}

const OtherPersonItemsEdit = ({fields}: Props) => {
  return (

    <div className='green-box'>
      {fields && fields.length > 0 && fields.map((person, index) => {
        return (
          <div key={index} className='green-box-item'>
            <button
              className='remove-button'
              type="button"
              title="Poista henkilö"
              onClick={() => fields.remove(index)}>
              <img src={trashIcon} alt='Poista' />
            </button>
            <Row>
              <Column medium={3}>
                <Field
                  name={`${person}.firstname`}
                  component={FieldTypeText}
                  label='Etunimi'
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${person}.lastname`}
                  component={FieldTypeText}
                  label='Sukunimi'
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${person}.roles`}
                  className='checkbox-inline'
                  component={FieldTypeCheckbox}
                  options= {[
                    {value: 'laskunsaaja', label: 'Laskunsaaja'},
                    {value: 'yhteyshenkilö', label: 'Yhteyshenkilö'},
                  ]}
                  label='Rooli'
                />
              </Column>
            </Row>

            <Row>
              <Column medium={4}>
                <Field
                  name={`${person}.address`}
                  component={FieldTypeText}
                  label='Osoite'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${person}.zip_code`}
                  component={FieldTypeText}
                  label='Postinumero'
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${person}.town`}
                  component={FieldTypeText}
                  label='Kaupunki'
                />
              </Column>
              <Column medium={3}>
                <Row>
                  <Column medium={6}>
                    <Field
                      name={`${person}.start_date`}
                      component={FieldTypeText}
                      label='Alkupvm'
                    />
                  </Column>
                  <Column medium={6}>
                    <Field
                      name={`${person}.end_date`}
                      component={FieldTypeText}
                      label='Loppupvm'
                    />
                  </Column>
                </Row>
              </Column>
            </Row>

            <Row>
              <Column medium={3}>
                <Field
                  name={`${person}.email`}
                  component={FieldTypeText}
                  label='Sähköposti'
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${person}.phone`}
                  component={FieldTypeText}
                  label='Puhelin'
                />
              </Column>
              <Column medium={6}>
                <Row>
                  <Column medium={4}>
                    <Field
                      name={`${person}.language`}
                      component={FieldTypeText}
                      label='Kieli'
                    />
                  </Column>
                  <Column medium={4}>
                    <Field
                      name={`${person}.social_security_number`}
                      component={FieldTypeText}
                      label='Henkilötunnus'
                    />
                  </Column>
                  <Column medium={4}>
                    <Field
                      name={`${person}.protection_order`}
                      className='checkbox-inline'
                      component={FieldTypeCheckbox}
                      options= {[
                        {value: 'true', label: 'Turvakielto'},
                      ]}
                      label='Turvakielto'
                    />
                  </Column>
                </Row>
              </Column>
            </Row>

            <Row>
              <Column medium={3}>
                <Field
                  name={`${person}.customer_id`}
                  component={FieldTypeText}
                  label='Asiakasnumero'
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${person}.SAP_customer_id`}
                  component={FieldTypeText}
                  label='SAP asiakasnumero'
                />
              </Column>
              <Column medium={6}>
                <Field
                  name={`${person}.comment`}
                  component={FieldTypeText}
                  label='Kommentti'
                />
              </Column>
            </Row>
          </div>
        );
      })}
      <Row>
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää vuokralaiselle laskunsaaja tai yhteyshenkilö</span></a>
        </Column>
      </Row>
    </div>
  );
};

export default OtherPersonItemsEdit;
