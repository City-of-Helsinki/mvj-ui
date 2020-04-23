// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Button from '$components/button/Button';
import {ButtonColors} from '$components/enums';
import FormField from '$components/form/FormField';
import {FieldTypes, FormNames} from '$src/enums';
import {withLeaseStatisticReportAttributes} from '$components/attributes/LeaseStatisticReportAttributes';
import Authorization from '$components/authorization/Authorization';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {
  getFieldAttributes,
  isFieldAllowedToEdit,
} from '$util/helpers';
import {
  LeaseStatisticReportPaths,
  LeaseStatisticReportTitles,
  LeaseInvoicingReportTypes,
} from '$src/leaseStatisticReport/enums';
import {
  getReportTypeOptions,
  getReportUrl,
  getPayload,
} from '$src/leaseStatisticReport/helpers';
import {fetchReportData, setReportType, sendReportToMail} from '$src/leaseStatisticReport/actions';
import {
  getAttributes as getLeaseStatisticReportAttributes,
} from '$src/leaseStatisticReport/selectors';
import type {Attributes, Reports} from '$src/types';
import {leaseTypeOptions, invoiceStateOptions} from './options';

type Props = {
  leaseStatisticReportAttributes: Attributes,
  reportType: string,
  startDate: string,
  endDate: string,
  startYear: number,
  endYear: number,
  reports: Reports,
  isFetchingReports: boolean,
  isFetchingReportData: boolean,
  isSendingMail: boolean,
  fetchReportData: Function,
  setReportType: Function,
  sendReportToMail: Function,
  leaseType: string,
  invoiceState: string,
}

type State = {
}

class LeaseStatisticReportForm extends PureComponent<Props, State> {
  state = {
    invoices: [],
    invoiceOptions: [],
    lease: {},
    tenantOptions: [],
  }

  getReportData = () => {
    const {
      reportType,
      startDate,
      endDate,
      reports,
      fetchReportData,
      setReportType,
      leaseType,
      invoiceState,
    } = this.props;
    const url = getReportUrl(reports, reportType);
    const payload = getPayload(startDate, endDate, url, reportType, leaseType, invoiceState);
    fetchReportData(payload);
    setReportType(payload);
  }

  sendToMail = () => {
    const {
      reportType,
      startYear,
      endYear,
      reports,
      sendReportToMail,
    } = this.props;
    const url = getReportUrl(reports, reportType);
    sendReportToMail({url: url, start_year: startYear, end_year: endYear});
  }

  render() {
    const {
      leaseStatisticReportAttributes,
      reports,
      isFetchingReports,
      isFetchingReportData,
      reportType,
      startDate,
      endDate,
      isSendingMail,
    } = this.props;

    if(isFetchingReports) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    const reportTypeOptions = getReportTypeOptions(reports);

    return(
      <form>
        <Row>
          <Column small={12} large={12}>
            <Row>
              <Column large={2} medium={3} small={4}>
                <Authorization allow={isFieldAllowedToEdit(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}>
                  <FormField
                    fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}
                    disableDirty
                    name='report_type'
                    overrideValues={{
                      fieldType: FieldTypes.CHOICE,
                      label: LeaseStatisticReportTitles.REPORT_TYPE,
                      options: reportTypeOptions,
                    }}
                    enableUiDataEdit
                  />
                </Authorization>
              </Column>
              {(reportType !== LeaseInvoicingReportTypes.LEASE_COUNT && reportType !== LeaseInvoicingReportTypes.LEASE_INVOICING_DISABLED) && reportType !== LeaseInvoicingReportTypes.RENT_FORECAST &&
                <Column large={2} medium={3} small={4}>
                  <Authorization allow={isFieldAllowedToEdit(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}>
                    <FormField
                      fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}
                      disableDirty
                      name='start_date'
                      overrideValues={{
                        fieldType: FieldTypes.DATE,
                        label: LeaseStatisticReportTitles.START_DATE,
                      }}
                      enableUiDataEdit
                    />
                  </Authorization>
                </Column>}
              {(reportType !== LeaseInvoicingReportTypes.LEASE_COUNT && reportType !== LeaseInvoicingReportTypes.LEASE_INVOICING_DISABLED) && reportType !== LeaseInvoicingReportTypes.RENT_FORECAST &&
                <Column large={2} medium={3} small={4}>
                  <Authorization allow={isFieldAllowedToEdit(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}>
                    <FormField
                      fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.END_DATE)}
                      disableDirty
                      overrideValues={{
                        fieldType: FieldTypes.DATE,
                        label: LeaseStatisticReportTitles.END_DATE,
                      }}
                      name='end_date'
                      enableUiDataEdit
                    />
                  </Authorization>
                </Column>}
              {reportType === LeaseInvoicingReportTypes.INVOICES_IN_PERIOD && <Column large={2} medium={3} small={4}>
                <Authorization allow={isFieldAllowedToEdit(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}>
                  <FormField
                    fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.END_DATE)}
                    disableDirty
                    overrideValues={{
                      fieldType: FieldTypes.CHOICE,
                      label: LeaseStatisticReportTitles.LEASE_TYPE,
                      options: leaseTypeOptions,
                      required: false,
                    }}
                    name='lease_type'
                    enableUiDataEdit
                  />
                </Authorization>
              </Column>}
              {reportType === LeaseInvoicingReportTypes.INVOICES_IN_PERIOD && <Column large={1} medium={2} small={3}>
                <Authorization allow={isFieldAllowedToEdit(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}>
                  <FormField
                    fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.END_DATE)}
                    disableDirty
                    overrideValues={{
                      fieldType: FieldTypes.CHOICE,
                      label: LeaseStatisticReportTitles.INVOICE_STATE,
                      options: invoiceStateOptions,
                      required: false,
                    }}
                    name='invoice_state'
                    enableUiDataEdit
                  />
                </Authorization>
              </Column>}
              {reportType === LeaseInvoicingReportTypes.RENT_FORECAST &&
                <Column large={2} medium={3} small={4}>
                  <Authorization allow={isFieldAllowedToEdit(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}>
                    <FormField
                      fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}
                      disableDirty
                      name='start_year'
                      overrideValues={{
                        fieldType: FieldTypes.INTEGER,
                        label: LeaseStatisticReportTitles.START_YEAR,
                      }}
                      enableUiDataEdit
                    />
                  </Authorization>
                </Column>}
              {reportType === LeaseInvoicingReportTypes.RENT_FORECAST &&
                <Column large={2} medium={3} small={4}>
                  <Authorization allow={isFieldAllowedToEdit(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}>
                    <FormField
                      fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.END_DATE)}
                      disableDirty
                      overrideValues={{
                        fieldType: FieldTypes.INTEGER,
                        label: LeaseStatisticReportTitles.END_YEAR,
                      }}
                      name='end_year'
                      enableUiDataEdit
                    />
                  </Authorization>
                </Column>}
              {(reportType !== LeaseInvoicingReportTypes.LEASE_COUNT && reportType !== LeaseInvoicingReportTypes.LEASE_INVOICING_DISABLED) && reportType !== LeaseInvoicingReportTypes.RENT_FORECAST &&
              <Column small={3} style={{margin: '10px 0'}}>
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={isFetchingReportData || !(startDate && endDate && reportType)}
                  text='Luo raportti'
                  onClick={this.getReportData}
                />
              </Column>}
              {(reportType === LeaseInvoicingReportTypes.LEASE_COUNT || reportType === LeaseInvoicingReportTypes.LEASE_INVOICING_DISABLED) &&
              <Column small={3} style={{margin: '10px 0'}}>
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={isFetchingReportData}
                  text='Luo raportti'
                  onClick={this.getReportData}
                />
              </Column>}
              {reportType === LeaseInvoicingReportTypes.RENT_FORECAST && <Column small={3} style={{margin: '10px 0'}}>
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={isSendingMail}
                  text='Lähetä sähköpostiin'
                  onClick={this.sendToMail}
                />
              </Column>}
            </Row>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.LEASE_STATISTIC_REPORT;
const selector = formValueSelector(formName);

export default flowRight(
  withLeaseStatisticReportAttributes,
  connect(
    (state) => {
      return {
        leaseStatisticReportAttributes: getLeaseStatisticReportAttributes(state),
        reportType: selector(state, 'report_type'),
        startDate: selector(state, 'start_date'),
        endDate: selector(state, 'end_date'),
        startYear: selector(state, 'start_year'),
        endYear: selector(state, 'end_year'),
        leaseType: selector(state, 'lease_type'),
        invoiceState: selector(state, 'invoice_state'),
      };
    },
    {
      fetchReportData,
      setReportType,
      sendReportToMail,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(LeaseStatisticReportForm);
