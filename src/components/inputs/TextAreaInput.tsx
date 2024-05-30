import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
  disabled?: boolean;
  id: string;
  onChange: (...args: Array<any>) => any;
  placeholder?: string;
  rows?: number;
  setRefForField?: (...args: Array<any>) => any;
  value: string;
  name?: string;
};

const TextAreaInput = ({
  className,
  disabled,
  id,
  onChange,
  placeholder = '',
  rows = 3,
  setRefForField,
  value = ''
}: Props) => {
  return <textarea ref={setRefForField} className={classNames('text-area-input', className)} id={id} disabled={disabled} onChange={onChange} placeholder={placeholder} rows={rows} value={value} />;
};

export default TextAreaInput;