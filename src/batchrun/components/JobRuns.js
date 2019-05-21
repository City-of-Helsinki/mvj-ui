// @flow
import React, {PureComponent} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import AuthorizationError from '$components/authorization/AuthorizationError';
import ErrorIcon from '$components/icons/ErrorIcon';
import GreenBox from '$components/content/GreenBox';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import RunPanel from './RunPanel';
import SortableTable from '$components/table/SortableTable';
import SuccessIcon from '$components/icons/SuccessIcon';
import TableAndPanelWrapper from '$components/table/TableAndPanelWrapper';
import {fetchBatchRuns} from '$src/batchrun/actions';
import {PermissionMissingTexts} from '$src/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  formatDate,
  getUrlParams,
  hasPermissions,
} from '$util/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {withBatchrunJobRunTabAttributes} from '$components/attributes/BatchrunJobRunsTabAttributes';

import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

const data = [
  {
    id: 1,
    succeeded: false,
    start_time: '2019-04-04T15:16:46.379318+03:00',
    end_time: '2019-04-04T15:16:46.379318+03:00',
    text: 'Lorem ipsum 1',
  },
  {
    id: 2,
    succeeded: false,
    start_time: '2019-04-04T15:16:46.379318+03:00',
    end_time: '2019-04-04T15:16:46.379318+03:00',
    text: 'Lorem ipsum 2',
  },
  {
    id: 3,
    succeeded: true,
    start_time: '2019-04-04T15:16:46.379318+03:00',
    end_time: '2019-04-04T15:16:46.379318+03:00',
    text: 'Lorem ipsum 3',
  },
];

type Props = {
  fetchBatchRuns: Function,
  isFetchingBatchrunJobRunsTabAttributes: boolean,
  location: Object,
  usersPermissions: UsersPermissionsType,
}

type State = {
  isPanelOpen: boolean,
  openedRow: ?Object,
}

class JobRuns extends PureComponent<Props, State> {
  state = {
    isPanelOpen: false,
    openedRow: null,
  }

  componentDidMount() {
    this.search();
  }

  search = () => {
    const {fetchBatchRuns, location: {search}} = this.props;
    const query = getUrlParams(search);

    delete query.tab;

    fetchBatchRuns(query);
  }

  getColumns = () => {
    const columns = [];

    // TODO: Set correct columns when API is ready
    columns.push({
      key: 'succeeded',
      text: '',
      renderer: (val) => val
        ? <SuccessIcon className='icon-small'/>
        : <ErrorIcon className='icon-small'/>,
      style: {width: 32},
    });

    columns.push({
      key: 'start_time',
      text: 'Aloitusaika',
      renderer: (val) => formatDate(val, 'DD.MM.YYYY H:mm:ss'),
    });

    columns.push({
      key: 'end_time',
      text: 'Päättymisaika',
      renderer: (val) => formatDate(val, 'DD.MM.YYYY H:mm:ss'),
    });

    columns.push({
      key: 'text',
      text: 'Työ',
    });

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

  render() {
    const {
      isFetchingBatchrunJobRunsTabAttributes,
      usersPermissions,
    } = this.props;
    const {isPanelOpen, openedRow} = this.state;
    const columns = this.getColumns();

    if(isFetchingBatchrunJobRunsTabAttributes) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    if(!hasPermissions(usersPermissions, UsersPermissions.VIEW_JOBRUN)) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;

    return (
      <GreenBox>
        <TableAndPanelWrapper
          hasData={!!data.length}
          isPanelOpen={isPanelOpen}
          onPanelClosed={this.handlePanelClosed}
          panelComponent={
            <RunPanel
              onClose={this.handlePanelClose}
              runId={openedRow ? openedRow.id : null}
            />
          }
          tableComponent={
            <SortableTable
              columns={columns}
              data={data}
              selectedRow={openedRow}
              fixedHeader={true}
              onRowClick={this.handleRowClick}
            />
          }
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
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      fetchBatchRuns,
    }
  ),
)(JobRuns);
