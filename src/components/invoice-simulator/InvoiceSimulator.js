// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, isValid} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AuthorizationError from '$components/authorization/AuthorizationError';
import Button from '$components/button/Button';
import FormText from '$components/form/FormText';
import InvoiceSimulatorBillingPeriod from './InvoiceSimulatorBillingPeriods';
import InvoiceSimulatorForm from './InvoiceSimulatorForm';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {fetchPreviewInvoices} from '$src/previewInvoices/actions';
import {PermissionMissingTexts} from '$src/enums';
import {ButtonColors, FormNames} from '$components/enums';
import {getContentPreviewInvoiceBillingPeriods} from '$components/helpers';
import {getFieldOptions} from '$util/helpers';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';
import {
  getIsFetching,
  getMethods as getPreviewInvoicesMethods,
  getPreviewInvoices,
} from '$src/previewInvoices/selectors';

import type {Attributes, Methods} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {PreviewInvoices} from '$src/previewInvoices/types';

type Props = {
  currentLease: Lease,
  fetchPreviewInvoices: Function,
  invoiceAttributes: Attributes,
  isFetching: boolean,
  isValid: boolean,
  previewInvoices: PreviewInvoices,
  previewInvoicesMethods: Methods,
  year: number,
}

type State = {
  billingPeriods: Array<Object> | null,
  invoiceAttributes: Attributes,
  invoiceReceivableTypeOptions: Array<Object>,
  invoiceTypeOptions: Array<Object>,
  previewInvoices: PreviewInvoices,
}
class InvoiceSimulator extends Component<Props, State> {
  state = {
    billingPeriods: null,
    invoiceAttributes: {},
    invoiceReceivableTypeOptions: [],
    invoiceTypeOptions: [],
    previewInvoices: null,
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.invoiceAttributes !== state.invoiceAttributes) {
      newState.invoiceAttributes = props.invoiceAttributes;
      newState.invoiceReceivableTypeOptions = getFieldOptions(props.invoiceAttributes, 'rows.child.children.receivable_type', false);
      newState.invoiceTypeOptions = getFieldOptions(props.invoiceAttributes, 'type', false);
    }

    if(props.previewInvoices !== state.previewInvoices) {
      newState.previewInvoices = props.previewInvoices;
      newState.billingPeriods = getContentPreviewInvoiceBillingPeriods(props.previewInvoices);
    }

    return newState;
  }

  handleCreatePreviewInvoices = () => {
    const {currentLease, fetchPreviewInvoices, year} = this.props;

    fetchPreviewInvoices({lease: currentLease.id, year: year});
  };

  render() {
    const {isFetching, isValid, previewInvoicesMethods} = this.props;
    const {billingPeriods, invoiceReceivableTypeOptions, invoiceTypeOptions} = this.state;

    if(!previewInvoicesMethods.GET) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;

    return(
      <div className='invoice-simulator'>
        <Row>
          <Column small={6} medium={3} large={2}>
            <InvoiceSimulatorForm onSubmit={this.handleCreatePreviewInvoices}/>
          </Column>
          <Column small={6} medium={9} large={10}>
            <Button
              className={`${ButtonColors.SUCCESS} no-margin`}
              disabled={isFetching || !isValid}
              onClick={this.handleCreatePreviewInvoices}
              text='Luo laskut'
            />
          </Column>
        </Row>
        {(billingPeriods && !billingPeriods.length && !isFetching) &&
          <FormText>Ei laskuja valittuna vuonna</FormText>
        }
        {((billingPeriods && !!billingPeriods.length) || isFetching) &&

          <div className='invoice-simulator__container'>
            {isFetching &&
              <LoaderWrapper className='relative-overlay-wrapper'>
                <Loader isLoading={isFetching} />
              </LoaderWrapper>
            }
            {(billingPeriods && !!billingPeriods.length) && billingPeriods.map((billingPeriod, index) => {
              return <InvoiceSimulatorBillingPeriod
                key={index}
                dueDate={billingPeriod.dueDate}
                endDate={billingPeriod.endDate}
                explanations={billingPeriod.explanations}
                invoices={billingPeriod.invoices}
                invoiceReceivableTypeOptions={invoiceReceivableTypeOptions}
                invoiceTypeOptions={invoiceTypeOptions}
                startDate={billingPeriod.startDate}
                totalAmount={billingPeriod.totalAmount}
              />;
            })}
          </div>
        }
      </div>
    );
  }
}
const formName = FormNames.INVOICE_SIMULATOR;
const selector = formValueSelector(formName);

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
      invoiceAttributes: getInvoiceAttributes(state),
      isFetching: getIsFetching(state),
      isValid: isValid(formName)(state),
      previewInvoices: getPreviewInvoices(state),
      previewInvoicesMethods: getPreviewInvoicesMethods(state),
      year: selector(state, 'invoice_simulator_year'),
    };
  },
  {
    fetchPreviewInvoices,
  }
)(InvoiceSimulator);
