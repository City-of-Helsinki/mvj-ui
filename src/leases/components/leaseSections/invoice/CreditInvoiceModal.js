// @flow
import React from 'react';

import Button from '$components/button/Button';
import Modal from '$components/modal/Modal';

type Props = {
  isOpen: boolean,
  label: string,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
  saveButtonLabel?: string,
  title: string,
}

const CreditInvoiceModal = ({
  isOpen,
  label,
  onCancel,
  onClose,
  onSave,
  saveButtonLabel = 'Hyvitä',
  title,
}: Props) =>
  <div className='invoice__credit-invoice-modal'>
    <Modal
      className='modal-small modal-autoheight modal-center'
      title={title}
      isOpen={isOpen}
      onClose={onClose}
    >
      <p>{label}</p>
      <div className='invoice__credit-invoice-modal_footer'>
        <Button
          className='button-red'
          label='Peruuta'
          onClick={onCancel}
          title='Peruuta'
        />
        <Button
          className='button-green'
          label={saveButtonLabel}
          onClick={onSave}
          title={saveButtonLabel}
        />
      </div>
    </Modal>
  </div>;

export default CreditInvoiceModal;
