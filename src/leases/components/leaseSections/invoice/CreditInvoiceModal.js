// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import Modal from '$components/modal/Modal';
import {FormNames} from '$src/leases/enums';

import type {Attributes} from '$src/invoices/types';

type Props = {
  attributes: Attributes,
  formValues: Object,
  handleSubmit: Function,
  isOpen: boolean,
  label: string,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
  saveButtonLabel?: string,
  selectedInvoice: ?Object,
  title: string,
  valid: boolean,
}

const CreditInvoiceModal = ({
  attributes,
  handleSubmit,
  isOpen,
  label,
  onCancel,
  onClose,
  onSave,
  saveButtonLabel = 'hyvitä',
  selectedInvoice,
  title,
  valid,
}: Props) =>
  <form className='invoice__credit-invoice-modal' onSubmit={handleSubmit}>
    <Modal
      className='modal-small modal-autoheight modal-center'
      title={title}
      isOpen={isOpen}
      onClose={onClose}
    >
      <p>{label}</p>
      <Row>
        <Column small={6}>
          <FormField
            fieldAttributes={{...get(attributes, 'total_amount'), max_value: get(selectedInvoice, 'total_amount')}}
            name='total_amount'
            overrideValues={{
              label: 'Hyvitettävä summa',
            }}
          />
        </Column>
        <Column small={6}>
          <FormField
            fieldAttributes={get(attributes, 'due_date')}
            name='due_date'
            overrideValues={{
              label: 'Eräpäivä',
            }}
          />
        </Column>
      </Row>
      <div className='invoice__credit-invoice-modal_footer'>
        <Button
          className='button-red'
          label='Peruuta'
          onClick={onCancel}
          title='Peruuta'
        />
        <Button
          className='button-green'
          disabled={!valid}
          label={saveButtonLabel}
          onClick={onSave}
          title={saveButtonLabel}
        />
      </div>
    </Modal>
  </form>;

const formName = FormNames.INVOICE_CREDIT;

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(CreditInvoiceModal);
