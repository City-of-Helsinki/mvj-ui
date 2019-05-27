// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SortableTable from '$components/table/SortableTable';
import TablePanel from '$components/table/TablePanel';
import {fetchJobRunLogEntriesByRun} from '$src/batchrun/actions';
import {TableSortOrder} from '$components/enums';
import {JobRunLogEntryFieldPaths, JobRunLogEntryFieldTitles} from '$src/batchrun/enums';
import {formatDate, getApiResponseResults, isFieldAllowedToRead} from '$util/helpers';
import {getIsFetchingJobRunLogEntriesByRun, getJobRunLogEntryAttributes, getJobRunLogEntriesByRun} from '$src/batchrun/selectors';

import type {ApiResponse, Attributes} from '$src/types';

type Props = {
  fetchJobRunLogEntriesByRun: Function,
  isFetcingJobLogEntries: boolean,
  jobRunLogEntryAttributes: Attributes,
  jobRunLogEntriesData: ApiResponse,
  onClose: Function,
  runId: ?number,
}

type State = {
  jobRunLogEntriesData: ApiResponse,
  jobRunLogEntries: Array<Object>,
}

class JobRunLogEntryPanel extends PureComponent<Props, State> {
  state = {
    jobRunLogEntriesData: null,
    jobRunLogEntries: [],
  }

  componentDidUpdate(prevProps: Props) {
    const {runId} = this.props;

    if(runId && runId !== prevProps.runId) {
      const {fetchJobRunLogEntriesByRun, jobRunLogEntriesData} = this.props;

      if(!jobRunLogEntriesData) {
        fetchJobRunLogEntriesByRun(runId);
      }

    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.jobRunLogEntriesData !== state.jobRunLogEntriesData) {
      newState.jobRunLogEntriesData = props.jobRunLogEntriesData;
      newState.jobRunLogEntries = getApiResponseResults(props.jobRunLogEntriesData);
    }

    return !isEmpty(newState) ? newState : null;
  }

  getColumns = () => {
    const {jobRunLogEntryAttributes} = this.props;
    const columns = [];

    if(isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TIME)) {
      columns.push({
        key: JobRunLogEntryFieldPaths.TIME,
        text: JobRunLogEntryFieldTitles.TIME,
        renderer: (val) => formatDate(val, 'DD.MM.YYYY H:mm:ss'),
      });
    }

    if(isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TEXT)) {
      columns.push({
        key: JobRunLogEntryFieldPaths.TEXT,
        text: JobRunLogEntryFieldTitles.TEXT,
      });
    }

    return columns;
  }

  render() {
    const {isFetcingJobLogEntries, onClose} = this.props;
    const {jobRunLogEntries} = this.state;
    const columns = this.getColumns();

    return (
      <TablePanel onClose={onClose}>
        {isFetcingJobLogEntries && <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>}
        {!isFetcingJobLogEntries &&
          <SortableTable
            columns={columns}
            data={jobRunLogEntries}
            sortable
            defaultSortKey={JobRunLogEntryFieldPaths.TIME}
            defaultSortOrder={TableSortOrder.DESCENDING}
          />
        }
      </TablePanel>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      isFetcingJobLogEntries: getIsFetchingJobRunLogEntriesByRun(state, props.runId || 0),
      jobRunLogEntryAttributes: getJobRunLogEntryAttributes(state),
      jobRunLogEntriesData: getJobRunLogEntriesByRun(state, props.runId || 0),
    };
  },
  {
    fetchJobRunLogEntriesByRun,
  },
  null,
  {forwardRef: true},
)(JobRunLogEntryPanel);
