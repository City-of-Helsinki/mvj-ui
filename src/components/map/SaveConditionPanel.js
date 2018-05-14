// @flow
import React, {Component} from 'react';
import classNames from 'classnames';

import Button from '$components/button/Button';
import TextAreaInput from '$components/inputs/TextAreaInput';

type Props = {
  createCondition: Function,
  disableSave: boolean,
  onCancel: Function,
  show: boolean,
}

type State = {
  comment: string,
}

class SaveConditionPanel extends Component<Props, State> {
  state = {
    comment: '',
  }

  clearCommentField = () => {
    this.setState({comment: ''});
  }

  render() {
    const {createCondition, disableSave, onCancel, show} = this.props;
    const {comment} = this.state;

    return (
      <div className={classNames('save-condition-panel', {'is-panel-open': show})}>
        <div className='save-condition-panel__container'>
          <div className='save-condition-panel__comment-wrapper'>
            <TextAreaInput
              className="no-margin"
              onChange={(e) => this.setState({comment: e.target.value})}
              placeholder='Kirjoita huomautus'
              rows={1}
              value={comment}
            />
          </div>
          <div className='save-condition-panel__buttons-wrapper'>
            <Button
              className='button-red'
              label='Peruuta'
              onClick={onCancel}
              title='Peruuta'
            />
            <Button
              className='button-green no-margin'
              disabled={disableSave}
              label='Tallenna'
              onClick={() => createCondition(this.state.comment)}
              title='Tallenna muistettava ehto'
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SaveConditionPanel;
