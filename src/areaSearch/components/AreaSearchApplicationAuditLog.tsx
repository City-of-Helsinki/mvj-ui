import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import AuditLogTable from "components/auditLog/AuditLogTable";
import Divider from "components/content/Divider";
import Loader from "components/loader/Loader";
import LoaderWrapper from "components/loader/LoaderWrapper";
import Pagination from "components/table/Pagination";
import TableWrapper from "components/table/TableWrapper";
import Title from "components/content/Title";
import { fetchAuditLogByAreaSearch } from "auditLog/actions";
import { LIST_TABLE_PAGE_SIZE } from "util/constants";
import { AreaSearchFieldPaths, AreaSearchFieldTitles } from "areaSearch/enums";
import { getApiResponseCount, getApiResponseMaxPage, getApiResponseResults } from "util/helpers";
import { getUiDataLeaseKey } from "uiData/helpers";
import { getAuditLogByAreaSearch, getIsFetchingByAreaSearch } from "auditLog/selectors";
import { getIsEditMode } from "leases/selectors";
import type { AuditLogList } from "auditLog/types";
type Props = {
  auditLogList: AuditLogList;
  fetchAuditLogByAreaSearch: (...args: Array<any>) => any;
  isEditMode: boolean;
  isFetching: boolean;
  areaSearchId: string;
};

const AreaSearchApplicationAuditLog = ({
  isEditMode,
  isFetching,
  fetchAuditLogByAreaSearch,
  areaSearchId,
  auditLogList
}: Props) => {
  const [activePage, setActivePage] = useState(1);
  const [auditLogItems, setAuditLogItems] = useState([]);
  const [maxPage, setMaxPage] = useState(0);

  const handlePageClick = (page: number) => {
    setActivePage(page);
    
    const payload: any = {
      id: areaSearchId,
      limit: LIST_TABLE_PAGE_SIZE,
    };
  
    if (page > 1) {
      payload.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }
  
    fetchAuditLogByAreaSearch(payload);
  };

  useEffect(() => {
    setAuditLogItems(getApiResponseResults(auditLogList))
    setMaxPage(getApiResponseMaxPage(auditLogList, LIST_TABLE_PAGE_SIZE))

    fetchAuditLogByAreaSearch({
      id: areaSearchId,
      limit: LIST_TABLE_PAGE_SIZE,
    });
  }, []);

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
          {isFetching && <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>}

        <AuditLogTable items={auditLogItems} />
          <Pagination activePage={activePage} maxPage={maxPage} onPageClick={handlePageClick} />
      </TableWrapper>
    </Fragment>
  );
};

export default connect((state, props: Props) => {
  return {
    auditLogList: getAuditLogByAreaSearch(state, props.areaSearchId),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetchingByAreaSearch(state, props.areaSearchId)
  };
}, {
  fetchAuditLogByAreaSearch
})(AreaSearchApplicationAuditLog);