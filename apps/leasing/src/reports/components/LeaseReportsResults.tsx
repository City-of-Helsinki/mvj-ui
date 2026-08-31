import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/root/hooks";
import { Row, Column } from "@/components/grid/Grid";
import { TableSortOrder } from "@/enums";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import SortableTable from "@/components/table/SortableTable";
import FormText from "@/components/form/FormText";
import ExcelLink from "@/components/excel/ExcelLink";
import {
  getLabelOfOption,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from "@/util/helpers";
import {
  LeaseReportsFieldLabels,
  LeaseReportsFormatOptions,
} from "@/reports/enums";
import {
  getDisplayName,
  getFormattedValue,
  getOutputFields,
  getReportTypeOptions,
} from "@/reports/helpers";
import {
  getPayload,
  getReportData,
  getIsFetchingReportData,
  getReportOptions,
  getReports,
} from "@/reports/selectors";
import type { Reports } from "types";
import type { ReportOptions } from "@/reports/types";

const LeaseReportsResults: React.FC = () => {
  const payload = useAppSelector(getPayload);

  const reportData = useAppSelector(getReportData);
  const isFetchingReportData = useAppSelector(getIsFetchingReportData);
  const reportOptions: ReportOptions = useAppSelector(getReportOptions);
  const reports: Reports = useAppSelector(getReports);

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

          if (field.key === LeaseReportsFieldLabels.SUBVENTION_EUROS_PER_YEAR) {
            decimals = 3;
          }

          if (field.choices && value) {
            outputValue = getDisplayName(field.choices, value);
          } else if (field.format && value) {
            outputValue = getFormattedValue(field.format, value, decimals);
            isBold =
              field.format === LeaseReportsFormatOptions.BOLD ||
              field.format === LeaseReportsFormatOptions.BOLD_MONEY;
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

  const columns = getColumns();
  const reportTypeOptions = getReportTypeOptions(reports);
  const isSortable = !reportOptions.is_already_sorted;
  if (isFetchingReportData)
    return (
      <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>
    );
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

export default LeaseReportsResults;
