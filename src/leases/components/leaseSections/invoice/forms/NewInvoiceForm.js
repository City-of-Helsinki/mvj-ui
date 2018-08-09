// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import FormSection from '$components/form/FormSection';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import WhiteBox from '$components/content/WhiteBox';
import {receiveIsCreateClicked} from '$src/invoices/actions';
import {FormNames, RecipientOptions} from '$src/leases/enums';
import {getInvoiceRecipientOptions} from '$src/leases/helpers';
import {getAttributes as getInvoiceAttributes, getIsCreateClicked} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';
import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

type InvoiceRowsProps = {
  attributes: InvoiceAttributes,
  fields: any,
  isCreateClicked: boolean,
}

const InvoiceRows = ({attributes, fields, isCreateClicked}: InvoiceRowsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <div>
      <SubTitle>Erittely</SubTitle>
      {!!fields && !!fields.length &&
        <div>
          <Row>
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
            const handleRemove = () => fields.remove(index);

            return (
              <Row key={index}>
                <Column small={3} large={2}>
                  <FormField
                    disableTouched={isCreateClicked}
                    fieldAttributes={get(attributes, 'rows.child.children.receivable_type')}
                    name={`${row}.receivable_type`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={3} large={4}>
                  <FormField
                    disableTouched={isCreateClicked}
                    fieldAttributes={get(attributes, 'rows.child.children.description')}
                    name={`${row}.description`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={2} large={2}>
                  <FormField
                    disableTouched={isCreateClicked}
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

type Props = {
  formValues: Object,
  handleSubmit: Function,
  invoiceAttributes: InvoiceAttributes,
  isCreateClicked: boolean,
  lease: Lease,
  onClose: Function,
  onSave: Function,
  receiveIsCreateClicked: Function,
  valid: boolean,
}

const NewInvoiceForm = ({
  formValues,
  handleSubmit,
  invoiceAttributes,
  isCreateClicked,
  lease,
  onClose,
  onSave,
  receiveIsCreateClicked,
  valid,
}: Props) => {
  const handleSave = () => {
    receiveIsCreateClicked(true);
    if(valid) {onSave(formValues);}
  };

  const recipientOptions = getInvoiceRecipientOptions(lease);

  return (
    <form onSubmit={handleSubmit} className='invoice__add-invoice_form'>
      <FormSection>
        <WhiteBox>
          <BoxContentWrapper>
            <h3>Luo lasku</h3>
            <CloseButton
              className="position-topright"
              onClick={onClose}
              title="Poista lasku"
            />
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={get(invoiceAttributes, 'recipient')}
                  name='recipient'
                  overrideValues={{
                    label: 'Vuokralainen',
                    options: recipientOptions,
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={get(invoiceAttributes, 'due_date')}
                  name='due_date'
                  overrideValues={{
                    label: 'Eräpäivä',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={get(invoiceAttributes, 'billing_period_start_date')}
                  name='billing_period_start_date'
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={get(invoiceAttributes, 'billing_period_end_date')}
                  name='billing_period_end_date'
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={get(invoiceAttributes, 'notes')}
                  name='notes'
                  overrideValues={{
                    label: 'Tiedote',
                  }}
                />
              </Column>
            </Row>
            <FieldArray
              attributes={invoiceAttributes}
              component={InvoiceRows}
              isCreateClicked={isCreateClicked}
              name='rows'
            />
            <Row style={{marginBottom: '10px'}}>
              <Column>
                <Button
                  className='button-green no-margin pull-right'
                  disabled={isCreateClicked && !valid}
                  label='Tallenna'
                  onClick={handleSave}
                  title='Tallenna'
                />
                <Button
                  className='button-red pull-right'
                  label='Peruuta'
                  onClick={onClose}
                  title='Peruuta'
                />
              </Column>
            </Row>
          </BoxContentWrapper>
        </WhiteBox>
      </FormSection>
    </form>
  );
};

const formName = FormNames.INVOICE_NEW;

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
        invoiceAttributes: getInvoiceAttributes(state),
        isCreateClicked: getIsCreateClicked(state),
        lease: getCurrentLease(state),
      };
    },
    {
      receiveIsCreateClicked,
    }
  ),
  reduxForm({
    form: formName,
    initialValues: {
      recipient: RecipientOptions.ALL,
      rows: [{}],
    },
  }),
)(NewInvoiceForm);
