// @flow
import React, {PureComponent} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AuthorizationError from '$components/authorization/AuthorizationError';
import ErrorIcon from '$components/icons/ErrorIcon';
import GreenBox from '$components/content/GreenBox';
import JobRunLogEntryPanel from './JobRunLogEntryPanel';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import Pagination from '$components/table/Pagination';
import SortableTable from '$components/table/SortableTable';
import SuccessIcon from '$components/icons/SuccessIcon';
import TableAndPanelWrapper from '$components/table/TableAndPanelWrapper';
import {fetchJobRuns} from '$src/batchrun/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {PermissionMissingTexts} from '$src/enums';
import {JobRunFieldPaths, JobRunFieldTitles} from '$src/batchrun/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  formatDate,
  getApiResponseCount,
  getApiResponseMaxPage,
  getApiResponseResults,
  hasPermissions,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getIsFetchingJobRuns, getJobRunAttributes, getJobRuns} from '$src/batchrun/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {withBatchrunJobRunTabAttributes} from '$components/attributes/BatchrunJobRunsTabAttributes';

import type {Attributes} from '$src/types';
import type {JobRuns as JobRunsType} from '$src/batchrun/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  fetchJobRuns: Function,
  isFetchingBatchrunJobRunsTabAttributes: boolean,
  isFetchingJobRuns: boolean,
  jobRunAttributes: Attributes,
  jobRunsData: JobRunsType,
  location: Object,
  usersPermissions: UsersPermissionsType,
}

type State = {
  activePage: number,
  count: number,
  isPanelOpen: boolean,
  jobRunsData: JobRunsType,
  jobRuns: Array<Object>,
  maxPage: number,
  openedRow: ?Object,
}

class JobRuns extends PureComponent<Props, State> {
  state = {
    activePage: 1,
    count: 0,
    isPanelOpen: false,
    jobRunsData: null,
    jobRuns: [],
    maxPage: 1,
    openedRow: null,
  }

  componentDidMount() {
    const {fetchJobRuns} = this.props;

    fetchJobRuns({
      limit: LIST_TABLE_PAGE_SIZE,
    });
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.jobRunsData !== state.jobRunsData) {
      newState.jobRunsData = props.jobRunsData;
      newState.count = getApiResponseCount(props.jobRunsData);
      newState.maxPage = getApiResponseMaxPage(props.jobRunsData, LIST_TABLE_PAGE_SIZE);
      newState.jobRuns = getApiResponseResults(props.jobRunsData);
    }

    return !isEmpty(newState) ? newState : null;
  }

  getColumns = () => {
    const {jobRunAttributes} = this.props;
    const columns = [];

    if(isFieldAllowedToRead(jobRunAttributes, JobRunFieldPaths.EXIT_CODE)) {
      columns.push({
        key: JobRunFieldPaths.EXIT_CODE,
        text: JobRunFieldTitles.EXIT_CODE,
        renderer: (val) => val
          ? <ErrorIcon className='icon-small'/>
          : <SuccessIcon className='icon-small'/>,
        style: {width: 32},
      });
    }

    if(isFieldAllowedToRead(jobRunAttributes, JobRunFieldPaths.STARTED_AT)) {
      columns.push({
        key: JobRunFieldPaths.STARTED_AT,
        text: JobRunFieldTitles.STARTED_AT,
        renderer: (val) => formatDate(val, 'DD.MM.YYYY H:mm:ss'),
      });
    }

    if(isFieldAllowedToRead(jobRunAttributes, JobRunFieldPaths.STOPPED_AT)) {
      columns.push({
        key: JobRunFieldPaths.STOPPED_AT,
        text: JobRunFieldTitles.STOPPED_AT,
        renderer: (val) => formatDate(val, 'DD.MM.YYYY H:mm:ss'),
      });
    }

    if(isFieldAllowedToRead(jobRunAttributes, JobRunFieldPaths.JOB_COMMENT)) {
      columns.push({
        key: JobRunFieldPaths.JOB_COMMENT,
        text: JobRunFieldTitles.JOB_COMMENT,
      });
    }

    return columns;
  }

  handleRowClick = (id: number, row: Object) => {
    this.setState({
      isPanelOpen: true,
      openedRow: row,
    });
  }

  handlePanelClose = () => {
    this.setState({
      isPanelOpen: false,
    });
  }

  handlePanelClosed = () => {
    this.setState({
      openedRow: null,
    });
  }

  handlePageClick = (page: number) => {
    this.setState({activePage: page}, () => {
      const {fetchJobRuns} = this.props;
      const query: any = {limit: LIST_TABLE_PAGE_SIZE};

      if(page > 1) {
        query.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
      }

      fetchJobRuns(query);
    });
  }

  render() {
    const {
      isFetchingBatchrunJobRunsTabAttributes,
      isFetchingJobRuns,
      jobRunsData,
      usersPermissions,
    } = this.props;
    const {
      activePage,
      isPanelOpen,
      jobRuns,
      maxPage,
      openedRow,
    } = this.state;
    const columns = this.getColumns();

    if(isFetchingBatchrunJobRunsTabAttributes || (!jobRunsData && isFetchingJobRuns)) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    if(!hasPermissions(usersPermissions, UsersPermissions.VIEW_JOBRUN)) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;

    return (
      <GreenBox>
        <TableAndPanelWrapper
          hasData={!!jobRuns.length}
          isPanelOpen={isPanelOpen}
          onPanelClosed={this.handlePanelClosed}
          panelComponent={
            <JobRunLogEntryPanel
              onClose={this.handlePanelClose}
              runId={openedRow ? openedRow.id : null}
            />
          }
          tableComponent={
            <SortableTable
              columns={columns}
              data={jobRuns}
              selectedRow={openedRow}
              onRowClick={this.handleRowClick}
            />
          }
        />
        <Pagination
          activePage={activePage}
          maxPage={maxPage}
          onPageClick={(page) => this.handlePageClick(page)}
        />
      </GreenBox>
    );
  }
}

export default flowRight(
  withRouter,
  withBatchrunJobRunTabAttributes,
  connect(
    (state) => {
      return {
        isFetchingJobRuns: getIsFetchingJobRuns(state),
        jobRunAttributes: getJobRunAttributes(state),
        jobRunsData: getJobRuns(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      fetchJobRuns,
    }
  ),
)(JobRuns);
