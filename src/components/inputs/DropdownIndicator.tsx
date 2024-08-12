import React from "react";
import classNames from "classnames";
export type IndicatorProps = {
  selectProps: {
    menuIsOpen: boolean;
  };
};

const DropdownIndicator = (props: IndicatorProps) => {
  const {
    selectProps: {
      menuIsOpen
    }
  } = props;
  return <i className={classNames('select-input__dropdown-indicator', {
    'menu-is-open': menuIsOpen
  })} />;
};

export default DropdownIndicator;