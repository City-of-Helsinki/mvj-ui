// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FormSection from '$components/form/FormSection';
import TenantItemsEdit from './TenantItemsEdit';

type Props = {
  handleSubmit: Function,
}

class TenantsEdit extends Component {
  props: Props

  render () {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <Row>
            <Column>
              <FieldArray name="tenants" component={TenantItemsEdit}/>
            </Column>
          </Row>
        </FormSection>
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
    destroyOnUnmount: false,
  }),
)(TenantsEdit);
