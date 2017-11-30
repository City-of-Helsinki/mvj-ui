// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
// import FieldTypeText from '../../../../components/form/FieldTypeText';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';

type ContractProps = {
  fields: any,
}

const renderContracts = ({fields}: ContractProps) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((contract, index) => {
        return(
          <div key={index} className='item'>
            <button
              className='remove-button'
              type="button"
              title="Poista sopimus"
              onClick={() => fields.remove(index)}>
              <img src={trashIcon} alt='Poista' />
            </button>
            <Row>
              <Column medium={3}>
                <Field
                  name={`${contract}.contract.contract_type`}
                  component={FieldTypeSelect}
                  label='Sopimuksen tyyppi'
                  options={[
                    {value: 'rent-contract', label: 'Vuokrasopimus'},
                    {value: 'esisopimus', label: 'Esisopimus'},
                    {value: 'rasitesopimus', label: 'Rasitesopimus'},
                  ]}
                />
              </Column>
            </Row>
          </div>
        );
      })}
    </div>
  );
};

type Props = {
  handleSubmit: Function,
  dispatch: Function,
}

class ContractEdit extends Component {
  props: Props

  render() {
    const {dispatch, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <Row>
          <Column>
            <FieldArray name="contracts" dispatch={dispatch} component={renderContracts}/>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'contract-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        contracts: selector(state, 'contracts'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(ContractEdit);
