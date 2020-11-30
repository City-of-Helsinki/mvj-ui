// @flow
import React, {Component} from 'react';

import Modal from '$components/modal/Modal';
import CreatePlotApplicationForm from './CreatePlotApplicationForm';

type Props = {
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
}

class CreatePlotApplicationsModal extends Component<Props> {
  form: any

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
      isOpen,
      onClose,
      onSubmit,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title='Luo uusi tonttihakemus'
      >
        <CreatePlotApplicationForm
          ref={this.setRefForForm}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </Modal>
    );
  }
}

export default CreatePlotApplicationsModal;
