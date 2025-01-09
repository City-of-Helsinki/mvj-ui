import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import AuditLogTable from "@/components/auditLog/AuditLogTable";
import Divider from "@/components/content/Divider";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import Pagination from "@/components/table/Pagination";
import TableWrapper from "@/components/table/TableWrapper";
import Title from "@/components/content/Title";
import { fetchAuditLogByAreaSearch } from "@/auditLog/actions";
import { LIST_TABLE_PAGE_SIZE } from "@/util/constants";
import {
  AreaSearchFieldPaths,
  AreaSearchFieldTitles,
} from "@/areaSearch/enums";
import {
  getApiResponseCount,
  getApiResponseMaxPage,
  getApiResponseResults,
} from "@/util/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getAuditLogByAreaSearch,
  getIsFetchingByAreaSearch,
} from "@/auditLog/selectors";
import { getIsEditMode } from "@/leases/selectors";
import type { AuditLogList } from "@/auditLog/types";
type Props = {
  auditLogList: AuditLogList;
  fetchAuditLogByAreaSearch: (...args: Array<any>) => any;
  isEditMode: boolean;
  isFetching: boolean;
  areaSearchId: string;
};
type State = {
  activePage: number;
  auditLogItems: Array<Record<string, any>>;
  auditLogList: AuditLogList;
  count: number;
  maxPage: number;
};

class AreaSearchApplicationAuditLog extends PureComponent<Props, State> {
  state = {
    activePage: 1,
    auditLogItems: [],
    auditLogList: {},
    count: 0,
    maxPage: 0,
  };

  componentDidMount() {
    const { fetchAuditLogByAreaSearch, areaSearchId } = this.props;
    fetchAuditLogByAreaSearch({
      id: areaSearchId,
      limit: LIST_TABLE_PAGE_SIZE,
    });
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.auditLogList !== state.auditLogList) {
      newState.auditLogList = props.auditLogList;
      newState.auditLogItems = getApiResponseResults(props.auditLogList);
      newState.count = getApiResponseCount(props.auditLogList);
      newState.maxPage = getApiResponseMaxPage(
        props.auditLogList,
        LIST_TABLE_PAGE_SIZE,
      );
    }

    return !isEmpty(newState) ? newState : null;
  }

  handlePageClick = (page: number) => {
    const { fetchAuditLogByAreaSearch, areaSearchId } = this.props;
    this.setState(
      {
        activePage: page,
      },
      () => {
        const payload: any = {
          id: areaSearchId,
          limit: LIST_TABLE_PAGE_SIZE,
        };

        if (page > 1) {
          payload.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
        }

        fetchAuditLogByAreaSearch(payload);
      },
    );
  };

  render() {
    const { isEditMode, isFetching } = this.props;
    const { activePage, auditLogItems, maxPage } = this.state;
    return (
      <Fragment>
        <Title
          enableUiDataEdit={isEditMode}
          uiDataKey={getUiDataLeaseKey(AreaSearchFieldPaths.AUDIT_LOG)}
        >
          {AreaSearchFieldTitles.AUDIT_LOG}
        </Title>
        <Divider />

        <TableWrapper>
          {isFetching && (
            <LoaderWrapper className="relative-overlay-wrapper">
              <Loader isLoading={isFetching} />
            </LoaderWrapper>
          )}

          <AuditLogTable items={auditLogItems} />
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
      auditLogList: getAuditLogByAreaSearch(state, props.areaSearchId),
      isEditMode: getIsEditMode(state),
      isFetching: getIsFetchingByAreaSearch(state, props.areaSearchId),
    };
  },
  {
    fetchAuditLogByAreaSearch,
  },
)(AreaSearchApplicationAuditLog);
