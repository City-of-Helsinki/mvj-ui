// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import FileInput from '$components/file/FileInput';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import Modal from '$components/modal/Modal';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import {FormNames} from '$src/enums';
import {CollectionCourtDecisionFieldPaths, CollectionCourtDecisionFieldTitles} from '$src/collectionCourtDecision/enums';
import {ButtonColors} from '$components/enums';
import {
  getFieldAttributes,
  isFieldAllowedToEdit,
} from '$util/helpers';
import {getAttributes as getCollectionCourtDecisionAttributes} from '$src/collectionCourtDecision/selectors';

import type {Attributes} from '$src/types';

type Props = {
  collectionCourtDecisionAttributes: Attributes,
  decisionDate: ?string,
  initialize: Function,
  isOpen: boolean,
  note: ?string,
  onClose: Function,
  onSave: Function,
  title: string,
  valid: boolean,
}

type State = {
  file: ?Object,
}

class CollectionCourtDecisionModal extends PureComponent<Props, State> {
  state = {
    file: null,
  }

  componentDidUpdate = (prevProps: Props) => {
    if(this.props.isOpen && !prevProps.isOpen) {
      this.clearInputs();
    }
  }

  clearInputs = () => {
    const {initialize} = this.props;

    initialize({
      decision_date: undefined,
      note: '',
    });

    this.setState({
      file: null,
    });
  }

  handleFileChange = (e: any) => {
    const file = e.target.files[0];

    this.setState({
      file: file,
    });
  }

  handleSave = () => {
    const {decisionDate, note, onSave} = this.props;
    const {file} = this.state;

    onSave({
      file: file,
      decision_date: decisionDate,
      note: note,
    });
  }

  render() {
    const {
      collectionCourtDecisionAttributes,
      isOpen,
      onClose,
      title,
      valid,
    } = this.props;
    const {file} = this.state;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
      >
        <Row>
          <Column small={12} medium={4}>
            <FormTextTitle required>{CollectionCourtDecisionFieldTitles.FILE}</FormTextTitle>
            <FileInput
              name={'collection_court_decision_file'}
              onChange={this.handleFileChange}
              value={file}
            />
          </Column>
          <Column small={12} medium={4}>
            <Authorization allow={isFieldAllowedToEdit(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.DECISION_DATE)}>
              <FormField
                disableDirty
                fieldAttributes={getFieldAttributes(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.DECISION_DATE)}
                name='decision_date'
                overrideValues={{label: CollectionCourtDecisionFieldTitles.DECISION_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={4}>
            <Authorization allow={isFieldAllowedToEdit(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.NOTE)}>
              <FormField
                disableDirty
                fieldAttributes={getFieldAttributes(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.NOTE)}
                name='note'
                overrideValues={{label: CollectionCourtDecisionFieldTitles.NOTE}}
              />
            </Authorization>
          </Column>
        </Row>
        <ModalButtonWrapper>
          <Button
            className={ButtonColors.ALERT}
            onClick={onClose}
            text='Peruuta'
          />
          <Button
            className={ButtonColors.SUCCESS}
            disabled={!file || !valid}
            onClick={this.handleSave}
            text='Tallenna'
          />
        </ModalButtonWrapper>
      </Modal>
    );
  }
}

const formName = FormNames.LEASE_CREATE_COLLECTION_COURT_DECISION;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        collectionCourtDecisionAttributes: getCollectionCourtDecisionAttributes(state),
        decisionDate: selector(state, 'decision_date'),
        note: selector(state, 'note'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(CollectionCourtDecisionModal);
