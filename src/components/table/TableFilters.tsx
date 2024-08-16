import React from "react";
import classNames from "classnames";
import CheckboxInput from "@/components/inputs/CheckboxInput";
type Props = {
  alignFiltersRight?: boolean;
  amountText: React.ReactNode;
  filterOptions: Array<Record<string, any>>;
  filterValue: Array<string>;
  onFilterChange?: (...args: Array<any>) => any;
  componentToRenderUnderTitle?: JSX.Element;
};

const TableFilters = ({
  alignFiltersRight,
  amountText,
  filterOptions,
  filterValue,
  onFilterChange,
  componentToRenderUnderTitle = null
}: Props): JSX.Element => {
  const handleFilterChange = (values: Array<Record<string, any>>) => {
    if (onFilterChange) {
      onFilterChange(values);
    }
  };

  return <div className='table__filters'>
      <div className='table__filters_filter-wrapper'>
        <div className={classNames('table__filters_filter-inner-wrapper', {
        'table__filters_filter-inner-wrapper--align-right': alignFiltersRight
      })}>
          {!!filterOptions.length && <p className='table__filters_filter-wrapper_title'>Suodatus</p>}
          {!!componentToRenderUnderTitle && componentToRenderUnderTitle}
          <CheckboxInput checkboxName='lease-type-checkbox' legend='Suodata' onChange={handleFilterChange} options={filterOptions} selectAllButton={false} value={filterValue} />
        </div>
      </div>
      <div className='table__filters_amount-wrapper'>
        <span>{amountText}</span>
      </div>
    </div>;
};

export default TableFilters;