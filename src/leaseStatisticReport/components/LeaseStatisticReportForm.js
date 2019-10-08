// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import createUrl from '$src/api/createUrl';
import FileDownloadButton from '$components/file/FileDownloadButton';
import FormField from '$components/form/FormField';
import {FieldTypes, FormNames} from '$src/enums';
/* import {
  getFieldAttributes,
} from '$util/helpers'; */
import {
  // LeaseStatisticReportPaths,
  LeaseStatisticReportTitles,
} from '$src/leaseStatisticReport/enums';
/* import {
  getAttributes as getLeaseStatisticReportAttributes,
} from '$src/leaseStatisticReport/selectors'; */
import type {Attributes} from '$src/types';

type Props = {
  leaseStatisticReportAttributes: Attributes,
  valid: boolean,
  startDate: string,
  endDate: string,
  leaseState: string,
  onlyActiveLeases: boolean,
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

  render() {
    const {
      // leaseStatisticReportAttributes,
      valid,
      startDate,
      endDate,
      leaseState,
      onlyActiveLeases,
    } = this.props;

    const options = [{value: 1, label: 'one'}, {value: 2, label: 'two'}];
    // console.log(leaseStatisticReportAttributes);

    return(
      <form>
        <Row>
          <Column small={12} large={12}>
            <Row>
              <Column small={12} medium={1}>
                <FormField
                  // fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.START_DATE)}
                  fieldAttributes={{
                    label: 'Lease',
                    read_only: false,
                    required: true,
                    type: 'field',
                  }}
                  disableDirty
                  name='start_date'
                  overrideValues={{
                    fieldType: FieldTypes.DATE,
                    label: LeaseStatisticReportTitles.START_DATE,
                  }}
                  enableUiDataEdit
                />
              </Column>
              <Column small={12} medium={1}>
                <FormField
                  // fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.END_DATE)}
                  fieldAttributes={{
                    label: 'Lease',
                    read_only: false,
                    required: true,
                    type: 'field',
                  }}
                  disableDirty
                  overrideValues={{
                    fieldType: FieldTypes.DATE,
                    label: LeaseStatisticReportTitles.END_DATE,
                  }}
                  name='end_date'
                  enableUiDataEdit
                />
              </Column>
              <Column small={12} medium={2}>
                <FormField
                  // fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.LEASE_STATE)}
                  fieldAttributes={{
                    label: 'Lease',
                    read_only: false,
                    required: true,
                    type: 'field',
                  }}
                  disableDirty
                  overrideValues={{
                    fieldType: FieldTypes.CHOICE,
                    label: LeaseStatisticReportTitles.LEASE_STATE,
                    options: options,
                  }}
                  name='lease_state'
                  enableUiDataEdit
                />
              </Column>
              <Column small={12} medium={2}>
                <FormField
                  // fieldAttributes={getFieldAttributes(leaseStatisticReportAttributes, LeaseStatisticReportPaths.ONLY_ACTIVE_LEASES)}
                  fieldAttributes={{
                    label: 'Lease',
                    read_only: false,
                    required: true,
                    type: 'field',
                  }}
                  disableDirty
                  overrideValues={{
                    fieldType: FieldTypes.CHOICE,
                    label: LeaseStatisticReportTitles.ONLY_ACTIVE_LEASES,
                    options: options,
                  }}
                  name='only_active_leases'
                  enableUiDataEdit
                />
              </Column>
              <Column small={3} style={{margin: '10px 0'}}>
                <FileDownloadButton
                  disabled={false} // !valid
                  label='Luo raportti'
                  payload={{
                    start_date: startDate,
                    end_date: endDate,
                    lease_state: leaseState,
                    only_active_leases: onlyActiveLeases,
                  }}
                  url={createUrl(`lease_statistic_report/`)} 
                  // /v1/lease_statistic_report?start_date=2010-01-01&end_date=2011-01-01&state=lease&only_active_leases=true
                />
              </Column>
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
  connect(
    (state) => {
      return {
        // leaseStatisticReportAttributes: getLeaseStatisticReportAttributes(state),
        startDate: selector(state, 'start_date'),
        endDate: selector(state, 'end_date'),
        leaseState: selector(state, 'lease_state'),
        onlyActiveLeases: selector(state, 'only_active_leases'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(LeaseStatisticReportForm);
