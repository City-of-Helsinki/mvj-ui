import React from "react";
type Props = {
  meta: Record<string, any>;
  showWarning?: boolean;
  style?: Record<string, any>;
};

const WarningField = ({
  meta: { warning },
  showWarning = true,
  style,
}: Props): JSX.Element => {
  return showWarning && warning ? (
    <span className="form-field__warning-field" role="alert" style={style}>
      {warning}
    </span>
  ) : null;
};

export default WarningField;
