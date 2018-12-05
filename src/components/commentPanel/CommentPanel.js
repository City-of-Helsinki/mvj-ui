//@flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {initialize, isDirty} from 'redux-form';
import classNames from 'classnames';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import CheckboxInput from '$components/inputs/CheckboxInput';
import CloseButton from '$components/button/CloseButton';
import Comment from './Comment';
import NewCommentForm from './forms/NewCommentForm';
import {clearEditFlags, createComment, receiveIsSaveClicked} from '$src/comments/actions';
import {ButtonColors, CloseCommentPanelTexts, FormNames} from '$components/enums';
import {getAttributeFieldOptions, sortStringByKeyDesc} from '$src/util/helpers';
import {getContentComments} from '$src/leases/helpers';
import {getAttributes, getCommentsByLease, getEditModeFlags} from '$src/comments/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {CommentList} from '$src/comments/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Object,
  clearEditFlags: Function,
  commentList: CommentList,
  createComment: Function,
  currentLease: Lease,
  editModeFlags: Object,
  initialize: Function,
  isNewCommentFormDirty: boolean,
  isOpen: boolean,
  onClose: Function,
  params: Object,
  receiveIsSaveClicked: Function,
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

  componentDidMount() {
    const {attributes, commentList, receiveIsSaveClicked} = this.props;

    receiveIsSaveClicked(false);

    if(!isEmpty(attributes)) {
      this.updateOptions();
    }

    if(!isEmpty(commentList)) {
      this.updateContent();
    }

    this.component.addEventListener('transitionend', this.transitionEnds);
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

      this.setState({
        isOpening: true,
      });
    } else if(prevProps.isOpen && !this.props.isOpen) {
      this.setState({
        isClosing: true,
      });
    }
  }

  componentWillUnmount() {
    const {clearEditFlags} = this.props;

    clearEditFlags();
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  transitionEnds = () => {
    const {isClosing} = this.state;
    const {clearEditFlags} = this.props;

    if(isClosing) {
      clearEditFlags();
    }

    this.setState({
      isClosing: false,
      isOpening: false,
    });
  }

  getFilteredComments = (comments: ?Array<Object>) => {
    const {selectedTopics} = this.state;

    if(!comments || !comments.length) return [];

    const sortedComments = [...comments].sort((a, b) => sortStringByKeyDesc(a, b, 'modified_at'));

    if(!selectedTopics.length) return sortedComments;

    return sortedComments.filter((comment) => selectedTopics.indexOf(comment.topic) !== -1);
  }

  setComponentRef = (element: any) => {
    this.component = element;
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
  }

  initializeNewCommentForm = () => {
    const {initialize} = this.props;

    initialize(FormNames.NEW_COMMENT, {text: '', topic: ''});
  }

  handleFilterChange = (value: Array<string>) => {
    this.setState({selectedTopics: value});
  }

  render () {
    const {
      attributes,
      editModeFlags,
      isNewCommentFormDirty,
      isOpen,
      onClose,
      receiveIsSaveClicked,
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

    return (
      <div ref={this.setComponentRef} className={classNames('comment-panel', {'is-panel-open': isOpen})}>
        <div hidden={!isOpen && !isClosing && !isOpening}>
          <div className='comment-panel__wrapper'>
            <div className='comment-panel__title'>
              <h1>Kommentit</h1>
              <AppConsumer>
                {({dispatch}) => {
                  const handleClose = () => {

                    if(isNewCommentFormDirty || !isEmpty(editModeFlags)) {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          onClose();
                          receiveIsSaveClicked(false);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText: CloseCommentPanelTexts.BUTTON,
                        confirmationModalLabel: CloseCommentPanelTexts.LABEL,
                        confirmationModalTitle: CloseCommentPanelTexts.TITLE,
                      });
                    } else {
                      onClose();
                      receiveIsSaveClicked(false);
                    }
                  };

                  return(
                    <CloseButton
                      className='position-topright'
                      onClick={handleClose}
                      title='Sulje'
                    />
                  );
                }}
              </AppConsumer>
            </div>
            <NewCommentForm
              attributes={attributes}
              onAddComment={this.createComment}
            />

            {comments && !!comments.length &&
              <div className='filters'>
                <p className='filters-title'>Suodatus</p>
                <CheckboxInput
                  checkboxName='checkbox-buttons-document-type'
                  legend='Suodata kommentteja'
                  onChange={this.handleFilterChange}
                  options={topicFilterOptions}
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
        editModeFlags: getEditModeFlags(state),
        isNewCommentFormDirty: isDirty(FormNames.NEW_COMMENT)(state),
      };
    },
    {
      clearEditFlags,
      createComment,
      initialize,
      receiveIsSaveClicked,
    },
  ),
)(CommentPanel);
