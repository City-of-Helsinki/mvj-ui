//@flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import classNames from 'classnames';

import CloseButton from '$components/button/CloseButton';
import Comment from './Comment';
import CommentArchived from './CommentArchived';
import NewCommentForm from './forms/NewCommentForm';

type Props = {
  comments: Array<Object>,
  dispatch: Function,
  isOpen: boolean,
  onAddComment: Function,
  onArchive: Function,
  onClose: Function,
  onDelete: Function,
  onEdit: Function,
  onUnarchive: Function,
}

class CommentPanel extends Component {
  props: Props

  getCommentsByType = (comments: Array<Object>, type: string) => {
    if(!comments || !comments.length) {return [];}
    return comments.filter((comment) => {return comment.type === type;});
  }

  getArchivedComments = (comments: Array<Object>) => {
    if(!comments || !comments.length) {return [];}
    return comments.filter((comment) => {return comment.archived === true;});
  }

  getCurrentComments = (comments: Array<Object>) => {
    if(!comments || !comments.length) {return [];}
    return comments.filter((comment) => {return comment.archived !== true;});
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
      onDelete,
      onEdit,
      onUnarchive,
    } = this.props;

    const archivedComments = this.getArchivedComments(comments);
    const archivedInvoicingComments = this.getCommentsByType(archivedComments, '0');
    const archivedCommunicationComments = this.getCommentsByType(archivedComments, '1');
    const archivedContractTermsComments = this.getCommentsByType(archivedComments, '2');
    const archivedPreparationComments = this.getCommentsByType(archivedComments, '3');
    const currentComments = this.getCurrentComments(comments);
    const currentInvoicingComments = this.getCommentsByType(currentComments, '0');
    const currentCommunicationComments = this.getCommentsByType(currentComments, '1');
    const currentContractTermsComments = this.getCommentsByType(currentComments, '2');
    const currentPreparationComments = this.getCommentsByType(currentComments, '3');


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
          {!currentComments || !currentComments.length && <p>Ei ajankohtaisia kommentteja</p>}
          {currentComments && !!currentComments.length &&
            <div className='comments'>
              {currentInvoicingComments && !!currentInvoicingComments.length &&
                <div className='comments-section'>
                  <h3>Laskutus ja perintä</h3>
                  {currentInvoicingComments.map((comment) => {
                    return (
                      <Comment
                        key={comment.id}
                        date={comment.date}
                        onArchive={() => onArchive(comment)}
                        onDelete={() => onDelete(comment)}
                        onEdit={(newText) => onEdit(comment, newText)}
                        text={comment.text}
                        user={comment.user}
                      />
                    );
                  })}
                </div>
              }
              {currentCommunicationComments && !!currentCommunicationComments.length &&
                <div className='comments-section'>
                  <h3>Yhteydenpito</h3>
                  {currentCommunicationComments.map((comment) => {
                    return (
                      <Comment
                        key={comment.id}
                        date={comment.date}
                        onArchive={() => onArchive(comment)}
                        onDelete={() => onDelete(comment)}
                        onEdit={(newText) => onEdit(comment, newText)}
                        text={comment.text}
                        user={comment.user}
                      />
                    );
                  })}
                </div>
              }
              {currentContractTermsComments && !!currentContractTermsComments.length &&
                <div className='comments-section'>
                  <h3>Sopimusehdot</h3>
                  {currentContractTermsComments.map((comment) => {
                    return (
                      <Comment
                        key={comment.id}
                        date={comment.date}
                        onArchive={() => onArchive(comment)}
                        onDelete={() => onDelete(comment)}
                        onEdit={(newText) => onEdit(comment, newText)}
                        text={comment.text}
                        user={comment.user}
                      />
                    );
                  })}
                </div>
              }
              {currentPreparationComments && !!currentPreparationComments.length &&
                <div className='comments-section'>
                  <h3>Valmistelu</h3>
                  {currentPreparationComments.map((comment) => {
                    return (
                      <Comment
                        key={comment.id}
                        date={comment.date}
                        onArchive={() => onArchive(comment)}
                        onDelete={() => onDelete(comment)}
                        onEdit={(newText) => onEdit(comment, newText)}
                        text={comment.text}
                        user={comment.user}
                      />
                    );
                  })}
                </div>
              }
            </div>
          }

          <h2 className='archived'>Arkistoidut</h2>
          {!archivedComments || !archivedComments.length && <p>Ei ajankohtaisia kommentteja</p>}
          {archivedComments && !!archivedComments.length &&
            <div className='comments archived'>
              {archivedInvoicingComments && !!archivedInvoicingComments.length &&
                <div className='comments-section'>
                  <h3>Laskutus ja perintä</h3>
                  {archivedInvoicingComments.map((comment) => {
                    return (
                      <CommentArchived
                        key={comment.id}
                        date={comment.date}
                        onDelete={() => onDelete(comment)}
                        onEdit={(newText) => onEdit(comment, newText)}
                        onUnarchive={() => onUnarchive(comment)}
                        text={comment.text}
                        user={comment.user}
                      />
                    );
                  })}
                </div>
              }
              {archivedCommunicationComments && !!archivedCommunicationComments.length &&
                <div className='comments-section'>
                  <h3>Yhteydenpito</h3>
                  {archivedCommunicationComments.map((comment) => {
                    return (
                      <CommentArchived
                        key={comment.id}
                        date={comment.date}
                        onDelete={() => onDelete(comment)}
                        onEdit={(newText) => onEdit(comment, newText)}
                        onUnarchive={() => onUnarchive(comment)}
                        text={comment.text}
                        user={comment.user}
                      />
                    );
                  })}
                </div>
              }
              {archivedContractTermsComments && !!archivedContractTermsComments.length &&
                <div className='comments-section'>
                  <h3>Sopimusehdot</h3>
                  {archivedContractTermsComments.map((comment) => {
                    return (
                      <CommentArchived
                        key={comment.id}
                        date={comment.date}
                        onDelete={() => onDelete(comment)}
                        onEdit={(newText) => onEdit(comment, newText)}
                        onUnarchive={() => onUnarchive(comment)}
                        text={comment.text}
                        user={comment.user}
                      />
                    );
                  })}
                </div>
              }
              {archivedPreparationComments && !!archivedPreparationComments.length &&
                <div className='comments-section'>
                  <h3>Valmistelu</h3>
                  {archivedPreparationComments.map((comment) => {
                    return (
                      <CommentArchived
                        key={comment.id}
                        date={comment.date}
                        onDelete={() => onDelete(comment)}
                        onEdit={(newText) => onEdit(comment, newText)}
                        onUnarchive={() => onUnarchive(comment)}
                        text={comment.text}
                        user={comment.user}
                      />
                    );
                  })}
                </div>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

export default connect(null, null, null, {withRef: true})(CommentPanel);
