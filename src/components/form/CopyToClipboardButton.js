// @flow
import React from 'react';
import classNames from 'classnames';

import CopyToClipboardIcon from '$components/icons/CopyToClipboardIcon';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick: Function,
  title?: string,
  type?: string,
}

const CopyToClipboardButton = (props: Props): React$Node => {
  const {
    className,
    disabled,
    onClick,
    title,
    type = 'button',
  } = props;

  return <button
    {...props}
    className={classNames('form__copy-to-clipboard-button', className)}
    disabled={disabled}
    type={type}
    title={title}
    onClick={onClick}>
    <CopyToClipboardIcon className='icon-medium'/>
  </button>;
};

export default CopyToClipboardButton;
