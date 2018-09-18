// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Button from '$components/button/Button';
import FormFieldLabel from '$components/form/FormFieldLabel';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {DeleteModalLabels, DeleteModalTitles} from '$src/areaNote/enums';

type Props = {
  disableDelete: boolean,
  disableSave: boolean,
  onCancel: Function,
  onDelete: Function,
  onSave: Function,
  show: boolean,
  title?: string,
}

type State = {
  note: string,
}

class SaveConditionPanel extends Component<Props, State> {
  firstField: any

  state = {
    note: '',
  }

  componentDidUpdate(prevProps: Props)  {
    if(!prevProps.show && this.props.show) {
      this.firstField.focus();
    }
  }

  setFirstFieldRef = (element: any) => {
    this.firstField = element;
  }

  setNoteField = (note: string) => {
    this.setState({note: note});
  }

  handleFieldChange = (e: any) => {
    this.setState({
      note: e.target.value,
    });
  }

  handleSave = () => {
    const {onSave} = this.props;
    const {note} = this.state;
    onSave(note);
  }

  render() {
    const {disableDelete, disableSave, onCancel, onDelete, show, title = 'Luo muistettava ehto'} = this.props;
    const {note} = this.state;

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleDelete = () => {

            dispatch({
              type: ActionTypes.SHOW_DELETE_MODAL,
              deleteFunction: () => {
                onDelete();
              },
              deleteModalLabel: DeleteModalLabels.AREA_NOTE,
              deleteModalTitle: DeleteModalTitles.AREA_NOTE,
            });
          };

          return(
            <div className={classNames('save-condition-panel', {'is-panel-open': show})}>
              <div className='save-condition-panel__container'>
                <h2>{title}</h2>
                <Row>
                  <Column>
                    <FormFieldLabel className='invisible' htmlFor='area-note__comment'>Kirjoita huomautus</FormFieldLabel>
                    <TextAreaInput
                      className="no-margin"
                      id='area-note__comment'
                      onChange={this.handleFieldChange}
                      placeholder='Kirjoita huomautus'
                      rows={4}
                      setRefForField={this.setFirstFieldRef}
                      value={note}
                    />
                  </Column>
                </Row>
                <div className='save-condition-panel__buttons-wrapper'>
                  <Row>
                    <Column>
                      <Button
                        className='button-red'
                        disabled={disableDelete}
                        label='Poista'
                        onClick={handleDelete}
                      />
                      <Button
                        className='button-red'
                        label='Peruuta'
                        onClick={onCancel}
                      />
                      <Button
                        className='button-green'
                        disabled={disableSave}
                        label='Tallenna'
                        onClick={this.handleSave}
                      />
                    </Column>
                  </Row>
                </div>
              </div>
            </div>
          );
        }}
      </AppConsumer>
    );
  }
}

export default SaveConditionPanel;
