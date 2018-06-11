//@flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import classNames from 'classnames';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import CloseButton from '$components/button/CloseButton';
import Comment from './Comment';
import NewCommentForm from './forms/NewCommentForm';
import StyledCheckboxButtons from '$components/button/StyledCheckboxButtons';
import {createComment} from '$src/comments/actions';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {getContentComments} from '$src/leases/helpers';
import {getAttributes, getCommentsByLease} from '$src/comments/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {CommentList} from '$src/comments/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Object,
  commentList: CommentList,
  createComment: Function,
  currentLease: Lease,
  initialize: Function,
  isOpen: boolean,
  onClose: Function,
  params: Object,
}

type State = {
  comments: ?Array<Object>,
  selectedTopics: Array<string>,
  topicOptions: Array<Object>,
  topicFilterOptions: Array<Object>,
}

const getCommentsByTopic = (comments: Array<Object>, topic: Object) => {
  if(!comments || !comments.length) {return [];}
  return comments.filter((comment) => {
    return comment.topic === topic.value;
  });
};

class CommentPanel extends PureComponent<Props, State> {
  state = {
    comments: null,
    selectedTopics: [],
    topicOptions: [],
    topicFilterOptions: [],
  }

  getFilteredComments = (comments: ?Array<Object>) => {
    const {selectedTopics} = this.state;
    if(!comments || !comments.length) {return [];}
    if(!selectedTopics.length) {return comments;}

    return comments.filter((comment) => {
      return selectedTopics.indexOf(comment.topic.toString()) !== -1;}
    );
  }

  componentWillMount() {
    const {attributes, commentList} = this.props;

    if(!isEmpty(attributes)) {
      this.updateOptions();
    }

    if(!isEmpty(commentList)) {
      this.updateContent();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.attributes !== this.props.attributes) {
      this.updateOptions();
    }
    if(prevProps.commentList !== this.props.commentList) {
      this.updateContent();
    }
  }

  updateContent = () => {
    const {commentList} = this.props;
    this.setState({
      comments: getContentComments(commentList),
    });
  }

  updateOptions = () => {
    const {attributes} = this.props;
    this.setState({
      topicOptions: getAttributeFieldOptions(attributes, 'topic'),
      topicFilterOptions: getAttributeFieldOptions(attributes, 'topic', false),
    });
  }

  createComment = (text: string, topic: number) => {
    const {
      createComment,
      currentLease,
    } = this.props;

    createComment({
      lease: currentLease.id,
      text: text,
      topic: topic,
    });

    this.resetNewCommentField();
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
      isOpen,
      onClose,
    } = this.props;
    const {
      comments,
      selectedTopics,
      topicOptions,
      topicFilterOptions,
    } = this.state;

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
            onAddComment={this.createComment}
          />

          <h2>Ajankohtaiset</h2>
          {comments && !!comments.length &&
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
                            comment={comment}
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
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        attributes: getAttributes(state),
        commentList: getCommentsByLease(state, currentLease.id),
        currentLease: currentLease,
      };
    },
    {
      createComment,
      initialize,
    },
  ),
)(CommentPanel);
