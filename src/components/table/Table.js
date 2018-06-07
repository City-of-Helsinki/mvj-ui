// @flow
import React, {Component} from 'react';
import classnames from 'classnames';
import forEach from 'lodash/forEach';

import SortableTableBody from './SortableTableBody';
import SortableTableHeader from './SortableTableHeader';
import {sortStringByKeyAsc, sortStringByKeyDesc} from '$util/helpers';

type Props = {
  className?: string,
  data: Array<any>,
  dataKeys: Array<any>,
  displayHeaders: boolean,
  fixedHeader?: boolean,
  noDataText?: string,
  onRowClick?: Function,
  sortable?: boolean,
  tableFixedLayout?: boolean,
};

type State = {
  sortings: Array<string>,
}

class Table extends Component<Props, State> {
  static defaultProps = {
    displayHeaders: true,
    fixedHeader: false,
    sortable: false,
    tableFixedLayout: false,
  };

  state = {
    sortings: this.getDefaultSortings(),
  }

  getDefaultSortings() {
    const {dataKeys} = this.props;
    return dataKeys.map((column) => {
      let sorting = 'both';
      if (column.defaultSorting) {
        const defaultSorting = column.defaultSorting.toLowerCase();
        if (defaultSorting == 'desc') {
          sorting = 'desc';
        } else if (defaultSorting == 'asc') {
          sorting = 'asc';
        }
      }
      return sorting;
    });
  }

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

  sortData = () => {
    const {data, dataKeys} = this.props;
    const {sortings} = this.state;
    let sortedData = data;

    forEach(sortings, (sorting, index) => {
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

  render() {
    const {
      className,
      dataKeys,
      displayHeaders,
      fixedHeader,
      noDataText,
      onRowClick,
      sortable,
      tableFixedLayout,
    } = this.props;

    const {sortings} = this.state;
    const sortedData = this.sortData();
    return (
      <div className={classnames({'table__fixed-header': fixedHeader})}>
        <div className={classnames({'table__fixed-header_wrapper': fixedHeader})}>
          {fixedHeader &&
            <div className="table__fixed-header_header-border" />
          }
          <table className={classnames(
            className,
            'table',
            {'table__fixed-layout': tableFixedLayout},
            {'clickable-row': !!onRowClick}
          )}>
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
              data={sortedData}
              dataKeys={dataKeys}
              noDataText={noDataText}
              onRowClick={onRowClick}
            />
          </table>
        </div>
      </div>
    );
  }
}

export default Table;
