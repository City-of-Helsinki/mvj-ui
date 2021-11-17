// @flow
import React, {Component} from 'react';

import Modal from '$components/modal/Modal';
import EditPlotApplicationSectionForm from './EditPlotApplicationSectionForm';

type Props = {
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
}

class EditPlotApplicationSectionModal extends Component<Props> {
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
      ...rest
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title='Muokkaa osiota'
      >
        <EditPlotApplicationSectionForm
          ref={this.setRefForForm}
          onClose={onClose}
          onSubmit={onSubmit}
          {...rest}
        />
      </Modal>
    );
  }
}

export default EditPlotApplicationSectionModal;
