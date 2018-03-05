// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, FieldArray} from 'redux-form';

import ContractItemsEdit from './ContractItemsEdit';
import FormSection from '../../../../components/form/FormSection';

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
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            component={ContractItemsEdit}
            dispatch={dispatch}
            name="contracts"
            rules={rules}
          />
        </FormSection>
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
