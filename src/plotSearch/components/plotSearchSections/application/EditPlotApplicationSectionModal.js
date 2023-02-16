// @flow
import React, {Component} from 'react';

import Modal from '$components/modal/Modal';
import EditPlotApplicationSectionForm from '$src/plotSearch/components/plotSearchSections/application/EditPlotApplicationSectionForm';

type Props = {
  isOpen: boolean,
  onClose: Function,
  onSubmit: Function,
  sectionIndex: number,
}

class EditPlotApplicationSectionModal extends Component<Props> {
  form: any

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      this.form.wrappedInstance.setFocus();
    }
  }

  setRefForForm: Function = (element: any): void => {
    this.form = element;
  }

  render(): React$Node {
    const {
      isOpen,
      onClose,
      onSubmit,
      sectionIndex,
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
          sectionIndex={sectionIndex}
        />
      </Modal>
    );
  }
}

export default EditPlotApplicationSectionModal;
