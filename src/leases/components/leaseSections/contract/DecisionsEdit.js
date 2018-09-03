// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import FormSection from '$components/form/FormSection';
import DecisionItemEdit from './DecisionItemEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getContentDecisions} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type DecisionsProps = {
  decisionsData: Array<Object>,
  fields: any,
  onOpenDeleteModal: Function,
}

const renderDecisions = ({
  decisionsData,
  fields,
  onOpenDeleteModal,
}: DecisionsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  const handleOpenDeleteModal = (index: number) => {
    onOpenDeleteModal(
      () => fields.remove(index),
      DeleteModalTitles.DECISION,
      DeleteModalLabels.DECISION,
    );
  };

  return (
    <div>
      {fields && !!fields.length && fields.map((decision, index) =>
        <DecisionItemEdit
          key={index}
          decisionsData={decisionsData}
          index={index}
          field={decision}
          onOpenDeleteModal={onOpenDeleteModal}
          onRemove={handleOpenDeleteModal}
        />
      )}
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
  currentLease: Lease,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  currentLease: ?Lease,
  decisionsData: Array<Object>,
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
}

class DecisionsEdit extends Component<Props, State> {
  state = {
    currentLease: null,
    decisionsData: [],
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.DECISION,
    deleteModalTitle: DeleteModalTitles.DECISION,
    isDeleteModalOpen: false,
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.currentLease) {
      const decisions = getContentDecisions(props.currentLease);
      return {
        currentLease: props.currentLease,
        decisionsData: decisions,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.DECISIONS]: this.props.valid,
      });
    }
  }

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.DECISION, modalLabel: string = DeleteModalLabels.Decision) => {
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
    const {
      decisionsData,
      deleteModalLabel,
      deleteModalTitle,
      isDeleteModalOpen,
    } = this.state;

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

        <FormSection>
          <FieldArray
            component={renderDecisions}
            decisionsData={decisionsData}
            name="decisions"
            onOpenDeleteModal={this.handleOpenDeleteModal}
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.DECISIONS;

export default flowRight(
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
      };
    },
    {
      receiveFormValidFlags,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(DecisionsEdit);
