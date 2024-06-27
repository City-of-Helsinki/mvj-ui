import React, { Fragment, ReactElement } from "react";
import { Row, Column } from "react-foundation";
import { connect } from "react-redux";
import { FieldArray, formValueSelector, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonThird from "/src/components/form/AddButtonThird";
import AmountWithVat from "/src/components/vat/AmountWithVat";
import Authorization from "/src/components/authorization/Authorization";
import FieldAndRemoveButtonWrapper from "/src/components/form/FieldAndRemoveButtonWrapper";
import FormField from "/src/components/form/FormField";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import InvoiceRowsEdit from "./InvoiceRowsEdit";
import RemoveButton from "/src/components/form/RemoveButton";
import SubTitle from "/src/components/content/SubTitle";
import { ConfirmationModalTexts, FieldTypes, FormNames } from "enums";
import SendupButton from "/src/components/button/SendupButton";
import { ButtonColors } from "/src/components/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getRecipientOptionsFromLitigants } from "/src/landUseContract/helpers";
import { exportInvoiceToLaskeAndUpdateList } from "/src/landUseInvoices/actions";
import { InvoiceCreditInvoicesFieldPaths, InvoiceCreditInvoicesFieldTitles, InvoiceFieldPaths, InvoiceFieldTitles, InvoiceInterestInvoicesFieldPaths, InvoiceInterestInvoicesFieldTitles, InvoicePaymentsFieldPaths, InvoicePaymentsFieldTitles, InvoiceRowsFieldPaths, InvoiceType } from "/src/landUseInvoices/enums";
import { validateInvoiceForm } from "/src/leases/formValidators";
import { getContactFullName } from "/src/contacts/helpers";
import { isInvoiceBillingPeriodRequired } from "/src/landUseInvoices/helpers";
import { getUiDataInvoiceKey } from "uiData/helpers";
import { formatDate, formatNumber, getFieldAttributes, getFieldOptions, getLabelOfOption, isEmptyValue, isFieldAllowedToEdit, isFieldAllowedToRead, isFieldRequired, hasPermissions } from "util/helpers";
import { getAttributes as getInvoiceAttributes, getIsEditClicked } from "/src/landUseInvoices/selectors";
import { getCurrentLandUseContract } from "/src/landUseContract/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes } from "types";
import type { LandUseContract } from "/src/landUseContract/types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type PaymentsProps = {
  attributes: Attributes;
  fields: any;
  isEditClicked: boolean;
  relativeTo: any;
};

const renderPayments = ({
  attributes,
  fields,
  isEditClicked,
  relativeTo
}: PaymentsProps): ReactElement => {
  const handleAdd = () => fields.push({});

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {!fields || !fields.length && <FormText>Ei maksuja</FormText>}

            {fields && !!fields.length && <Row>
                <Column small={6}>
                  <FormTextTitle required={isFieldRequired(attributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)} enableUiDataEdit tooltipStyle={{
              right: 12
            }} relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoicePaymentsFieldPaths.PAID_AMOUNT)}>
                    {InvoicePaymentsFieldTitles.PAID_AMOUNT}
                  </FormTextTitle>
                </Column>
                <Column small={6}>
                  <FormTextTitle required={isFieldRequired(attributes, InvoicePaymentsFieldPaths.PAID_DATE)} enableUiDataEdit tooltipStyle={{
              right: 20
            }} relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoicePaymentsFieldPaths.PAID_DATE)}>
                    {InvoicePaymentsFieldTitles.PAID_DATE}
                  </FormTextTitle>
                </Column>
              </Row>}
            {fields && !!fields.length && fields.map((payment, index) => {
          const handleRemove = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                fields.remove(index);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_INVOICE_PAYMENT.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_INVOICE_PAYMENT.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_INVOICE_PAYMENT.TITLE
            });
          };

          return <Row key={index}>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(attributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)}>
                      <FormField disableTouched={isEditClicked} fieldAttributes={getFieldAttributes(attributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)} invisibleLabel name={`${payment}.paid_amount`} unit='€' overrideValues={{
                  label: InvoicePaymentsFieldTitles.PAID_AMOUNT
                }} />
                    </Authorization>
                  </Column>
                  <Column small={6}>
                    <FieldAndRemoveButtonWrapper field={<Authorization allow={isFieldAllowedToRead(attributes, InvoicePaymentsFieldPaths.PAID_DATE)}>
                          <FormField disableTouched={isEditClicked} fieldAttributes={getFieldAttributes(attributes, InvoicePaymentsFieldPaths.PAID_DATE)} invisibleLabel name={`${payment}.paid_date`} overrideValues={{
                  label: InvoicePaymentsFieldTitles.PAID_DATE
                }} />
                        </Authorization>} removeButton={<Authorization allow={isFieldAllowedToEdit(attributes, InvoicePaymentsFieldPaths.PAYMENTS)}>
                          <RemoveButton className='third-level' onClick={handleRemove} title="Poista maksu" />
                        </Authorization>} />
                  </Column>
                </Row>;
        })}

            <Authorization allow={isFieldAllowedToEdit(attributes, InvoicePaymentsFieldPaths.PAYMENTS)}>
              <Row>
                <Column>
                  <AddButtonThird label='Lisää maksu' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

type Props = {
  creditedInvoice: Record<string, any> | null | undefined;
  currentLandUseContract: LandUseContract;
  exportInvoiceToLaskeAndUpdateList: (...args: Array<any>) => any;
  handleSubmit: (...args: Array<any>) => any;
  interestInvoiceFor: Record<string, any> | null | undefined;
  invoice: Record<string, any> | null | undefined;
  invoiceAttributes: Attributes;
  isEditClicked: boolean;
  onInvoiceLinkClick: (...args: Array<any>) => any;
  relativeTo: any;
  rows: Array<Record<string, any>>;
  usersPermissions: UsersPermissionsType;
};

const EditInvoiceForm = ({
  creditedInvoice,
  currentLandUseContract,
  handleSubmit,
  interestInvoiceFor,
  invoice,
  invoiceAttributes,
  isEditClicked,
  onInvoiceLinkClick,
  relativeTo,
  rows,
  usersPermissions,
  exportInvoiceToLaskeAndUpdateList
}: Props) => {
  const handleCreditedInvoiceClick = () => {
    if (invoice) {
      onInvoiceLinkClick(invoice.credited_invoice);
    }
  };

  const handleCreditedInvoiceKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      handleCreditedInvoiceClick();
    }
  };

  const handleInterestInvoiceForClick = () => {
    if (invoice) {
      onInvoiceLinkClick(invoice.interest_invoice_for);
    }
  };

  const handleInterestInvoiceForKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      handleInterestInvoiceForClick();
    }
  };

  const shouldShowOldInvoiceInfo = () => {
    return Boolean(invoice && (invoice.payment_notification_date || invoice.collection_charge || invoice.payment_notification_catalog_date || invoice.delivery_method));
  };

  const handleExportToLaske = () => {
    if (invoice) {
      exportInvoiceToLaskeAndUpdateList({
        id: invoice.id,
        landUseContract: currentLandUseContract.id
      });
    }
  };

  const stateOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.STATE);
  const litigants = currentLandUseContract.litigants;
  const recipientOptions = getRecipientOptionsFromLitigants(litigants);
  const deliveryMethodOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.DELIVERY_METHOD);
  const typeOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.TYPE);
  const creditInvoices = invoice ? invoice.credit_invoices : [];
  const interestInvoices = invoice ? invoice.interest_invoices : [];
  const showOldInvoiceInfo = shouldShowOldInvoiceInfo();
  const billingPeriodRequired = isInvoiceBillingPeriodRequired(rows);
  return <form onSubmit={handleSubmit}>
      <Row>
        <Column small={8}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.RECIPIENT)}>
              {InvoiceFieldTitles.RECIPIENT}
            </FormTextTitle>
            <FormText>{invoice ? getContactFullName(invoice.recipientFull) : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NUMBER)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.NUMBER)}>
              {InvoiceFieldTitles.NUMBER}
            </FormTextTitle>
            <FormText>{invoice && invoice.number || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.SENT_TO_SAP_AT)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.SENT_TO_SAP_AT)}>
              {InvoiceFieldTitles.SENT_TO_SAP_AT}
            </FormTextTitle>
            <FormText>{invoice && formatDate(invoice.sent_to_sap_at) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          {invoice && !invoice.sent_to_sap_at && <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}>
              <SendupButton onClick={handleExportToLaske} text='Lähetä SAP:iin' title='Lähetä SAP:iin' />
            </Authorization>}
        </Column> 
      </Row>
      <Row>
        <Column small={4}>
          {invoice && invoice.type !== InvoiceType.CREDIT_NOTE && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}>
              <FormField disableTouched={isEditClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)} name='due_date' overrideValues={{
            label: InvoiceFieldTitles.DUE_DATE
          }} enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.DUE_DATE)} />
            </Authorization>}
          {invoice && invoice.type === InvoiceType.CREDIT_NOTE && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.DUE_DATE)}>
                {InvoiceFieldTitles.DUE_DATE}
              </FormTextTitle>
              <FormText>{invoice && formatDate(invoice.due_date) || '-'}</FormText>
            </Authorization>}
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.ADJUSTED_DUE_DATE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.ADJUSTED_DUE_DATE)}>
              {InvoiceFieldTitles.ADJUSTED_DUE_DATE}
            </FormTextTitle>
            <FormText>{invoice && formatDate(invoice.adjusted_due_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.INVOICING_DATE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.INVOICING_DATE)}>
              {InvoiceFieldTitles.INVOICING_DATE}
            </FormTextTitle>
            <FormText>{invoice && formatDate(invoice.invoicing_date) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.STATE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.STATE)}>
              {InvoiceFieldTitles.STATE}
            </FormTextTitle>
            <FormText>{invoice && getLabelOfOption(stateOptions, invoice.state) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Row>
            <Column>
              <FormTextTitle required={billingPeriodRequired} enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.BILLING_PERIOD)}>
                {InvoiceFieldTitles.BILLING_PERIOD}
              </FormTextTitle>
            </Column>
          </Row>
          <Row>
            <Column small={6}>
              {invoice && invoice.type !== InvoiceType.CREDIT_NOTE && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)}>
                  <FormField disableTouched={isEditClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)} invisibleLabel name='billing_period_start_date' overrideValues={{
                label: InvoiceFieldTitles.BILLING_PERIOD_START_DATE
              }} />
                </Authorization>}
              {invoice && invoice.type === InvoiceType.CREDIT_NOTE && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)}>
                  <FormText>{invoice && formatDate(invoice.billing_period_start_date) || '-'}</FormText>
                </Authorization>}
            </Column>
            <Column small={6}>
              {invoice && invoice.type !== InvoiceType.CREDIT_NOTE && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}>
                  <FormField disableTouched={isEditClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)} invisibleLabel name='billing_period_end_date' overrideValues={{
                label: InvoiceFieldTitles.BILLING_PERIOD_END_DATE
              }} />
                </Authorization>}
              {invoice && invoice.type === InvoiceType.CREDIT_NOTE && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}>
                  <FormText>{invoice && formatDate(invoice.billing_period_end_date) || '-'}</FormText>
                </Authorization>}
            </Column>
          </Row>
        </Column>
        <Column small={4}>
          {invoice && invoice.type !== InvoiceType.CREDIT_NOTE && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.POSTPONE_DATE)}>
              <FormField disableTouched={isEditClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.POSTPONE_DATE)} name='postpone_date' overrideValues={{
            label: InvoiceFieldTitles.POSTPONE_DATE
          }} />
            </Authorization>}
          {invoice && invoice.type === InvoiceType.CREDIT_NOTE && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.POSTPONE_DATE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.POSTPONE_DATE)}>
                {InvoiceFieldTitles.POSTPONE_DATE}
              </FormTextTitle>
              <FormText>{invoice && formatDate(invoice.postpone_date) || '-'}</FormText>
            </Authorization>}
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.TOTAL_AMOUNT)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.TOTAL_AMOUNT)}>
              {InvoiceFieldTitles.TOTAL_AMOUNT}
            </FormTextTitle>
            <FormText>{invoice && !isEmptyValue(invoice.total_amount) ? <AmountWithVat amount={invoice.total_amount} date={invoice.due_date} /> : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.SHARE)}>
            {InvoiceFieldTitles.SHARE}
          </FormTextTitle>
          <FormText>{invoice && !isEmptyValue(invoice.totalShare) ? `${formatNumber(invoice.totalShare * 100)} %` : '-'}</FormText>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLED_AMOUNT)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.BILLED_AMOUNT)}>
              {InvoiceFieldTitles.BILLED_AMOUNT}
            </FormTextTitle>
            <FormText>{invoice && !isEmptyValue(invoice.billed_amount) ? <AmountWithVat amount={invoice.billed_amount} date={invoice.due_date} /> : '-'}
            </FormText>
          </Authorization>
        </Column>
      </Row>

      {invoice && invoice.type !== InvoiceType.CREDIT_NOTE && <Fragment>
          <SubTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoicePaymentsFieldPaths.PAYMENTS)}>
            {InvoicePaymentsFieldTitles.PAYMENTS}
          </SubTitle>

          <Row>
            <Column small={12} medium={8}>
              <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAYMENTS)}>
                <FieldArray attributes={invoiceAttributes} component={renderPayments} isEditClicked={isEditClicked} name='payments' relativeTo={relativeTo} />
              </Authorization>
            </Column>
            <Column small={6} medium={4}>
              <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.OUTSTANDING_AMOUNT)}>
                <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.OUTSTANDING_AMOUNT)}>
                  {InvoiceFieldTitles.OUTSTANDING_AMOUNT}
                </FormTextTitle>
                <FormText>{invoice && !isEmptyValue(invoice.outstanding_amount) ? <AmountWithVat amount={invoice.outstanding_amount} date={invoice.due_date} /> : '-'}
                </FormText>
              </Authorization>
            </Column>
          </Row>
        </Fragment>}

      {showOldInvoiceInfo && <Row>
          <Column small={4}>
            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.PAYMENT_NOTIFICATION_DATE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.PAYMENT_NOTIFICATION_DATE)}>
                {InvoiceFieldTitles.PAYMENT_NOTIFICATION_DATE}
              </FormTextTitle>
              <FormText>{invoice && formatDate(invoice.payment_notification_date) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={4}>
            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.COLLECTION_CHARGE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.COLLECTION_CHARGE)}>
                {InvoiceFieldTitles.COLLECTION_CHARGE}
              </FormTextTitle>
              <FormText>{invoice && !isEmptyValue(invoice.collection_charge) ? `${formatNumber(invoice.collection_charge)} €` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={4}>
            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.PAYMENT_NOTIFICATION_CATALOG_DATE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.PAYMENT_NOTIFICATION_CATALOG_DATE)}>
                {InvoiceFieldTitles.PAYMENT_NOTIFICATION_CATALOG_DATE}
              </FormTextTitle>
              <FormText>{invoice && formatDate(invoice.payment_notification_catalog_date) || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>}
      <Row>
        <Column small={4}>
          {showOldInvoiceInfo && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DELIVERY_METHOD)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.DELIVERY_METHOD)}>
                {InvoiceFieldTitles.DELIVERY_METHOD}
              </FormTextTitle>
              <FormText>{invoice && getLabelOfOption(deliveryMethodOptions, invoice.delivery_method) || '-'}</FormText>
            </Authorization>}
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.TYPE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.TYPE)}>
              {InvoiceFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{invoice && getLabelOfOption(typeOptions, invoice.type) || '-'}</FormText>
          </Authorization>
        </Column>

        <Column small={4}>
          {creditedInvoice && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.CREDITED_INVOICE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.CREDITED_INVOICE)}>
                {InvoiceFieldTitles.CREDITED_INVOICE}
              </FormTextTitle>
              <FormText>{<a className='no-margin' onKeyDown={handleCreditedInvoiceKeyDown} onClick={handleCreditedInvoiceClick} tabIndex={0}>{creditedInvoice && creditedInvoice.number ? creditedInvoice.number : 'Numeroimaton'}</a>}
              </FormText>
            </Authorization>}
        </Column>
        <Column small={4}>
          {interestInvoiceFor && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.INTEREST_INVOICE_FOR)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.INTEREST_INVOICE_FOR)}>
                {InvoiceFieldTitles.INTEREST_INVOICE_FOR}
              </FormTextTitle>
              <FormText>{<a className='no-margin' onKeyDown={handleInterestInvoiceForKeyDown} onClick={handleInterestInvoiceForClick} tabIndex={0}>{interestInvoiceFor.number ? interestInvoiceFor.number : 'Numeroimaton'}</a>}
              </FormText>
            </Authorization>}
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NOTES)}>
            <FormField disableTouched={isEditClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.NOTES)} name='notes' overrideValues={{
            label: InvoiceFieldTitles.NOTES,
            fieldType: FieldTypes.TEXTAREA
          }} enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.NOTES)} />
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.CREDITED_INVOICE)}>
        {!!creditInvoices.length && <Fragment>
            <SubTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceCreditInvoicesFieldPaths.CREDIT_INVOICES)}>
              {InvoiceCreditInvoicesFieldTitles.CREDIT_INVOICES}
            </SubTitle>

            {!!creditInvoices.length && <Fragment>
                <Row>
                  <Column small={4}>
                    <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceCreditInvoicesFieldPaths.NUMBER)}>
                      {InvoiceCreditInvoicesFieldTitles.NUMBER}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceCreditInvoicesFieldPaths.TOTAL_AMOUNT)}>
                      {InvoiceCreditInvoicesFieldTitles.TOTAL_AMOUNT}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceCreditInvoicesFieldPaths.DUE_DATE)}>
                      {InvoiceCreditInvoicesFieldTitles.DUE_DATE}
                    </FormTextTitle>
                  </Column>
                </Row>

                {creditInvoices.map(item => {
            const handleCreditInvoiceClick = () => {
              onInvoiceLinkClick(item.id);
            };

            const handleCreditInvoiceKeyDown = (e: any) => {
              if (e.keyCode === 13) {
                handleCreditInvoiceClick();
              }
            };

            return <Row key={item.id}>
                      <Column small={4}>
                        <FormText>
                          <a className='no-margin' onKeyDown={handleCreditInvoiceKeyDown} onClick={handleCreditInvoiceClick} tabIndex={0}>{item.number ? item.number : 'Numeroimaton'}</a>
                        </FormText>
                      </Column>
                      <Column small={4}>
                        <FormText><AmountWithVat amount={item.total_amount} date={item.due_date} /></FormText>
                      </Column>
                      <Column small={4}>
                        <FormText>{formatDate(item.due_date)}</FormText>
                      </Column>
                    </Row>;
          })}
              </Fragment>}
          </Fragment>}
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.INTEREST_INVOICE_FOR)}>
        {!!interestInvoices.length && <Fragment>
            <SubTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceInterestInvoicesFieldPaths.INTEREST_INVOICES)}>
              {InvoiceInterestInvoicesFieldTitles.INTEREST_INVOICES}
            </SubTitle>

            {!!interestInvoices.length && <Fragment>
                <Row>
                  <Column small={4}>
                    <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceInterestInvoicesFieldPaths.NUMBER)}>
                      {InvoiceInterestInvoicesFieldTitles.NUMBER}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceInterestInvoicesFieldPaths.TOTAL_AMOUNT)}>
                      {InvoiceInterestInvoicesFieldTitles.TOTAL_AMOUNT}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceInterestInvoicesFieldPaths.DUE_DATE)}>
                      {InvoiceInterestInvoicesFieldTitles.DUE_DATE}
                    </FormTextTitle>
                  </Column>
                </Row>

                {interestInvoices.map(item => {
            const handleInterestInvoiceClick = () => {
              onInvoiceLinkClick(item.id);
            };

            const handleInterestInvoiceKeyDown = (e: any) => {
              if (e.keyCode === 13) {
                handleInterestInvoiceClick();
              }
            };

            return <Row key={item.id}>
                      <Column small={4}>
                        <FormText>
                          <a className='no-margin' onKeyDown={handleInterestInvoiceKeyDown} onClick={handleInterestInvoiceClick} tabIndex={0}>{item.number ? item.number : 'Numeroimaton'}</a>
                        </FormText>
                      </Column>
                      <Column small={4}>
                        <FormText><AmountWithVat amount={item.total_amount} date={item.due_date} /></FormText>
                      </Column>
                      <Column small={4}>
                        <FormText>{formatDate(item.due_date)}</FormText>
                      </Column>
                    </Row>;
          })}
              </Fragment>}
          </Fragment>}
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.ROWS)}>
        <FieldArray component={InvoiceRowsEdit} name='rows' isEditClicked={isEditClicked} relativeTo={relativeTo} litigantOptions={recipientOptions} />
      </Authorization>
    </form>;
};

const formName = FormNames.LAND_USE_CONTRACT_INVOICE_EDIT;
const selector = formValueSelector(formName);
export default flowRight(connect(state => {
  return {
    currentLandUseContract: getCurrentLandUseContract(state),
    invoiceAttributes: getInvoiceAttributes(state),
    isEditClicked: getIsEditClicked(state),
    rows: selector(state, 'rows'),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  exportInvoiceToLaskeAndUpdateList
}), reduxForm({
  form: formName,
  validate: validateInvoiceForm
}))(EditInvoiceForm) as React.ComponentType<any>;