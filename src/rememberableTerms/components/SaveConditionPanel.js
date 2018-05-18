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
  comment: string,
}

class SaveConditionPanel extends Component<Props, State> {
  state = {
    comment: '',
  }

  setCommentField = (comment: string) => {
    this.setState({comment: comment});
  }

  render() {
    const {disableDelete, disableSave, onCancel, onDelete, onSave, show, title = 'Luo muistettava ehto'} = this.props;
    const {comment} = this.state;

    return (
      <div className={classNames('save-condition-panel', {'is-panel-open': show})}>
        <div className='save-condition-panel__container'>
          <h2>{title}</h2>
          <Row>
            <Column>
              <TextAreaInput
                className="no-margin"
                onChange={(e) => this.setState({comment: e.target.value})}
                placeholder='Kirjoita huomautus'
                rows={4}
                value={comment}
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
                  title='Poista'
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
                  onClick={() => onSave(this.state.comment)}
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
