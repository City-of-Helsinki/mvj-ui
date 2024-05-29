import React from "react";
import classNames from "classnames";
import AddIcon from "components/icons/AddIcon";
type Props = {
  className?: string;
  disabled?: boolean;
  label: string;
  onClick: (...args: Array<any>) => any;
  style?: Record<string, any>;
  title?: string;
};

const AddButtonSecondary = ({
  className,
  disabled = false,
  label,
  onClick,
  style,
  title
}: Props): React.ReactNode => <button className={classNames('form__add-button secondary', className)} disabled={disabled} onClick={onClick} style={style} title={title} type='button'>
    <AddIcon />
    <span>{label}</span>
  </button>;

export default AddButtonSecondary;