// @flow
import React from 'react';

import SelectItem from './SelectItem';

import type {
  Option,
} from './SelectItem';

type Props = {
  focusIndex: number,
  ItemRenderer?: Function,
  options: Array<Option>,
  selected: Array<Object>,
  onSelectedChanged: (selected: any) => void,
  onClick: (event: MouseEvent, index: number) => void,
  disabled?: boolean
};

const SelectList = ({
  disabled,
  focusIndex,
  ItemRenderer,
  onClick,
  onSelectedChanged,
  options,
  selected,
}: Props) => {
  const handleSelectionChanged = (option: Option, checked: boolean) => {
    if (disabled) {
      true;
    }

    if (checked) {
      onSelectedChanged([...selected, option.value]);
    } else {
      const index = selected.indexOf(option.value);
      const removed = [
        ...selected.slice(0, index),
        ...selected.slice(index + 1),
      ];
      onSelectedChanged(removed);
    }
  };

  const renderItems = () => {
    return options.map((o, i) =>
      <li className='multi-select__select-list-item' key={i}>
        <SelectItem
          focused={focusIndex === i}
          option={o}
          onSelectionChanged={c => handleSelectionChanged(o, c)}
          checked={selected.includes(o.value)}
          onClick={e => onClick(e, i)}
          ItemRenderer={ItemRenderer}
          disabled={disabled}
        />
      </li>
    );
  };

  return <ul
    className='multi-select__select-list'
  >
    {renderItems()}
  </ul>;
};

export default SelectList;
