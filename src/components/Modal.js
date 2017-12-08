// @flow
import React from 'react';
import classnames from 'classnames';

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

  return (
    <div className={classnames('modal', {'modal-open': isOpen})}>
      <div className='modal__overlay'></div>
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
