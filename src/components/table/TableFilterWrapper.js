// @flow
import React from 'react';

type Props = {
  filterComponent: any,
  visualizationComponent?: any,
}
const TableFilterWrapper = ({
  filterComponent,
  visualizationComponent,
}: Props) => {
  return (
    <div className='table__table-filter-wrapper'>
      {visualizationComponent &&
        <div className='table__table-filter-wrapper_visualization-wrapper'>
          {visualizationComponent}
        </div>
      }
      <div className='table__table-filter-wrapper_filter-wrapper'>
        {filterComponent}
      </div>
    </div>
  );
};

export default TableFilterWrapper;
