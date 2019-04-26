// @flow
import React, {Component} from 'react';

import CreateLeaseForm from './CreateLeaseForm';
import Modal from '$components/modal/Modal';


type Props = {
  allowToChangeRelateTo?: boolean,
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
}

class CreateLease extends Component<Props> {
  form: any

  static defaultProps = {
    allowToChangeRelateTo: true,
  }

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      this.form.wrappedInstance.setFocus();
    }
  }

  setRefForForm = (element: any) => {
    this.form = element;
  }

  render () {
    const {
      allowToChangeRelateTo,
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
          allowToChangeRelateTo={allowToChangeRelateTo}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </Modal>
    );
  }
}

export default CreateLease;
