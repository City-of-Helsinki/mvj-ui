// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import ContractItemsEdit from './ContractItemsEdit';

type Props = {
  handleSubmit: Function,
  dispatch: Function,
  rules: Array<Object>,
}

class ContractsEdit extends Component {
  props: Props

  render() {
    const {dispatch, handleSubmit, rules} = this.props;
    return (
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <Row>
          <Column>
            <FieldArray name="contracts" rules={rules} dispatch={dispatch} component={ContractItemsEdit}/>
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
    destroyOnUnmount: false,
  }),
)(ContractsEdit);
