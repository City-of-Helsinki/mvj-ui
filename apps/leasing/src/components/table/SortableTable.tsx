import React, { Component } from "react";
import debounce from "lodash/debounce";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import classNames from "classnames";
import SortableTableHeader from "./SortableTableHeader";
import SortableTableGroup from "./SortableTableGroup";
import SortableTableRow from "./SortableTableRow";
import { sortStringByKeyAsc, sortStringByKeyDesc } from "@/util/helpers";
import { TableSortOrder } from "@/enums";

export type Column = {
  arrayRenderer?: (...args: Array<any>) => any;
  dataClassName?: string;
  defaultSortOrder?: string;
  disabled?: boolean;
  grouping?: {
    key: string;
    columnKeys: Array<string>;
    columnsToHide?: Array<string>;
    options: Array<Record<string, any>>;
  };
  key: string;
  minWidth?: number;
  renderer?: (...args: Array<any>) => any;
  sortable?: boolean;
  style?: Record<string, any>;
  text: React.ReactNode;
};
type Props = {
  columns: Array<Column>;
  data: Array<any>;
  defaultSortKey?: string;
  defaultSortOrder?: string;
  fixedHeader?: boolean;
  listTable?: boolean;
  maxHeight?: number | null | undefined;
  noDataText?: string;
  onDataUpdate?: (...args: Array<any>) => any;
  onRowClick?: (...args: Array<any>) => any;
  onSelectNext?: (...args: Array<any>) => any;
  onSelectPrevious?: (...args: Array<any>) => any;
  onSortingChange?: (...args: Array<any>) => any;
  selectedRow?: Record<string, any> | null;
  serverSideSorting?: boolean;
  showCollapseArrowColumn?: boolean;
  sortKey?: string;
  sortOrder?: string;
  sortable?: boolean;
  style?: Record<string, any>;
  className?: string;
  footer?: (arg0: { columnCount: number }) => JSX.Element;
  invoiceToCredit?: any;
  onSelectRow?: any;
};
type State = {
  collapse?: boolean;
  columns: Array<Column>;
  data: Array<Record<string, any>>;
  scrollHeaderColumnStyles: Array<Record<string, any>>;
  scrollHeaderWidth: number;
  sortedData: Array<Record<string, any>>;
  sortKey: string | null | undefined;
  sortOrder: string | null | undefined;
  theadStyle?: any;
};

const groupData = (data: Array<Record<string, any>>, column: Column) => {
  if (!column.grouping) {
    return data;
  }

  const groups = [],
    groupedData = [],
    groupOptions = get(column, "grouping.options", []),
    groupKey = get(column, "grouping.key");
  data.forEach((row) => {
    if (row[groupKey]) {
      const index = groups.findIndex((group) => group.id === row[groupKey]);

      if (index !== -1) {
        groups[index].tableRows.push(row);
      } else {
        const group = groupOptions.find((group) => group.id === row[groupKey]);

        if (group) {
          groups.push({
            isTableGroup: true,
            tableGroupName: groupKey,
            ...group,
            tableRows: [row],
          });
        } else {
          groupedData.push(row);
        }
      }
    } else {
      groupedData.push(row);
    }
  });
  return [...groups, ...groupedData];
};

const sortData = (
  data: Array<Props>,
  columns: Array<any>,
  sortKey: string | null | undefined,
  sortOrder: string | null | undefined,
) => {
  if (!data || !data.length) {
    return [];
  }

  const column = columns.find((column) => column.key === sortKey);

  if (!column || !sortKey || !sortOrder) {
    return data;
  }

  const groupedData = groupData(data, column),
    groupKey = get(column, "grouping.key");
  const sortedData = [...groupedData];

  switch (sortOrder) {
    case TableSortOrder.ASCENDING:
      if (
        column.descSortFunction &&
        typeof column.ascSortFunction == "function"
      ) {
        sortedData.sort((a, b) => column.ascSortFunction(a, b, sortKey));
      } else {
        sortedData.sort((a, b) => sortStringByKeyAsc(a, b, sortKey));
      }

      // Sort also groued data
      if (groupKey) {
        sortedData.forEach((item) => {
          if (item.isTableGroup) {
            if (
              column.ascSortFunction &&
              typeof column.ascSortFunction == "function"
            ) {
              item.tableRows.sort((a, b) =>
                column.ascSortFunction(a, b, sortKey),
              );
            } else {
              item.tableRows.sort((a, b) => sortStringByKeyAsc(a, b, sortKey));
            }
          }
        });
      }

      break;

    case TableSortOrder.DESCENDING:
      if (
        column.descSortFunction &&
        typeof column.descSortFunction == "function"
      ) {
        sortedData.sort((a, b) => column.descSortFunction(a, b, sortKey));
      } else {
        sortedData.sort((a, b) => sortStringByKeyDesc(a, b, sortKey));
      }

      // Sort also groued data
      if (groupKey) {
        sortedData.forEach((item) => {
          if (item.isTableGroup) {
            if (
              column.descSortFunction &&
              typeof column.descSortFunction == "function"
            ) {
              item.tableRows.sort((a, b) =>
                column.descSortFunction(a, b, sortKey),
              );
            } else {
              item.tableRows.sort((a, b) => sortStringByKeyDesc(a, b, sortKey));
            }
          }
        });
      }

      break;
  }

  return sortedData;
};

class SortableTable extends Component<Props, State> {
  container: any;
  scrollBodyTable: any;
  scrollBodyWrapper: any;
  scrollHeaderWrapper: any;
  thead: any;
  _isMounted: boolean;
  state: State = {
    collapse: true,
    columns: [],
    data: [],
    scrollHeaderColumnStyles: [],
    scrollHeaderWidth: 0,
    sortedData: [],
    sortKey: this.props.defaultSortKey || null,
    sortOrder: this.props.defaultSortOrder || TableSortOrder.DESCENDING,
    theadStyle: {},
  };
  static defaultProps: Partial<Props> = {
    fixedHeader: false,
    noDataText: "Ei tuloksia",
    sortable: false,
  };
  setContainerRef: (arg0: any) => void = (el) => {
    this.container = el;
  };
  setScrollBodyTableRef: (arg0: any) => void = (el) => {
    this.scrollBodyTable = el;
  };
  setScrollBodyWrapperRef: (arg0: any) => void = (el) => {
    this.scrollBodyWrapper = el;
  };
  setScrollHeaderWrapperRef: (arg0: any) => void = (el) => {
    this.scrollHeaderWrapper = el;
  };
  setTheadRef: (arg0: any) => void = (el) => {
    this.thead = el;
  };

  static getDerivedStateFromProps(
    props: Props,
    state: State,
  ): Partial<State> | null {
    const newState: any = {};

    if (props.data !== state.data || props.columns !== state.columns) {
      newState.data = props.data;
      newState.columns = props.columns;
      newState.sortedData =
        props.sortable && !props.serverSideSorting
          ? sortData(props.data, props.columns, state.sortKey, state.sortOrder)
          : props.data;
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidMount() {
    const { fixedHeader } = this.props;

    if (fixedHeader) {
      this.scrollBodyWrapper.addEventListener(
        "scroll",
        this.updateHeaderPosition,
      );
      this.scrollHeaderWrapper.addEventListener(
        "scroll",
        this.updateBodyPosition,
      );
      this.setTableScrollHeaderColumnStyles();
    }

    this._isMounted = true;
  }

  componentWillUnmount() {
    const { fixedHeader } = this.props;

    if (fixedHeader) {
      this.scrollBodyWrapper.removeEventListener(
        "scroll",
        this.updateHeaderPosition,
      );
      this.scrollHeaderWrapper.removeEventListener(
        "scroll",
        this.updateBodyPosition,
      );
    }

    this._isMounted = false;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { fixedHeader } = this.props;

    if (
      fixedHeader &&
      (prevProps.columns !== this.props.columns ||
        prevProps.data !== this.props.data)
    ) {
      this.setTableScrollHeaderColumnStyles();
    }

    if (prevState.sortedData !== this.state.sortedData) {
      const { onDataUpdate } = this.props;

      if (onDataUpdate) {
        onDataUpdate();
      }
    }
  }

  updateHeaderPosition: () => void = debounce(() => {
    const scrollLeft = this.scrollBodyWrapper.scrollLeft;
    this.scrollHeaderWrapper.scrollLeft = scrollLeft;
  }, 1);
  updateBodyPosition: () => void = () => {
    const scrollLeft = this.scrollHeaderWrapper.scrollLeft;
    this.scrollBodyWrapper.scrollLeft = scrollLeft;
  };
  setTableScrollHeaderColumnStyles: () => void = () => {
    if (!this._isMounted) {
      return;
    }

    const ths = Array.from(this.thead.querySelectorAll("th"));
    const scrollHeaderColumnStyles = ths.map((th) => {
      // @ts-expect-error ts(2339)
      const rect = th.getBoundingClientRect();
      return {
        width: rect.width || null,
      };
    });
    const scrollHeaderWidth = scrollHeaderColumnStyles.reduce((sum, cur) => {
      return sum + cur.width;
    }, 0);
    const scrollBarWidth =
      this.scrollBodyWrapper.offsetWidth - this.scrollBodyWrapper.clientWidth;

    if (scrollBarWidth) {
      const index = scrollHeaderColumnStyles.length - 1;
      scrollHeaderColumnStyles[index].width =
        scrollHeaderColumnStyles[index].width + scrollBarWidth;
    }

    this.setState({
      scrollHeaderColumnStyles: scrollHeaderColumnStyles,
      scrollHeaderWidth: scrollHeaderWidth
        ? scrollHeaderWidth + scrollBarWidth + 1
        : 0,
    });
  };
  onSortingChange: (arg0: Column) => void = (column) => {
    const { columns, data, onSortingChange, serverSideSorting } = this.props;
    const sortKey = serverSideSorting ? this.props.sortKey : this.state.sortKey;
    const sortOrder = serverSideSorting
      ? this.props.sortOrder
      : this.state.sortOrder;
    let newSortKey = sortKey,
      newSortOrder = TableSortOrder.DESCENDING;

    if (sortKey === column.key) {
      newSortOrder =
        sortOrder === TableSortOrder.DESCENDING
          ? TableSortOrder.ASCENDING
          : TableSortOrder.DESCENDING;
    } else {
      newSortKey = column.key;
      newSortOrder = column.defaultSortOrder || TableSortOrder.DESCENDING;
    }

    if (serverSideSorting) {
      if (onSortingChange) {
        onSortingChange({
          sortKey: newSortKey,
          sortOrder: newSortOrder,
        });
      } else {
        console.error("Sorting table: onSortingChange function is missing");
      }
    } else {
      this.setState({
        sortedData: sortData(data, columns, newSortKey, newSortOrder),
        sortKey: newSortKey,
        sortOrder: newSortOrder,
      });
    }
  };
  selectNext: () => void = () => {
    const { onSelectNext, selectedRow } = this.props;

    if (!selectedRow || !onSelectNext) {
      return;
    }

    const sortedRows = this.getRowsFromSortedData(),
      index = sortedRows.findIndex((row) => row.id === selectedRow.id);

    if (index < sortedRows.length - 1) {
      onSelectNext(sortedRows[index + 1]);
    }
  };
  selectPrevious: () => void = () => {
    const { onSelectPrevious, selectedRow } = this.props;

    if (!selectedRow || !onSelectPrevious) {
      return;
    }

    const sortedRows = this.getRowsFromSortedData(),
      index = sortedRows.findIndex((row) => row.id === selectedRow.id);

    if (index > 0) {
      onSelectPrevious(sortedRows[index - 1]);
    }
  };
  getRowsFromSortedData: () => Array<Record<string, any>> = () => {
    const { sortedData } = this.state;
    let rows = [];
    sortedData.forEach((row) => {
      if (row.tableGroupName) {
        rows = [...rows, ...row.tableRows];
      } else {
        rows.push(row);
      }
    });
    return rows;
  };
  calculateMaxHeight: () => number | null | undefined = () => {
    const { fixedHeader, maxHeight } = this.props;

    if (!maxHeight || !fixedHeader || !this.scrollHeaderWrapper) {
      return maxHeight;
    }

    const { clientHeight: headerHeight } = this.scrollHeaderWrapper;
    return maxHeight - headerHeight;
  };
  getNoDataColSpan: () => number = () => {
    const { columns, showCollapseArrowColumn } = this.props;
    let colSpan = columns.length;

    if (showCollapseArrowColumn) {
      colSpan++;
    }

    return colSpan;
  };

  render(): JSX.Element {
    const {
      columns,
      fixedHeader,
      listTable,
      noDataText,
      onRowClick,
      selectedRow,
      serverSideSorting,
      showCollapseArrowColumn,
      sortable,
      style,
      className,
      footer,
    } = this.props;
    const { scrollHeaderColumnStyles, scrollHeaderWidth, sortedData } =
      this.state;
    const noDataColSpan = this.getNoDataColSpan();
    const fixedMaxHeight = this.calculateMaxHeight();
    const sortKey = serverSideSorting ? this.props.sortKey : this.state.sortKey;
    const sortOrder = serverSideSorting
      ? this.props.sortOrder
      : this.state.sortOrder;
    const column = columns.find((column) => sortKey === column.key);
    const grouping = column ? column.grouping : null;

    return (
      <div
        ref={this.setContainerRef}
        className={classNames(
          "sortable-table__container",
          {
            "fixed-table-container": fixedHeader,
          },
          className,
        )}
        style={style}
      >
        {fixedHeader && (
          <div
            ref={this.setScrollHeaderWrapperRef}
            className={"scroll-head-wrapper"}
          >
            <table
              className={classNames(
                {
                  "sortable-table": sortable,
                },
                {
                  "scroll-head-table": fixedHeader,
                },
                {
                  "list-table": listTable,
                },
              )}
              style={{
                width: scrollHeaderWidth || null,
              }}
            >
              {!!scrollHeaderWidth && (
                <SortableTableHeader
                  getRef={this.setTheadRef}
                  columns={columns}
                  columnStyles={scrollHeaderColumnStyles}
                  onColumnClick={this.onSortingChange}
                  showCollapseArrowColumn={showCollapseArrowColumn}
                  sortable={sortable}
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              )}
            </table>
          </div>
        )}

        <div
          className={"scroll-body-wrapper"}
          ref={this.setScrollBodyWrapperRef}
          style={{
            maxHeight: fixedMaxHeight,
          }}
        >
          <table
            className={classNames(
              {
                "clickable-row": !!onRowClick,
              },
              {
                "sortable-table": sortable,
              },
              {
                "scroll-body-table": scrollHeaderWidth && fixedHeader,
              },
              {
                "list-table": listTable,
              },
            )}
            ref={this.setScrollBodyTableRef}
          >
            <SortableTableHeader
              getRef={this.setTheadRef}
              columns={columns}
              fixedHeader={fixedHeader}
              onColumnClick={this.onSortingChange}
              showCollapseArrowColumn={showCollapseArrowColumn}
              sortable={sortable}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
            <tbody>
              {!sortedData.length && (
                <tr className="no-data-row">
                  <td colSpan={noDataColSpan}>{noDataText}</td>
                </tr>
              )}

              {!!sortedData.length &&
                sortedData.map((row, index) => {
                  const isRowSelected = Boolean(
                    selectedRow &&
                      !selectedRow.tableGroupName &&
                      selectedRow.id === row.id,
                  );
                  return row.isTableGroup ? (
                    <SortableTableGroup
                      key={index}
                      id={`group_${row.id}`}
                      columns={columns}
                      grouping={grouping}
                      onRowClick={onRowClick}
                      row={row}
                      selectedRow={selectedRow}
                      showCollapseArrowColumn={showCollapseArrowColumn}
                    />
                  ) : (
                    <SortableTableRow
                      key={index}
                      columns={columns}
                      id={`row_${row.id}`}
                      grouping={grouping}
                      groupRow={false}
                      isSelected={isRowSelected}
                      onRowClick={onRowClick}
                      row={row}
                      showCollapseArrowColumn={showCollapseArrowColumn}
                    />
                  );
                })}
            </tbody>
            {footer && (
              <tfoot>
                {footer({
                  columnCount:
                    columns.length + (showCollapseArrowColumn ? 1 : 0),
                })}
              </tfoot>
            )}
          </table>
        </div>
      </div>
    );
  }
}

export default SortableTable;
