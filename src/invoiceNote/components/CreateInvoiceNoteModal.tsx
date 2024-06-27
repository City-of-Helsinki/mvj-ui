import React, { PureComponent } from "react";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Button from "/src/components/button/Button";
import FormField from "/src/components/form/FormField";
import Modal from "/src/components/modal/Modal";
import ModalButtonWrapper from "/src/components/modal/ModalButtonWrapper";
import { FieldTypes, FormNames } from "enums";
import { InvoiceNoteFieldPaths, InvoiceNoteFieldTitles } from "/src/invoiceNote/enums";
import { ButtonColors } from "/src/components/enums";
import { getFieldAttributes } from "util/helpers";
import { getAttributes } from "/src/invoiceNote/selectors";
import { getUserActiveServiceUnit } from "usersPermissions/selectors";
import type { Attributes } from "types";
import type { UserServiceUnit } from "usersPermissions/types";
type Props = {
  handleSubmit: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  invoiceNoteAttributes: Attributes;
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  valid: boolean;
  userActiveServiceUnit: UserServiceUnit;
};

class CreateInvoiceNoteModal extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.resetForm();
    }
  }

  resetForm = () => {
    const {
      initialize
    } = this.props;
    initialize({});
  };
  handleSubmit = (data: Record<string, any>) => {
    const {
      onSubmit
    } = this.props;
    onSubmit({ ...data,
      lease: data.lease ? Number(data.lease.value) : null
    });
  };

  render() {
    const {
      handleSubmit,
      invoiceNoteAttributes,
      isOpen,
      onClose,
      valid,
      userActiveServiceUnit
    } = this.props;
    return <form onSubmit={handleSubmit(this.handleSubmit)}>
        <Modal isOpen={isOpen} onClose={onClose} title='Luo laskujen tiedote'>
          <Row>
            <Column small={4}>
              <FormField fieldAttributes={getFieldAttributes(invoiceNoteAttributes, InvoiceNoteFieldPaths.LEASE)} name='lease' disableDirty overrideValues={{
              fieldType: FieldTypes.LEASE,
              label: InvoiceNoteFieldTitles.LEASE
            }} serviceUnit={userActiveServiceUnit} />
            </Column>
            <Column small={4}>
              <FormField fieldAttributes={getFieldAttributes(invoiceNoteAttributes, InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE)} name='billing_period_start_date' disableDirty overrideValues={{
              label: InvoiceNoteFieldTitles.BILLING_PERIOD_START_DATE
            }} />
            </Column>
            <Column small={4}>
              <FormField fieldAttributes={getFieldAttributes(invoiceNoteAttributes, InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE)} name='billing_period_end_date' disableDirty overrideValues={{
              label: InvoiceNoteFieldTitles.BILLING_PERIOD_END_DATE
            }} />
            </Column>
          </Row>
          <Row>
            <Column small={12}>
              <FormField fieldAttributes={getFieldAttributes(invoiceNoteAttributes, InvoiceNoteFieldPaths.NOTES)} name='notes' disableDirty overrideValues={{
              label: InvoiceNoteFieldTitles.NOTES,
              fieldType: FieldTypes.TEXTAREA
            }} />
            </Column>
          </Row>

          <ModalButtonWrapper>
            <Button className={ButtonColors.ALERT} onClick={onClose} text='Peruuta' />
            <Button className={ButtonColors.SUCCESS} disabled={!valid} onClick={handleSubmit(this.handleSubmit)} type='submit' text='Tallenna' />
          </ModalButtonWrapper>
        </Modal>
      </form>;
  }

}

const formName = FormNames.INVOICE_NOTE_CREATE;
export default flowRight(connect(state => {
  return {
    invoiceNoteAttributes: getAttributes(state),
    userActiveServiceUnit: getUserActiveServiceUnit(state)
  };
}), reduxForm({
  form: formName
}))(CreateInvoiceNoteModal) as React.ComponentType<any>;