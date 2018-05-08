//@flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {initialize} from 'redux-form';
import classNames from 'classnames';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import CloseButton from '$components/button/CloseButton';
import Comment from './Comment';
import NewCommentForm from './forms/NewCommentForm';
import StyledCheckboxButtons from '$components/button/StyledCheckboxButtons';
import {createComment, editComment} from '$src/comments/actions';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {getContentComments} from '$src/leases/helpers';
import {getAttributes, getCommentsByLease} from '$src/comments/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {CommentList} from '$src/comments/types';

type Props = {
  attributes: Object,
  commentList: CommentList,
  createComment: Function,
  editComment: Function,
  initialize: Function,
  isOpen: boolean,
  onClose: Function,
  params: Object,
}

type State = {
  selectedTopics: Array<string>,
}

const getCommentsByTopic = (comments: Array<Object>, topic: Object) => {
  if(!comments || !comments.length) {return [];}
  return comments.filter((comment) => {
    return comment.topic === topic.value;
  });
};

class CommentPanel extends Component<Props, State> {
  state = {
    selectedTopics: [],
  }

  getFilteredComments = (comments: Array<Object>) => {
    const {selectedTopics} = this.state;
    if(!comments || !comments.length) {return [];}
    if(!selectedTopics.length) {return comments;}

    return comments.filter((comment) => {
      return selectedTopics.indexOf(comment.topic.toString()) !== -1;}
    );
  }

  createComment = (text: string, topic: number) => {
    const {
      createComment,
      params: {leaseId},
    } = this.props;

    createComment({
      lease: leaseId,
      text: text,
      topic: topic,
    });

    this.resetNewCommentField();
  }

  editComment = (comment: Object, text: string) => {
    const {editComment} = this.props;
    editComment({
      id: get(comment, 'id'),
      lease: get(comment, 'lease'),
      text: text,
      topic: get(comment, 'topic'),
    });
  }

  resetNewCommentField = () => {
    const {initialize} = this.props;
    initialize('new-comment-form', {text: '', topic: ''});
  }

  handleFilterChange = (value: Array<string>) => {
    this.setState({selectedTopics: value});
  }

  render () {
    const {
      attributes,
      commentList,
      isOpen,
      onClose,
    } = this.props;
    const {selectedTopics} = this.state;

    const comments = getContentComments(commentList);
    const topicOptions = getAttributeFieldOptions(attributes, 'topic');
    const topicFilterOptions = getAttributeFieldOptions(attributes, 'topic', false);
    const filteredComments = this.getFilteredComments(comments);

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
            attributes={attributes}
            onAddComment={(text, type) => this.createComment(text, type)}
          />

          <h2>Ajankohtaiset</h2>
          {!!comments.length &&
            <div className='filters'>
              <StyledCheckboxButtons
                checkboxName='checkbox-buttons-document-type'
                onChange={(value) => this.handleFilterChange(value)}
                options={topicFilterOptions}
                selectAllButton
                selectAllButtonLabel='Kaikki'
                value={selectedTopics}
              />
            </div>
          }

          {!filteredComments || !filteredComments.length &&
            <div className='comments'>
              <p className='no-comments-text'>Ei ajankohtaisia kommentteja</p>
            </div>
          }
          {filteredComments && !!filteredComments.length &&
            <div className='comments'>
              {topicOptions && !!topicOptions.length &&
                topicOptions.map((topic) => {
                  const comments = getCommentsByTopic(filteredComments, topic);
                  if(!comments.length) {
                    return null;
                  }
                  return (
                    <div className='comments-section' key={topic.value}>
                      <h3>{topic.label}</h3>
                      {comments.map((comment) => {
                        return (
                          <Comment
                            key={comment.id}
                            date={comment.modified_at}
                            onEdit={(newText) => this.editComment(comment, newText)}
                            text={comment.text}
                            user={comment.user}
                          />
                        );
                      })}
                    </div>
                  );
                })
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        attributes: getAttributes(state),
        commentList: getCommentsByLease(state, currentLease.id),
      };
    },
    {
      createComment,
      editComment,
      initialize,
    },
  ),
)(CommentPanel);
