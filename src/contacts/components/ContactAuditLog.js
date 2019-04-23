//@flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import AuditLogTable from '$components/auditLog/AuditLogTable';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import Pagination from '$components/table/Pagination';
import TableWrapper from '$components/table/TableWrapper';
import {fetchAuditLogByContact} from '$src/auditLog/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {getAuditLogCount, getAuditLogItems, getAuditLogMaxPage} from '$src/auditLog/helpers';
import {getAuditLogByContact, getIsFetchingByContact} from '$src/auditLog/selectors';

import type {AuditLogList} from '$src/auditLog/types';

type Props = {
  auditLogList: AuditLogList,
  contactId: string,
  fetchAuditLogByContact: Function,
  isFetching: boolean,
}

type State = {
  activePage: number,
  auditLogItems: Array<Object>,
  auditLogList: AuditLogList,
  count: number,
  maxPage: number,
}

class ContactAuditLog extends PureComponent<Props, State> {
  state = {
    activePage: 1,
    auditLogItems: [],
    auditLogList: {},
    count: 0,
    maxPage: 0,
  }
  componentDidMount() {
    const {fetchAuditLogByContact, contactId} = this.props;

    fetchAuditLogByContact({
      id: contactId,
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
    const {fetchAuditLogByContact, contactId} = this.props;

    this.setState({activePage: page}, () => {
      const payload: any = {
        id: contactId,
        limit: LIST_TABLE_PAGE_SIZE,
      };

      if(page > 1) {
        payload.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
      }

      fetchAuditLogByContact(payload);
    });
  }

  render() {
    const {isFetching} = this.props;
    const {activePage, auditLogItems, maxPage} = this.state;

    return(
      <Fragment>
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
      auditLogList: getAuditLogByContact(state, props.contactId),
      isFetching: getIsFetchingByContact(state, props.contactId),
    };
  },
  {
    fetchAuditLogByContact,
  }
)(ContactAuditLog);
