import React, { Component } from "react";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { ButtonColors } from "@/components/enums";
type Props = {
  confirmButtonClassName?: string | null | undefined;
  confirmButtonLabel?: string | null | undefined;
  isOpen: boolean;
  label: any;
  onCancel: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
  title: string;
};

class ConfirmationModal extends Component<Props> {
  cancelButton: any;
  setCancelButtonRef: (arg0: any) => void = element => {
    this.cancelButton = element;
  };

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isOpen && this.props.isOpen) {
      if (this.cancelButton) {
        this.cancelButton.focus();
      }
    }
  }

  render(): React.ReactNode {
    const {
      confirmButtonClassName,
      confirmButtonLabel = 'Tallenna',
      isOpen,
      label,
      onCancel,
      onClose,
      onSave,
      title
    } = this.props;
    return <div className='confirmation-modal'>
        <Modal className='modal-small modal-autoheight' title={title} isOpen={isOpen} onClose={onClose}>
          <p>{label}</p>
          <div className='confirmation-modal__footer'>
            <Button className={ButtonColors.SECONDARY} innerRef={this.setCancelButtonRef} onClick={onCancel} text='Peruuta' />
            <Button className={confirmButtonClassName || ButtonColors.SUCCESS} onClick={onSave} text={confirmButtonLabel || ''} />
          </div>
        </Modal>
      </div>;
  }

}

export default ConfirmationModal;