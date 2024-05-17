import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import AuditLogTable from "src/components/auditLog/AuditLogTable";
import Divider from "src/components/content/Divider";
import Loader from "src/components/loader/Loader";
import LoaderWrapper from "src/components/loader/LoaderWrapper";
import Pagination from "src/components/table/Pagination";
import TableWrapper from "src/components/table/TableWrapper";
import Title from "src/components/content/Title";
import { fetchAuditLogByLease } from "src/auditLog/actions";
import { LIST_TABLE_PAGE_SIZE } from "src/constants";
import { LeaseFieldPaths, LeaseFieldTitles } from "src/leases/enums";
import { getApiResponseCount, getApiResponseMaxPage, getApiResponseResults } from "src/util/helpers";
import { getUiDataLeaseKey } from "src/uiData/helpers";
import { getAuditLogByLease, getIsFetchingByLease } from "src/auditLog/selectors";
import { getIsEditMode } from "src/leases/selectors";
import type { AuditLogList } from "src/auditLog/types";
type Props = {
  auditLogList: AuditLogList;
  fetchAuditLogByLease: (...args: Array<any>) => any;
  isEditMode: boolean;
  isFetching: boolean;
  leaseId: string;
};
type State = {
  activePage: number;
  auditLogItems: Array<Record<string, any>>;
  auditLogList: AuditLogList;
  count: number;
  maxPage: number;
};

class LeaseAuditLog extends PureComponent<Props, State> {
  state = {
    activePage: 1,
    auditLogItems: [],
    auditLogList: {},
    count: 0,
    maxPage: 0
  };

  componentDidMount() {
    const {
      fetchAuditLogByLease,
      leaseId
    } = this.props;
    fetchAuditLogByLease({
      id: leaseId,
      limit: LIST_TABLE_PAGE_SIZE
    });
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if (props.auditLogList !== state.auditLogList) {
      newState.auditLogList = props.auditLogList;
      newState.auditLogItems = getApiResponseResults(props.auditLogList);
      newState.count = getApiResponseCount(props.auditLogList);
      newState.maxPage = getApiResponseMaxPage(props.auditLogList, LIST_TABLE_PAGE_SIZE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  handlePageClick = (page: number) => {
    const {
      fetchAuditLogByLease,
      leaseId
    } = this.props;
    this.setState({
      activePage: page
    }, () => {
      const payload: any = {
        id: leaseId,
        limit: LIST_TABLE_PAGE_SIZE
      };

      if (page > 1) {
        payload.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
      }

      fetchAuditLogByLease(payload);
    });
  };

  render() {
    const {
      isEditMode,
      isFetching
    } = this.props;
    const {
      activePage,
      auditLogItems,
      maxPage
    } = this.state;
    return <Fragment>
        <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.AUDIT_LOG)}>
          {LeaseFieldTitles.AUDIT_LOG}
        </Title>
        <Divider />

        <TableWrapper>
          {isFetching && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>}

          <AuditLogTable items={auditLogItems} />
          <Pagination activePage={activePage} maxPage={maxPage} onPageClick={this.handlePageClick} />
        </TableWrapper>
      </Fragment>;
  }

}

export default connect((state, props: Props) => {
  return {
    auditLogList: getAuditLogByLease(state, props.leaseId),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetchingByLease(state, props.leaseId)
  };
}, {
  fetchAuditLogByLease
})(LeaseAuditLog);