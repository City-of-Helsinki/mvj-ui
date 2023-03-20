// @flow
import React from 'react';
import classNames from 'classnames';

import AttachIcon from '$components/icons/AttachIcon';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick: Function,
  title?: string,
  type?: string,
}

const AttachButton = ({className, disabled, onClick, title, type = 'button'}: Props): React$Node =>
  <button
    className={classNames('form__attach-button', className)}
    disabled={disabled}
    type={type}
    title={title}
    onClick={onClick}>
    <AttachIcon className='icon-medium'/>
  </button>;

export default AttachButton;
