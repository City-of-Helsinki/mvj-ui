// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import DecisionItemEdit from './DecisionItemEdit';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {getContentDecisions} from '$src/landUseContract/helpers';
import {getAttributes, getCurrentLandUseContract, getErrorsByFormName, getIsSaveClicked} from '$src/landUseContract/selectors';

import type {Attributes, LandUseContract} from '$src/landUseContract/types';

type DecisionsProps = {
  attributes: Attributes,
  decisionsData: Array<Object>,
  errors: ?Object,
  fields: any,
  formValues: Object,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

const renderDecisions = ({attributes, decisionsData, errors, fields, isSaveClicked, onOpenDeleteModal}: DecisionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  const handleOpenDeleteModal = (index: number) => {
    onOpenDeleteModal(
      () => fields.remove(index),
      DeleteModalTitles.DECISION,
      DeleteModalLabels.DECISION,
    );
  };

  return (
    <div>
      {fields && !!fields.length && fields.map((decision, index) => {
        return (
          <DecisionItemEdit
            key={index}
            attributes={attributes}
            decisionsData={decisionsData}
            errors={errors}
            field={decision}
            index={index}
            isSaveClicked={isSaveClicked}
            onOpenDeleteModal={onOpenDeleteModal}
            onRemove={handleOpenDeleteModal}
          />
        );
      })}
      <Row>
        <Column>
          <AddButton
            label='Lisää päätös'
            onClick={handleAdd}
            title='Lisää päätös'
          />
        </Column>
      </Row>
    </div>
  );
};


type Props = {
  attributes: Attributes,
  currentLandUseContract: LandUseContract,
  errors: ?Object,
  formValues: Object,
  receiveFormValidFlags: Function,
  isSaveClicked: boolean,
  valid: boolean,
}

type State = {
  currentLandUseContract: ?LandUseContract,
  decisionsData: Array<Object>,
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
}

class DecisionsEdit extends Component<Props, State> {
  state = {
    currentLandUseContract: null,
    decisionsData: [],
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.DECISION,
    deleteModalTitle: DeleteModalTitles.DECISION,
    isDeleteModalOpen: false,
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.DECISIONS]: this.props.valid,
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLandUseContract !== state.currentLandUseContract) {
      const decisions = getContentDecisions(props.currentLandUseContract);
      return {
        currentLandUseContract: props.currentLandUseContract,
        decisionsData: decisions,
      };
    }
    return null;
  }

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.DECISION, modalLabel: string = DeleteModalLabels.DECISION) => {
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
    const {attributes, errors, formValues, isSaveClicked} = this.props,
      {decisionsData, deleteModalLabel, deleteModalTitle, isDeleteModalOpen} = this.state;
    return (
      <form>
        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteModalOpen}
          label={deleteModalLabel}
          onCancel={this.handleHideDeleteModal}
          onClose={this.handleHideDeleteModal}
          onSave={this.handleDeleteClick}
          title={deleteModalTitle}
        />

        <FieldArray
          attributes={attributes}
          component={renderDecisions}
          decisionsData={decisionsData}
          errors={errors}
          formValues={formValues}
          isSaveClicked={isSaveClicked}
          name="decisions"
          onOpenDeleteModal={this.handleOpenDeleteModal}
        />
      </form>
    );
  }
}

const formName = FormNames.DECISIONS;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentLandUseContract: getCurrentLandUseContract(state),
        errors: getErrorsByFormName(state, formName),
        formValues: getFormValues(formName)(state),
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
)(DecisionsEdit);
