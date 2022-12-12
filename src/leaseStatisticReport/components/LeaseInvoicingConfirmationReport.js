// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {TableSortOrder} from '$src/enums';
import AuthorizationError from '$components/authorization/AuthorizationError';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SortableTable from '$components/table/SortableTable';
import FormText from '$components/form/FormText';
import ExcelLink from '$components/excel/ExcelLink';
import {
  getApiResponseResults,
  hasPermissions,
  getLabelOfOption,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from '$util/helpers';
import {
  LeaseStatisticReportFormatOptions,
} from '$src/leaseStatisticReport/enums';
import {
  getDisplayName,
  getFormattedValue,
  getOutputFields,
  getReportTypeOptions,
} from '$src/leaseStatisticReport/helpers';
import {getIsFetchingLeaseInvoicingConfirmationReport, getLeaseInvoicingConfirmationReport, getPayload} from '$src/leaseStatisticReport/selectors';
import type {Attributes, Reports} from '$src/types';
import type {LeaseInvoicingConfirmationReport as LeaseInvoicingConfirmationReportsType} from '$src/leaseStatisticReport/types';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {PermissionMissingTexts} from '$src/enums';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {withLeaseInvoicingConfirmationReportAttributes} from '$components/attributes/LeaseInvoicingConfirmationReportAttributes';

type Props = {
  isFetchingLeaseInvoicingConfirmationReportAttributes: boolean,
  leaseInvoicingConfirmationReportAttributes: Attributes,
  fetchLeaseInvoicingConfrimationReports: Function,
  isFetchingLeaseInvoicingConfirmationReport: boolean,
  leaseInvoicingConfirmationReportData: LeaseInvoicingConfirmationReportsType,
  usersPermissions: UsersPermissionsType,
  isFetchingReportData: boolean,
  reportData: Object,
  reportOptions: Object,
  payload: Object,
  reports: Reports,
}

type State = {
  leaseInvoicingConfirmationReport: Array<Object>,
  leaseInvoicingConfirmationReportData: LeaseInvoicingConfirmationReportsType,
}

class LeaseInvoicingConfirmationReport extends PureComponent<Props, State> {
  state = {
    leaseInvoicingConfirmationReport: [],
    leaseInvoicingConfirmationReportData: null,
  };

  componentDidMount() {

  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseInvoicingConfirmationReportData !== state.leaseInvoicingConfirmationReportData) {
      newState.leaseInvoicingConfirmationReportData = props.leaseInvoicingConfirmationReportData;
      newState.leaseInvoicingConfirmationReport = getApiResponseResults(props.leaseInvoicingConfirmationReportData);
    }

    return !isEmpty(newState) ? newState : null;
  }

  getColumns = () => {
    const {reportOptions} = this.props;

    const columns = [];
    const outputFields = getOutputFields(reportOptions);

    outputFields.map(field => {
      columns.push({
        key: field.key,
        text: field.label,
        renderer: (value) => {
          let isBold = false;
          let outputValue = value || '-';

          if (field.choices && value) {
            outputValue = getDisplayName(field.choices, value);
          } else if (field.format && value) {
            outputValue = getFormattedValue(field.format, value);
            isBold = field.format === LeaseStatisticReportFormatOptions.BOLD || field.format === LeaseStatisticReportFormatOptions.BOLD_MONEY;
          }

          return (
            <FormText className='no-margin' style={{ whiteSpace: 'nowrap' }}>
              {isBold ? <strong>{outputValue}</strong> : outputValue}
            </FormText>
          );
        },
        ascSortFunction: field.isNumeric ? sortNumberByKeyAsc : sortStringByKeyAsc,
        descSortFunction: field.isNumeric ? sortNumberByKeyDesc : sortStringByKeyDesc,
      });
    });

    return columns;
  }

  render() {
    const {
      usersPermissions,
      isFetchingReportData,
      reportData,
      payload,
      reports,
      reportOptions,
    } = this.props;

    const dev = false;
    const columns = this.getColumns();
    const reportTypeOptions = getReportTypeOptions(reports);
    const isSortable = !reportOptions.is_already_sorted;

    if(isFetchingReportData) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    if(!hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASE_INVOICING_CONFIRMATION_REPORT) && dev) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
    return(
      <Fragment>
        <Row>
          <Column className={''} style={{margin: '0 0 10px 0'}}>
          </Column>
          {payload && <ExcelLink
            fileName='Raportti'
            identifier={getLabelOfOption(reportTypeOptions, payload.report_type)}
            url={payload.url}
            query={payload.query}
            label='VIE EXCELIIN'
          />}
        </Row>
        <SortableTable
          columns={columns}
          data={reportData}
          style={{marginBottom: 10}}
          defaultSortKey='lease_id'
          defaultSortOrder={TableSortOrder.ASCENDING}
          sortable={isSortable}
        />
      </Fragment>
    );
  }
}

export default flowRight(
  withLeaseInvoicingConfirmationReportAttributes,
  connect(
    (state) => {
      return {
        isFetchingLeaseInvoicingConfirmationReport: getIsFetchingLeaseInvoicingConfirmationReport(state),
        leaseInvoicingConfirmationReportData: getLeaseInvoicingConfirmationReport(state),
        usersPermissions: getUsersPermissions(state),
        payload: getPayload(state),
      };
    },
  ),
)(LeaseInvoicingConfirmationReport);
