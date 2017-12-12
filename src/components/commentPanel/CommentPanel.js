//@flow
import React, {Component} from 'react';
import classnames from 'classnames';

import Button from '../Button';
import TextAreaInput from '../TextAreaInput';
import {formatDate} from '../../util/helpers';

type Props = {
  comments: Array<Object>,
  isOpen: boolean,
  onClose: Function,
  onAddComment: Function,
}

type State = {
  comment: string,
}

class CommentPanel extends Component {
  props: Props

  state: State = {
    comment: '',
  }

  render () {
    const {comments, isOpen, onAddComment, onClose} = this.props;
    const {comment} = this.state;

    return (
      <div className={classnames('comment-panel', {'is-panel-open': isOpen}) }>
        <div className='comment-panel__title-row'>
          <div className='title'>
            <h1>Kommentit</h1>
          </div>
          <div className='close-button-container'>
            <a onClick={onClose}></a>
          </div>
        </div>
        <div className='comment-panel__textarea-container'>
          <TextAreaInput
            onChange={(e) => this.setState({comment: e.target.value})}
            placeholder='Kirjoita kommentti...'
            rows={5}
            value={comment}
          />
        </div>
        <div className='commant-panel__button-container'>
          <Button
            className='button-green no-margin'
            disabled={!comment}
            onClick={() => onAddComment(comment)}
            text='Lisää kommentti'
          />
        </div>
        <div className='comment-panel__comments'>
          {comments && comments.length > 0 && comments.map((comment, index) => {
            return (
              <div key={index} className='comment'>
                <p className='comment-text'>
                  {comment.text}
                </p>
                <p className='comment-info'>
                  <span className='user'>{comment.user}, </span><span className='date'>{formatDate(comment.date)}</span>
                </p>

              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CommentPanel;
