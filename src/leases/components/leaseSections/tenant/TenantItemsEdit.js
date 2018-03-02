// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButton from '../../../../components/form/AddButton';
import BoxContentWrapper from '../../../../components/content/BoxContentWrapper';
import FieldTypeCheckbox from '../../../../components/form/FieldTypeCheckbox';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import OtherPersonItemsEdit from './OtherPersonItemsEdit';
import RemoveButton from '../../../../components/form/RemoveButton';
import WhiteBoxEdit from '../../../../components/content/WhiteBoxEdit';
import {tenantsRolesOptions} from '../constants';

type Props = {
  fields: any,
}

const TenantItemsEdit = ({fields}: Props) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((tenant, index) => {
        return (
          <div key={index} className='item'>
            <WhiteBoxEdit>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright'
                  label='Poista vuokralainen'
                  onClick={() => fields.remove(index)}
                  title='Poista vuokralainen'
                />
                <Row>
                  <Column medium={3}>
                    <Field
                      name={`${tenant}.tenant.firstname`}
                      component={FieldTypeText}
                      label='Etunimi'
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      name={`${tenant}.tenant.lastname`}
                      component={FieldTypeText}
                      label='Sukunimi'
                    />
                  </Column>
                  <Column medium={3}>
                    <Row>
                      <Column>
                        <label className='mvj-form-field-label'>Osuus murtolukuna</label>
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Field
                          className='inline width-xsmall'
                          component={FieldTypeText}
                          name={`${tenant}.tenant.share`}
                        />
                        <Field
                          className='inline width-xsmall with-slash with-left-margin'
                          component={FieldTypeText}
                          name={`${tenant}.tenant.share_divider`}
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column medium={3}>
                    <Field
                      name={`${tenant}.roles`}
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
                      name={`${tenant}.tenant.address`}
                      component={FieldTypeText}
                      label='Osoite'
                    />
                  </Column>
                  <Column medium={2}>
                    <Field
                      name={`${tenant}.tenant.zip_code`}
                      component={FieldTypeText}
                      label='Postinumero'
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      name={`${tenant}.tenant.town`}
                      component={FieldTypeText}
                      label='Kaupunki'
                    />
                  </Column>
                  <Column medium={3}>
                    <Row>
                      <Column medium={6}>
                        <Field
                          name={`${tenant}.tenant.start_date`}
                          component={FieldTypeDatePicker}
                          label='Alkupvm'
                        />
                      </Column>
                      <Column medium={6}>
                        <Field
                          name={`${tenant}.tenant.end_date`}
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
                      name={`${tenant}.tenant.email`}
                      component={FieldTypeText}
                      label='Sähköposti'
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      name={`${tenant}.tenant.phone`}
                      component={FieldTypeText}
                      label='Puhelin'
                    />
                  </Column>
                  <Column medium={6}>
                    <Row>
                      <Column medium={4}>
                        <Field
                          name={`${tenant}.tenant.language`}
                          component={FieldTypeText}
                          label='Kieli'
                        />
                      </Column>
                      <Column medium={4}>
                        <Field
                          name={`${tenant}.tenant.social_security_number`}
                          component={FieldTypeText}
                          label='Henkilötunnus'
                        />
                      </Column>
                      <Column medium={4}>
                        <Field
                          name={`${tenant}.tenant.protection_order`}
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
                      name={`${tenant}.tenant.customer_id`}
                      component={FieldTypeText}
                      label='Asiakasnumero'
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      name={`${tenant}.tenant.SAP_customer_id`}
                      component={FieldTypeText}
                      label='SAP asiakasnumero'
                    />
                  </Column>
                  <Column medium={6}>
                    <Row>
                      <Column medium={4}>
                        <Field
                          name={`${tenant}.tenant.ovt_identifier`}
                          component={FieldTypeText}
                          label='Ovt-tunnus'
                        />
                      </Column>
                      <Column medium={3}>
                        <Field
                          name={`${tenant}.tenant.partner_code`}
                          component={FieldTypeText}
                          label='Kumppanikoodi'
                        />
                      </Column>
                      <Column medium={5}>
                        <Field
                          name={`${tenant}.tenant.reference`}
                          component={FieldTypeText}
                          label='Viite'
                        />
                      </Column>
                    </Row>
                  </Column>
                </Row>

                <Row>
                  <Column>
                    <Field
                      className='no-margin'
                      component={FieldTypeText}
                      label='Kommentti'
                      name={`${tenant}.tenant.comment`}
                    />
                  </Column>
                </Row>
              </BoxContentWrapper>
            </WhiteBoxEdit>

            <FieldArray name={`${tenant}.other_persons`} component={OtherPersonItemsEdit}/>
          </div>
        );
      })
      }
      <Row>
        <Column>
          <AddButton
            className='no-margin'
            label='Lisää uusi vuokralainen'
            onClick={() => fields.push({})}
            title='Lisää uusi vuokralainen'
          />
        </Column>
      </Row>
    </div>
  );
};

export default TenantItemsEdit;
