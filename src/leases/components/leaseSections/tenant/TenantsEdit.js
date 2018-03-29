// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {reduxForm, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FormSection from '$components/form/FormSection';
import TenantItemsEdit from './TenantItemsEdit';
import {getIsTenantsFormValid} from '$src/leases/selectors';
import {receiveTenantsFormValid} from '$src/leases/actions';

import type {Attributes as ContactAttributes, ContactList} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: ContactList,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  handleSubmit: Function,
  isTenantsFormValid: boolean,
  receiveTenantsFormValid: Function,
  valid: boolean,
}

class TenantsEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isTenantsFormValid, receiveTenantsFormValid, valid} = this.props;
    if(isTenantsFormValid !== valid) {
      receiveTenantsFormValid(valid);
    }
  }

  render () {
    const {
      allContacts,
      attributes,
      contactAttributes,
      handleSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <Row>
            <Column>
              <FieldArray
                allContacts={allContacts}
                attributes={attributes}
                component={TenantItemsEdit}
                contactAttributes={contactAttributes}
                name="tenants"
              />
            </Column>
          </Row>
        </FormSection>
      </form>
    );
  }
}

const formName = 'tenants-form';

export default flowRight(
  connect(
    (state) => {
      return {
        isTenantsFormValid: getIsTenantsFormValid(state),
      };
    },
    {
      receiveTenantsFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(TenantsEdit);
