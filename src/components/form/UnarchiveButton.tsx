import React from "react";
import classNames from "classnames";
import UnarchiveIcon from "components/icons/UnarchiveIcon";
type Props = {
  className?: string;
  disabled?: boolean;
  onClick: (...args: Array<any>) => any;
  title?: string;
  type?: any;
};

const UnarchiveButton = ({
  className,
  disabled,
  onClick,
  title,
  type = 'button'
}: Props): React.ReactNode => <button className={classNames('form__unarchive-button', className)} disabled={disabled} type={type} title={title} onClick={onClick}>
    <UnarchiveIcon className='icon-medium' />
  </button>;

export default UnarchiveButton;