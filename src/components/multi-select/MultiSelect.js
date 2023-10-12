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
  onBlur: Function,
  onSelectedChanged?: (selected: Array<any>) => void,
  valueRenderer?: (
    selected: Array<any>,
    options: Array<Option>
  ) => string,
  id: string,
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
  id,
  ItemRenderer,
  onBlur,
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
}: Props): React$Node => {
  const getSelectedText = () => {
    const selectedOptions = selected
      .map(s => options.find(o => o.value === s));

    const selectedLabels = selectedOptions.map(s => s ? s.label : '');

    return isLoading ? '' : selectedLabels.join(', ');
  };

  const handleBlur = () => onBlur(selected);

  const renderHeader = () => {
    const noneSelected = selected.length === 0;
    const allSelected = selected.length === options.length;
    const multipleSelected = selected.length > 1;

    const customText = valueRenderer && valueRenderer(selected, options);

    if (noneSelected) {
      return <span className='multi-select__none-selected'>
        {customText || 'Valitse...'}
      </span>;
    }

    if (customText) {
      return <span>{customText}</span>;
    }

    if(multipleSelected && !allSelected) {
      return <span>
        {`${selected.length} valittu`}
      </span>;
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
    <input id={id} hidden/>
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
      onBlur={handleBlur}
    >
      {renderHeader()}
    </Dropdown>
  </div>;
};


export default MultiSelect;
export {Dropdown};
