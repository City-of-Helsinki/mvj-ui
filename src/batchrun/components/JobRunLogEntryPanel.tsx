import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import CopyToClipboardButton from "components/form/CopyToClipboardButton";
import Loader from "components/loader/Loader";
import LoaderWrapper from "components/loader/LoaderWrapper";
import SortableTable from "components/table/SortableTable";
import TablePanel from "components/table/TablePanel";
import { fetchJobRunLogEntriesByRun } from "batchrun/actions";
import { JobRunLogEntryFieldPaths, JobRunLogEntryFieldTitles } from "batchrun/enums";
import { copyElementContentsToClipboard, displayUIMessage, formatDate, getApiResponseResults, isFieldAllowedToRead } from "util/helpers";
import { TableSortOrder } from "enums";
import { getIsFetchingJobRunLogEntriesByRun, getJobRunLogEntryAttributes, getJobRunLogEntriesByRun } from "batchrun/selectors";
import type { ApiResponse, Attributes } from "types";
type Props = {
  fetchJobRunLogEntriesByRun: (...args: Array<any>) => any;
  isFetcingJobLogEntries: boolean;
  jobRunLogEntryAttributes: Attributes;
  jobRunLogEntriesData: ApiResponse;
  onClose: (...args: Array<any>) => any;
  runId: number | null | undefined;
};
type State = {
  jobRunLogEntriesData: ApiResponse;
  jobRunLogEntries: Array<Record<string, any>>;
};

class JobRunLogEntryPanel extends PureComponent<Props, State> {
  state = {
    jobRunLogEntriesData: null,
    jobRunLogEntries: []
  };

  componentDidUpdate(prevProps: Props) {
    const {
      runId
    } = this.props;

    if (runId && runId !== prevProps.runId) {
      const {
        fetchJobRunLogEntriesByRun,
        jobRunLogEntriesData
      } = this.props;

      if (!jobRunLogEntriesData) {
        fetchJobRunLogEntriesByRun(runId);
      }
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.jobRunLogEntriesData !== state.jobRunLogEntriesData) {
      newState.jobRunLogEntriesData = props.jobRunLogEntriesData;
      newState.jobRunLogEntries = getApiResponseResults(props.jobRunLogEntriesData);
    }

    return !isEmpty(newState) ? newState : null;
  }

  getColumns = () => {
    const {
      jobRunLogEntryAttributes
    } = this.props;
    const columns = [];

    if (isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TIME)) {
      columns.push({
        key: JobRunLogEntryFieldPaths.TIME,
        text: JobRunLogEntryFieldTitles.TIME,
        renderer: val => formatDate(val, 'dd.MM.yyyy H:mm:ss')
      });
    }

    if (isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TEXT)) {
      columns.push({
        key: JobRunLogEntryFieldPaths.TEXT,
        text: JobRunLogEntryFieldTitles.TEXT
      });
    }

    return columns;
  };
  handleCopyToClipboard = () => {
    const tableContent = this.getTableContentForClipboard(),
          el = document.createElement('table');
    el.className = 'sortable-table__clipboard-table';
    el.innerHTML = tableContent;

    if (copyElementContentsToClipboard(el)) {
      displayUIMessage({
        title: '',
        body: 'Ajon tiedot on kopioitu leikepöydälle.'
      });
    }
  };
  getTableContentForClipboard = () => {
    const {
      jobRunLogEntryAttributes
    } = this.props;
    return `<thead>
        <tr>
          ${isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TIME) ? `<th>${JobRunLogEntryFieldTitles.TIME}</th>` : ''}
          ${isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TEXT) ? `<th>${JobRunLogEntryFieldTitles.TEXT}</th>` : ''}
        </tr>
      </thead>
      <tbody>
        ${this.getTableBodyContent()}
      </tbody>`;
  };
  getTableBodyContent = (): string => {
    const {
      jobRunLogEntryAttributes
    } = this.props;
    const {
      jobRunLogEntries
    } = this.state;
    let bodyHtml = '';
    jobRunLogEntries.forEach(entry => {
      bodyHtml += `<tr>
        ${isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TIME) ? `<td>${formatDate(entry.time, 'dd.MM.yyyy H:mm:ss') || '-'}</td>` : ''}
        ${isFieldAllowedToRead(jobRunLogEntryAttributes, JobRunLogEntryFieldPaths.TEXT) ? `<td>${entry.text || '-'}</td>` : ''}
      </tr>`;
    });
    return bodyHtml;
  };

  render() {
    const {
      isFetcingJobLogEntries,
      onClose
    } = this.props;
    const {
      jobRunLogEntries
    } = this.state;
    const columns = this.getColumns();
    return <TablePanel onClose={onClose}>
        {isFetcingJobLogEntries && <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>}
        {!isFetcingJobLogEntries && <Fragment>
            <CopyToClipboardButton onClick={this.handleCopyToClipboard} style={{
          position: 'absolute',
          right: 28,
          top: 6
        }} />
            <SortableTable columns={columns} data={jobRunLogEntries} sortable defaultSortKey={JobRunLogEntryFieldPaths.TIME} defaultSortOrder={TableSortOrder.DESCENDING} />
          </Fragment>}
      </TablePanel>;
  }

}

export default connect((state, props) => {
  return {
    isFetcingJobLogEntries: getIsFetchingJobRunLogEntriesByRun(state, props.runId || 0),
    jobRunLogEntryAttributes: getJobRunLogEntryAttributes(state),
    jobRunLogEntriesData: getJobRunLogEntriesByRun(state, props.runId || 0)
  };
}, {
  fetchJobRunLogEntriesByRun
}, null, {
  forwardRef: true
})(JobRunLogEntryPanel);