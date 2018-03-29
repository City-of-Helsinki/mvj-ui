// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContactInfo from './ContactInfo';
import ContentItem from '$components/content/ContentItem';
// import FieldTypeCheckbox from '$components/form/FieldTypeCheckbox';
import OtherTenantItemsEdit from './OtherTenantItemsEdit';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';
import {getContactOptions} from '$util/helpers';
import {getTenantsFormValues} from '$src/leases/selectors';

import type {Attributes as ContactAttributes, ContactList} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: ContactList,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  fields: any,
  formValues: Object,
}

const TenantItemsEdit = ({
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
  return (
    <div>
      {fields && !!fields.length && fields.map((tenant, index) => {
        const contact = findContact(get(formValues, `${tenant}.tenant.contact`));
        return (
          <ContentItem key={tenant.id ? tenant.id : `index_${index}`}>
            <WhiteBoxEdit>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright-no-padding'
                  label='Poista vuokralainen'
                  onClick={() => fields.remove(index)}
                  title='Poista vuokralainen'
                />
                <Row>
                  <Column small={6} medium={4} large={4}>
                    <Row>
                      <Column small={9} medium={9} large={9}>
                        <Field
                          name={`${tenant}.tenant.contact`}
                          component={FieldTypeSelect}
                          label='Asiakas'
                          options={contactOptions}
                        />
                      </Column>
                    </Row>

                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <label className='mvj-form-field-label'>Osuus murtolukuna</label>
                    <Row>
                      <Column small={6}>
                        <Field
                          name={`${tenant}.share_numerator`}
                          component={FieldTypeText}
                        />
                      </Column>
                      <Column small={6}>
                        <Field
                          className='with-slash'
                          name={`${tenant}.share_denominator`}
                          component={FieldTypeText}
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column small={6} medium={4} large={2}></Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Alkupäivämäärä'
                      name={`${tenant}.tenant.start_date`}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Loppupäivämäärä'
                      name={`${tenant}.tenant.end_date`}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={4} large={4}>
                    <Field
                      component={FieldTypeText}
                      label='Viite'
                      name={`${tenant}.tenant.reference`}
                    />
                  </Column>
                  <Column small={6} medium={8} large={8}>
                    <Field
                      component={FieldTypeText}
                      label='Kommentti'
                      name={`${tenant}.tenant.note`}
                    />
                  </Column>
                </Row>

                <ContactInfo
                  contact={contact}
                  contactAttributes={contactAttributes}
                />
              </BoxContentWrapper>
            </WhiteBoxEdit>

            <FieldArray
              allContacts={allContacts}
              attributes={attributes}
              component={OtherTenantItemsEdit}
              contactAttributes={contactAttributes}
              name={`${tenant}.tenantcontact_set`}
            />
          </ContentItem>
        );
      })
      }
      <Row>
        <Column>
          <AddButton
            className='no-margin'
            label='Lisää uusi vuokralainen'
            onClick={() => fields.push({})}
            title='Lisää uusi vuokralainen'
          />
        </Column>
      </Row>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      formValues: getTenantsFormValues(state),
    };
  },
)(TenantItemsEdit);
