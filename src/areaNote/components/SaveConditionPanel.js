// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import TextAreaInput from '$components/inputs/TextAreaInput';

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
  state = {
    note: '',
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
      <div className={classNames('save-condition-panel', {'is-panel-open': show})}>
        <div className='save-condition-panel__container'>
          <h2>{title}</h2>
          <Row>
            <Column>
              <TextAreaInput
                className="no-margin"
                onChange={this.handleFieldChange}
                placeholder='Kirjoita huomautus'
                rows={4}
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
                  onClick={onDelete}
                  title='Poista muistettava ehto'
                />
                <Button
                  className='button-red'
                  label='Peruuta'
                  onClick={onCancel}
                  title='Peruuta'
                />
                <Button
                  className='button-green'
                  disabled={disableSave}
                  label='Tallenna'
                  onClick={this.handleSave}
                  title='Tallenna muistettava ehto'
                />
              </Column>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default SaveConditionPanel;
