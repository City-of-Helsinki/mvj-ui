// @flow
import React, {Component} from 'react';
import classnames from 'classnames';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';

import SortableTableBody from './SortableTableBody';
import SortableTableHeader from './SortableTableHeader';
import {sortStringByKeyAsc, sortStringByKeyDesc} from '$util/helpers';

type Props = {
  className?: string,
  data: Array<any>,
  dataKeys: Array<any>,
  displayHeaders: boolean,
  fixedHeader?: boolean,
  fixedHeaderClassName?: string,
  maxHeight: ?number,
  noDataText?: string,
  onDataUpdate?: Function,
  onRowClick?: Function,
  onSelectNext?: Function,
  onSelectPrevious?: Function;
  secondaryTable?: boolean,
  selectedRow?: ?Object,
  sortable?: boolean,
  tableFixedLayout?: boolean,
};

type State = {
  sortedData: Array<Object>,
  sortings: Array<string>,
}

class Table extends Component<Props, State> {
  static defaultProps = {
    displayHeaders: true,
    fixedHeader: false,
    maxHeight: null,
    secondaryTable: false,
    sortable: false,
    tableFixedLayout: false,
  };

  state = {
    sortedData: [],
    sortings: [],
  }

  tableElement: any

  componentWillMount() {
    const {sortable} = this.props;
    if(sortable) {
      const sortings = this.getDefaultSortings(this.props.dataKeys);
      this.setState({
        sortedData: this.sortData(sortings),
        sortings: sortings,
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {sortable} = this.props;
    if(!sortable) {
      return;
    }

    if(this.state.sortings !== prevState.sortings ||
      this.props.dataKeys !== prevProps.dataKeys
    ) {
      this.setState({
        sortedData: this.sortData(this.state.sortings),
      });
    }

    if(this.state.sortedData !== prevState.sortedData) {
      const {onDataUpdate} = this.props;
      if(onDataUpdate) {
        onDataUpdate();
      }
    }
  }

  getDefaultSortings = (columns: Array<Object>): Array<string> => {
    return columns.map((column) => {
      let sorting = 'both';
      if (column.defaultSorting) {
        const defaultSorting = column.defaultSorting.toLowerCase();
        if (defaultSorting === 'desc') {
          sorting = 'desc';
        } else if (defaultSorting === 'asc') {
          sorting = 'asc';
        }
      }
      return sorting;
    });
  };

  onSortingChange = (index: number) => {
    const {sortings} = this.state;
    const newSortings = sortings.map(((sorting, i) => {
      if (i == index) {
        return this.nextSorting(sorting);
      }
      return 'both';
    }));

    this.setState({
      sortings: newSortings,
    });
  }

  nextSorting = (state: string) => {
    switch (state) {
      case 'both':
        return 'desc';
      case 'desc':
        return 'asc';
      case 'asc':
        return 'desc';
      default:
        return 'both';
    }
  }

  sortData = (sortings: Array<string>) => {
    const {data, dataKeys} = this.props;
    let sortedData = data;

    forEach(sortings, (sorting, index) => {
      if(index + 1 >= dataKeys.length) {
        return false;
      }
      const column = dataKeys[index];
      const key = column.key;
      switch (sorting) {
        case 'desc':
          if (column.descSortFunction &&
            typeof(column.descSortFunction) == 'function') {
            sortedData.sort((a, b) => column.descSortFunction(a, b, key));
          } else {
            sortedData.sort((a, b) => sortStringByKeyDesc(a, b, key));
          }
          break;
        case 'asc':
          if (column.descSortFunction &&
            typeof(column.ascSortFunction) == 'function') {
            sortedData.sort((a, b) => column.ascSortFunction(a, b, key));
          } else {
            sortedData.sort((a, b) => sortStringByKeyAsc(a, b, key));
          }
          break;
      }
    });
    return sortedData;
  }

  selectPrevious = () => {
    const {sortedData} = this.state;
    const {onSelectPrevious, selectedRow} = this.props;
    if(!selectedRow || !onSelectPrevious) {
      return null;
    }
    const index = findIndex(sortedData, (row) => row.id === selectedRow.id);
    if(index > 0) {
      onSelectPrevious(sortedData[index - 1]);
    }
  }

  selectNext = () => {
    const {sortedData} = this.state;
    const {onSelectNext, selectedRow} = this.props;

    if(!selectedRow || !onSelectNext) {
      return null;
    }

    const index = findIndex(sortedData, (row) => row.id === selectedRow.id);
    if(index < (sortedData.length - 1)) {
      onSelectNext(sortedData[index + 1]);
    }
  }

  render() {
    const {
      className,
      data,
      dataKeys,
      displayHeaders,
      fixedHeader,
      fixedHeaderClassName,
      maxHeight,
      noDataText,
      onRowClick,
      secondaryTable,
      selectedRow,
      sortable,
      tableFixedLayout,
    } = this.props;
    const {sortedData, sortings} = this.state;

    return (
      <div className={classnames({'table__fixed-header': fixedHeader}, fixedHeaderClassName)}>
        <div
          className={classnames({'table__fixed-header_wrapper': fixedHeader})}
          style={{maxHeight: maxHeight}}
          tabIndex={-1}
        >
          {fixedHeader &&
            <div className="table__fixed-header_header-border" />
          }
          <table
            ref={(ref) => this.tableElement = ref}
            className={classnames(
              className,
              'table',
              {'table__fixed-layout': tableFixedLayout},
              {'table__secondary': secondaryTable},
              {'clickable-row': !!onRowClick}
            )}
          >
            {displayHeaders &&
              <SortableTableHeader
                dataKeys={dataKeys}
                fixedHeader={fixedHeader}
                sortable={sortable}
                sortings={sortings}
                onStateChange={this.onSortingChange}
              />
            }
            <SortableTableBody
              data={sortable ? sortedData : data}
              dataKeys={dataKeys}
              noDataText={noDataText}
              onRowClick={onRowClick}
              selectedRow={selectedRow}
            />
          </table>
        </div>
      </div>
    );
  }
}

export default Table;
