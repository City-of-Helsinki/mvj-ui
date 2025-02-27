import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { TableSortOrder } from "@/enums";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import SortableTable from "@/components/table/SortableTable";
import FormText from "@/components/form/FormText";
import ExcelLink from "@/components/excel/ExcelLink";
import {
  getApiResponseResults,
  hasPermissions,
  getLabelOfOption,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from "@/util/helpers";
import { LeaseStatisticReportFormatOptions } from "@/leaseStatisticReport/enums";
import {
  getDisplayName,
  getFormattedValue,
  getOutputFields,
  getReportTypeOptions,
} from "@/leaseStatisticReport/helpers";
import {
  getIsFetchingLeaseInvoicingConfirmationReport,
  getLeaseInvoicingConfirmationReport,
  getPayload,
} from "@/leaseStatisticReport/selectors";
import type { Attributes, Reports } from "types";
import type { LeaseInvoicingConfirmationReport as LeaseInvoicingConfirmationReportsType } from "@/leaseStatisticReport/types";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { UsersPermissions } from "@/usersPermissions/enums";
import { PermissionMissingTexts } from "@/enums";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import { withLeaseInvoicingConfirmationReportAttributes } from "@/components/attributes/LeaseInvoicingConfirmationReportAttributes";
import type { ReportOptions } from "@/leaseStatisticReport/types";
import { Link } from "hds-react";
import { getRouteById } from "@/root/routes";
type Props = {
  isFetchingLeaseInvoicingConfirmationReportAttributes: boolean;
  leaseInvoicingConfirmationReportAttributes: Attributes;
  fetchLeaseInvoicingConfrimationReports: (...args: Array<any>) => any;
  isFetchingLeaseInvoicingConfirmationReport: boolean;
  leaseInvoicingConfirmationReportData: LeaseInvoicingConfirmationReportsType;
  usersPermissions: UsersPermissionsType;
  isFetchingReportData: boolean;
  reportData: any;
  reportOptions: ReportOptions;
  payload: Record<string, any>;
  reports: Reports;
};

type State = {
  leaseInvoicingConfirmationReport: Array<Record<string, any>>;
  leaseInvoicingConfirmationReportData: LeaseInvoicingConfirmationReportsType;
};

const renderLeaseIdentifier = (id: number, identifier: string) => {
  if (id && identifier) {
    return (
      <Link
        href={`${getRouteById("leases")}/${id}`}
        openInNewTab
        style={{ border: "unset", margin: "unset" }}
      >
        {identifier}
      </Link>
    );
  } else if (!id && identifier) {
    return identifier;
  }
  return "-";
};

class LeaseInvoicingConfirmationReport extends PureComponent<Props, State> {
  state = {
    leaseInvoicingConfirmationReport: [],
    leaseInvoicingConfirmationReportData: null,
  };

  componentDidMount() {}

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (
      props.leaseInvoicingConfirmationReportData !==
      state.leaseInvoicingConfirmationReportData
    ) {
      newState.leaseInvoicingConfirmationReportData =
        props.leaseInvoicingConfirmationReportData;
      newState.leaseInvoicingConfirmationReport = getApiResponseResults(
        props.leaseInvoicingConfirmationReportData,
      );
    }

    return !isEmpty(newState) ? newState : null;
  }

  getColumns = () => {
    const { reportOptions } = this.props;
    const columns = [];
    const outputFields = getOutputFields(reportOptions);
    outputFields.map((field) => {
      columns.push({
        key: field.key,
        text: field.label,
        renderer: (value: any) => {
          let isBold = false;
          let outputValue = value || "-";

          if (field.key == "lease_identifier") {
            const { id, identifier } = value;
            outputValue = renderLeaseIdentifier(id, identifier);
          }

          if (field.choices && value) {
            outputValue = getDisplayName(field.choices, value);
          } else if (field.format && value) {
            outputValue = getFormattedValue(field.format, value);
            isBold =
              field.format === LeaseStatisticReportFormatOptions.BOLD ||
              field.format === LeaseStatisticReportFormatOptions.BOLD_MONEY;
          }

          return (
            <FormText
              className="no-margin"
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {isBold ? <strong>{outputValue}</strong> : outputValue}
            </FormText>
          );
        },
        ascSortFunction: field.isNumeric
          ? sortNumberByKeyAsc
          : sortStringByKeyAsc,
        descSortFunction: field.isNumeric
          ? sortNumberByKeyDesc
          : sortStringByKeyDesc,
      });
    });
    return columns;
  };

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
    if (isFetchingReportData)
      return (
        <LoaderWrapper>
          <Loader isLoading={true} />
        </LoaderWrapper>
      );
    if (
      !hasPermissions(
        usersPermissions,
        UsersPermissions.VIEW_LEASE_INVOICING_CONFIRMATION_REPORT,
      ) &&
      dev
    )
      return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
    return (
      <Fragment>
        <Row>
          <Column
            className={""}
            style={{
              margin: "0 0 10px 0",
            }}
          ></Column>
          {payload && (
            <ExcelLink
              fileName="Raportti"
              identifier={getLabelOfOption(
                reportTypeOptions,
                payload.report_type,
              )}
              url={payload.url}
              query={payload.query}
              label="VIE EXCELIIN"
            />
          )}
        </Row>
        <SortableTable
          columns={columns}
          data={reportData}
          style={{
            marginBottom: 10,
          }}
          defaultSortKey="lease_id"
          defaultSortOrder={TableSortOrder.ASCENDING}
          sortable={isSortable}
        />
      </Fragment>
    );
  }
}

export default flowRight(
  withLeaseInvoicingConfirmationReportAttributes,
  connect((state) => {
    return {
      isFetchingLeaseInvoicingConfirmationReport:
        getIsFetchingLeaseInvoicingConfirmationReport(state),
      leaseInvoicingConfirmationReportData:
        getLeaseInvoicingConfirmationReport(state),
      usersPermissions: getUsersPermissions(state),
      payload: getPayload(state),
    };
  }),
)(LeaseInvoicingConfirmationReport) as React.ComponentType<any>;
