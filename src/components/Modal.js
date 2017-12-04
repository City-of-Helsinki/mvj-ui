// @flow

import React from 'react';

type Props = {
  children?: any,
  isOpen: boolean,
  onClose: Function,
  title: string,
}

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
}: Props) => {
  if(!isOpen) {
    return null;
  }
  return (
    <div className='modal'>
      <div className='modal__backdrop'></div>
      <div className='modal__wrapper'>

        <div className='modal__header'>
          <h1 className='title'>{title}</h1>
          <button className='close-button' onClick={onClose}>x</button>
        </div>
        <div className='modal__content'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
