// @flow
import React from 'react';

import StyledCheckboxButtons from '$components/button/StyledCheckboxButtons';

type Props = {
  amountText: string,
  filterOptions: Array<Object>,
  filterValue: Array<string>,
  onFilterChange?: Function,
}
const TableFilters = ({
  amountText,
  filterOptions,
  filterValue,
  onFilterChange,
}: Props) => {
  const handleFilterChange = (values: Array<Object>) => {
    if(onFilterChange) {
      onFilterChange(values);
    }
  };

  return (
    <div className='table__filters'>
      <div className='table__filters_filter-wrapper'>
        {!!filterOptions.length &&
          <p className='table__filters_filter-wrapper_title'>Suodatus</p>
        }
        <StyledCheckboxButtons
          checkboxName='lease-type-checkbox'
          legend='Suodata'
          onChange={handleFilterChange}
          options={filterOptions}
          selectAllButton={false}
          value={filterValue}
        />
      </div>
      <div className='table__filters_amount-wrapper'>
        <span>{amountText}</span>
      </div>
    </div>
  );
};

export default TableFilters;
