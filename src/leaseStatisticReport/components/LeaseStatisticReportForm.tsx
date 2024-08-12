import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { formValueSelector, destroy, getFormValues, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Button from "components/button/Button";
import { ButtonColors } from "components/enums";
import FormField from "components/form/FormField";
import { FieldTypes, FormNames } from "enums";
import { withLeaseStatisticReportAttributes } from "components/attributes/LeaseStatisticReportAttributes";
import Authorization from "components/authorization/Authorization";
import Loader from "components/loader/Loader";
import LoaderWrapper from "components/loader/LoaderWrapper";
import { getFieldAttributes, isFieldAllowedToEdit } from "util/helpers";
import { LeaseStatisticReportPaths, LeaseStatisticReportTitles } from "leaseStatisticReport/enums";
import { getReportTypeOptions, getReportUrl, getPayload, getFields, getQueryParams, formatType } from "leaseStatisticReport/helpers";
import { fetchReportData, setOptions, sendReportToMail, fetchOptions, setPayload } from "leaseStatisticReport/actions";
import { getAttributes as getLeaseStatisticReportAttributes, getOptions, getIsFetchingOptions } from "leaseStatisticReport/selectors";
import type { Attributes, Reports } from "types";
type Props = {
  leaseStatisticReportAttributes: Attributes;
  reportType: string;
  reports: Reports;
  isFetchingReports: boolean;
  isFetchingReportData: boolean;
  isSendingMail: boolean;
  fetchReportData: (...args: Array<any>) => any;
  setOptions: (...args: Array<any>) => any;
  setPayload: (...args: Array<any>) => any;
  sendReportToMail: (...args: Array<any>) => any;
  fetchOptions: (...args: Array<any>) => any;
  leaseType: string;
  invoiceState: string;
  options: Record<string, any>;
  formValues: Record<string, any>;
  isFetchingOptions: boolean;
  destroy: (...args: Array<any>) => any;
};
type State = {};

class LeaseStatisticReportForm extends PureComponent<Props, State> {
  state = {
    invoices: [],
    invoiceOptions: [],
    lease: {},
    tenantOptions: []
  };
  getReportData = () => {
    const {
      reportType,
      reports,
      formValues,
      fetchReportData,
      setOptions,
      options,
      setPayload
    } = this.props;
    const url = getReportUrl(reports, reportType);
    const query = getQueryParams(formValues);
    const payload = getPayload(query, url, reportType);
    fetchReportData(payload);
    setOptions(options);
    setPayload(payload);
  };
  sendToMail = () => {
    const {
      reportType,
      reports,
      sendReportToMail,
      formValues
    } = this.props;
    const url = getReportUrl(reports, reportType);
    const query = getQueryParams(formValues);
    const payload = getPayload(query, url, reportType);
    sendReportToMail(payload);
  };
  ReportTypeChanged = (value: any) => {
    const {
      reports,
      fetchOptions
    } = this.props;
    const url = getReportUrl(reports, value);
    fetchOptions(url);
    this.resetAllOtherFields();
  };
  resetAllOtherFields = () => {
    const {
      destroy
    } = this.props;
    const formName = FormNames.LEASE_STATISTIC_REPORT;
    destroy(formName);
  };

  render() {
    const {
      leaseStatisticReportAttributes,
      reports,
      isFetchingReports,
      isFetchingReportData,
      isSendingMail,
      options,
      isFetchingOptions
    } = this.props;
    if (isFetchingReports) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;
    const reportTypeOptions = getReportTypeOptions(reports);
    const fields = getFields(options);
    const isAsync = !!(options && options.is_async);
    return <form>
        <Row>
          <Column small={12} large={12}>
            <Row>
              <Column large={3} medium={4} small={6}>
                <Authorization allow={isFieldAllowedToEdit(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}>
                  <FormField fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)} disableDirty name='report_type' overrideValues={{
                  fieldType: FieldTypes.CHOICE,
                  label: LeaseStatisticReportTitles.REPORT_TYPE,
                  options: reportTypeOptions
                }} enableUiDataEdit onChange={this.ReportTypeChanged} />
                </Authorization>
              </Column>
              {isFetchingOptions && <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>}
              {fields && !isFetchingOptions && Object.entries(fields).map(([key, value], index) => {
              return <Column large={3} medium={4} small={6} key={index}>
                    <FormField fieldAttributes={value} overrideValues={{
                  fieldType: formatType(value)
                }} disableDirty name={key} />
                  </Column>;
            })}
              {!isAsync && fields && !isFetchingOptions && <Column small={3} style={{
              margin: '10px 0'
            }}>
                <Button className={ButtonColors.SUCCESS} disabled={isFetchingReportData} text='Luo raportti' onClick={this.getReportData} />
              </Column>}
              {isAsync && <Column small={3} style={{
              margin: '10px 0'
            }}>
                <Button className={ButtonColors.SUCCESS} disabled={isSendingMail} text='Lähetä sähköpostiin' onClick={this.sendToMail} />
              </Column>}
            </Row>
          </Column>
        </Row>
      </form>;
  }

}

const formName = FormNames.LEASE_STATISTIC_REPORT;
const selector = formValueSelector(formName);
export default flowRight(withLeaseStatisticReportAttributes, connect(state => {
  return {
    leaseStatisticReportAttributes: getLeaseStatisticReportAttributes(state),
    reportType: selector(state, 'report_type'),
    options: getOptions(state),
    isFetchingOptions: getIsFetchingOptions(state),
    formValues: getFormValues(formName)(state)
  };
}, {
  fetchReportData,
  setOptions,
  sendReportToMail,
  fetchOptions,
  setPayload,
  destroy
}), reduxForm({
  form: formName
}))(LeaseStatisticReportForm) as React.ComponentType<any>;