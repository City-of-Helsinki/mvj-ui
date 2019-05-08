// @flow
import React from 'react';
import classNames from 'classnames';
import kebabCase from 'lodash/kebabCase';

import {SortIconBoth, SortIconDesc, SortIconAsc} from '$components/table/Icons';
import {TableSortOrder} from '$components/enums';

import type {Column} from './SortableTable';

type Props = {
  columns: Array<Column>,
  columnStyles?: Array<Object>,
  fixedHeader?: boolean,
  getRef?: Function,
  onColumnClick?: Function,
  showCollapseArrowColumn?: boolean,
  sortable?: boolean,
  sortKey: ?string,
  sortOrder: ?string,
}

const SortableTableHeader = ({
  columns,
  columnStyles,
  fixedHeader,
  getRef,
  onColumnClick,
  showCollapseArrowColumn,
  sortable,
  sortKey,
  sortOrder,
}: Props) => {
  const setTheadRef = (el: any) => {
    if(getRef) {
      getRef(el);
    }
  };

  const getSortIcon = (column: Column, isSortable: boolean) => {
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

  return(
    <thead ref={setTheadRef}>
      <tr>
        {showCollapseArrowColumn && <th></th>}

        {columns.map((column, index) => {
          const handleColumnClick = () => {
            if(isSortable && onColumnClick) {
              onColumnClick(column);
            }
          };

          const handleKeyDown = (e: any) => {
            if(e.keyCode === 13) {
              e.preventDefault();
              handleColumnClick();
            }
          };

          const isSortable = (sortable && column.sortable !== false) ? true : false,
            sortIcon = getSortIcon(column, isSortable),
            columnStyle = columnStyles && (columnStyles.length > (index))
              ? columnStyles[index]
              : {};

          return(
            <th
              key={column.key}
              className={classNames(kebabCase(column.key), {'sortable': isSortable})}
              style={{...column.style, ...columnStyle, minWidth: column.minWidth}}
              onClick={handleColumnClick}
            >
              <div
                onKeyDown={handleKeyDown}
                tabIndex={(isSortable && !fixedHeader) ? 0 : undefined}
              >
                {column.text}
                {isSortable && sortIcon}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default SortableTableHeader;
