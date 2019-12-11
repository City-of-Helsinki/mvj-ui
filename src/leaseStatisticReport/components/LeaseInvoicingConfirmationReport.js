// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import AuthorizationError from '$components/authorization/AuthorizationError';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import FileDownloadButton from '$components/file/FileDownloadButton';
import SortableTable from '$components/table/SortableTable';
import FormText from '$components/form/FormText';
import ExternalLink from '$components/links/ExternalLink';
import ExcelLink from '$components/excel/ExcelLink';
import {
  getApiResponseResults,
  formatDate,
  getReferenceNumberLink,
  hasPermissions,
} from '$util/helpers';
import {
  LeaseInvoicingReportPaths,
  LeaseInvoicingReportTitles,
} from '$src/leaseStatisticReport/enums';
import data from './dummyDataLeaseInvoicingReport';
import {getIsFetchingLeaseInvoicingConfirmationReport, getLeaseInvoicingConfirmationReport} from '$src/leaseStatisticReport/selectors';
import {fetchLeaseInvoicingConfrimationReports} from '$src/leaseStatisticReport/actions';
import type {Attributes} from '$src/types';
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
    const {fetchLeaseInvoicingConfrimationReports} = this.props;

    fetchLeaseInvoicingConfrimationReports({limit: 10000});
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
    const columns = [];

    columns.push({
      key: LeaseInvoicingReportPaths.TYPE,
      text: LeaseInvoicingReportTitles.TYPE,
    });
  
    columns.push({
      key: LeaseInvoicingReportPaths.LEASE_ID,
      text: LeaseInvoicingReportTitles.LEASE_ID,
      renderer: (id) => id 
        ? <ExternalLink href={''} text={id}/>
        : null,
    });

    columns.push({
      key: LeaseInvoicingReportPaths.START_DATE,
      text: LeaseInvoicingReportTitles.START_DATE,
      renderer: (date) => date
        ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
        : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
    });

    columns.push({
      key: LeaseInvoicingReportPaths.END_DATE,
      text: LeaseInvoicingReportTitles.END_DATE,
      renderer: (date) => date
        ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
        : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
    });

    columns.push({
      key: LeaseInvoicingReportPaths.ERROR_MESSAGE,
      text: LeaseInvoicingReportTitles.ERROR_MESSAGE,
      renderer: (error) => error
        ? <FormText className='alert no-margin' style={{whiteSpace: 'nowrap'}}>{error}</FormText> 
        : <FormText className='alert no-margin' style={{whiteSpace: 'nowrap'}}></FormText>,
    });

    return columns;
  }

  render() {
    const {
      isFetchingLeaseInvoicingConfirmationReportAttributes, 
      isFetchingLeaseInvoicingConfirmationReport,
      usersPermissions,
    } = this.props;

    const dev = false;
    const columns = this.getColumns();
    
    if(isFetchingLeaseInvoicingConfirmationReportAttributes || isFetchingLeaseInvoicingConfirmationReport) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    if(!hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASE_INVOICING_CONFIRMATION_REPORT) && dev) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;

    return(
      <Fragment>
        <Row>
          <Column className={''} style={{margin: '0 0 10px 0'}}>
            <FileDownloadButton
              disabled={true}
              label='Luo raportti'
              payload={{
              }}
              url={''} 
            />
          </Column>
          <ExcelLink href={''} text={'VIE EXCELIIN'}/>
        </Row>
        <SortableTable
          columns={columns}
          data={data}
          style={{marginBottom: 10}}
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
      };
    },
    {
      fetchLeaseInvoicingConfrimationReports,
    }
  ),
)(LeaseInvoicingConfirmationReport);
