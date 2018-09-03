// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import FormSection from '$components/form/FormSection';
import InspectionItemsEdit from './InspectionItemsEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getAttributes, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
}

class InspectionsEdit extends Component<Props, State> {
  state = {
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.INSPECTION,
    deleteModalTitle: DeleteModalTitles.INSPECTION,
    isDeleteModalOpen: false,
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.INSPECTIONS]: this.props.valid,
      });
    }
  }

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.INSPECTION, modalLabel: string = DeleteModalLabels.INSPECTION) => {
    this.setState({
      deleteFunction: fn,
      deleteModalLabel: modalLabel,
      deleteModalTitle: modalTitle,
      isDeleteModalOpen: true,
    });
  }

  handleHideDeleteModal = () => {
    this.setState({
      isDeleteModalOpen: false,
    });
  }

  handleDeleteClick = () => {
    const {deleteFunction} = this.state;
    if(deleteFunction) {
      deleteFunction();
    }
    this.handleHideDeleteModal();
  }

  render() {
    const {attributes, handleSubmit, isSaveClicked} = this.props;
    const {deleteModalLabel, deleteModalTitle, isDeleteModalOpen} = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteModalOpen}
          label={deleteModalLabel}
          onCancel={this.handleHideDeleteModal}
          onClose={this.handleHideDeleteModal}
          onSave={this.handleDeleteClick}
          title={deleteModalTitle}
        />

        <FormSection>
          <FieldArray
            attributes={attributes}
            component={InspectionItemsEdit}
            isSaveClicked={isSaveClicked}
            name="inspections"
            onOpenDeleteModal={this.handleOpenDeleteModal}
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.INSPECTIONS;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(InspectionsEdit);
