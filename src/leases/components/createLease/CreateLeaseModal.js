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
  form: any

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      this.form.getWrappedInstance().wrappedInstance.setFocus();
    }
  }

  setRefForForm = (element: any) => {
    this.form = element;
  }

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
        <CreateLeaseForm
          ref={this.setRefForForm}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </Modal>
    );
  }
}

export default CreateLease;
