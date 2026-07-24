import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import { TableSortOrder } from "@/enums";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import SortableTable from "@/components/table/SortableTable";
import FormText from "@/components/form/FormText";
import ExcelLink from "@/components/excel/ExcelLink";
import {
  hasPermissions,
  getLabelOfOption,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from "@/util/helpers";
import {
  LeaseStatisticReportFieldLabels,
  LeaseStatisticReportFormatOptions,
} from "@/leaseStatisticReport/enums";
import {
  getDisplayName,
  getFormattedValue,
  getOutputFields,
  getReportTypeOptions,
} from "@/leaseStatisticReport/helpers";
import {
  getLeaseInvoicingConfirmationReport,
  getPayload,
  getReportData,
  getIsFetchingReportData,
  getReportOptions,
  getReports,
} from "@/leaseStatisticReport/selectors";
import type { Reports } from "types";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { UsersPermissions } from "@/usersPermissions/enums";
import { PermissionMissingTexts } from "@/enums";
import type { ReportOptions } from "@/leaseStatisticReport/types";

const LeaseInvoicingConfirmationReport: React.FC = () => {
  const leaseInvoicingConfirmationReportData = useSelector(
    getLeaseInvoicingConfirmationReport,
  );
  const usersPermissions = useSelector(getUsersPermissions);
  const payload = useSelector(getPayload);

  const reportData = useSelector(getReportData);
  const isFetchingReportData = useSelector(getIsFetchingReportData);
  const reportOptions: ReportOptions = useSelector(getReportOptions);
  const reports: Reports = useSelector(getReports);

  const [
    leaseInvoicingConfirmationReportDataState,
    setLeaseInvoicingConfirmationReportDataState,
  ] = useState(null);

  useEffect(() => {
    if (
      leaseInvoicingConfirmationReportData !==
      leaseInvoicingConfirmationReportDataState
    ) {
      setLeaseInvoicingConfirmationReportDataState(
        leaseInvoicingConfirmationReportData,
      );
    }
  }, [
    leaseInvoicingConfirmationReportData,
    leaseInvoicingConfirmationReportDataState,
  ]);

  const getColumns = () => {
    const columns = [];
    const outputFields = getOutputFields(reportOptions);
    outputFields.forEach((field) => {
      columns.push({
        key: field.key,
        text: field.label,
        renderer: (value: any) => {
          let isBold = false;
          let outputValue = value || "-";
          let decimals: number | null | undefined;

          if (
            field.key ===
            LeaseStatisticReportFieldLabels.SUBVENTION_EUROS_PER_YEAR
          ) {
            decimals = 3;
          }

          if (field.choices && value) {
            outputValue = getDisplayName(field.choices, value);
          } else if (field.format && value) {
            outputValue = getFormattedValue(field.format, value, decimals);
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

  const dev = false;
  const columns = getColumns();
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
    <>
      <Row>
        <Column
          className={""}
          style={{
            margin: "0 0 10px 0",
          }}
        >
          <></>
        </Column>
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
    </>
  );
};

export default LeaseInvoicingConfirmationReport;
