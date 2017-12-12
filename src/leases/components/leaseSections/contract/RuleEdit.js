// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';

type RuleTermsProps = {
  title: string,
  fields: any,
}

const renderRuleTerms = ({title, fields}: RuleTermsProps) => {
  return(
    <div className='green-box'>
      {fields.length > 0 &&
      <Row>
        <Column>
          <h2>{title}</h2>
        </Column>
      </Row>}
      {fields && fields.length > 0 && fields.map((term, index) =>
        <div key={index} className='green-box-item'>
          <button
            className='remove-button'
            type="button"
            title="Poista ehto"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={6}>
              <Field
                name={`${term}.term_purpose`}
                component={FieldTypeSelect}
                label='Käyttötarkoitusehto'
                options={[
                  {value: 'discount', label: 'Alennusehto'},
                ]}
              />
            </Column>
            <Column medium={3}>
              <Field
                name={`${term}.supervision_date`}
                component={FieldTypeText}
                label='Valvonta päivämäärä'
              />
            </Column>
            <Column medium={3}>
              <Field
                name={`${term}.supervised_date`}
                component={FieldTypeText}
                label='Valvottu päivämäärä'
              />
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <Field
                name={`${term}.term_description`}
                component={FieldTypeText}
                label='Selite'
              />
            </Column>
          </Row>
        </div>
      )}
      <Row>
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää ehto</span></a>
        </Column>
      </Row>
    </div>
  );
};


type RuleProps = {
  fields: any,
}

const renderRules = ({fields}: RuleProps) => {
  return(
    <div>
      {fields && fields.length > 0 && fields.map((rule, index) =>
        <div key={index} className='item'>
          <button
            className='remove-button'
            type="button"
            title="Poista sopimus"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={4}>
              <Field
                name={`${rule}.rule_maker`}
                component={FieldTypeSelect}
                label='Päättäjä'
                options={[
                  {value: 'rent-contract', label: 'To be filled'},
                ]}
              />
            </Column>
            <Column medium={2}>
              <Field
                name={`${rule}.rule_date`}
                component={FieldTypeText}
                label='Päätöspäivämäärä'
              />
            </Column>
            <Column medium={2}>
              <Field
                name={`${rule}.rule_clause`}
                component={FieldTypeText}
                label='Pykälä'
              />
            </Column>
            <Column medium={4}>
              <Field
                name={`${rule}.rule_type`}
                component={FieldTypeSelect}
                label='Päätöksen tyyppi'
                options={[
                  {value: 'rent-contract', label: 'To be filled'},
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <Field
                name={`${rule}.rule_description`}
                component={FieldTypeText}
                label='Selite'
              />
            </Column>
          </Row>
          <FieldArray title='Ehdot' name={`${rule}.terms`} component={renderRuleTerms}/>
        </div>
      )}
    </div>
  );
};

type Props = {
  handleSubmit: Function,
  dispatch: Function,
}

class RuleEdit extends Component {
  props: Props

  render() {
    const {dispatch, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <Row>
          <Column>
            <FieldArray name="rules" dispatch={dispatch} component={renderRules}/>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'rule-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        rules: selector(state, 'rules'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(RuleEdit);
