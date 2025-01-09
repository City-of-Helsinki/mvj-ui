import React from "react";
import ErrorIcon from "../icons/ErrorIcon";
import SuccessIcon from "../icons/SuccessIcon";
type Props = {
  name: string;
};

const ToastrIcons = ({ name }: Props) => {
  switch (name) {
    case "success":
      return <SuccessIcon className="toastr__icons" />;

    case "error":
      return <ErrorIcon className="toastr__icons" />;

    default:
      return null;
  }
};

export default ToastrIcons;
