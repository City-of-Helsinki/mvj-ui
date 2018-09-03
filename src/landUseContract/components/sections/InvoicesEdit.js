// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonThird from '$components/form/AddButtonThird';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import GreenBox from '$components/content/GreenBox';
import RemoveButton from '../../../components/form/RemoveButton';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {getAttributes, getIsSaveClicked} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/landUseContract/types';

type InvoicesProps = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

const renderInvoices = ({attributes, fields, isSaveClicked, onOpenDeleteModal}: InvoicesProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return(
    <div>
      {!fields || !fields.length && <p>Ei laskuja</p>}
      {fields && !!fields.length &&
        <div>
          <Row>
            <Column small={3} large={2}><FormFieldLabel>Määrä</FormFieldLabel></Column>
            <Column small={3} large={2}><FormFieldLabel>Eräpäivä</FormFieldLabel></Column>
            <Column small={2} large={2}><FormFieldLabel>Lähetetty pvm</FormFieldLabel></Column>
            <Column small={2} large={2}><FormFieldLabel>Maksettu pvm</FormFieldLabel></Column>
          </Row>
          {fields.map((invoice, index) => {
            const handleOpenDeleteModal = () => {
              onOpenDeleteModal(
                () => fields.remove(index),
                DeleteModalTitles.INVOICE,
                DeleteModalLabels.INVOICE,
              );
            };

            return (
              <Row key={index}>
                <Column small={3} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'invoices.child.children.amount')}
                    name={`${invoice}.amount`}
                    unit='€'
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={3} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'invoices.child.children.due_date')}
                    name={`${invoice}.due_date`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={2} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'invoices.child.children.sent_date')}
                    name={`${invoice}.sent_date`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={2} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'invoices.child.children.paid_date')}
                    name={`${invoice}.paid_date`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column>
                  <RemoveButton
                    className='third-level'
                    onClick={handleOpenDeleteModal}
                    title="Poista sopimus"
                  />
                </Column>
              </Row>
            );
          })}
        </div>
      }

      <Row>
        <Column>
          <AddButtonThird
            label='Lisää lasku'
            onClick={handleAdd}
            title='Lisää lasku'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
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

class InvoicesEdit extends Component<Props, State> {
  state = {
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.INVOICE,
    deleteModalTitle: DeleteModalTitles.INVOICE,
    isDeleteModalOpen: false,
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONTRACTS]: this.props.valid,
      });
    }
  }

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.INVOICE, modalLabel: string = DeleteModalLabels.INVOICE) => {
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
    const {attributes, isSaveClicked} = this.props;
    const {deleteModalLabel, deleteModalTitle, isDeleteModalOpen} = this.state;

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

        <GreenBox>
          <FieldArray
            attributes={attributes}
            component={renderInvoices}
            isSaveClicked={isSaveClicked}
            name="invoices"
            onOpenDeleteModal={this.handleOpenDeleteModal}
          />
        </GreenBox>
      </form>
    );
  }
}

const formName = FormNames.INVOICES;

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
  })
)(InvoicesEdit);
