// @flow
import React, {Component} from 'react';

import CreateLandUseContractForm from './CreateLandUseContractForm';
import Modal from '$components/modal/Modal';


type Props = {
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
}

class CreateLandUseContractModal extends Component<Props> {
  render () {
    const {
      isOpen,
      onClose,
      onSubmit,
    } = this.props;

    return (
      <Modal
        className='modal-center'
        isOpen={isOpen}
        onClose={onClose}
        title='Luo uusi maankäyttösopimustunnus'
      >
        {isOpen &&
          <CreateLandUseContractForm
            onClose={onClose}
            onSubmit={onSubmit}
          />
        }
      </Modal>
    );
  }
}

export default CreateLandUseContractModal;
