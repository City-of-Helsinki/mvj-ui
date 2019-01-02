// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, formValueSelector, getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import WhiteBox from '$components/content/WhiteBox';
import {receiveIsCreateClicked} from '$src/invoices/actions';
import {ButtonColors} from '$components/enums';
import {InvoiceFieldPaths, InvoiceFieldTitles, InvoiceRowsFieldPaths, InvoiceRowsFieldTitles} from '$src/invoices/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames, RecipientOptions} from '$src/leases/enums';
import {validateInvoiceForm} from '$src/leases/formValidators';
import {getInvoiceRecipientOptions} from '$src/leases/helpers';
import {getFieldAttributes, isFieldAllowedToEdit, isFieldRequired} from '$util/helpers';
import {getAttributes as getInvoiceAttributes, getIsCreateClicked} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type InvoiceRowsProps = {
  attributes: Attributes,
  fields: any,
  isCreateClicked: boolean,
}

const InvoiceRows = ({attributes, fields, isCreateClicked}: InvoiceRowsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <SubTitle>Erittely</SubTitle>
            {!!fields && !!fields.length &&
              <Fragment>
                <Row>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToEdit(attributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                      <FormTextTitle required={isFieldRequired(attributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                        {InvoiceRowsFieldTitles.RECEIVABLE_TYPE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToEdit(attributes, InvoiceRowsFieldPaths.AMOUNT)}>
                      <FormTextTitle required={isFieldRequired(attributes, InvoiceRowsFieldPaths.AMOUNT)}>
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
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.INVOICE_ROW,
                      confirmationModalTitle: DeleteModalTitles.INVOICE_ROW,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToEdit(attributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                          <FormField
                            disableTouched={isCreateClicked}
                            fieldAttributes={getFieldAttributes(attributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}
                            invisibleLabel={true}
                            name={`${row}.receivable_type`}
                            overrideValues={{label: InvoiceRowsFieldTitles.RECEIVABLE_TYPE}}
                          />
                        </Authorization>
                      </Column>
                      <Column small={2} large={2}>
                        <Authorization allow={isFieldAllowedToEdit(attributes, InvoiceRowsFieldPaths.AMOUNT)}>
                          <FormField
                            disableTouched={isCreateClicked}
                            fieldAttributes={get(attributes, InvoiceRowsFieldPaths.AMOUNT)}
                            invisibleLabel={true}
                            name={`${row}.amount`}
                            unit='€'
                            overrideValues={{label: InvoiceRowsFieldTitles.AMOUNT}}
                          />
                        </Authorization>
                      </Column>

                      <Authorization allow={isFieldAllowedToEdit(attributes, InvoiceRowsFieldPaths.ROWS)}>
                        <Column small={1} large={2}>
                          {fields.length > 1 &&
                            <RemoveButton
                              className='third-level'
                              onClick={handleRemove}
                              title="Poista rivi"
                            />
                          }
                        </Column>
                      </Authorization>
                    </Row>
                  );
                })}
              </Fragment>
            }

            <Authorization allow={isFieldAllowedToEdit(attributes, InvoiceRowsFieldPaths.ROWS)}>
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää rivi'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  formValues: Object,
  handleSubmit: Function,
  invoiceAttributes: Attributes,
  isCreateClicked: boolean,
  lease: Lease,
  onClose: Function,
  onSave: Function,
  receiveIsCreateClicked: Function,
  recipient: string,
  setRefForFirstField?: Function,
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
  recipient,
  setRefForFirstField,
  valid,
}: Props) => {
  const handleSave = () => {
    receiveIsCreateClicked(true);
    if(valid) {
      onSave(formValues);
    }
  };

  const recipientOptions = getInvoiceRecipientOptions(lease);

  return (
    <form onSubmit={handleSubmit} className='invoice__new-invoice_form'>
      <WhiteBox>
        <BoxContentWrapper>
          <h3>Luo lasku</h3>
          <CloseButton className='position-topright' onClick={onClose} />

          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}
                  name='recipient'
                  setRefForField={setRefForFirstField}
                  overrideValues={{
                    label: 'Vuokralainen',
                    options: recipientOptions,
                  }}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}
                  name='due_date'
                  overrideValues={{label: InvoiceFieldTitles.DUE_DATE}}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)}
                  name='billing_period_start_date'
                  overrideValues={{label: InvoiceFieldTitles.BILLING_PERIOD_START_DATE}}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}
                  name='billing_period_end_date'
                  overrideValues={{label: InvoiceFieldTitles.BILLING_PERIOD_END_DATE}}
                />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.NOTES)}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={recipient === RecipientOptions.ALL
                    ? {...getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.NOTES), required: true}
                    : getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.NOTES)
                  }
                  name='notes'
                  overrideValues={{label: InvoiceFieldTitles.NOTES}}
                />
              </Authorization>
            </Column>
          </Row>

          <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.ROWS)}>
            <FieldArray
              attributes={invoiceAttributes}
              component={InvoiceRows}
              isCreateClicked={isCreateClicked}
              name='rows'
            />
          </Authorization>

          <Row>
            <Column>
              <div className='button-wrapper'>
                <Button
                  className={ButtonColors.SECONDARY}
                  onClick={onClose}
                  text='Peruuta'
                />
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={isCreateClicked && !valid}
                  onClick={handleSave}
                  text='Tallenna'
                />
              </div>
            </Column>
          </Row>
        </BoxContentWrapper>
      </WhiteBox>
    </form>
  );
};

const formName = FormNames.INVOICE_NEW;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
        invoiceAttributes: getInvoiceAttributes(state),
        isCreateClicked: getIsCreateClicked(state),
        lease: getCurrentLease(state),
        recipient: selector(state, 'recipient'),
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
    validate: validateInvoiceForm,
  }),
)(NewInvoiceForm);
