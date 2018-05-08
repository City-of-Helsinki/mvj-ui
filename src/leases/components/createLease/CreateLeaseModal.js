// @flow
import React, {Component} from 'react';

import CreateLeaseForm from './CreateLeaseForm';
import Modal from '$components/modal/Modal';


type Props = {
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
}

class CreateLease extends Component<Props> {
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
        title='Luo vuokratunnus'
      >
        {isOpen &&
          <CreateLeaseForm
            onClose={onClose}
            onSubmit={(lease) => onSubmit(lease)}
          />
        }
      </Modal>
    );
  }
}

export default CreateLease;
