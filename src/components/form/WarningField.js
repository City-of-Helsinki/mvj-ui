// @flow
import React from 'react';

type Props = {
  meta: Object,
  showWarning?: boolean,
  style?: Object,
};

const WarningField = ({meta: {warning}, showWarning = true, style}: Props) => {
  return (showWarning && warning)
    ? <span className="form-field__warning-field" role="alert" style={style}>{warning}</span>
    : null;
};

export default WarningField;
