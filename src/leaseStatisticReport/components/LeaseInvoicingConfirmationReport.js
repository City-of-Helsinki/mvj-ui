// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
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
} from '$util/helpers';
import {
  LeaseInvoicingReportPaths,
  LeaseInvoicingReportTitles,
  LeaseInvoicingReportTypes,
} from '$src/leaseStatisticReport/enums';
import {
  getInvoiceState,
} from '$src/leaseStatisticReport/helpers';
import {getIsFetchingLeaseInvoicingConfirmationReport, getLeaseInvoicingConfirmationReport} from '$src/leaseStatisticReport/selectors';
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
  reportType: Object,
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
    const {reportType} = this.props;

    const columns = [];

    if(reportType.report_type === LeaseInvoicingReportTypes.LEASE_INVOICING_DISABLED){
      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_ID,
        text: LeaseInvoicingReportTitles.LEASE_ID,
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
    }
    else if(reportType.report_type === LeaseInvoicingReportTypes.EXTRA_CITY_RENT){
      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_ID,
        text: LeaseInvoicingReportTitles.LEASE_ID,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.TENANT_NAME,
        text: LeaseInvoicingReportTitles.TENANT_NAME,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.AREA_IDENTIFIER,
        text: LeaseInvoicingReportTitles.AREA_IDENTIFIER,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.AREA,
        text: LeaseInvoicingReportTitles.AREA_SQUARE,
        renderer: (area) => area
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(area)} m²`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.AREA_ADDRESS,
        text: LeaseInvoicingReportTitles.AREA_ADDRESS,
      }); 
      columns.push({
        key: LeaseInvoicingReportPaths.RENT,
        text: LeaseInvoicingReportTitles.RENT,
        renderer: (amount) => amount
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      }); 
    } else if(reportType.report_type === LeaseInvoicingReportTypes.MONEY_COLLETERALS){
      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_ID,
        text: LeaseInvoicingReportTitles.LEASE_ID,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.TOTAL_AMOUNT,
        text: LeaseInvoicingReportTitles.TOTAL_AMOUNT,
        renderer: (amount) => amount
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.PAID_DATE,
        text: LeaseInvoicingReportTitles.PAID_DATE,
        renderer: (date) => date
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.RETURNED_DATE,
        text: LeaseInvoicingReportTitles.RETURNED_DATE,
        renderer: (date) => date
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.NOTE,
        text: LeaseInvoicingReportTitles.NOTE,
      }); 
    } else if(reportType.report_type === LeaseInvoicingReportTypes.OPEN_INVOICES){
      columns.push({
        key: LeaseInvoicingReportPaths.NUMBER,
        text: LeaseInvoicingReportTitles.NUMBER,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_TYPE,
        text: LeaseInvoicingReportTitles.LEASE_TYPE,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_ID,
        text: LeaseInvoicingReportTitles.LEASE_ID,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.DUE_DATE,
        text: LeaseInvoicingReportTitles.DUE_DATE,
        renderer: (date) => date
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });

      columns.push({
        key: LeaseInvoicingReportPaths.TOTAL_AMOUNT,
        text: LeaseInvoicingReportTitles.TOTAL_AMOUNT,
        renderer: (amount) => amount
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      }); 

      columns.push({
        key: LeaseInvoicingReportPaths.BILLED_AMOUNT,
        text: LeaseInvoicingReportTitles.BILLED_AMOUNT,
        renderer: (amount) => amount
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      }); 

      columns.push({
        key: LeaseInvoicingReportPaths.OUTSTANDING_AMOUNT,
        text: LeaseInvoicingReportTitles.OUTSTANDING_AMOUNT,
        renderer: (amount) => amount
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      }); 

      columns.push({
        key: LeaseInvoicingReportPaths.RECIPIENT_NAME,
        text: LeaseInvoicingReportTitles.RECIPIENT_NAME,
      }); 

      columns.push({
        key: LeaseInvoicingReportPaths.RECIPIENT_ADDRESS,
        text: LeaseInvoicingReportTitles.RECIPIENT_ADDRESS,
      }); 
    } else if(reportType.report_type === LeaseInvoicingReportTypes.INVOICE_PAYMENTS){
      columns.push({
        key: LeaseInvoicingReportPaths.INVOICE_NUMBER,
        text: LeaseInvoicingReportTitles.INVOICE_NUMBER,
      }); 

      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_ID,
        text: LeaseInvoicingReportTitles.LEASE_ID,
      }); 

      columns.push({
        key: LeaseInvoicingReportPaths.PAID_DATE,
        text: LeaseInvoicingReportTitles.PAID_DATE,
        renderer: (date) => date
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      }); 

      columns.push({
        key: LeaseInvoicingReportPaths.PAID_AMOUNT,
        text: LeaseInvoicingReportTitles.PAID_AMOUNT,
        renderer: (amount) => amount
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      }); 

      columns.push({
        key: LeaseInvoicingReportPaths.FILLING_CODE,
        text: LeaseInvoicingReportTitles.FILLING_CODE,
      }); 
    } else if(reportType.report_type === LeaseInvoicingReportTypes.LEASE_COUNT){
      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_TYPE,
        text: LeaseInvoicingReportTitles.LEASE_TYPE,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.COUNT,
        text: LeaseInvoicingReportTitles.COUNT,
      });
    } else if(reportType.report_type === LeaseInvoicingReportTypes.INVOICES_IN_PERIOD){
      columns.push({
        key: LeaseInvoicingReportPaths.NUMBER,
        text: LeaseInvoicingReportTitles.NUMBER,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_TYPE,
        text: LeaseInvoicingReportTitles.LEASE_TYPE,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_ID,
        text: LeaseInvoicingReportTitles.LEASE_ID,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.STATE,
        text: LeaseInvoicingReportTitles.STATE,
        renderer: (state) => state
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{getInvoiceState(state)}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.DUE_DATE,
        text: LeaseInvoicingReportTitles.DUE_DATE,
        renderer: (date) => date
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.TOTAL_AMOUNT,
        text: LeaseInvoicingReportTitles.TOTAL_AMOUNT,
        renderer: (amount) => amount
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.BILLED_AMOUNT,
        text: LeaseInvoicingReportTitles.BILLED_AMOUNT,
        renderer: (amount) => amount
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.OUTSTANDING_AMOUNT,
        text: LeaseInvoicingReportTitles.OUTSTANDING_AMOUNT,
        renderer: (amount) => amount
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{`${formatNumber(amount)} €`}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.RECIPIENT_NAME,
        text: LeaseInvoicingReportTitles.RECIPIENT_NAME,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.RECIPIENT_ADDRESS,
        text: LeaseInvoicingReportTitles.RECIPIENT_ADDRESS,
      });
    } else if (reportType.report_type === LeaseInvoicingReportTypes.LASKE_INVOICE_COUNT){
      columns.push({
        key: LeaseInvoicingReportPaths.SEND_DATE,
        text: LeaseInvoicingReportTitles.SEND_DATE,
        renderer: (date) => date
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.INVOICE_COUNT,
        text: LeaseInvoicingReportTitles.INVOICE_COUNT,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.IS_ESTIMATE,
        text: LeaseInvoicingReportTitles.IS_ESTIMATE,
      });
    } else {
      columns.push({
        key: LeaseInvoicingReportPaths.LEASE_ID,
        text: LeaseInvoicingReportTitles.LEASE_ID,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.AREA,
        text: LeaseInvoicingReportTitles.AREA,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.ADDRESS,
        text: LeaseInvoicingReportTitles.ADDRESS,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.TYPE,
        text: LeaseInvoicingReportTitles.TYPE,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.SUPERVISION_DATE,
        text: LeaseInvoicingReportTitles.SUPERVISION_DATE,
        renderer: (date) => date
          ? <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>{formatDate(date, 'dd.MM.yyyy')}</FormText> 
          : <FormText className='no-margin' style={{whiteSpace: 'nowrap'}}>-</FormText>,
      });
  
      columns.push({
        key: LeaseInvoicingReportPaths.DESCRIPTION,
        text: LeaseInvoicingReportTitles.DESCRIPTION,
      });
    }
    
    return columns;
  }

  render() {
    const {
      usersPermissions,
      isFetchingReportData,
      reportData,
      reportType,
    } = this.props;

    const dev = false;
    const columns = this.getColumns();

    if(isFetchingReportData) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    if(!hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASE_INVOICING_CONFIRMATION_REPORT) && dev) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;

    return(
      <Fragment>
        <Row>
          <Column className={''} style={{margin: '0 0 10px 0'}}>
          </Column>
          <ExcelLink href={`${reportType.url}?${reportType.query}&format=xlsx`} text={'VIE EXCELIIN'}/>
        </Row>
        <SortableTable
          columns={columns}
          data={reportData}
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
  ),
)(LeaseInvoicingConfirmationReport);
