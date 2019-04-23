//@flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import AuditLogTable from '$components/auditLog/AuditLogTable';
import Divider from '$components/content/Divider';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import Pagination from '$components/table/Pagination';
import TableWrapper from '$components/table/TableWrapper';
import Title from '$components/content/Title';
import {fetchAuditLogByLease} from '$src/auditLog/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {
  LeaseFieldPaths,
  LeaseFieldTitles,
} from '$src/leases/enums';
import {getAuditLogCount, getAuditLogItems, getAuditLogMaxPage} from '$src/auditLog/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getAuditLogByLease, getIsFetchingByLease} from '$src/auditLog/selectors';
import {getIsEditMode} from '$src/leases/selectors';

import type {AuditLogList} from '$src/auditLog/types';

type Props = {
  auditLogList: AuditLogList,
  fetchAuditLogByLease: Function,
  isEditMode: boolean,
  isFetching: boolean,
  leaseId: string,
}

type State = {
  activePage: number,
  auditLogItems: Array<Object>,
  auditLogList: AuditLogList,
  count: number,
  maxPage: number,
}

class LeaseAuditLog extends PureComponent<Props, State> {
  state = {
    activePage: 1,
    auditLogItems: [],
    auditLogList: {},
    count: 0,
    maxPage: 0,
  }
  componentDidMount() {
    const {fetchAuditLogByLease, leaseId} = this.props;

    fetchAuditLogByLease({
      id: leaseId,
      limit: LIST_TABLE_PAGE_SIZE,
    });
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.auditLogList !== state.auditLogList) {
      newState.auditLogList = props.auditLogList;
      newState.auditLogItems = getAuditLogItems(props.auditLogList);
      newState.count = getAuditLogCount(props.auditLogList);
      newState.maxPage = getAuditLogMaxPage(props.auditLogList, LIST_TABLE_PAGE_SIZE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  handlePageClick = (page: number) => {
    const {fetchAuditLogByLease, leaseId} = this.props;

    this.setState({activePage: page}, () => {
      const payload: any = {
        id: leaseId,
        limit: LIST_TABLE_PAGE_SIZE,
      };

      if(page > 1) {
        payload.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
      }

      fetchAuditLogByLease(payload);
    });
  }

  render() {
    const {isEditMode, isFetching} = this.props;
    const {activePage, auditLogItems, maxPage} = this.state;

    return(
      <Fragment>
        <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.AUDIT_LOG)}>
          {LeaseFieldTitles.AUDIT_LOG}
        </Title>
        <Divider />

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }

          <AuditLogTable
            items={auditLogItems}
          />
          <Pagination
            activePage={activePage}
            maxPage={maxPage}
            onPageClick={this.handlePageClick}
          />
        </TableWrapper>
      </Fragment>
    );
  }
}

export default connect(
  (state, props: Props) => {
    return {
      auditLogList: getAuditLogByLease(state, props.leaseId),
      isEditMode: getIsEditMode(state),
      isFetching: getIsFetchingByLease(state, props.leaseId),
    };
  },
  {
    fetchAuditLogByLease,
  }
)(LeaseAuditLog);
