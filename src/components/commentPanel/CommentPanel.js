//@flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import classNames from 'classnames';

import CloseButton from '$components/button/CloseButton';
import Comment from './Comment';
import NewCommentForm from './forms/NewCommentForm';
import {formatDate} from '$util/helpers';

type Props = {
  comments: Array<Object>,
  dispatch: Function,
  isOpen: boolean,
  onAddComment: Function,
  onArchive: Function,
  onClose: Function,
  onUnarchive: Function,
}

class CommentPanel extends Component {
  props: Props

  getArchivedComments = (comments: Array<Object>) => {
    if(!comments || !comments.length) {return [];}
    return comments.filter((comments) => {return comments.archived === true;});
  }

  getCurrentComments = (comments: Array<Object>) => {
    if(!comments || !comments.length) {return [];}
    return comments.filter((comments) => {return comments.archived !== true;});
  }

  resetNewCommentField = () => {
    const {dispatch} = this.props;
    dispatch(initialize('new-comment-form', {text: '', type: ''}));
  }

  render () {
    const {
      comments,
      isOpen,
      onAddComment,
      onArchive,
      onClose,
      onUnarchive,
    } = this.props;

    const archivedComments = this.getArchivedComments(comments);
    const currentComments = this.getCurrentComments(comments);

    return (
      <div className={classNames('comment-panel', {'is-panel-open': isOpen}) }>
        <div className='comment-panel__title-wrapper'>
          <div className='comment-panel__title'>
            <h1>Kommentit</h1>
            <CloseButton
              className='position-topright'
              onClick={onClose}
              title='Sulje'
            />
          </div>
        </div>
        <div className='comment-panel__content-wrapper'>
          <NewCommentForm
            onAddComment={(text, type) => onAddComment(text, type)}
          />

          <h2>Ajankohtaiset</h2>
          <div className='comments'>
            {!currentComments || !currentComments.length && <p>Ei ajankohtaisia kommentteja</p>}
            {currentComments && !!currentComments.length && currentComments.map((comment) => {
              return (
                <Comment
                  key={comment.id}
                  date={comment.date}
                  onArchive={() => onArchive(comment)}
                  onEdit={() => onArchive(comment)}
                  text={comment.text}
                  user={comment.user}
                />
              );
            })}
          </div>

          <h2>Arkistoidut</h2>
          <div className='comments'>
            {!archivedComments || !archivedComments.length && <p>Ei arkistoituja kommentteja</p>}
            {archivedComments && !!archivedComments.length && archivedComments.map((comment, index) => {
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
      </div>
    );
  }
}

export default connect(null, null, null, {withRef: true})(CommentPanel);
