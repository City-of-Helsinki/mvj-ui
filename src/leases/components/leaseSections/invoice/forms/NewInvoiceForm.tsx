import React, { Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { FieldArray, formValueSelector, getFormValues, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonThird from "/src/components/form/AddButtonThird";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import Button from "/src/components/button/Button";
import CloseButton from "/src/components/button/CloseButton";
import FormField from "/src/components/form/FormField";
import FormTextTitle from "/src/components/form/FormTextTitle";
import RemoveButton from "/src/components/form/RemoveButton";
import SubTitle from "/src/components/content/SubTitle";
import WhiteBox from "/src/components/content/WhiteBox";
import { receiveIsCreateClicked } from "/src/invoices/actions";
import { ConfirmationModalTexts, FormNames } from "enums";
import { ButtonColors } from "/src/components/enums";
import { InvoiceFieldPaths, InvoiceFieldTitles, InvoiceRowsFieldPaths, InvoiceRowsFieldTitles } from "/src/invoices/enums";
import { LeaseCreateChargeFieldPaths, LeaseCreateChargeRowsFieldPaths } from "/src/leaseCreateCharge/enums";
import { RecipientOptions } from "/src/leases/enums";
import { receivableTypesFromAttributes } from "/src/leaseCreateCharge/helpers";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { validateInvoiceForm } from "/src/leases/formValidators";
import { isInvoiceBillingPeriodRequired } from "/src/invoices/helpers";
import { getInvoiceRecipientOptions } from "/src/leases/helpers";
import { getUiDataCreateChargeKey } from "/src/uiData/helpers";
import { getFieldAttributes, hasPermissions, isFieldAllowedToEdit, isFieldRequired } from "/src/util/helpers";
import { getAttributes as getInvoiceAttributes, getIsCreateClicked } from "/src/invoices/selectors";
import { getCurrentLease } from "/src/leases/selectors";
import { getAttributes as getLeaseCreateCrargeAttributes, getReceivableTypes } from "/src/leaseCreateCharge/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import type { Attributes } from "types";
import type { Lease } from "/src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
import Loader from "/src/components/loader/Loader";
type InvoiceRowsProps = {
  fields: any;
  invoiceAttributes: Attributes;
  isCreateClicked: boolean;
  leaseCreateChargeAttributes: Attributes;
  receivableTypes: Record<string, any>;
  useLeaseCreateChargeEndpoint: boolean;
};

const InvoiceRows = ({
  fields,
  invoiceAttributes,
  isCreateClicked,
  leaseCreateChargeAttributes,
  receivableTypes,
  useLeaseCreateChargeEndpoint
}: InvoiceRowsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            <SubTitle enableUiDataEdit uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeRowsFieldPaths.ROWS)}>Erittely</SubTitle>
            {!!fields && !!fields.length && <Fragment>
                <Row>
                  <Column small={3} large={2}>
                    <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE) : isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                      <FormTextTitle required={useLeaseCreateChargeEndpoint ? isFieldRequired(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE) : isFieldRequired(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)} enableUiDataEdit uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE)}>
                        {InvoiceRowsFieldTitles.RECEIVABLE_TYPE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.AMOUNT) : isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)}>
                      <FormTextTitle required={useLeaseCreateChargeEndpoint ? isFieldRequired(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.AMOUNT) : isFieldRequired(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)} enableUiDataEdit tooltipStyle={{
                  right: 12
                }} uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeRowsFieldPaths.AMOUNT)}>
                        {InvoiceRowsFieldTitles.AMOUNT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>

                {fields.map((row, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_INVOICE_ROW.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_INVOICE_ROW.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_INVOICE_ROW.TITLE
              });
            };

            return <Row key={index}>
                      <Column small={3} large={2}>
                        <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE) : isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                          {receivableTypes ? <FormField disableTouched={isCreateClicked} fieldAttributes={useLeaseCreateChargeEndpoint ? receivableTypesFromAttributes(getFieldAttributes(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE), receivableTypes) : receivableTypesFromAttributes(getFieldAttributes(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE), receivableTypes)} invisibleLabel name={`${row}.receivable_type`} overrideValues={{
                    label: InvoiceRowsFieldTitles.RECEIVABLE_TYPE
                  }} /> : <Loader isLoading={true} />}

                        </Authorization>
                      </Column>
                      <Column small={2} large={2}>
                        <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.AMOUNT) : isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)}>
                          <FormField disableTouched={isCreateClicked} fieldAttributes={useLeaseCreateChargeEndpoint ? getFieldAttributes(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.AMOUNT) : getFieldAttributes(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)} invisibleLabel name={`${row}.amount`} unit='€' overrideValues={{
                    label: InvoiceRowsFieldTitles.AMOUNT
                  }} />
                        </Authorization>
                      </Column>

                      <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.ROWS) : isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.ROWS)}>
                        <Column small={1} large={2}>
                          {fields.length > 1 && <RemoveButton className='third-level' onClick={handleRemove} title="Poista rivi" />}
                        </Column>
                      </Authorization>
                    </Row>;
          })}
              </Fragment>}

            <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.ROWS) : isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.ROWS)}>
              <Row>
                <Column>
                  <AddButtonThird label='Lisää rivi' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

type Props = {
  formValues: Record<string, any>;
  handleSubmit: (...args: Array<any>) => any;
  invoiceAttributes: Attributes;
  isCreateClicked: boolean;
  lease: Lease;
  leaseCreateChargeAttributes: Attributes;
  onClose: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
  receiveIsCreateClicked: (...args: Array<any>) => any;
  tenant: string;
  rows: Array<Record<string, any>>;
  receivableTypes: Record<string, any>;
  setRefForFirstField?: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
};

const NewInvoiceForm = ({
  formValues,
  handleSubmit,
  invoiceAttributes,
  isCreateClicked,
  lease,
  leaseCreateChargeAttributes,
  onClose,
  onSave,
  receiveIsCreateClicked,
  tenant,
  rows,
  receivableTypes,
  setRefForFirstField,
  usersPermissions,
  valid
}: Props) => {
  const handleSave = () => {
    receiveIsCreateClicked(true);

    if (valid) {
      onSave(formValues);
    }
  };

  const recipientOptions = getInvoiceRecipientOptions(lease, hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE), hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE));
  const useLeaseCreateChargeEndpoint = tenant === RecipientOptions.ALL;
  const billingPeriodRequired = isInvoiceBillingPeriodRequired(rows);
  return <form onSubmit={handleSubmit} className='invoice__new-invoice_form'>
      <WhiteBox>
        <BoxContentWrapper>
          <h3>Luo lasku</h3>
          <CloseButton className='position-topright' onClick={onClose} />

          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}>
                <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)} name='tenant' setRefForField={setRefForFirstField} overrideValues={{
                label: 'Vuokralainen',
                options: recipientOptions
              }} enableUiDataEdit uiDataKey={getUiDataCreateChargeKey(InvoiceFieldPaths.RECIPIENT)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.DUE_DATE) : isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}>
                <FormField disableTouched={isCreateClicked} fieldAttributes={useLeaseCreateChargeEndpoint ? getFieldAttributes(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.DUE_DATE) : getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)} name='due_date' overrideValues={{
                label: InvoiceFieldTitles.DUE_DATE
              }} enableUiDataEdit uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeFieldPaths.DUE_DATE)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.BILLING_PERIOD_START_DATE) : isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)}>
                <FormTextTitle required={billingPeriodRequired} enableUiDataEdit uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeFieldPaths.BILLING_PERIOD_START_DATE)}>
                  {InvoiceFieldTitles.BILLING_PERIOD_START_DATE}
                </FormTextTitle>
                <FormField disableTouched={isCreateClicked} fieldAttributes={useLeaseCreateChargeEndpoint ? getFieldAttributes(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.BILLING_PERIOD_START_DATE) : getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)} name='billing_period_start_date' invisibleLabel overrideValues={{
                label: InvoiceFieldTitles.BILLING_PERIOD_START_DATE
              }} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.BILLING_PERIOD_END_DATE) : isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}>
                <FormTextTitle required={billingPeriodRequired} enableUiDataEdit uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeFieldPaths.BILLING_PERIOD_END_DATE)}>
                  {InvoiceFieldTitles.BILLING_PERIOD_END_DATE}
                </FormTextTitle>
                <FormField disableTouched={isCreateClicked} fieldAttributes={useLeaseCreateChargeEndpoint ? getFieldAttributes(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.BILLING_PERIOD_END_DATE) : getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)} name='billing_period_end_date' invisibleLabel overrideValues={{
                label: InvoiceFieldTitles.BILLING_PERIOD_END_DATE
              }} />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column>
              <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.NOTES) : isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.NOTES)}>
                <FormField disableTouched={isCreateClicked} fieldAttributes={tenant === RecipientOptions.ALL ? getFieldAttributes(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.NOTES) : getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.NOTES)} name='notes' overrideValues={{
                label: InvoiceFieldTitles.NOTES
              }} enableUiDataEdit uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeFieldPaths.NOTES)} />
              </Authorization>
            </Column>
          </Row>

          <Authorization allow={useLeaseCreateChargeEndpoint ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeRowsFieldPaths.ROWS) : isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.ROWS)}>
            <FieldArray component={InvoiceRows} receivableTypes={receivableTypes} invoiceAttributes={invoiceAttributes} isCreateClicked={isCreateClicked} leaseCreateChargeAttributes={leaseCreateChargeAttributes} name='rows' useLeaseCreateChargeEndpoint={useLeaseCreateChargeEndpoint} />
          </Authorization>

          <Row>
            <Column>
              <div className='button-wrapper'>
                <Button className={ButtonColors.SECONDARY} onClick={onClose} text='Peruuta' />
                <Button className={ButtonColors.SUCCESS} disabled={isCreateClicked || !valid} onClick={handleSave} text='Tallenna' />
              </div>
            </Column>
          </Row>
        </BoxContentWrapper>
      </WhiteBox>
    </form>;
};

const formName = FormNames.LEASE_INVOICE_NEW;
const selector = formValueSelector(formName);
export default flowRight(connect(state => {
  return {
    formValues: getFormValues(formName)(state),
    invoiceAttributes: getInvoiceAttributes(state),
    isCreateClicked: getIsCreateClicked(state),
    lease: getCurrentLease(state),
    leaseCreateChargeAttributes: getLeaseCreateCrargeAttributes(state),
    receivableTypes: getReceivableTypes(state),
    tenant: selector(state, 'tenant'),
    rows: selector(state, 'rows'),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  receiveIsCreateClicked
}), reduxForm({
  form: formName,
  validate: validateInvoiceForm
}))(NewInvoiceForm) as React.ComponentType<any>;