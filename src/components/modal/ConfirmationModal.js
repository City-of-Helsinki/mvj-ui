// @flow
import React from 'react';

import Button from '../button/Button';
import Modal from './Modal';

type Props = {
  confirmButtonLabel?: string,
  isOpen: boolean,
  label: string,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
  title: string,
}

const ConfirmationModal = ({
  confirmButtonLabel = 'Tallenna',
  isOpen,
  label,
  onCancel,
  onClose,
  onSave,
  title,
}: Props) =>
  <div className='confirmation-modal'>
    <Modal
      className='modal-small modal-autoheight modal-center'
      title={title}
      isOpen={isOpen}
      onClose={onClose}
    >
      <p>{label}</p>
      <div className='confirmation-modal__footer'>
        <Button
          className='button-red'
          label='Peruuta'
          onClick={onCancel}
          title='Peruuta'
        />
        <Button
          className='button-green'
          label={confirmButtonLabel}
          onClick={onSave}
          title={confirmButtonLabel}
        />
      </div>
    </Modal>
  </div>;

export default ConfirmationModal;
