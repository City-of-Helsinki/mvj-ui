import React from "react";
import classNames from "classnames";
import ArchiveIcon from "@/components/icons/ArchiveIcon";
type Props = {
  className?: string;
  disabled?: boolean;
  onClick: (...args: Array<any>) => any;
  title?: string;
  type?: any;
};

const ArchiveButton = ({
  className,
  disabled,
  onClick,
  title,
  type = "button",
}: Props): JSX.Element => (
  <button
    className={classNames("form__archive-button", className)}
    disabled={disabled}
    type={type}
    title={title}
    onClick={onClick}
  >
    <ArchiveIcon className="icon-medium" />
  </button>
);

export default ArchiveButton;
