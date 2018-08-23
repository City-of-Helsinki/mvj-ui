// @flow
import React from 'react';
import DualListBox from 'react-dual-listbox';

type Props = {
  className?: string,
  disabled?: boolean,
  onChange: Function,
  options: Array<Object>,
  selected: Array<string>,
  setAvailabelReference?: Function,
}

const DualListBoxInput = ({
  className,
  disabled = false,
  onChange,
  options,
  selected,
  setAvailabelReference,
}: Props) => {
  return (
    <DualListBox
      availableRef={setAvailabelReference}
      className={className}
      disabled={disabled}
      onChange={onChange}
      options={options}
      selected={selected}
    />
  );
};

export default DualListBoxInput;
