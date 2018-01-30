// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeSwitch from '../../../../components/form/FieldTypeSwitch';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import {rentDiscountAmountTypeOptions, rentDiscountDecisionOptions, rentDiscountPurposeOptions, rentDiscountTypeOptions} from '../constants';

type DiscountProps = {
  fields: any,
}

const renderDiscounts = ({fields}: DiscountProps) => {
  return (
    <div className='green-box'>
      {fields && fields.length > 0 && fields.map((discount, index) => {
        return(
          <div key={index} className='item'>
            <button
              className='remove-button'
              type="button"
              title="Poista alennus/korotus"
              onClick={() => fields.remove(index)}>
              <img src={trashIcon} alt='Poista' />
            </button>
            <Row>
              <Column medium={6}>
                <Row>
                  <Column small={3}>
                    <Field
                      component={FieldTypeSelect}
                      label='Tyyppi'
                      name={`${discount}.type`}
                      options={rentDiscountTypeOptions}
                    />
                  </Column>
                  <Column small={4}>
                    <Field
                      component={FieldTypeSelect}
                      label='Käyttötarkoitus'
                      name={`${discount}.purpose`}
                      options={rentDiscountPurposeOptions}
                    />
                  </Column>
                  <Column small={5}>
                    <Row>
                      <Column small={6} style={{paddingRight: '0'}}>
                        <Field
                          component={FieldTypeDatePicker}
                          label='Alkupvm'
                          name={`${discount}.start_date`}
                        />
                      </Column>
                      <Column small={6} style={{paddingRight: '0'}}>
                        <Field
                          component={FieldTypeDatePicker}
                          label='Loppupvm'
                          name={`${discount}.end_date`}
                        />
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Column>
              <Column medium={6}>
                <Row>
                  <Column small={6}>
                    <Row>
                      <Column><label className="mvj-form-field-label">Kokonaismäärä</label></Column>
                    </Row>
                    <Row>
                      <Column small={6} style={{paddingRight: '0'}}>
                        <Field
                          component={FieldTypeText}
                          name={`${discount}.amount`}
                        />
                      </Column>
                      <Column small={6} style={{paddingRight: '0'}}>
                        <Field
                          component={FieldTypeSelect}
                          name={`${discount}.amount_type`}
                          options={rentDiscountAmountTypeOptions}
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column small={3}>
                    <Field
                      component={FieldTypeText}
                      disabled={true}
                      label="Jäljellä (€)"
                      name={`${discount}.amount_left`}
                    />
                  </Column>
                  <Column small={3}>
                    <Field
                      clearable={true}
                      component={FieldTypeSelect}
                      label="Päätös"
                      name={`${discount}.rule`}
                      options={rentDiscountDecisionOptions}
                    />
                  </Column>
                </Row>
              </Column>
            </Row>
            <Row>
              <Column medium={12}>
                <Field
                  name={`${discount}.comment`}
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
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää sopimuksen muutos</span></a>
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  dispatch: Function,
  handleSubmit: Function,
}

class RentEdit extends Component {
  props: Props

  render() {
    const {dispatch, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <Row>
          <Column medium={9}><h1>Vuokra</h1></Column>
          <Column medium={3}>
            <Field
              component={FieldTypeSwitch}
              name="rents.rent_info_ok"
              optionLabel="Vuokratiedot kunnossa"
            />
          </Column>
        </Row>
        <Row><Column><div className="separator-line no-margin"></div></Column></Row>
        <Row><Column><h2>Vuokranperusteet</h2></Column></Row>
        <Row><Column><h2>Alennukset ja korotukset</h2></Column></Row>
        <Row>
          <Column>
            <FieldArray name="rents.discounts" dispatch={dispatch} component={renderDiscounts}/>
          </Column>
        </Row>
        <Row><Column><h2>Vuokran perustiedot</h2></Column></Row>
        <Row><Column><h2>Sopimusvuokra</h2></Column></Row>
        <Row>
          <Column medium={6}><h2>Indeksitarkistettu vuokra</h2></Column>
          <Column medium={6}><h2>Perittävä vuokra</h2></Column>
        </Row>
      </form>
    );
  }
}

const formName = 'rent-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        rents: selector(state, 'rents'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(RentEdit);
