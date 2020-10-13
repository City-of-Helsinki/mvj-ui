// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FormField from '$components/form/FormField';
import WhiteBox from '$components/content/WhiteBox';
import {receiveIsCreateClicked} from '$src/landUseInvoices/actions';
import {FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {InvoiceFieldPaths, InvoiceFieldTitles} from '$src/invoices/enums'; // TODO MAKE OWN ENUMS
import {LeaseCreateChargeFieldPaths} from '$src/leaseCreateCharge/enums';
import {RecipientOptions} from '$src/leases/enums';
import {validateLandUseInvoiceForm} from '$src/landUseContract/formValidators';
import {getUiDataCreateChargeKey} from '$src/uiData/helpers';
import {
  getFieldAttributes,
  isFieldAllowedToEdit,
} from '$util/helpers';
import {
  getAttributes as getInvoiceAttributes,
  getIsCreateClicked,
} from '$src/landUseInvoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';
import {
  getAttributes as getLeaseCreateCrargeAttributes,
  getReceivableTypes,
} from '$src/leaseCreateCharge/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  formValues: Object,
  handleSubmit: Function,
  invoiceAttributes: Attributes,
  isCreateClicked: boolean,
  lease: Lease,
  leaseCreateChargeAttributes: Attributes,
  onClose: Function,
  onSave: Function,
  receiveIsCreateClicked: Function,
  tenant: string,
  rows: Array<Object>,
  receivableTypes: Object,
  setRefForFirstField?: Function,
  usersPermissions: UsersPermissionsType,
  valid: boolean,
}

const NewInvoiceForm = ({
  formValues,
  handleSubmit,
  invoiceAttributes,
  isCreateClicked,
  leaseCreateChargeAttributes,
  onClose,
  onSave,
  receiveIsCreateClicked,
  tenant,
  setRefForFirstField,
  valid,
}: Props) => {
  const handleSave = () => {
    receiveIsCreateClicked(true);

    if(valid) {
      onSave(formValues);
    }
  };

  const recipientOptions = [{value: 1, label: 'Virve Virkailija'}, {value: 2, label: 'Teuvo Kuusela'}];
  const useLeaseCreateChargeEndpoint = tenant === RecipientOptions.ALL;
  return (
    <form onSubmit={handleSubmit} className='invoice__new-invoice_form'>
      <WhiteBox>
        <BoxContentWrapper>
          <h3>Luo lasku</h3>
          <CloseButton className='position-topright' onClick={onClose} />

          <Row>
            <Column small={6} medium={4} large={1}>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}>
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}
                  name='tenant'
                  setRefForField={setRefForFirstField}
                  overrideValues={{
                    label: 'Laskunsaaja',
                    options: recipientOptions,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataCreateChargeKey(InvoiceFieldPaths.RECIPIENT)}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={1}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={useLeaseCreateChargeEndpoint
                  ? getFieldAttributes(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.DUE_DATE)
                  : getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)
                }
                name='due_date'
                overrideValues={{label: InvoiceFieldTitles.DUE_DATE}}
                enableUiDataEdit
                uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeFieldPaths.DUE_DATE)}
              />
            </Column>

            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={getFieldAttributes(invoiceAttributes, 'compensation_amount')}
                name='compensation_amount'
                overrideValues={{label: 'Korvauksen määrä (€)'}}
                unit='€'
              />
            </Column>

            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={getFieldAttributes(invoiceAttributes, 'intrest_amount')}
                name='intrest_amount'
                overrideValues={{label: 'Korotuksen määrä (%)'}}
                unit='%'
              />
            </Column>

            <Column small={6} medium={4} large={1}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={getFieldAttributes(invoiceAttributes, 'sign_date')}
                name='sign_date'
                overrideValues={{label: 'Allekirjoituspvm'}}
              />
            </Column>
            <Column small={6} medium={4} large={3}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={getFieldAttributes(invoiceAttributes, 'legal_from_date')}
                name='legal_from_date'
                overrideValues={{label: 'Kaavamuutoksen lainvoimaisuuspvm'}}
              />
            </Column>

            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isCreateClicked}
                fieldAttributes={getFieldAttributes(invoiceAttributes, 'billing_amount')}
                name='billing_amount'
                overrideValues={{label: 'Laskutettava määrä (€)'}}
                unit='€'
              />
            </Column>
          </Row>

          <Row>
            <Column>
              <Authorization allow={useLeaseCreateChargeEndpoint
                ? isFieldAllowedToEdit(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.NOTES)
                : isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.NOTES)}
              >
                <FormField
                  disableTouched={isCreateClicked}
                  fieldAttributes={tenant === RecipientOptions.ALL
                    ? getFieldAttributes(leaseCreateChargeAttributes, LeaseCreateChargeFieldPaths.NOTES)
                    : getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.NOTES)
                  }
                  name='notes'
                  overrideValues={{label: InvoiceFieldTitles.NOTES}}
                  enableUiDataEdit
                  uiDataKey={getUiDataCreateChargeKey(LeaseCreateChargeFieldPaths.NOTES)}
                />
              </Authorization>
            </Column>
          </Row>

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
                  disabled={isCreateClicked || !valid}
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

const formName = FormNames.LEASE_INVOICE_NEW;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
        invoiceAttributes: getInvoiceAttributes(state),
        isCreateClicked: getIsCreateClicked(state),
        lease: getCurrentLease(state),
        leaseCreateChargeAttributes: getLeaseCreateCrargeAttributes(state),
        receivableTypes: getReceivableTypes(state),
        tenant: selector(state, 'tenant'),
        rows: selector(state, 'rows'),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      receiveIsCreateClicked,
    }
  ),
  reduxForm({
    form: formName,
    validate: validateLandUseInvoiceForm,
  }),
)(NewInvoiceForm);
