// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import FileInput from '$components/file/FileInput';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ButtonWrapper from '$components/content/ButtonWrapper';
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
  largeScreen: boolean,
  note: ?string,
  onClose: Function,
  onSave: Function,
  title: string,
  valid: boolean,
}

type State = {
  file: ?Object,
}

class CollectionCourtDecisionPanelR extends PureComponent<Props, State> {
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
      largeScreen,
      onClose,
      valid,
    } = this.props;
    const {file} = this.state;

    if(!isOpen) return null;

    return (
      <Fragment>
        <Row>
          <Column small={6} large={3}>
            {!largeScreen &&
              <FormTextTitle required>{CollectionCourtDecisionFieldTitles.FILE}</FormTextTitle>
            }
            <FileInput
              name={'collection_court_decision_file'}
              onChange={this.handleFileChange}
              value={file}
            />
          </Column>
          <Column small={3} large={1}>
            {!largeScreen &&
              <FormTextTitle>{CollectionCourtDecisionFieldTitles.UPLOADED_AT}</FormTextTitle>
            }
            <FormText>-</FormText>
          </Column>
          <Column small={3} large={2}>
            {!largeScreen &&
              <FormTextTitle>{CollectionCourtDecisionFieldTitles.UPLOADER}</FormTextTitle>
            }
            <FormText>-</FormText>
          </Column>
          <Column small={3} large={2}>
            <Authorization allow={isFieldAllowedToEdit(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.DECISION_DATE)}>
              <FormField
                disableDirty
                fieldAttributes={getFieldAttributes(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.DECISION_DATE)}
                name='decision_date'
                invisibleLabel={largeScreen}
                overrideValues={{label: CollectionCourtDecisionFieldTitles.DECISION_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={9} large={4}>
            <Authorization allow={isFieldAllowedToEdit(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.NOTE)}>
              <FormField
                disableDirty
                fieldAttributes={getFieldAttributes(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.NOTE)}
                invisibleLabel={largeScreen}
                name='note'
                overrideValues={{label: CollectionCourtDecisionFieldTitles.NOTE}}
              />
            </Authorization>
          </Column>
        </Row>
        <ButtonWrapper>
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
        </ButtonWrapper>
      </Fragment>
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
)(CollectionCourtDecisionPanelR);
