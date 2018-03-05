// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '../../../../components/form/AddButtonSecondary';
import BoxContentWrapper from '../../../../components/content/BoxContentWrapper';
import FieldTypeCheckbox from '../../../../components/form/FieldTypeCheckbox';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import GreenBoxEdit from '../../../../components/content/GreenBoxEdit';
import GreenBoxItem from '../../../../components/content/GreenBoxItem';
import RemoveButton from '../../../../components/form/RemoveButton';

import {tenantsRolesOptions} from '../constants';

type Props = {
  fields: any,
}

const OtherPersonItemsEdit = ({fields}: Props) => {
  return (

    <GreenBoxEdit>
      {fields && fields.length > 0 && fields.map((person, index) => {
        return (
          <GreenBoxItem key={index} className='no-border-on-first-child'>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright'
                label='Poista henkilö'
                onClick={() => fields.remove(index)}
                title='Poista henkilö'
              />
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
                <Column medium={3} offsetOnMedium={3}>
                  <Field
                    name={`${person}.roles`}
                    className='checkbox-inline'
                    component={FieldTypeCheckbox}
                    options= {tenantsRolesOptions}
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
                        component={FieldTypeDatePicker}
                        label='Alkupvm'
                      />
                    </Column>
                    <Column medium={6}>
                      <Field
                        name={`${person}.end_date`}
                        component={FieldTypeDatePicker}
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
                    className='no-margin'
                    component={FieldTypeText}
                    label='Asiakasnumero'
                    name={`${person}.customer_id`}
                  />
                </Column>
                <Column medium={3}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='SAP asiakasnumero'
                    name={`${person}.SAP_customer_id`}
                  />
                </Column>
                <Column medium={6}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='Kommentti'
                    name={`${person}.comment`}
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
            className='no-margin'
            label='Lisää vuokralaiselle laskunsaaja tai yhteyshenkilö'
            onClick={() => fields.push({})}
            title='Lisää vuokralaiselle laskunsaaja tai yhteyshenkilö'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

export default OtherPersonItemsEdit;
