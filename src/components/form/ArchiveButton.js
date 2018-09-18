// @flow
import React from 'react';
import classNames from 'classnames';

import ArchiveIcon from '$components/icons/ArchiveIcon';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick: Function,
  title?: string,
  type?: string,
}

const ArchiveButton = ({className, disabled, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('form__archive-button', className)}
    disabled={disabled}
    type={type}
    title={title}
    onClick={onClick}>
    <ArchiveIcon className='icon-medium'/>
  </button>;

export default ArchiveButton;
