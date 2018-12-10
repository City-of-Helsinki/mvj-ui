// @flow
import React, {Component} from 'react';

import Button from '../button/Button';
import Modal from './Modal';
import {ButtonColors} from '$components/enums';

type Props = {
  confirmButtonClassName?: string,
  confirmButtonLabel?: string,
  isOpen: boolean,
  label: any,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
  title: string,
}

class ConfirmationModal extends Component<Props> {
  cancelButton: any

  setCancelButtonRef = (element: any) => {
    this.cancelButton = element;
  }

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      if(this.cancelButton) {
        this.cancelButton.focus();
      }
    }
  }

  render() {
    const {
      confirmButtonClassName,
      confirmButtonLabel = 'Tallenna',
      isOpen,
      label,
      onCancel,
      onClose,
      onSave,
      title,
    } = this.props;

    return (
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
              className={ButtonColors.SECONDARY}
              innerRef={this.setCancelButtonRef}
              onClick={onCancel}
              text='Peruuta'
            />
            <Button
              className={confirmButtonClassName || ButtonColors.SUCCESS}
              onClick={onSave}
              text={confirmButtonLabel}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default ConfirmationModal;
