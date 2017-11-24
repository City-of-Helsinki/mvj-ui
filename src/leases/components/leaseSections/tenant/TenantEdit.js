// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeText from '../../../../components/form/FieldTypeText';

type OtherPersonProps = {
  fields: any,
}

const renderOtherPersons = ({fields}: OtherPersonProps) => {
  console.log(fields);
  return (

    <div>
      {fields && fields.length > 0 && fields.map((person, index) => {
        return (
          <div key={index} className='other-person'>
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
                  name={`${person}.city`}
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
                  <Column medium={3}>
                    <Field
                      name={`${person}.social_security_number`}
                      component={FieldTypeText}
                      label='Henkilötunnus'
                    />
                  </Column>
                  <Column medium={5}>

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

type TenantProps = {
  fields: any,
}

const renderTenants = ({fields}: TenantProps) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((tenant, index) => {
        return (
          <div key={index} className='tenant'>
            <button
              className='remove-button'
              type="button"
              title="Poista vuokralainen"
              onClick={() => fields.remove(index)}>
              <img src={trashIcon} alt='Poista' />
            </button>
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
                  name={`${tenant}.tenant.city`}
                  component={FieldTypeText}
                  label='Kaupunki'
                />
              </Column>
              <Column medium={3}>
                <Row>
                  <Column medium={6}>
                    <Field
                      name={`${tenant}.tenant.start_date`}
                      component={FieldTypeText}
                      label='Alkupvm'
                    />
                  </Column>
                  <Column medium={6}>
                    <Field
                      name={`${tenant}.tenant.end_date`}
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
                  <Column medium={3}>
                    <Field
                      name={`${tenant}.tenant.social_security_number`}
                      component={FieldTypeText}
                      label='Henkilötunnus'
                    />
                  </Column>
                  <Column medium={5}>

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
                  name={`${tenant}.tenant.comment`}
                  component={FieldTypeText}
                  label='Kommentti'
                />
              </Column>
            </Row>
            <FieldArray name={`${tenant}.other_persons`} component={renderOtherPersons}/>
          </div>
        );
      })
      }
      <Row>
        <Column>
          <button type="button" onClick={() => fields.push({})} className='add-button'>Lisää uusi vuokralainen</button>
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  handleSubmit: Function,
  dispatch: Function,
}

class TenantEdit extends Component {
  props: Props

  render () {
    const {dispatch, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}className='tenant-edit'>
        <Row>
          <Column>
            <FieldArray name="tenants" dispatch={dispatch} component={renderTenants}/>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'tenant-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        tenants: selector(state, 'tenants'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(TenantEdit);
