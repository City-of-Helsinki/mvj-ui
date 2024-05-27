import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import AuthorizationError from "src/components/authorization/AuthorizationError";
import FormText from "src/components/form/FormText";
import GreenBox from "src/components/content/GreenBox";
import Loader from "src/components/loader/Loader";
import LoaderWrapper from "src/components/loader/LoaderWrapper";
import SortableTable from "src/components/table/SortableTable";
import { fetchScheduledJobs } from "src/batchrun/actions";
import { PermissionMissingTexts } from "src/enums";
import { ScheduledJobFieldPaths, ScheduledJobFieldTitles, ScheduledJobJobFieldPaths, ScheduledJobJobFieldTitles } from "src/batchrun/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { getApiResponseResults, hasPermissions, isFieldAllowedToRead } from "src/util/helpers";
import { getIsFetchingScheduledJobs, getScheduledJobs } from "src/batchrun/selectors";
import { getUsersPermissions } from "src/usersPermissions/selectors";
import { withBatchrunScheduledJobTabAttributes } from "src/components/attributes/BatchrunScheduledJobsTabAttributes";
import type { Attributes } from "src/types";
import type { ScheduledJobs as ScheduledJobsType } from "src/batchrun/types";
import type { UsersPermissions as UsersPermissionsType } from "src/usersPermissions/types";
type Props = {
  batchrunScheduledJobAttributes: Attributes;
  fetchScheduledJobs: (...args: Array<any>) => any;
  isFetchingBatchrunScheduledJobAttributes: boolean;
  isFetchingScheduledJobs: boolean;
  scheduledJobsData: ScheduledJobsType;
  usersPermissions: UsersPermissionsType;
};
type State = {
  scheduledJobs: Array<Record<string, any>>;
  scheduledJobsData: ScheduledJobsType;
};

class ScheduledJobs extends PureComponent<Props, State> {
  state = {
    scheduledJobs: [],
    scheduledJobsData: null
  };

  componentDidMount() {
    const {
      fetchScheduledJobs
    } = this.props;
    fetchScheduledJobs({
      limit: 10000
    });
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.scheduledJobsData !== state.scheduledJobsData) {
      newState.scheduledJobsData = props.scheduledJobsData;
      newState.scheduledJobs = getApiResponseResults(props.scheduledJobsData);
    }

    return !isEmpty(newState) ? newState : null;
  }

  getColumns = () => {
    const {
      batchrunScheduledJobAttributes
    } = this.props;
    const columns = [];

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobFieldPaths.ID)) {
      columns.push({
        key: ScheduledJobFieldPaths.ID,
        text: ScheduledJobFieldTitles.ID
      });
    }

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobFieldPaths.ENABLED)) {
      columns.push({
        key: ScheduledJobFieldPaths.ENABLED,
        text: ScheduledJobFieldTitles.ENABLED,
        renderer: val => val ? <FormText className='success no-margin' style={{
          whiteSpace: 'nowrap'
        }}>Käytössä</FormText> : <FormText className='alert no-margin' style={{
          whiteSpace: 'nowrap'
        }}>Ei käytössä</FormText>,
        style: {
          width: 32
        }
      });
    }

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobFieldPaths.YEARS)) {
      columns.push({
        key: ScheduledJobFieldPaths.YEARS,
        text: ScheduledJobFieldTitles.YEARS
      });
    }

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobFieldPaths.MONTHS)) {
      columns.push({
        key: ScheduledJobFieldPaths.MONTHS,
        text: ScheduledJobFieldTitles.MONTHS
      });
    }

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobFieldPaths.DAYS_OF_MONTH)) {
      columns.push({
        key: ScheduledJobFieldPaths.DAYS_OF_MONTH,
        text: ScheduledJobFieldTitles.DAYS_OF_MONTH
      });
    }

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobFieldPaths.WEEKDAYS)) {
      columns.push({
        key: ScheduledJobFieldPaths.WEEKDAYS,
        text: ScheduledJobFieldTitles.WEEKDAYS
      });
    }

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobFieldPaths.HOURS)) {
      columns.push({
        key: ScheduledJobFieldPaths.HOURS,
        text: ScheduledJobFieldTitles.HOURS
      });
    }

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobFieldPaths.MINUTES)) {
      columns.push({
        key: ScheduledJobFieldPaths.MINUTES,
        text: ScheduledJobFieldTitles.MINUTES
      });
    }

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobJobFieldPaths.NAME)) {
      columns.push({
        key: 'job.name',
        text: ScheduledJobJobFieldTitles.NAME,
        renderer: (val, row) => <abbr title={get(row, 'job.comment') || undefined}>{get(row, 'job.name', '-')}</abbr>
      });
    }

    if (isFieldAllowedToRead(batchrunScheduledJobAttributes, ScheduledJobFieldPaths.COMMENT)) {
      columns.push({
        key: ScheduledJobFieldPaths.COMMENT,
        text: ScheduledJobFieldTitles.COMMENT
      });
    }

    return columns;
  };

  render() {
    const {
      isFetchingBatchrunScheduledJobAttributes,
      isFetchingScheduledJobs,
      usersPermissions
    } = this.props;
    const {
      scheduledJobs
    } = this.state;
    const columns = this.getColumns();
    if (isFetchingBatchrunScheduledJobAttributes || isFetchingScheduledJobs) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;
    if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_JOB)) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
    return <GreenBox>
        <SortableTable columns={columns} data={scheduledJobs} style={{
        marginBottom: 10
      }} />
      </GreenBox>;
  }

}

export default flowRight(withBatchrunScheduledJobTabAttributes, connect(state => {
  return {
    isFetchingScheduledJobs: getIsFetchingScheduledJobs(state),
    scheduledJobsData: getScheduledJobs(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  fetchScheduledJobs
}))(ScheduledJobs) as React.ComponentType<any>;