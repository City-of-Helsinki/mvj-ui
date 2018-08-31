//@flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {destroy, initialize} from 'redux-form';
import classNames from 'classnames';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import CloseButton from '$components/button/CloseButton';
import Comment from './Comment';
import NewCommentForm from './forms/NewCommentForm';
import StyledCheckboxButtons from '$components/button/StyledCheckboxButtons';
import {createComment} from '$src/comments/actions';
import {getAttributeFieldOptions, sortStringByKeyDesc} from '$src/util/helpers';
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
  destroy: Function,
  initialize: Function,
  isOpen: boolean,
  onClose: Function,
  params: Object,
}

type State = {
  comments: ?Array<Object>,
  isClosing: boolean,
  isOpening: boolean,
  selectedTopics: Array<string>,
  topicOptions: Array<Object>,
  topicFilterOptions: Array<Object>,
}

const getCommentsByTopic = (comments: Array<Object>, topic: Object): Array<Object> => {
  if(!comments || !comments.length) {return [];}
  return comments.filter((comment) => comment.topic === topic.value);
};

class CommentPanel extends PureComponent<Props, State> {
  component: any
  firstCommentModalField: any

  state = {
    comments: null,
    isClosing: false,
    isOpening: false,
    selectedTopics: [],
    topicOptions: [],
    topicFilterOptions: [],
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
    if(!prevProps.isOpen && this.props.isOpen) {
      this.initializeNewCommentForm();
      this.setFocusOnCommentForm();
      this.setState({
        isOpening: true,
      });
    } else if(prevProps.isOpen && !this.props.isOpen) {
      this.setState({
        isClosing: true,
      });
    }
  }

  componentDidMount() {
    this.component.addEventListener('transitionend', this.transitionEnds);
  }

  componentWillUnmount() {
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  transitionEnds = () => {
    this.setState({
      isClosing: false,
      isOpening: false,
    });
  }

  getFilteredComments = (comments: ?Array<Object>) => {
    const {selectedTopics} = this.state;
    if(!comments || !comments.length) {return [];}

    const sortedComments = [...comments].sort((a, b) => sortStringByKeyDesc(a, b, 'modified_at'));

    if(!selectedTopics.length) {return sortedComments;}
    return sortedComments.filter((comment) => selectedTopics.indexOf(comment.topic.toString()) !== -1);
  }

  setComponentRef = (element: any) => {
    this.component = element;
  }

  setRefForFirstCommentFormField = (element: any) => {
    this.firstCommentModalField = element;
  }

  setFocusOnCommentForm = () => {
    this.firstCommentModalField.focus();
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

    this.initializeNewCommentForm();
    this.setFocusOnCommentForm();
  }

  initializeNewCommentForm = () => {
    const {destroy, initialize} = this.props;
    destroy('new-comment-form');
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
      isClosing,
      isOpening,
      selectedTopics,
      topicOptions,
      topicFilterOptions,
    } = this.state;
    const filteredComments = this.getFilteredComments(comments);
    console.log(!isOpen && !isClosing && !isOpening);
    return (
      <div ref={this.setComponentRef} className={classNames('comment-panel', {'is-panel-open': isOpen})}>
        <div hidden={!isOpen && !isClosing && !isOpening}>
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
              setRefForFirstField={this.setRefForFirstCommentFormField}
            />

            <h2>Ajankohtaiset</h2>
            {comments && !!comments.length &&
              <div className='filters'>
                <StyledCheckboxButtons
                  checkboxName='checkbox-buttons-document-type'
                  onChange={this.handleFilterChange}
                  options={topicFilterOptions}
                  selectAllButton
                  selectAllButtonLabel='Kaikki'
                  value={selectedTopics}
                />
              </div>
            }

            {!filteredComments || !filteredComments.length &&
              <div className='comments'>
                <p className='no-comments-text'>Ei kommentteja</p>
              </div>
            }
            {filteredComments && !!filteredComments.length &&
              <div className='comments'>
                {topicOptions && !!topicOptions.length && topicOptions.map((topic) => {
                  const comments = getCommentsByTopic(filteredComments, topic);

                  if(!comments.length) {return null;}

                  return (
                    <div className='comments-section' key={topic.value}>
                      <h3>{topic.label}</h3>
                      {comments.map((comment) =>
                        <Comment
                          key={comment.id}
                          comment={comment}
                          user={comment.user}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            }
          </div>
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
      destroy,
      initialize,
    },
  ),
)(CommentPanel);
