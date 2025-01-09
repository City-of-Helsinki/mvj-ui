import React from "react";
import classNames from "classnames";
import AddIcon from "@/components/icons/AddIcon";
type Props = {
  className?: string;
  disabled?: boolean;
  label: string;
  onClick: (...args: Array<any>) => any;
  style?: Record<string, any>;
  title?: string;
};

const AddButton = ({
  className,
  disabled = false,
  label,
  onClick,
  style,
  title,
}: Props): JSX.Element => (
  <button
    className={classNames("form__add-button", className)}
    disabled={disabled}
    onClick={onClick}
    style={style}
    title={title}
    type="button"
  >
    <AddIcon />
    <span>{label}</span>
  </button>
);

export default AddButton;
