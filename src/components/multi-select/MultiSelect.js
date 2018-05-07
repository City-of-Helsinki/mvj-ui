// @flow
import React from 'react';

import Dropdown from './Dropdown';
import SelectPanel from './SelectPanel';

import type {
  Option,
} from './SelectItem';

type Props = {
  options: Array<Option>,
  selected: Array<any>,
  onSelectedChanged?: (selected: Array<any>) => void,
  valueRenderer?: (
    selected: Array<any>,
    options: Array<Option>
  ) => string,
  ItemRenderer?: Function,
  selectAllLabel?: string,
  isLoading?: boolean,
  disabled?: boolean,
  disableSearch?: boolean,
  shouldToggleOnHover: boolean,
  hasSelectAll: boolean,
  filterOptions?: (options: Array<Option>, filter: string) => Array<Option>
};

const MultiSelect = ({
  ItemRenderer,
  options,
  selected,
  selectAllLabel,
  isLoading,
  disabled,
  disableSearch,
  filterOptions,
  shouldToggleOnHover = false,
  hasSelectAll = true,
  onSelectedChanged,
  valueRenderer,
}: Props) => {
  const getSelectedText = () => {
    const selectedOptions = selected
      .map(s => options.find(o => o.value === s));

    const selectedLabels = selectedOptions.map(s => s ? s.label : '');

    return selectedLabels.join(', ');
  };

  const renderHeader = () => {
    const noneSelected = selected.length === 0;
    const allSelected = selected.length === options.length;

    const customText = valueRenderer && valueRenderer(selected, options);

    if (noneSelected) {
      return <span className='multi-select__none-selected'>
        {customText || 'Valitse...'}
      </span>;
    }

    if (customText) {
      return <span>{customText}</span>;
    }

    return <span>
      {allSelected
        ? 'Kaikki valittu'
        : getSelectedText()
      }
    </span>;
  };

  const handleSelectedChanged = (selected: Array<any>) => {
    if (disabled) {
      return;
    }

    if (onSelectedChanged) {
      onSelectedChanged(selected);
    }
  };

  return <div className="multi-select">
    <Dropdown
      isLoading={isLoading}
      contentComponent={SelectPanel}
      shouldToggleOnHover={shouldToggleOnHover}
      contentProps={{
        ItemRenderer,
        options,
        selected,
        hasSelectAll,
        selectAllLabel,
        onSelectedChanged: handleSelectedChanged,
        disabled,
        disableSearch,
        filterOptions,
      }}
      disabled={disabled}
    >
      {renderHeader()}
    </Dropdown>
  </div>;
};


export default MultiSelect;
export {Dropdown};
