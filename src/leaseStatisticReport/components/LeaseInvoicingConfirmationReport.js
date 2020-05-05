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
  formatDate,
  formatNumber,
  hasPermissions,
  getLabelOfOption,
} from '$util/helpers';
import {
  LeaseInvoicingReportPaths,
} from '$src/leaseStatisticReport/enums';
import {
  getOutputFields,
  getInvoiceState,
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
      if(field.key === LeaseInvoicingReportPaths.SUPERVISION_DATE ||
         field.key === LeaseInvoicingReportPaths.START_DATE ||
         field.key === LeaseInvoicingReportPaths.END_DATE || 
         field.key === LeaseInvoicingReportPaths.PAID_DATE || 
         field.key === LeaseInvoicingReportPaths.DUE_DATE || 
         field.key === LeaseInvoicingReportPaths.RETURNED_DATE || 
         field.key === LeaseInvoicingReportPaths.SEND_DATE){
        columns.push({
          key: field.key,
          text: field.label,
          renderer: (date) => date
            ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
            : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
        });
      } else if (field.key === LeaseInvoicingReportPaths.AREA) {
        columns.push({
          key: field.key,
          text: field.label,
          sortable: false,
          renderer: (area) => area
            ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(area)} m²`}</FormText> 
            : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
        });
      } else if(field.key === LeaseInvoicingReportPaths.LEASE_ID){
        columns.push({
          key: field.key,
          text: field.label,
          renderer: (identifier) => identifier
            ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{identifier}</FormText> 
            : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
        });
      } else if(field.key === LeaseInvoicingReportPaths.STATE){
        columns.push({
          key: field.key,
          text: field.label,
          renderer: (state) => state
            ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{getInvoiceState(state)}</FormText> 
            : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
        });
      } else if(field.key === LeaseInvoicingReportPaths.TOTAL_AMOUNT ||
        field.key === LeaseInvoicingReportPaths.BILLED_AMOUNT ||
        field.key === LeaseInvoicingReportPaths.OUTSTANDING_AMOUNT ||
        field.key === LeaseInvoicingReportPaths.RENT ||
        field.key === LeaseInvoicingReportPaths.PAID_AMOUNT) {
        columns.push({
          key: field.key,
          text: field.label,
          sortable: false,
          renderer: (amount) => amount
            ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
            : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
        });
      } else {
        columns.push({
          key: field.key,
          text: field.label,
          sortable: false,
        });
      }
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
    } = this.props;

    const dev = false;
    const columns = this.getColumns();
    const reportTypeOptions = getReportTypeOptions(reports);

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
          sortable={true}
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
