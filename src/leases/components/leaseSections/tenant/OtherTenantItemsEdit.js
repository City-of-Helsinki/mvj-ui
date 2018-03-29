// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContactInfo from './ContactInfo';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';
import {getTenantsFormValues} from '$src/leases/selectors';
import {getAttributeFieldOptions, getContactOptions} from '$util/helpers';
import {TenantContactType} from '$src/leases/enums';

import type {Attributes as ContactAttributes, ContactList} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: ContactList,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  fields: any,
  formValues: Object,
}

const OtherTenantItemsEdit = ({
  allContacts,
  attributes,
  contactAttributes,
  fields,
  formValues,
}: Props) => {
  const findContact = (id: string) => {
    if(!allContacts || !allContacts.length) {
      return null;
    }
    return allContacts.find((x) => x.id === id);
  };
  const contactOptions = getContactOptions(allContacts);
  const tenantTypeOptions = getAttributeFieldOptions(attributes,
    'tenants.child.children.tenantcontact_set.child.children.type').filter((x) => x.value !== TenantContactType.TENANT);
  return (
    <GreenBoxEdit>
      {fields && fields.length > 0 && fields.map((tenant, index) => {
        const contact = findContact(get(formValues, `${tenant}.contact`));
        return (
          <GreenBoxItem key={tenant.id ? tenant.id : `index_${index}`} className='no-border-on-first-child'>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright'
                label='Poista henkilö'
                onClick={() => fields.remove(index)}
                title='Poista henkilö'
              />
              <Row>
                <Column small={6} medium={4} large={4}>
                  <Row>
                    <Column small={9} medium={9} large={9}>
                      <Field
                        name={`${tenant}.contact`}
                        component={FieldTypeSelect}
                        label='Asiakas'
                        options={contactOptions}
                      />
                    </Column>
                  </Row>

                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    name={`${tenant}.type`}
                    component={FieldTypeSelect}
                    label='Rooli'
                    options={tenantTypeOptions}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Alkupäivämäärä'
                    name={`${tenant}.start_date`}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Loppupäivämäärä'
                    name={`${tenant}.end_date`}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12}>
                  <Field
                    component={FieldTypeText}
                    label='Kommentti'
                    name={`${tenant}.note`}
                  />
                </Column>
              </Row>

              <ContactInfo
                contact={contact}
                contactAttributes={contactAttributes}
              />
            </BoxContentWrapper>
          </GreenBoxItem>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää vuokralaiselle laskunsaaja tai yhteyshenkilö'
            onClick={() => fields.push({})}
            title='Lisää vuokralaiselle laskunsaaja tai yhteyshenkilö'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

export default connect(
  (state) => {
    return {
      formValues: getTenantsFormValues(state),
    };
  },
)(OtherTenantItemsEdit);
