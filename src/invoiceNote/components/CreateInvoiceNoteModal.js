// @flow
import React, {PureComponent} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import Modal from '$components/modal/Modal';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import {FieldTypes, FormNames} from '$src/enums';
import {InvoiceNoteFieldPaths, InvoiceNoteFieldTitles} from '$src/invoiceNote/enums';
import {ButtonColors} from '$components/enums';
import {getFieldAttributes} from '$util/helpers';
import {getAttributes} from '$src/invoiceNote/selectors';

import type {Attributes} from '$src/types';

type Props = {
  handleSubmit: Function,
  initialize: Function,
  invoiceNoteAttributes: Attributes,
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
  valid: boolean,
}

class CreateInvoiceNoteModal extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    if(this.props.isOpen && !prevProps.isOpen) {
      this.resetForm();
    }
  }

  resetForm = () => {
    const {initialize} = this.props;

    initialize({});
  }

  handleSubmit = (data: Object) => {
    const {onSubmit} = this.props;

    onSubmit({
      ...data,
      lease: data.lease ? Number(data.lease.value) : null,
    });
  }

  render() {
    const {
      handleSubmit,
      invoiceNoteAttributes,
      isOpen,
      onClose,
      valid,
    } = this.props;

    return(
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title='Luo laskujen tiedote'
        >
          <Row>
            <Column small={4}>
              <FormField
                fieldAttributes={getFieldAttributes(invoiceNoteAttributes, InvoiceNoteFieldPaths.LEASE)}
                name='lease'
                disableDirty
                overrideValues={{
                  fieldType: FieldTypes.LEASE,
                  label: InvoiceNoteFieldTitles.LEASE,
                }}
              />
            </Column>
            <Column small={4}>
              <FormField
                fieldAttributes={getFieldAttributes(invoiceNoteAttributes, InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE)}
                name='billing_period_start_date'
                disableDirty
                overrideValues={{label: InvoiceNoteFieldTitles.BILLING_PERIOD_START_DATE}}
              />
            </Column>
            <Column small={4}>
              <FormField
                fieldAttributes={getFieldAttributes(invoiceNoteAttributes, InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE)}
                name='billing_period_end_date'
                disableDirty
                overrideValues={{label: InvoiceNoteFieldTitles.BILLING_PERIOD_END_DATE}}
              />
            </Column>
          </Row>
          <Row>
            <Column small={12}>
              <FormField
                fieldAttributes={getFieldAttributes(invoiceNoteAttributes, InvoiceNoteFieldPaths.NOTES)}
                name='notes'
                disableDirty
                overrideValues={{
                  label: InvoiceNoteFieldTitles.NOTES,
                  fieldType: FieldTypes.TEXTAREA,
                }}
              />
            </Column>
          </Row>

          <ModalButtonWrapper>
            <Button
              className={ButtonColors.ALERT}
              onClick={onClose}
              text='Peruuta'
            />
            <Button
              className={ButtonColors.SUCCESS}
              disabled={!valid}
              onClick={handleSubmit(this.handleSubmit)}
              type='submit'
              text='Tallenna'
            />
          </ModalButtonWrapper>
        </Modal>
      </form>
    );
  }
}

const formName = FormNames.INVOICE_NOTE_CREATE;

export default flowRight(
  connect(
    (state) => {
      return {
        invoiceNoteAttributes: getAttributes(state),
      };
    }
  ),
  reduxForm({
    form: formName,
  })
)(CreateInvoiceNoteModal);
