import React, { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ErrorIcon from "@/components/icons/ErrorIcon";
import GreenBox from "@/components/content/GreenBox";
import JobRunLogEntryPanel from "./JobRunLogEntryPanel";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import Pagination from "@/components/table/Pagination";
import SortableTable from "@/components/table/SortableTable";
import SuccessIcon from "@/components/icons/SuccessIcon";
import TableAndPanelWrapper from "@/components/table/TableAndPanelWrapper";
import {
  fetchJobRunAttributes,
  fetchJobRunLogEntryAttributes,
  fetchJobRuns,
} from "@/batchrun/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import { PermissionMissingTexts } from "@/enums";
import {
  JobRunFieldPaths,
  JobRunFieldTitles,
  JobRunJobFieldPaths,
  JobRunJobFieldTitles,
} from "@/batchrun/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  formatDate,
  getApiResponseMaxPage,
  getApiResponseResults,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getIsFetchingJobRunAttributes,
  getIsFetchingJobRunLogEntryAttributes,
  getIsFetchingJobRuns,
  getJobRunAttributes,
  getJobRunLogEntryAttributes,
  getJobRunLogEntryMethods,
  getJobRunMethods,
  getJobRuns,
} from "@/batchrun/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { JobRuns as JobRunsType } from "@/batchrun/types";

const JobRuns: React.FC = () => {
  const dispatch = useDispatch();
  const [activePage, setActivePage] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [openedRow, setOpenedRow] = useState<Record<string, any> | null>(null);

  const isFetchingBatchrunJobRunAttributes = useSelector(
    getIsFetchingJobRunAttributes,
  );
  const isFetchingBatchrunJobRunLogEntryAttributes = useSelector(
    getIsFetchingJobRunLogEntryAttributes,
  );
  const batchrunJobRunAttributes = useSelector(getJobRunAttributes);
  const batchrunJobRunMethods = useSelector(getJobRunMethods);
  const batchrunJobRunLogEntryAttributes = useSelector(
    getJobRunLogEntryAttributes,
  );
  const batchrunJobRunLogEntryMethods = useSelector(getJobRunLogEntryMethods);

  const isFetchingJobRuns = useSelector(getIsFetchingJobRuns);
  const jobRunAttributes: Attributes = useSelector(getJobRunAttributes);
  const jobRunsData: JobRunsType = useSelector(getJobRuns);
  const usersPermissions = useSelector(getUsersPermissions);

  const isFetchingBatchrunJobRunsTabAttributes =
    isFetchingBatchrunJobRunAttributes ||
    isFetchingBatchrunJobRunLogEntryAttributes;

  useEffect(() => {
    if (
      !isFetchingBatchrunJobRunAttributes &&
      !batchrunJobRunAttributes &&
      !batchrunJobRunMethods
    ) {
      dispatch(fetchJobRunAttributes());
    }

    if (
      !isFetchingBatchrunJobRunLogEntryAttributes &&
      !batchrunJobRunLogEntryAttributes &&
      !batchrunJobRunLogEntryMethods
    ) {
      dispatch(fetchJobRunLogEntryAttributes());
    }
  }, [
    batchrunJobRunAttributes,
    batchrunJobRunLogEntryAttributes,
    batchrunJobRunLogEntryMethods,
    batchrunJobRunMethods,
    dispatch,
    isFetchingBatchrunJobRunAttributes,
    isFetchingBatchrunJobRunLogEntryAttributes,
  ]);

  useEffect(() => {
    dispatch(
      fetchJobRuns({
        limit: LIST_TABLE_PAGE_SIZE,
      }),
    );
  }, [dispatch]);

  const jobRuns = useMemo(
    () => getApiResponseResults(jobRunsData),
    [jobRunsData],
  );
  const maxPage = useMemo(
    () => getApiResponseMaxPage(jobRunsData, LIST_TABLE_PAGE_SIZE),
    [jobRunsData],
  );

  const columns = useMemo(() => {
    const tableColumns = [];

    if (isFieldAllowedToRead(jobRunAttributes, JobRunFieldPaths.EXIT_CODE)) {
      tableColumns.push({
        key: JobRunFieldPaths.EXIT_CODE,
        text: JobRunFieldTitles.EXIT_CODE,
        renderer: (val) =>
          val ? (
            <ErrorIcon className="icon-small" />
          ) : (
            <SuccessIcon className="icon-small" />
          ),
        style: {
          width: 32,
        },
      });
    }

    if (isFieldAllowedToRead(jobRunAttributes, JobRunFieldPaths.STARTED_AT)) {
      tableColumns.push({
        key: JobRunFieldPaths.STARTED_AT,
        text: JobRunFieldTitles.STARTED_AT,
        renderer: (val) => formatDate(val, "dd.MM.yyyy H:mm:ss"),
      });
    }

    if (isFieldAllowedToRead(jobRunAttributes, JobRunFieldPaths.STOPPED_AT)) {
      tableColumns.push({
        key: JobRunFieldPaths.STOPPED_AT,
        text: JobRunFieldTitles.STOPPED_AT,
        renderer: (val) => formatDate(val, "dd.MM.yyyy H:mm:ss"),
      });
    }

    if (isFieldAllowedToRead(jobRunAttributes, JobRunJobFieldPaths.NAME)) {
      tableColumns.push({
        key: "job.name",
        text: JobRunJobFieldTitles.NAME,
      });
    }

    if (isFieldAllowedToRead(jobRunAttributes, JobRunJobFieldPaths.COMMENT)) {
      tableColumns.push({
        key: "job.comment",
        text: JobRunJobFieldTitles.COMMENT,
      });
    }

    return tableColumns;
  }, [jobRunAttributes]);

  const handleRowClick = (_id: number, row: Record<string, any>) => {
    setIsPanelOpen(true);
    setOpenedRow(row);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
  };

  const handlePanelClosed = () => {
    setOpenedRow(null);
  };

  const handlePageClick = (page: number) => {
    setActivePage(page);
    const query: any = {
      limit: LIST_TABLE_PAGE_SIZE,
    };

    if (page > 1) {
      query.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    dispatch(fetchJobRuns(query));
  };

  if (
    isFetchingBatchrunJobRunsTabAttributes ||
    (!jobRunsData && isFetchingJobRuns)
  ) {
    return (
      <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>
    );
  }

  if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_JOBRUN)) {
    return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
  }

  return (
    <GreenBox>
      <TableAndPanelWrapper
        hasData={!!jobRuns.length}
        isPanelOpen={isPanelOpen}
        onPanelClosed={handlePanelClosed}
        panelComponent={
          <JobRunLogEntryPanel
            onClose={handlePanelClose}
            runId={openedRow ? openedRow.id : null}
          />
        }
        tableComponent={
          <SortableTable
            columns={columns}
            data={jobRuns}
            selectedRow={openedRow}
            onRowClick={handleRowClick}
          />
        }
      />
      <Pagination
        activePage={activePage}
        maxPage={maxPage}
        onPageClick={(page) => handlePageClick(page)}
      />
    </GreenBox>
  );
};

export default memo(JobRuns);
