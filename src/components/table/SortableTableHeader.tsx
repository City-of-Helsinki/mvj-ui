import React from "react";
import classNames from "classnames";
import kebabCase from "lodash/kebabCase";
import { SortIconBoth, SortIconDesc, SortIconAsc } from "/src/components/table/Icons";
import { TableSortOrder } from "enums";
import type { Column } from "./SortableTable";
type Props = {
  columns: Array<Column>;
  columnStyles?: Array<Record<string, any>>;
  fixedHeader?: boolean;
  getRef?: (...args: Array<any>) => any;
  onColumnClick?: (...args: Array<any>) => any;
  showCollapseArrowColumn?: boolean;
  sortable?: boolean;
  sortKey: string | null | undefined;
  sortOrder: string | null | undefined;
};

const SortableTableHeader = ({
  columns,
  columnStyles,
  fixedHeader,
  getRef,
  onColumnClick,
  showCollapseArrowColumn,
  sortable,
  sortKey,
  sortOrder
}: Props): React.ReactNode => {
  const setTheadRef = (el: any) => {
    if (getRef) {
      getRef(el);
    }
  };

  const getSortIcon = (column: Column, isSortable: boolean) => {
    if (isSortable && sortKey !== column.key) {
      return <SortIconBoth />;
    }

    if (isSortable && sortKey === column.key) {
      switch (sortOrder) {
        case TableSortOrder.ASCENDING:
          return <SortIconAsc />;

        case TableSortOrder.DESCENDING:
          return <SortIconDesc />;
      }
    }

    return null;
  };

  return <thead ref={setTheadRef}>
      <tr>
        {showCollapseArrowColumn && <th></th>}

        {columns.map((column, index) => {
        const handleColumnClick = () => {
          if (isSortable && onColumnClick) {
            onColumnClick(column);
          }
        };

        const handleKeyDown = (e: any) => {
          if (e.keyCode === 13) {
            e.preventDefault();
            handleColumnClick();
          }
        };

        const isSortable = !!(sortable && column.sortable !== false);
        const sortIcon = getSortIcon(column, isSortable);
        const columnStyle = columnStyles && columnStyles.length > index ? columnStyles[index] : {};
        return <th key={column.key} className={classNames(kebabCase(column.key), {
          'sortable': isSortable
        })} style={{ ...column.style,
          ...columnStyle,
          minWidth: column.minWidth
        }} onClick={handleColumnClick}>
              <div onKeyDown={handleKeyDown} tabIndex={isSortable && !fixedHeader ? 0 : undefined}>
                {column.text}
                {isSortable && sortIcon}
              </div>
            </th>;
      })}
      </tr>
    </thead>;
};

export default SortableTableHeader;