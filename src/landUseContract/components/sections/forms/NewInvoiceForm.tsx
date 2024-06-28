import React, { Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { getFormValues, reduxForm, FieldArray } from "redux-form";
import flowRight from "lodash/flowRight";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import Button from "/src/components/button/Button";
import CloseButton from "/src/components/button/CloseButton";
import RemoveButton from "/src/components/form/RemoveButton";
import FormField from "/src/components/form/FormField";
import WhiteBox from "/src/components/content/WhiteBox";
import { receiveIsCreateClicked } from "/src/landUseInvoices/actions";
import { ConfirmationModalTexts, FormNames } from "enums";
import { ButtonColors } from "/src/components/enums";
import SubTitle from "/src/components/content/SubTitle";
// import {InvoiceFieldPaths, InvoiceFieldTitles} from 'src/invoices/enums'; // TODO MAKE OWN ENUMS
import { validateLandUseInvoiceForm } from "/src/landUseContract/formValidators";
import { getFieldAttributes, isFieldAllowedToEdit } from "/src/util/helpers";
import { getAttributes as getInvoiceAttributes, getIsCreateClicked } from "/src/landUseInvoices/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import { getRecipientOptionsFromLitigants } from "/src/landUseContract/helpers";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonThird from "/src/components/form/AddButtonThird";
type InvoiceRowsProps = {
  fields: any;
  invoiceAttributes: Attributes;
  isCreateClicked: boolean;
};

const InvoiceRows = ({
  fields,
  invoiceAttributes,
  isCreateClicked
}: InvoiceRowsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            <SubTitle>Erittely</SubTitle>
            {!!fields && !!fields.length && <Fragment>

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
                      <Column small={6} medium={4} large={2}>
                        <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'rows.child.children.receivable_type')} name={`${row}.receivable_type`} overrideValues={{
                  label: 'Saamislaji'
                }} />
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'rows.child.children.compensation_amount')} name={`${row}.compensation_amount`} unit='€' />
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'rows.child.children.amount')} name={`${row}.amount`} unit='€' />
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'rows.child.children.increase_percentage')} name={`${row}.increase_percentage`} unit='%' overrideValues={{
                  label: 'Korkoprosentti'
                }} />
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'rows.child.children.sign_date')} name={`${row}.sign_date`} />
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'rows.child.children.plan_lawfulness_date')} name={`${row}.plan_lawfulness_date`} />
                      </Column>
                      <Column small={1} large={1}>
                        {fields.length > 1 && <RemoveButton className='third-level' onClick={handleRemove} title='Poista rivi' />}
                      </Column>
                    </Row>;
          })}
              </Fragment>}
            <Row>
              <Column>
                <AddButtonThird label='Lisää rivi' onClick={handleAdd} />
              </Column>
            </Row>
          </Fragment>;
    }}
    </AppConsumer>;
};

type Props = {
  formValues: Record<string, any>;
  handleSubmit: (...args: Array<any>) => any;
  invoiceAttributes: Attributes;
  isCreateClicked: boolean;
  leaseCreateChargeAttributes: Attributes;
  onClose: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
  receiveIsCreateClicked: (...args: Array<any>) => any;
  setRefForFirstField?: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
  litigants: Array<Record<string, any>>;
};

const NewInvoiceForm = ({
  formValues,
  handleSubmit,
  invoiceAttributes,
  isCreateClicked,
  onClose,
  onSave,
  receiveIsCreateClicked,
  setRefForFirstField,
  litigants
}: Props) => {
  const handleSave = () => {
    receiveIsCreateClicked(true);
    onSave(formValues);
  };

  const recipientOptions = getRecipientOptionsFromLitigants(litigants);
  return <form onSubmit={handleSubmit} className='invoice__new-invoice_form'>
      <WhiteBox>
        <BoxContentWrapper>
          <h3>Luo lasku</h3>
          <CloseButton className='position-topright' onClick={onClose} />

          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, 'recipient')}>
                <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'recipient')} name='recipient' setRefForField={setRefForFirstField} overrideValues={{
                label: 'Laskunsaaja',
                options: recipientOptions
              }} // enableUiDataEdit
              // uiDataKey={getUiDataCreateChargeKey(InvoiceFieldPaths.RECIPIENT)}
              />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={1}>
              <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'due_date')} name='due_date' // enableUiDataEdit
            // uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeFieldPaths.DUE_DATE)}
            />
            </Column>

            <Column small={6} medium={4} large={1}>
              <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'total_amount')} name='total_amount' />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'billed_amount')} name='billed_amount' />
            </Column>
            <Column small={6} medium={4} large={1}>
              <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'type')} name='type' />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField disableTouched={isCreateClicked} fieldAttributes={getFieldAttributes(invoiceAttributes, 'outstanding_amount')} name='outstanding_amount' />
            </Column>
            <Column small={12} medium={12} large={12}>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, 'rows')}>
                <FieldArray component={InvoiceRows} invoiceAttributes={invoiceAttributes} isCreateClicked={isCreateClicked} name='rows' />
              </Authorization>
            </Column>

            <Column>
              <div className='button-wrapper'>
                <Button className={ButtonColors.SECONDARY} onClick={onClose} text='Peruuta' />
                <Button className={ButtonColors.SUCCESS} disabled={isCreateClicked} onClick={handleSave} text='Tallenna' />
              </div>
            </Column>
          </Row>
        </BoxContentWrapper>
      </WhiteBox>
    </form>;
};

const formName = FormNames.LAND_USE_INVOICE_NEW;
export default flowRight(connect(state => {
  return {
    formValues: getFormValues(formName)(state),
    invoiceAttributes: getInvoiceAttributes(state),
    isCreateClicked: getIsCreateClicked(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  receiveIsCreateClicked
}), reduxForm({
  form: formName,
  validate: validateLandUseInvoiceForm
}))(NewInvoiceForm) as React.ComponentType<any>;