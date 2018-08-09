// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

type Props = {
  attributes: InvoiceAttributes,
  fields: any,
  tenantOptions: Array<Object>,
}

const InvoiceRowsEdit = ({attributes, fields, tenantOptions}: Props): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <div>
      <SubTitle>Erittely</SubTitle>
      {!!fields && !!fields.length &&
        <div>
          <Row>
            <Column small={3} large={2}>
              <FormFieldLabel required={get(attributes, 'rows.child.children.tenant.required')}>Vuokralainen</FormFieldLabel>
            </Column>
            <Column small={3} large={2}>
              <FormFieldLabel  required={get(attributes, 'rows.child.children.receivable_type.required')}>Saamislaji</FormFieldLabel>
            </Column>
            <Column small={3} large={4}>
              <FormFieldLabel required={get(attributes, 'rows.child.children.description.required')}>Selite</FormFieldLabel>
            </Column>
            <Column small={3} large={2}>
              <FormFieldLabel required={get(attributes, 'rows.child.children.amount.required')}>Määrä</FormFieldLabel>
            </Column>
          </Row>
          {fields.map((row, index) => {
            const handleRemove = () => {
              fields.remove(index);
            };

            return (
              <Row key={index}>
                <Column small={3} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'rows.child.children.tenant')}
                    name={`${row}.tenant`}
                    overrideValues={{
                      label: '',
                      options: tenantOptions,
                    }}
                  />
                </Column>
                <Column small={3} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'rows.child.children.receivable_type')}
                    name={`${row}.receivable_type`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={3} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'rows.child.children.description')}
                    name={`${row}.description`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={2} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'rows.child.children.amount')}
                    name={`${row}.amount`}
                    unit='€'
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={1} large={2}>
                  {fields.length > 1 &&
                    <RemoveButton
                      onClick={handleRemove}
                      title="Poista tiedosto"
                    />
                  }
                </Column>
              </Row>
            );
          })}
        </div>
      }
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää rivi'
            onClick={handleAdd}
            title='Lisää rivi'
          />
        </Column>
      </Row>
    </div>
  );
};

export default InvoiceRowsEdit;
