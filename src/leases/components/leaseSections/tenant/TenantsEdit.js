// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {reduxForm, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FormSection from '$components/form/FormSection';
import TenantItemsEdit from './TenantItemsEdit';

import type {Attributes as ContactAttributes, ContactList} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: ContactList,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  handleSubmit: Function,
}

class TenantsEdit extends Component {
  props: Props

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
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(TenantsEdit);
