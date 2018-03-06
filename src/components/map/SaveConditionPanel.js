// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import TextAreaInput from '$components/inputs/TextAreaInput';

type Props = {
  createCondition: Function,
  show: boolean,
}

type State = {
  comment: string,
}

class SaveConditionPanel extends Component {
  props: Props

  state: State = {
    comment: '',
  }

  clearCommentField = () => {
    this.setState({comment: ''});
  }

  render() {
    const {createCondition, show} = this.props;
    const {comment} = this.state;

    return (
      <div className={classNames('save-condition-panel', {'is-panel-open': show})}>
        <div className='save-condition-panel__container'>
          <Row>
            <Column medium={9}>
              <TextAreaInput
                className="no-margin"
                onChange={(e) => this.setState({comment: e.target.value})}
                placeholder='Kirjoita kommentti'
                rows={1}
                value={comment} />
            </Column>
            <Column medium={3} style={{paddingRight: 0, paddingTop: '20px'}}>
              <Button
                className='button-green no-margin full-width'
                onClick={() => createCondition(this.state.comment)}
                text='Lisää muistettava ehto'
              />
            </Column>
          </Row>

        </div>
      </div>
    );
  }
}

export default SaveConditionPanel;
