import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import CopyToClipboardButton from "@/components/form/CopyToClipboardButton";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import SortableTable from "@/components/table/SortableTable";
import TablePanel from "@/components/table/TablePanel";
import { fetchJobRunLogEntriesByRun } from "@/batchrun/actions";
import {
  JobRunLogEntryFieldPaths,
  JobRunLogEntryFieldTitles,
} from "@/batchrun/enums";
import {
  copyElementContentsToClipboard,
  displayUIMessage,
  formatDate,
  getApiResponseResults,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { TableSortOrder } from "@/enums";
import {
  getIsFetchingJobRunLogEntriesByRun,
  getJobRunLogEntryAttributes,
  getJobRunLogEntriesByRun,
} from "@/batchrun/selectors";
import type { ApiResponse, Attributes } from "types";
type Props = {
  onClose: (...args: Array<any>) => any;
  runId: number | null | undefined;
};

const JobRunLogEntryPanel = (props: Props) => {
  const { onClose, runId } = props;
  const dispatch = useAppDispatch();
  const isFetcingJobLogEntries = useAppSelector((state) =>
    getIsFetchingJobRunLogEntriesByRun(state, runId || 0),
  );
  const jobRunLogEntryAttributes: Attributes = useAppSelector(
    getJobRunLogEntryAttributes,
  );
  const jobRunLogEntriesData: ApiResponse = useAppSelector((state) =>
    getJobRunLogEntriesByRun(state, runId || 0),
  );
  const previousRunIdRef = useRef<number | null | undefined>(runId);

  useEffect(() => {
    if (runId && runId !== previousRunIdRef.current && !jobRunLogEntriesData) {
      dispatch(fetchJobRunLogEntriesByRun(runId));
    }

    previousRunIdRef.current = runId;
  }, [dispatch, jobRunLogEntriesData, runId]);

  const jobRunLogEntries = useMemo(
    () => getApiResponseResults(jobRunLogEntriesData),
    [jobRunLogEntriesData],
  );

  const columns = useMemo(() => {
    const tableColumns = [];

    if (
      isFieldAllowedToRead(
        jobRunLogEntryAttributes,
        JobRunLogEntryFieldPaths.TIME,
      )
    ) {
      tableColumns.push({
        key: JobRunLogEntryFieldPaths.TIME,
        text: JobRunLogEntryFieldTitles.TIME,
        renderer: (val) => formatDate(val, "dd.MM.yyyy H:mm:ss"),
      });
    }

    if (
      isFieldAllowedToRead(
        jobRunLogEntryAttributes,
        JobRunLogEntryFieldPaths.TEXT,
      )
    ) {
      tableColumns.push({
        key: JobRunLogEntryFieldPaths.TEXT,
        text: JobRunLogEntryFieldTitles.TEXT,
      });
    }

    return tableColumns;
  }, [jobRunLogEntryAttributes]);

  const getTableBodyContent = useCallback((): string => {
    let bodyHtml = "";

    jobRunLogEntries.forEach((entry) => {
      bodyHtml += `<tr>
        ${isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TIME) ? `<td>${formatDate(entry.time, "dd.MM.yyyy H:mm:ss") || "-"}</td>` : ""}
        ${isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TEXT) ? `<td>${entry.text || "-"}</td>` : ""}
      </tr>`;
    });

    return bodyHtml;
  }, [jobRunLogEntries, jobRunLogEntryAttributes]);

  const getTableContentForClipboard = useCallback(() => {
    return `<thead>
        <tr>
          ${isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TIME) ? `<th>${JobRunLogEntryFieldTitles.TIME}</th>` : ""}
          ${isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TEXT) ? `<th>${JobRunLogEntryFieldTitles.TEXT}</th>` : ""}
        </tr>
      </thead>
      <tbody>
        ${getTableBodyContent()}
      </tbody>`;
  }, [getTableBodyContent, jobRunLogEntryAttributes]);

  const handleCopyToClipboard = useCallback(() => {
    const tableContent = getTableContentForClipboard();
    const el = document.createElement("table");
    el.className = "sortable-table__clipboard-table";
    el.innerHTML = tableContent;

    if (copyElementContentsToClipboard(el)) {
      displayUIMessage({
        title: "",
        body: "Ajon tiedot on kopioitu leikepöydälle.",
      });
    }
  }, [getTableContentForClipboard]);

  return (
    <TablePanel onClose={onClose}>
      {isFetcingJobLogEntries && (
        <LoaderWrapper>
          <Loader isLoading={true} />
        </LoaderWrapper>
      )}
      {!isFetcingJobLogEntries && (
        <>
          <CopyToClipboardButton
            onClick={handleCopyToClipboard}
            style={{
              position: "absolute",
              right: 28,
              top: 6,
            }}
          />
          <SortableTable
            columns={columns}
            data={jobRunLogEntries}
            sortable
            defaultSortKey={JobRunLogEntryFieldPaths.TIME}
            defaultSortOrder={TableSortOrder.DESCENDING}
          />
        </>
      )}
    </TablePanel>
  );
};

export default JobRunLogEntryPanel;
