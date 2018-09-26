// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

import SortableTableRow from './SortableTableRow';
import {SortIconBoth, SortIconDesc, SortIconAsc} from '$components/table/Icons';
import {sortStringByKeyAsc, sortStringByKeyDesc} from '$util/helpers';
import {TableSortOrder} from '$components/enums';

const TableGroup = (props: Object) =>
  props.children.length ? props.children : null;


type Column = {
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
  maxHeight?: number,
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
  theadStyle: Object,
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
  component: any
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
    const scrollHeaderColumnStyles = ths.map(function(th) {
      var rect = th.getBoundingClientRect();
      return {
        width: rect.width,
      };
    });
    var scrollHeaderWidth = scrollHeaderColumnStyles.reduce((sum, cur) => {
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

  render() {
    const {
      clickedRow,
      columns,
      fixedHeader,
      maxHeight,
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
      theadStyle,
    } = this.state;

    return (
      <div
        className={classNames('sortable-table__container', {'fixed-table-container': fixedHeader})}
      >
        {fixedHeader &&
          <ReactResizeDetector
            handleWidth
            onResize={this.handleResize}
          />
        }
        {fixedHeader &&
          <div ref={(ref) => this.scrollHeaderWrapper = ref} className={'scroll-head-wrapper'}>
            <table className={classNames({'sortable-table': sortable}, {'scroll-head-table': fixedHeader})} style={{width: scrollHeaderWidth}}>
              <thead>
                <tr>
                  {!!scrollHeaderColumnStyles.length && scrollHeaderColumnStyles.map((styles, index) => {
                    if(showRadioButton && index === 0) {
                      return <th key={index} style={{width: styles.width}}></th>;
                    }

                    const column = columns[showRadioButton ? index - 1 : index];
                    const isSortable = (sortable && column.sortable !== false) ? true : false;
                    const sortIcon = this.getSortIcon(column, isSortable);

                    const handleClick = () => {
                      if(isSortable) {
                        this.onSortingChange(column);
                      }
                    };

                    const handleKeyDown = (e: any) => {
                      if(e.keyCode === 13) {
                        e.preventDefault();
                        handleClick();
                      }
                    };

                    return(
                      <th key={index} className={classNames({'sortable': isSortable})} style={{width: styles.width}} onClick={handleClick}>
                        <div onKeyDown={handleKeyDown} tabIndex={(isSortable && fixedHeader) ? 0 : undefined}>
                          {column.text}
                          {isSortable && sortIcon}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
            </table>
          </div>
        }

        <div
          className={'scroll-body-wrapper'}
          ref={(ref) => this.scrollBodyWrapper = ref}
          style={{maxHeight: maxHeight}}
        >
          <table
            className={classNames(
              {'clickable-row': !!onRowClick},
              {'sortable-table': sortable},
              {'scroll-body-table': fixedHeader}
            )}>
            <thead ref={(ref) => this.thead = ref} style={theadStyle}>
              <tr>
                {showRadioButton &&
                  <th></th>
                }
                {columns.map((column) => {
                  const isSortable = (sortable && column.sortable !== false) ? true : false;
                  const sortIcon = this.getSortIcon(column, isSortable);

                  const handleClick = () => {
                    if(isSortable) {
                      this.onSortingChange(column);
                    }
                  };

                  const handleKeyDown = (e: any) => {
                    if(e.keyCode === 13) {
                      e.preventDefault();
                      handleClick();
                    }
                  };

                  return(
                    <th key={column.key} className={classNames({'sortable': isSortable})} style={{minWidth: column.minWidth}} onClick={handleClick}>
                      <div onKeyDown={handleKeyDown} tabIndex={(isSortable && !fixedHeader) ? 0 : undefined}>
                        {column.text}
                        {isSortable && sortIcon}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {(!sortedData.length) &&
                <tr className='no-data-row'>
                  <td colSpan={columns.length}>{noDataText}</td>
                </tr>
              }

              {!!sortedData.length && sortedData.map((row, index) => {
                const handleRadioClick = () => {
                  this.handleSelectRow(row);
                };

                const isRadioButtonDisabled = () => {
                  if(radioButtonDisabledFunction) {
                    return radioButtonDisabledFunction(row);
                  }

                  return false;
                };

                const isRadioDisabled = isRadioButtonDisabled();

                return row.isTableGroup
                  ? <TableGroup key={index}>
                    <tr key={index} className='group-row'>
                      {showRadioButton &&
                        <td>
                          <label className='form-field__label invisible' htmlFor={`group_${row.id}`}>Ryhmä {row.id}</label>
                          <input type='radio'
                            checked={selectedRow === row}
                            disabled={isRadioDisabled}
                            id={`group_${row.id}`}
                            name={`group_${row.id}`}
                            onClick={handleRadioClick}
                          />
                        </td>
                      }
                      {columns.map(({dataClassName, grouping, key, renderer}, columnIndex) => {
                        const show = grouping ? grouping.columnKeys.indexOf(key) : -1;
                        return show !== -1
                          ? <td key={columnIndex} className={dataClassName}>
                            {renderer
                              ? renderer(get(row, key), row)
                              : get(row, key) || ' - '
                            }
                          </td>
                          : <td key={columnIndex}></td>;
                      })}
                    </tr>
                    {row.tableRows.map((row, rowIndex) => {
                      const isRadioDisabled = isRadioButtonDisabled();

                      return <SortableTableRow
                        key={rowIndex}
                        className='group-item-row'
                        clickedRow={clickedRow}
                        columns={columns}
                        disabled={isRadioDisabled}
                        groupRow={true}
                        isClicked={clickedRow === row}
                        isSelected={selectedRow === row}
                        onRowClick={onRowClick}
                        onSelectRow={this.handleSelectRow}
                        row={row}
                        showRadioButton={showRadioButton || false}
                      />;
                    })}
                  </TableGroup>
                  : <SortableTableRow
                    key={index}
                    clickedRow={clickedRow}
                    columns={columns}
                    disabled={isRadioDisabled}
                    groupRow={false}
                    isClicked={clickedRow === row}
                    isSelected={selectedRow === row}
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
