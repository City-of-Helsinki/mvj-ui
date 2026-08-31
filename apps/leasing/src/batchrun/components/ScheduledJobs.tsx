import React, { memo, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { get } from "lodash-es";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import FormText from "@/components/form/FormText";
import GreenBox from "@/components/content/GreenBox";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import SortableTable from "@/components/table/SortableTable";
import {
  fetchScheduledJobAttributes,
  fetchScheduledJobs,
} from "@/batchrun/actions";
import { PermissionMissingTexts } from "@/enums";
import {
  ScheduledJobFieldPaths,
  ScheduledJobFieldTitles,
  ScheduledJobJobFieldPaths,
  ScheduledJobJobFieldTitles,
} from "@/batchrun/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  getApiResponseResults,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getIsFetchingScheduledJobAttributes,
  getIsFetchingScheduledJobs,
  getScheduledJobAttributes,
  getScheduledJobMethods,
  getScheduledJobs,
} from "@/batchrun/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";

const ScheduledJobs: React.FC = () => {
  const dispatch = useAppDispatch();

  const batchrunScheduledJobAttributes = useAppSelector(
    getScheduledJobAttributes,
  );
  const batchrunScheduledJobMethods = useAppSelector(getScheduledJobMethods);
  const isFetchingBatchrunScheduledJobAttributes = useAppSelector(
    getIsFetchingScheduledJobAttributes,
  );

  const isFetchingScheduledJobs = useAppSelector(getIsFetchingScheduledJobs);
  const scheduledJobsData = useAppSelector(getScheduledJobs);
  const usersPermissions = useAppSelector(getUsersPermissions);

  useEffect(() => {
    if (
      !isFetchingBatchrunScheduledJobAttributes &&
      !batchrunScheduledJobAttributes &&
      !batchrunScheduledJobMethods
    ) {
      dispatch(fetchScheduledJobAttributes());
    }
  }, [
    batchrunScheduledJobAttributes,
    batchrunScheduledJobMethods,
    dispatch,
    isFetchingBatchrunScheduledJobAttributes,
  ]);

  useEffect(() => {
    dispatch(
      fetchScheduledJobs({
        limit: 10000,
      }),
    );
  }, [dispatch]);

  const scheduledJobs = useMemo(
    () => getApiResponseResults(scheduledJobsData),
    [scheduledJobsData],
  );

  const columns = useMemo(() => {
    const nextColumns = [];

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobFieldPaths.ID,
      )
    ) {
      nextColumns.push({
        key: ScheduledJobFieldPaths.ID,
        text: ScheduledJobFieldTitles.ID,
      });
    }

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobFieldPaths.ENABLED,
      )
    ) {
      nextColumns.push({
        key: ScheduledJobFieldPaths.ENABLED,
        text: ScheduledJobFieldTitles.ENABLED,
        renderer: (val) =>
          val ? (
            <FormText
              className="success no-margin"
              style={{
                whiteSpace: "nowrap",
              }}
            >
              Käytössä
            </FormText>
          ) : (
            <FormText
              className="alert no-margin"
              style={{
                whiteSpace: "nowrap",
              }}
            >
              Ei käytössä
            </FormText>
          ),
        style: {
          width: 32,
        },
      });
    }

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobFieldPaths.YEARS,
      )
    ) {
      nextColumns.push({
        key: ScheduledJobFieldPaths.YEARS,
        text: ScheduledJobFieldTitles.YEARS,
      });
    }

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobFieldPaths.MONTHS,
      )
    ) {
      nextColumns.push({
        key: ScheduledJobFieldPaths.MONTHS,
        text: ScheduledJobFieldTitles.MONTHS,
      });
    }

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobFieldPaths.DAYS_OF_MONTH,
      )
    ) {
      nextColumns.push({
        key: ScheduledJobFieldPaths.DAYS_OF_MONTH,
        text: ScheduledJobFieldTitles.DAYS_OF_MONTH,
      });
    }

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobFieldPaths.WEEKDAYS,
      )
    ) {
      nextColumns.push({
        key: ScheduledJobFieldPaths.WEEKDAYS,
        text: ScheduledJobFieldTitles.WEEKDAYS,
      });
    }

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobFieldPaths.HOURS,
      )
    ) {
      nextColumns.push({
        key: ScheduledJobFieldPaths.HOURS,
        text: ScheduledJobFieldTitles.HOURS,
      });
    }

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobFieldPaths.MINUTES,
      )
    ) {
      nextColumns.push({
        key: ScheduledJobFieldPaths.MINUTES,
        text: ScheduledJobFieldTitles.MINUTES,
      });
    }

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobJobFieldPaths.NAME,
      )
    ) {
      nextColumns.push({
        key: "job.name",
        text: ScheduledJobJobFieldTitles.NAME,
        renderer: (_val, row) => (
          <abbr title={get(row, "job.comment") || undefined}>
            {get(row, "job.name", "-")}
          </abbr>
        ),
      });
    }

    if (
      isFieldAllowedToRead(
        batchrunScheduledJobAttributes,
        ScheduledJobFieldPaths.COMMENT,
      )
    ) {
      nextColumns.push({
        key: ScheduledJobFieldPaths.COMMENT,
        text: ScheduledJobFieldTitles.COMMENT,
      });
    }

    return nextColumns;
  }, [batchrunScheduledJobAttributes]);

  if (isFetchingBatchrunScheduledJobAttributes || isFetchingScheduledJobs) {
    return (
      <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>
    );
  }

  if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_JOB)) {
    return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
  }

  return (
    <GreenBox>
      <SortableTable
        columns={columns}
        data={scheduledJobs}
        style={{
          marginBottom: 10,
        }}
      />
    </GreenBox>
  );
};

export default memo(ScheduledJobs);
