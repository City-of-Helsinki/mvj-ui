// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContractItemEdit from './ContractItemEdit';
import FormSection from '$components/form/FormSection';
import {receiveFormValidFlags} from '$src/leases/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getContentContracts} from '$src/leases/helpers';
import {getDecisionOptions} from '$src/decision/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type ContractsProps = {
  attributes: Attributes,
  contractsData: Array<Object>,
  decisionOptions: Array<Object>,
  fields: any,
  onOpenDeleteModal: Function,
}

const renderContracts = ({
  attributes,
  contractsData,
  decisionOptions,
  fields,
  onOpenDeleteModal,
}: ContractsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  const handleOpenDeleteModal = (index: number) => {
    onOpenDeleteModal(
      () => fields.remove(index),
      DeleteModalTitles.CONTRACT,
      DeleteModalLabels.CONTRACT,
    );
  };

  return (
    <div>
      {fields && !!fields.length && fields.map((contract, index) =>
        <ContractItemEdit
          key={index}
          attributes={attributes}
          contractsData={contractsData}
          decisionOptions={decisionOptions}
          field={contract}
          index={index}
          onOpenDeleteModal={onOpenDeleteModal}
          onRemove={handleOpenDeleteModal}
        />
      )}
      <Row>
        <Column>
          <AddButton
            label='Lisää sopimus'
            onClick={handleAdd}
            title='Lisää sopimus'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  decisions: Array<Object>,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  contractsData: Array<Object>,
  currentLease: ?Lease,
  decisionOptions: Array<Object>,
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
}

class ContractsEdit extends Component<Props, State> {
  state = {
    currentLease: null,
    contractsData: [],
    decisionOptions: [],
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.CONTRACT,
    deleteModalTitle: DeleteModalTitles.CONTRACT,
    isDeleteModalOpen: false,
  }

  static getDerivedStateFromProps(props, state) {
    const retObj = {};

    if(props.currentLease !== state.currentLease) {
      retObj.currentLease = props.currentLease,
      retObj.contractsData = getContentContracts(props.currentLease);
    }

    if(props.decisions !== state.decisions) {
      retObj.decisionOptions = getDecisionOptions(props.decisions);
      retObj.decisions = props.decisions;
    }

    if(!isEmpty(retObj)) {
      return retObj;
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONTRACTS]: this.props.valid,
      });
    }
  }

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.CONTRACT, modalLabel: string = DeleteModalLabels.CONTRACT) => {
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
    const {attributes} = this.props;
    const {
      contractsData,
      decisionOptions,
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
            attributes={attributes}
            component={renderContracts}
            contractsData={contractsData}
            decisionOptions={decisionOptions}
            name="contracts"
            onOpenDeleteModal={this.handleOpenDeleteModal}
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.CONTRACTS;

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        decisions: getDecisionsByLease(state, currentLease.id),
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
)(ContractsEdit);
