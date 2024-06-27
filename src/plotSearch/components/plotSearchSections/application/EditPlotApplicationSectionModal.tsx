import React, { Component } from "react";
import Modal from "/src/components/modal/Modal";
import EditPlotApplicationSectionForm from "/src/plotSearch/components/plotSearchSections/application/EditPlotApplicationSectionForm";
type Props = {
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  sectionIndex: number;
};

class EditPlotApplicationSectionModal extends Component<Props> {
  form: any;

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.form.wrappedInstance.setFocus();
    }
  }

  setRefForForm: (...args: Array<any>) => any = (element: any): void => {
    this.form = element;
  };

  render(): React.ReactNode {
    const {
      isOpen,
      onClose,
      onSubmit,
      sectionIndex
    } = this.props;

    if (sectionIndex === -1) {
      return null;
    }

    return <Modal isOpen={isOpen} onClose={onClose} title='Muokkaa osiota'>
        <EditPlotApplicationSectionForm ref={this.setRefForForm} onClose={onClose} onSubmit={onSubmit} sectionIndex={sectionIndex} isOpen={isOpen} />
      </Modal>;
  }

}

export default EditPlotApplicationSectionModal;