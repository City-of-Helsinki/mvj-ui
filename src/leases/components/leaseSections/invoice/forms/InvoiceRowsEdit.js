// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

type Props = {
  attributes: InvoiceAttributes,
  fields: any,
  isEditClicked: boolean,
  tenantOptions: Array<Object>,
}

const InvoiceRowsEdit = ({attributes, fields, isEditClicked, tenantOptions}: Props): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <SubTitle>Erittely</SubTitle>
            {!!fields && !!fields.length &&
              <div>
                <Row>
                  <Column small={3} large={3}>
                    <FormFieldLabel required={get(attributes, 'rows.child.children.tenant.required')}>Vuokralainen</FormFieldLabel>
                  </Column>
                  <Column small={3} large={3}>
                    <FormFieldLabel  required={get(attributes, 'rows.child.children.receivable_type.required')}>Saamislaji</FormFieldLabel>
                  </Column>
                  <Column small={3} large={3}>
                    <FormFieldLabel required={get(attributes, 'rows.child.children.amount.required')}>Määrä</FormFieldLabel>
                  </Column>
                </Row>
                {fields.map((row, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_DELETE_MODAL,
                      deleteFunction: () => {
                        fields.remove(index);
                      },
                      deleteModalLabel: DeleteModalLabels.INVOICE_ROW,
                      deleteModalTitle: DeleteModalTitles.INVOICE_ROW,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={3} large={3}>
                        <FormField
                          disableTouched={isEditClicked}
                          fieldAttributes={get(attributes, 'rows.child.children.tenant')}
                          name={`${row}.tenant`}
                          overrideValues={{
                            label: '',
                            options: tenantOptions,
                          }}
                        />
                      </Column>
                      <Column small={3} large={3}>
                        <FormField
                          disableTouched={isEditClicked}
                          fieldAttributes={get(attributes, 'rows.child.children.receivable_type')}
                          name={`${row}.receivable_type`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={2} large={3}>
                        <FormField
                          disableTouched={isEditClicked}
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
                            className='third-level'
                            onClick={handleRemove}
                            title="Poista rivi"
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
                <AddButtonThird
                  label='Lisää rivi'
                  onClick={handleAdd}
                  title='Lisää rivi'
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

export default InvoiceRowsEdit;
