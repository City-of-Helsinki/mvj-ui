import React from "react";
type Props = {
  meta: Record<string, any>;
  showWarning?: boolean;
  style?: Record<string, any>;
};

const SuccessField = ({
  meta: {
    warning
  },
  showWarning = true,
  style
}: Props): React.ReactNode => {
  return showWarning && warning ? <span className="form-field__success-field" role="alert" style={style}>{warning}</span> : null;
};

export default SuccessField;