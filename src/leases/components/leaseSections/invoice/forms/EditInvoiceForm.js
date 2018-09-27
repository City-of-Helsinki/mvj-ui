// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import InvoiceRowsEdit from './InvoiceRowsEdit';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {InvoiceType} from '$src/invoices/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getInvoiceTenantOptions} from '$src/leases/helpers';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes as getInvoiceAttributes, getIsEditClicked} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';
import type {Lease} from '$src/leases/types';

type PaymentsProps = {
  attributes: InvoiceAttributes,
  fields: any,
  isEditClicked: boolean,
}

const renderPayments = ({attributes, fields, isEditClicked}: PaymentsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            {!fields || !fields.length && <FormText>Ei maksuja</FormText>}

            {fields && !!fields.length &&
              <Row>
                <Column small={6}>
                  <FormTextTitle
                    required={get(attributes, 'payments.child.children.paid_amount.required')}
                    title='Maksettu määrä'
                  />
                </Column>
                <Column small={6}>
                  <FormTextTitle
                    required={get(attributes, 'payments.child.children.paid_date.required')}
                    title='Maksettu pvm'
                  />
                </Column>
              </Row>
            }
            {fields && !!fields.length && fields.map((payment, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_DELETE_MODAL,
                  deleteFunction: () => {
                    fields.remove(index);
                  },
                  deleteModalLabel: DeleteModalLabels.INVOICE_PAYMENT,
                  deleteModalTitle: DeleteModalTitles.INVOICE_PAYMENT,
                });
              };

              return (
                <Row key={index}>
                  <Column small={6}>
                    <FormField
                      disableTouched={isEditClicked}
                      fieldAttributes={get(attributes, 'payments.child.children.paid_amount')}
                      invisibleLabel
                      name={`${payment}.paid_amount`}
                      unit='€'
                    />
                  </Column>
                  <Column small={4}>
                    <FormField
                      disableTouched={isEditClicked}
                      fieldAttributes={get(attributes, 'payments.child.children.paid_date')}
                      invisibleLabel
                      name={`${payment}.paid_date`}
                    />
                  </Column>
                  <Column small={2}>
                    <RemoveButton
                      className='third-level'
                      onClick={handleRemove}
                      title="Poista maksu"
                    />
                  </Column>
                </Row>
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää maksu'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  handleSubmit: Function,
  invoice: ?Object,
  invoiceAttributes: InvoiceAttributes,
  isEditClicked: boolean,
  lease: Lease,
  onCreditedInvoiceClick: Function,
  setRefForFirstField?: Function,
}

const EditInvoiceForm = ({
  handleSubmit,
  invoice,
  invoiceAttributes,
  isEditClicked,
  lease,
  onCreditedInvoiceClick,
  setRefForFirstField,
}: Props) => {
  const handleCreditedInvoiceClick = () => {
    if(invoice) {
      onCreditedInvoiceClick(invoice.credited_invoice);
    }
  };

  const handleCreditedInvoiceKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      handleCreditedInvoiceClick();
    }
  };

  const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');
  const tenantOptions = getInvoiceTenantOptions(lease);
  const deliveryMethodOptions = getAttributeFieldOptions(invoiceAttributes, 'delivery_method');
  const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskunsaaja'
            text={(invoice && getContactFullName(invoice.recipientFull)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Lähetetty SAP:iin'
            text={(invoice && formatDate(invoice.sent_to_sap_at)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='SAP numero'
            text={(invoice && invoice.sap_id) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormField
            disableTouched={isEditClicked}
            fieldAttributes={get(invoiceAttributes, 'due_date')}
            name='due_date'
            setRefForField={setRefForFirstField}
            overrideValues={{
              label: 'Eräpäivä',
            }}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskutuspvm'
            text={(invoice && formatDate(invoice.invoicing_date)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskun tila'
            text={(invoice && getLabelOfOption(stateOptions, invoice.state)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <Row>
            <Column>
              <FormTextTitle required title='Laskutuskausi' />
            </Column>
          </Row>
          <Row>
            <Column medium={6}>
              <FormField
                disableTouched={isEditClicked}
                fieldAttributes={get(invoiceAttributes, 'billing_period_start_date')}
                invisibleLabel
                name='billing_period_start_date'
              />
            </Column>
            <Column medium={6}>
              <FormField
                disableTouched={isEditClicked}
                fieldAttributes={get(invoiceAttributes, 'billing_period_end_date')}
                invisibleLabel
                name='billing_period_end_date'
              />
            </Column>
          </Row>
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Lykkäyspvm'
            text={(invoice && formatDate(invoice.postpone_date)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormField
            disableTouched={isEditClicked}
            fieldAttributes={get(invoiceAttributes, 'total_amount')}
            name='total_amount'
            unit='€'
            overrideValues={{
              label: 'Laskun pääoma',
            }}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskun osuus'
            text={`${formatNumber((invoice ? invoice.totalShare : 0) * 100)} %`}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskutettu määrä'
            text={(invoice && invoice.billed_amount)
              ? `${formatNumber(invoice.billed_amount)} €`
              : '-'}
          />
        </Column>
      </Row>

      <SubTitle>Maksut</SubTitle>
      <Row>
        <Column small={12} medium={8}>
          <FieldArray
            attributes={invoiceAttributes}
            component={renderPayments}
            isEditClicked={isEditClicked}
            name='payments'
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Maksamaton määrä'
            text={(invoice && invoice.outstanding_amount)
              ? `${formatNumber(invoice.outstanding_amount)} €`
              : '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormTitleAndText
            title='Maksukehotuspvm'
            text={(invoice && formatDate(invoice.payment_notification_date)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Perintäkulu'
            text={(invoice && invoice.collection_charge)
              ? `${formatNumber(invoice.collection_charge)} €`
              : '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Maksukehotus luettelo'
            text={(invoice && formatDate(invoice.payment_notification_catalog_date)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormTitleAndText
            title='E vai paperilasku'
            text={(invoice && getLabelOfOption(deliveryMethodOptions, invoice.delivery_method)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskun tyyppi'
            text={(invoice && getLabelOfOption(typeOptions, invoice.type)) || '-'}
          />
        </Column>
        {invoice && invoice.type === InvoiceType.CREDIT_NOTE &&
          <Column medium={4}>
            <FormTitleAndText
              title='Hyvitetty lasku'
              text={invoice.credited_invoice
                ? <a className='no-margin' onKeyDown={handleCreditedInvoiceKeyDown} onClick={handleCreditedInvoiceClick} tabIndex={0}>{invoice.credited_invoice}</a>
                : '-'
              }
            />
          </Column>
        }
      </Row>
      <Row>
        <Column medium={12}>
          <FormField
            disableTouched={isEditClicked}
            fieldAttributes={get(invoiceAttributes, 'notes')}
            name='notes'
            overrideValues={{
              label: 'Tiedote',
              fieldType: 'textarea',
            }}
          />
        </Column>
      </Row>
      <FieldArray
        attributes={invoiceAttributes}
        component={InvoiceRowsEdit}
        name='rows'
        isEditClicked={isEditClicked}
        tenantOptions={tenantOptions}
      />
    </form>
  );
};

const formName = FormNames.INVOICE_EDIT;

export default flowRight(
  connect(
    (state) => {
      return {
        invoiceAttributes: getInvoiceAttributes(state),
        isEditClicked: getIsEditClicked(state),
        lease: getCurrentLease(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(EditInvoiceForm);
