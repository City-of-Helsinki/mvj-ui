// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {ButtonColors} from '$components/enums';
import {InvoiceRowsFieldPaths, InvoiceRowsFieldTitles} from '$src/invoices/enums';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';
import {getUiDataInvoiceKey} from '$src/uiData/helpers';
import {getFieldAttributes, isFieldAllowedToEdit, isFieldAllowedToRead, isFieldRequired} from '$util/helpers';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';

import type {Attributes} from '$src/types';

type Props = {
  fields: any,
  invoiceAttributes: Attributes,
  isEditClicked: boolean,
  tenantOptions: Array<Object>,
}

const InvoiceRowsEdit = ({fields, invoiceAttributes, isEditClicked, tenantOptions}: Props): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <SubTitle enableUiDataEdit uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.ROWS)}>
              {InvoiceRowsFieldTitles.ROWS}
            </SubTitle>
            {!!fields && !!fields.length &&
              <Fragment>
                <Row>
                  <Column small={4}>
                    <FormTextTitle
                      required={isFieldRequired(invoiceAttributes, InvoiceRowsFieldPaths.TENANT)}
                      enableUiDataEdit
                      uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.TENANT)}
                    >
                      {InvoiceRowsFieldTitles.TENANT}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle
                      required={isFieldRequired(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}
                      enableUiDataEdit
                      uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}
                    >
                      {InvoiceRowsFieldTitles.RECEIVABLE_TYPE}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle
                      required={isFieldRequired(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)}
                      enableUiDataEdit
                      uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.AMOUNT)}
                    >
                      {InvoiceRowsFieldTitles.AMOUNT}
                    </FormTextTitle>
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
                      <Column small={4}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.TENANT)}>
                          <FormField
                            disableTouched={isEditClicked}
                            fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceRowsFieldPaths.TENANT)}
                            invisibleLabel
                            name={`${row}.tenant`}
                            overrideValues={{
                              label: InvoiceRowsFieldTitles.TENANT,
                              options: tenantOptions,
                            }}
                          />
                        </Authorization>
                      </Column>
                      <Column small={4}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                          <FormField
                            disableTouched={isEditClicked}
                            fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}
                            invisibleLabel
                            name={`${row}.receivable_type`}
                            overrideValues={{label: InvoiceRowsFieldTitles.RECEIVABLE_TYPE}}
                          />
                        </Authorization>
                      </Column>
                      <Column small={4}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)}>
                          <FormField
                            disableTouched={isEditClicked}
                            fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)}
                            invisibleLabel
                            name={`${row}.amount`}
                            unit='€'
                            overrideValues={{label: InvoiceRowsFieldTitles.AMOUNT}}
                          />
                        </Authorization>
                      </Column>
                      <Column small={1} large={2}>
                        <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.ROWS)}>
                          {fields.length > 1 &&
                            <RemoveButton
                              className='third-level'
                              onClick={handleRemove}
                              title="Poista rivi"
                            />
                          }
                        </Authorization>
                      </Column>
                    </Row>
                  );
                })}
              </Fragment>
            }

            <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.ROWS)}>
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

export default connect(
  (state) => {
    return {
      invoiceAttributes: getInvoiceAttributes(state),
    };
  }
)(InvoiceRowsEdit);
