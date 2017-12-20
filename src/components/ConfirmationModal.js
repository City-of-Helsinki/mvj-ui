// @flow
import React from 'react';

import Button from './Button';
import Modal from './Modal';

type Props = {
  isOpen: boolean,
  label: string,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
  title: string,
}

const ConfirmationModal = ({
  isOpen,
  label,
  onCancel,
  onClose,
  onSave,
  title,
}: Props) => (
  <div className='confirmation-modal'>
    <Modal
      className='modal-small modal-autoheight modal-center'
      title={title}
      isOpen={isOpen}
      onClose={onClose}
    >
      <p>{label}</p>
      <div className='confirmation-modal__footer'>
        <Button className='button-red' text='Peruuta' onClick={onCancel}/>
        <Button className='button-green' text='Tallenna' onClick={onSave}/>
      </div>
    </Modal>
  </div>
);

export default ConfirmationModal;
