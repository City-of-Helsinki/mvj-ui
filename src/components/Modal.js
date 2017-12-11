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
          <button className='close-button' onClick={onClose}><svg viewBox="0 0 30 30"><path d="M5.16,3.47,15,13.38l9.84-9.91,1.69,1.69L16.62,15l9.91,9.84-1.69,1.69L15,16.62,5.16,26.53,3.47,24.84,13.38,15,3.47,5.16Z"/></svg></button>
        </div>
        <div className='modal__content'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
