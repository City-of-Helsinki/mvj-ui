import React, { Fragment } from "react";
import classNames from "classnames";
import { KeyCodes } from "@/enums";
type Props = {
  checked: boolean;
  disabled?: boolean;
  invisibleLabel?: boolean;
  label: string;
  legend?: string;
  name: string;
  onChange: (...args: Array<any>) => any;
};

const SingleRadioInput = ({
  checked,
  disabled,
  invisibleLabel,
  label,
  name,
  onChange
}: Props) => {
  const handleChange = (e: any) => {
    onChange(e.target.value);
  };

  const handleClick = () => {
    if (checked) {
      onChange(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === KeyCodes.SPACE) {
      e.preventDefault();
      handleClick();
    }
  };

  return <Fragment>
      <label className={classNames('form-field__label', {
      'invisible': invisibleLabel
    })} htmlFor={name}>
        {label}
      </label>
      <input type='radio' checked={checked} disabled={disabled} id={name} name={name} onChange={handleChange} onClick={handleClick} onKeyDown={handleKeyDown} />
    </Fragment>;
};

export default SingleRadioInput;