// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeText from '../../../../components/form/FieldTypeText';

type InspectionsProps = {
  fields: any,
}

const renderInspections = ({fields}: InspectionsProps) => {
  return(
    <div className='green-box'>
      {fields && fields.length > 0 && fields.map((inspection, index) =>
        <div key={index} className='green-box-item'>
          <button
            className='remove-button'
            type="button"
            title="Poista tarkastus"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={4}>
              <Field
                name={`${inspection}.inspector`}
                component={FieldTypeText}
                label='Tarkastaja'
              />
            </Column>
            <Column medium={4}>
              <Field
                name={`${inspection}.supervision_date`}
                component={FieldTypeText}
                label='Valvonta päivämäärä'
              />
            </Column>
            <Column medium={4}>
              <Field
                name={`${inspection}.supervised_date`}
                component={FieldTypeText}
                label='Valvottu päivämäärä'
              />
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <Field
                name={`${inspection}.inspection_description`}
                component={FieldTypeText}
                label='Selite'
              />
            </Column>
          </Row>
        </div>
      )}
      <Row>
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää tarkastus</span></a>
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  handleSubmit: Function,
  dispatch: Function,
}

class InspectionEdit extends Component {
  props: Props

  render() {
    const {dispatch, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <Row>
          <Column>
            <FieldArray name="inspections" dispatch={dispatch} component={renderInspections}/>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'inspection-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        rules: selector(state, 'inspections'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(InspectionEdit);
