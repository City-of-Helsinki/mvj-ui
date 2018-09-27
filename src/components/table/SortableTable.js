// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

import SortableTableHeader from './SortableTableHeader';
import SortableTableGroup from './SortableTableGroup';
import SortableTableRow from './SortableTableRow';
import {SortIconBoth, SortIconDesc, SortIconAsc} from '$components/table/Icons';
import {sortStringByKeyAsc, sortStringByKeyDesc} from '$util/helpers';
import {TableSortOrder} from '$components/enums';

export type Column = {
  dataClassName?: string,
  defaultSortOrder?: string,
  grouping?: {
    key: string,
    columnKeys: Array<string>,
    columnsToHide?: Array<string>,
    options: Array<Object>,
  },
  key: string,
  minWidth?: number,
  renderer?: Function,
  sortable?: boolean,
  text: string,
}

type Props = {
  clickedRow?: Object | null,
  columns: Array<Column>,
  data: Array<Object>,
  defaultSortKey?: string,
  defaultSortOrder?: string,
  fixedHeader?: boolean,
  maxHeight?: ?number,
  noDataText?: string,
  onDataUpdate?: Function,
  onRowClick?: Function,
  onSelectNext?: Function,
  onSelectPrevious?: Function,
  onSelectRow?: Function,
  selectedRow?: Object | null,
  showRadioButton?: boolean,
  radioButtonDisabledFunction?: Function,
  sortable?: boolean,
}

type State = {
  data: Array<Object>,
  scrollHeaderColumnStyles: Array<Object>,
  scrollHeaderWidth: number,
  sortedData: Array<Object>,
  sortKey: ?string,
  sortOrder: ?string,
}

const groupData = (data: Array<Object>, column: Column) => {
  if(!column.grouping) {
    return data;
  }

  const groups = [],
    groupedData = [],
    groupOptions = get(column, 'grouping.options', []),
    groupKey = get(column, 'grouping.key');

  data.forEach((row) => {
    if(row[groupKey]) {
      const index = groups.findIndex((group) => group.id === row[groupKey]);
      if(index !== -1) {
        groups[index].tableRows.push(row);
      } else {
        const group = groupOptions.find((group) => group.id === row[groupKey]);
        if(group) {
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

const sortData = (data: Array<Props>, columns: Array<Object>, sortKey: ?string, sortOrder: ?string) => {
  if(!data || !data.length) {
    return [];
  }

  const column = columns.find((column) => column.key === sortKey);
  if(!column || !sortKey || !sortOrder) {
    return data;
  }

  const groupedData = groupData(data, column),
    groupKey = get(column, 'grouping.key');

  let sortedData = [...groupedData];

  switch (sortOrder) {
    case TableSortOrder.ASCENDING:
      column.descSortFunction && typeof(column.ascSortFunction) == 'function'
        ? sortedData.sort((a, b) => column.ascSortFunction(a, b, sortKey))
        : sortedData.sort((a, b) => sortStringByKeyAsc(a, b, sortKey));
      // Sort also groued data
      if(groupKey) {
        sortedData.forEach((item) => {
          if(item.isTableGroup) {
            (column.ascSortFunction && typeof(column.ascSortFunction)) == 'function'
              ? item.tableRows.sort((a, b) => column.ascSortFunction(a, b, sortKey))
              : item.tableRows.sort((a, b) => sortStringByKeyAsc(a, b, sortKey));
          }
        });
      }
      break;
    case TableSortOrder.DESCENDING:
      column.descSortFunction && typeof(column.descSortFunction) == 'function'
        ? sortedData.sort((a, b) => column.descSortFunction(a, b, sortKey))
        : sortedData.sort((a, b) => sortStringByKeyDesc(a, b, sortKey));
      // Sort also groued data
      if(groupKey) {
        sortedData.forEach((item) => {
          if(item.isTableGroup) {
            (column.descSortFunction && typeof(column.descSortFunction)) == 'function'
              ? item.tableRows.sort((a, b) => column.descSortFunction(a, b, sortKey))
              : item.tableRows.sort((a, b) => sortStringByKeyDesc(a, b, sortKey));
          }
        });
      }
      break;
  }
  return sortedData;
};

class SortableTable extends Component<Props, State> {
  container: any
  scrollBodyTable: any
  scrollBodyWrapper: any
  scrollHeaderWrapper: any
  thead: any

  state = {
    data: [],
    scrollHeaderColumnStyles: [],
    scrollHeaderWidth: 0,
    sortedData: [],
    sortKey: this.props.defaultSortKey || null,
    sortOrder: this.props.defaultSortOrder || TableSortOrder.DESCENDING,
    theadStyle: {},
  }

  static defaultProps = {
    fixedHeader: false,
    noDataText: 'Ei tuloksia',
    showRadioButton: false,
    sortable: false,
  }

  setContainerRef = (el: any) => {
    this.container = el;
  }

  setScrollBodyTableRef = (el: any) => {
    this.scrollBodyTable = el;
  }

  setScrollBodyWrapperRef = (el: any) => {
    this.scrollBodyWrapper = el;
  }

  setScrollHeaderWrapperRef = (el: any) => {
    this.scrollHeaderWrapper = el;
  }

  setTheadRef = (el: any) => {
    this.thead = el;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};
    if(props.data !== state.data) {
      newState.data = props.data;
      newState.sortedData = props.sortable
        ? sortData(props.data, props.columns, state.sortKey, state.sortOrder)
        : props.data;
    }
    return newState;
  }

  componentDidMount() {
    const {fixedHeader} = this.props;

    if(fixedHeader) {
      this.scrollBodyWrapper.addEventListener('scroll', this.updateHeaderPosition);
      this.scrollHeaderWrapper.addEventListener('scroll', this.updateBodyPosition);
      this.setTableScrollHeaderColumnStyles();
    }
  }

  componentWillUnmount() {
    const {fixedHeader} = this.props;

    if(fixedHeader) {
      this.scrollBodyWrapper.removeEventListener('scroll', this.updateHeaderPosition);
      this.scrollHeaderWrapper.removeEventListener('scroll', this.updateBodyPosition);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {fixedHeader} = this.props;
    if(fixedHeader &&
      (prevProps.columns !== this.props.columns
      || prevProps.data !== this.props.data)) {
      this.setTableScrollHeaderColumnStyles();
    }
    if(prevState.sortedData !== this.state.sortedData) {
      const {onDataUpdate} = this.props;

      if(onDataUpdate) {
        onDataUpdate();
      }
    }
  }

  handleResize = debounce(() => {
    const {fixedHeader} = this.props;

    if(fixedHeader) {
      this.setTableScrollHeaderColumnStyles();
    }
  }, 100)

  updateHeaderPosition = debounce(() => {
    const scrollLeft = this.scrollBodyWrapper.scrollLeft;
    this.scrollHeaderWrapper.scrollLeft = scrollLeft;
  }, 1)

  updateBodyPosition = () => {
    const scrollLeft = this.scrollHeaderWrapper.scrollLeft;
    this.scrollBodyWrapper.scrollLeft = scrollLeft;
  }

  setTableScrollHeaderColumnStyles = () => {
    const ths = [].slice.call(this.thead.querySelectorAll('th'));
    const scrollHeaderColumnStyles = ths.map((th) => {
      const rect = th.getBoundingClientRect();
      return {
        width: rect.width,
      };
    });
    const scrollHeaderWidth = scrollHeaderColumnStyles.reduce((sum, cur) => {
      return sum + cur.width;
    }, 0);

    this.setState({
      scrollHeaderColumnStyles: scrollHeaderColumnStyles,
      scrollHeaderWidth: scrollHeaderWidth,
    });
  }

  onSortingChange = (column: Column) => {
    const {sortKey, sortOrder} = this.state;
    const {columns, data} = this.props;

    let newSortKey = sortKey,
      newSortOrder = TableSortOrder.DESCENDING;

    if(sortKey === column.key) {
      newSortOrder = sortOrder === TableSortOrder.DESCENDING
        ? TableSortOrder.ASCENDING
        : TableSortOrder.DESCENDING;
    } else {
      newSortKey = column.key;
      newSortOrder = column.defaultSortOrder || TableSortOrder.DESCENDING;
    }

    this.setState({
      sortedData: sortData(data, columns, newSortKey, newSortOrder),
      sortKey: newSortKey,
      sortOrder: newSortOrder,
    });
  }

  getSortIcon = (column: Column, isSortable: boolean) => {
    const {sortKey, sortOrder} = this.state;

    if (isSortable && sortKey !== column.key) {
      return <SortIconBoth />;
    }
    if (isSortable &&  sortKey === column.key) {
      switch (sortOrder) {
        case TableSortOrder.ASCENDING:
          return <SortIconAsc />;
        case TableSortOrder.DESCENDING:
          return <SortIconDesc />;
      }
    }

    return null;
  };

  handleSelectRow = (row: Object) => {
    const {onSelectRow} = this.props;
    if(onSelectRow) {
      onSelectRow(row);
    }
  }

  selectNext = () => {
    const {onSelectNext, clickedRow} = this.props;

    if(!clickedRow || !onSelectNext) {
      return;
    }

    const sortedRows = this.getRowsFromSortedData(),
      index = sortedRows.findIndex((row) => row.id === clickedRow.id);

    if(index < (sortedRows.length - 1)) {
      onSelectNext(sortedRows[index + 1]);
    }
  }

  selectPrevious = () => {
    const {onSelectPrevious, clickedRow} = this.props;

    if(!clickedRow || !onSelectPrevious) {
      return;
    }

    const sortedRows = this.getRowsFromSortedData(),
      index = sortedRows.findIndex((row) => row.id === clickedRow.id);

    if(index > 0) {
      onSelectPrevious(sortedRows[index - 1]);
    }
  }

  getRowsFromSortedData = () => {
    const {sortedData} = this.state;
    let rows = [];

    sortedData.forEach((row) => {
      if(row.tableGroupName) {
        rows = [...rows, ...row.tableRows];
      } else {
        rows.push(row);
      }
    });
    return rows;
  }

  calculateMaxHeight = () => {
    const {fixedHeader, maxHeight} = this.props;

    if(!maxHeight || !fixedHeader || !this.scrollHeaderWrapper) {
      return maxHeight;
    }
    const {clientHeight: headerHeight} = this.scrollHeaderWrapper;
    return maxHeight - headerHeight;
  }

  render() {
    const {
      clickedRow,
      columns,
      fixedHeader,
      noDataText,
      onRowClick,
      radioButtonDisabledFunction,
      selectedRow,
      showRadioButton,
      sortable,
    } = this.props;
    const {
      scrollHeaderColumnStyles,
      scrollHeaderWidth,
      sortedData,
      sortKey,
      sortOrder,
    } = this.state;
    const fixedMaxHeight = this.calculateMaxHeight();

    return (
      <div
        ref={this.setContainerRef}
        className={classNames('sortable-table__container', {'fixed-table-container': fixedHeader})}
      >
        {fixedHeader &&
          <ReactResizeDetector
            handleWidth
            onResize={this.handleResize}
          />
        }
        {fixedHeader &&
          <div ref={this.setScrollHeaderWrapperRef} className={'scroll-head-wrapper'}>
            <table
              className={classNames(
                {'sortable-table': sortable},
                {'scroll-head-table': fixedHeader}
              )}
              style={{width: scrollHeaderWidth}}
            >
              <SortableTableHeader
                getRef={this.setTheadRef}
                columns={columns}
                columnStyles={scrollHeaderColumnStyles}
                onColumnClick={this.onSortingChange}
                showRadioButton={showRadioButton}
                sortable={sortable}
                sortKey={sortKey}
                sortOrder={sortOrder}
              />
            </table>
          </div>
        }

        <div
          className={'scroll-body-wrapper'}
          ref={this.setScrollBodyWrapperRef}
          style={{maxHeight: fixedMaxHeight}}
        >
          <table
            className={classNames(
              {'clickable-row': !!onRowClick},
              {'sortable-table': sortable},
              {'scroll-body-table': fixedHeader}
            )}
            ref={this.setScrollBodyTableRef}
          >
            <SortableTableHeader
              getRef={this.setTheadRef}
              columns={columns}
              fixedHeader={fixedHeader}
              onColumnClick={this.onSortingChange}
              showRadioButton={showRadioButton}
              sortable={sortable}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
            <tbody>
              {!sortedData.length &&
                <tr className='no-data-row'><td colSpan={columns.length}>{noDataText}</td></tr>
              }

              {!!sortedData.length && sortedData.map((row, index) => {
                const isRadioButtonDisabled = () => {
                  if(radioButtonDisabledFunction) {
                    return radioButtonDisabledFunction(row);
                  }

                  return false;
                };

                const isRadioDisabled = isRadioButtonDisabled(),
                  isRowClicked = Boolean(clickedRow && !clickedRow.tableGroupName && (clickedRow.id === row.id)),
                  isRowSelected = Boolean(selectedRow && !selectedRow.tableGroupName && (selectedRow.id === row.id));

                return row.isTableGroup
                  ? <SortableTableGroup
                    key={index}
                    clickedRow={clickedRow}
                    columns={columns}
                    disabled={isRadioDisabled}
                    onRowClick={onRowClick}
                    onSelectRow={this.handleSelectRow}
                    radioButtonDisabledFunction={radioButtonDisabledFunction}
                    row={row}
                    selectedRow={selectedRow}
                    showRadioButton={showRadioButton}
                  />
                  : <SortableTableRow
                    key={index}
                    columns={columns}
                    disabled={isRadioDisabled}
                    groupRow={false}
                    isClicked={isRowClicked}
                    isSelected={isRowSelected}
                    onRowClick={onRowClick}
                    onSelectRow={this.handleSelectRow}
                    row={row}
                    showRadioButton={showRadioButton || false}
                  />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default SortableTable;
