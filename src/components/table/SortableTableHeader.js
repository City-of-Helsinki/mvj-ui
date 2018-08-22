// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import kebabCase from 'lodash/kebabCase';

import {SortIconBoth, SortIconDesc, SortIconAsc} from './Icons';

const SortingType = PropTypes.oneOf(['desc', 'asc', 'both']);

type ItemProps = {
  dataKey: string,
  fixedHeader?: boolean,
  headerProps: Object,
  index: number,
  label: string,
  onClick: Function,
  sortable?: boolean,
  sorting: SortingType,
}

const SortableTableHeaderItem = ({
  dataKey,
  headerProps = {},
  index,
  label,
  onClick,
  sortable = true,
  sorting,
}: ItemProps) => {
  const getSortIcon = () => {
    let sortIcon;
    if (sortable) {
      sortIcon = <SortIconBoth />;
      if (sorting == 'desc') {
        sortIcon = <SortIconDesc />;
      } else if (sorting === 'asc') {
        sortIcon = <SortIconAsc />;
      }
    }
    return sortIcon;
  };

  const handleOnClick = () => {
    if (sortable)
      onClick(index);
  };

  const handleKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      handleOnClick();
    }
  };


  const sortIcon = getSortIcon();

  return (
    <th
      className={classnames({'table__sortable_header-link': sortable}, kebabCase(dataKey))}
      onClick={handleOnClick}

      {...headerProps} >
      <div aria-label={label} onKeyDown={handleKeyDown} tabIndex={sortable ? 0 : undefined}>
        {label}
        {sortIcon}
      </div>
    </th>
  );
};

type Props = {
  dataKeys: Array<Object>,
  emptyFirstColumn?: boolean,
  fixedHeader?: boolean,
  onStateChange: Function,
  sortable?: boolean,
  sortings: Array<string>,
}

const SortableTableHeader = ({
  dataKeys,
  emptyFirstColumn,
  fixedHeader,
  onStateChange,
  sortable = false,
  sortings,
}: Props) => {

  const handleOnClick = (index) => {
    if(sortable) {
      onStateChange(index);
    }
  };

  if(!dataKeys) {
    return null;
  }

  return (
    <thead>
      <tr>
        {emptyFirstColumn && <th className='empty-cell'></th>}
        {dataKeys.map((column, index) => {
          const sorting = sortings[index];
          return (
            <SortableTableHeaderItem
              key={index}
              index={index}
              dataKey={column.key}
              fixedHeader={fixedHeader}
              label={column.label}
              onClick={handleOnClick}
              sortable={sortable && column.sortable}
              sorting={sorting}
              headerProps={column.headerProps}
            />
          );
        })}
      </tr>
    </thead>
  );
};

export default SortableTableHeader;
