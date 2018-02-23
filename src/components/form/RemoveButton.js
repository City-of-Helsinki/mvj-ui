// @flow
import React from 'react';

import trashIcon from '../../../assets/icons/trash.svg';

type Props = {
  onClick: Function,
  title: string,
  type?: string,
}

const RemoveButton = ({onClick, title, type = 'button'}: Props) =>
  <button
    className='remove-button'
    type={type}
    title={title}
    onClick={() => onClick()}>
    <img src={trashIcon} alt='Poista' />
  </button>;

export default RemoveButton;
