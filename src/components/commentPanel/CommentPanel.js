//@flow
import React, {Component} from 'react';
import classNames from 'classnames';

import Button from '../button/Button';
import TextAreaInput from '../inputs/TextAreaInput';
import {formatDate} from '$util/helpers';

type Props = {
  commentsArchived: Array<Object>,
  commentsNotArchived: Array<Object>,
  isOpen: boolean,
  onAddComment: Function,
  onArchive: Function,
  onClose: Function,
  onUnarchive: Function,
}

type State = {
  comment: string,
}

class CommentPanel extends Component {
  props: Props

  state: State = {
    comment: '',
  }

  resetField = () => {
    this.setState({comment: ''});
  }

  render () {
    const {
      commentsArchived,
      commentsNotArchived,
      isOpen,
      onAddComment,
      onArchive,
      onClose,
      onUnarchive,
    } = this.props;
    const {comment} = this.state;

    return (
      <div className={classNames('comment-panel', {'is-panel-open': isOpen}) }>
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
            label='Lisää kommentti'
            onClick={() => onAddComment(comment)}
            title='Lisää kommentti'
          />
        </div>
        <div className='comment-panel__comments'>
          <h2 className="comments-title">Ajankohtaiset</h2>
          {commentsNotArchived && commentsNotArchived.length === 0 && <p>Ei ajankohtaisia kommentteja</p>}
          {commentsNotArchived && commentsNotArchived.length > 0 && commentsNotArchived.map((comment, index) => {
            return (
              <div key={index} className='comment'>
                <span className="archive-icon" onClick={() => onArchive(comment)}></span>
                <p className='comment-text'>
                  {comment.text}
                </p>
                <p className='comment-info'>
                  <span className='user'>{comment.user}, </span><span className='date'>{formatDate(comment.date)}</span>
                </p>

              </div>
            );
          })}
          <h2 className="comments-title archived">Arkistoidut</h2>
          {commentsArchived && commentsArchived.length === 0 && <p>Ei arkistoituja kommentteja</p>}
          {commentsArchived && commentsArchived.length > 0 && commentsArchived.map((comment, index) => {
            return (
              <div key={index} className='comment comment-archived'>
                <span className="archive-icon" onClick={() => onUnarchive(comment)}></span>
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
