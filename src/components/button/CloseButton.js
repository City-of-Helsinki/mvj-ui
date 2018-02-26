// @flow
import React from 'react';
import classNames from 'classnames';

import closeIcon from '../../../assets/icons/icon_close.svg';

type Props = {
  className?: string,
  onClick: Function,
  title: string,
  type?: string,
}

const CloseButton = ({className, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('close-button-component', className)}
    type={type}
    title={title}
    onClick={() => onClick()}>
    <img src={closeIcon} alt='Poista' />
  </button>;

export default CloseButton;
