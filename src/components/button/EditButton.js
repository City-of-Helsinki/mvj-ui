// @flow
import React from 'react';
import classNames from 'classnames';

import editIcon from '$assets/icons/icon_edit.svg';

type Props = {
  className?: string,
  onClick: Function,
  title: string,
  type?: string,
}

const EditButton = ({className, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('icon-button-component', className)}
    onClick={() => onClick()}
    title={title}
    type={type}
    >
    <img src={editIcon} alt='Muokkaa' />
  </button>;

export default EditButton;
