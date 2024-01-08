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

  static defaultProps: $Shape<Props> = {
    allowToChangeRelateTo: true,
  }

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      this.form.wrappedInstance.setFocus();
    }
  }

  setRefForForm: (any) => void = (element) => {
    this.form = element;
  }

  render(): React$Node {
    const {
      allowToChangeRelateTo,
      isOpen,
      onClose,
      onSubmit,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title='Luo vuokraustunnus'
      >
        <CreateLeaseForm
          ref={this.setRefForForm}
          allowToChangeRelateTo={allowToChangeRelateTo}
          allowToChangeReferenceNumberAndNote
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </Modal>
    );
  }
}

export default CreateLease;
