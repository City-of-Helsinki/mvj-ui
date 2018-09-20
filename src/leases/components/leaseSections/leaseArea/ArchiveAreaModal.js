// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import Modal from '$components/modal/Modal';
import {FormNames} from '$src/leases/enums';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  archivedNote: string,
  archivedDecision: ?number,
  attributes: Attributes,
  decisionOptions: Array<Object>,
  isOpen: boolean,
  label: string,
  onArchive: Function,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
  title: string,
  valid: boolean,
}

class ArchiveAreaModal extends Component<Props> {
  firstField: any

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      if(this.firstField) {
        this.firstField.focus();
      }
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  }

  handleArchive = () => {
    const {archivedDecision, archivedNote, onArchive} = this.props;

    onArchive({
      archived_at: new Date().toISOString(),
      archived_note: archivedNote,
      archived_decision: archivedDecision,
    });
  }

  render() {
    const {
      attributes,
      decisionOptions,
      isOpen,
      onCancel,
      onClose,
      valid,
    } = this.props;

    return (
      <div>
        <Modal
          className='modal-small modal-autoheight modal-center'
          title='Arkistoi kohde'
          isOpen={isOpen}
          onClose={onClose}
        >
          <FormText>Haluatko varmasti arkistoida kohteen?</FormText>

          <Row>
            <Column>
              <FormField
                setRefForField={this.setRefForFirstField}
                fieldAttributes={get(attributes, 'lease_areas.child.children.archived_decision')}
                name='archived_decision'
                overrideValues={{
                  label: 'Päätös',
                  options: decisionOptions,
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <FormField
                fieldAttributes={get(attributes, 'lease_areas.child.children.archived_note')}
                name='archived_note'
                overrideValues={{
                  label: 'Huomautus',
                }}
              />
            </Column>
          </Row>
          <div className='confirmation-modal__footer'>
            <Button
              className='button-red'
              onClick={onCancel}
              text='Peruuta'
            />
            <Button
              className='button-green'
              disabled={!valid}

              onClick={this.handleArchive}
              text='Arkistoi'
            />
          </div>
        </Modal>
      </div>
    );
  }
}

const formName = FormNames.ARCHIVE_AREA;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        archivedDecision: selector(state, 'archived_decision'),
        archivedNote: selector(state, 'archived_note'),
        attributes: getAttributes(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(ArchiveAreaModal);
