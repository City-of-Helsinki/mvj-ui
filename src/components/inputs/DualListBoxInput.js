// @flow
import React from 'react';
import DualListBox from 'react-dual-listbox';

type Props = {
  className?: string,
  disabled?: boolean,
  onChange: Function,
  options: Array<Object>,
  selected: Array<string>,
}

const DualListBoxInput = ({
  className,
  disabled = false,
  onChange,
  options,
  selected,
}: Props) => {
  return (
    <DualListBox
      className={className}
      disabled={disabled}
      onChange={onChange}
      options={options}
      selected={selected}
    />
  );
};

export default DualListBoxInput;
