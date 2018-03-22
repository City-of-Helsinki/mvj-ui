//@flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import classNames from 'classnames';
import flowRight from 'lodash/flowRight';

import CloseButton from '$components/button/CloseButton';
import Comment from './Comment';
import NewCommentForm from './forms/NewCommentForm';
import StyledCheckboxButtons from '$components/button/StyledCheckboxButtons';
import {getCommentAttributes} from '$src/leases/selectors';
import {fetchCommentAttributes} from '$src/leases/actions';
import {getAttributeFieldOptions} from '$src/util/helpers';

type Props = {
  attributes: Object,
  comments: Array<Object>,
  dispatch: Function,
  fetchCommentAttributes: Function,
  isOpen: boolean,
  onAddComment: Function,
  onArchive: Function,
  onClose: Function,
  onDelete: Function,
  onEdit: Function,
  onUnarchive: Function,
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

class CommentPanel extends Component {
  props: Props

  state: State = {
    selectedTopics: [],
  }

  componentWillMount() {
    const {fetchCommentAttributes} = this.props;
    fetchCommentAttributes();
  }

  getCurrentComments = (comments: Array<Object>) => {
    if(!comments || !comments.length) {return [];}
    return comments.filter((comment) => {return comment.is_archived !== true;});
  }

  getFilteredComments = (comments: Array<Object>) => {
    const {selectedTopics} = this.state;
    if(!comments || !comments.length) {return [];}
    if(!selectedTopics.length) {return comments;}

    return comments.filter((comment) => {
      return selectedTopics.indexOf(comment.topic.toString()) !== -1;}
    );
  }

  resetNewCommentField = () => {
    const {dispatch} = this.props;
    dispatch(initialize('new-comment-form', {text: '', type: ''}));
  }

  handleFilterChange = (value: Array<string>) => {
    this.setState({selectedTopics: value});
  }

  render () {
    const {
      attributes,
      comments,
      isOpen,
      onAddComment,
      onClose,
      onEdit,
    } = this.props;

    const topicOptions = getAttributeFieldOptions(attributes, 'topic');
    const {selectedTopics} = this.state;

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
            onAddComment={(text, type) => onAddComment(text, type)}
          />

          <h2>Ajankohtaiset</h2>
          {!!comments.length &&
            <div className='filters'>
              <StyledCheckboxButtons
                checkboxName='checkbox-buttons-document-type'
                onChange={(value) => this.handleFilterChange(value)}
                options={topicOptions}
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
                            onEdit={(newText) => onEdit(comment, newText)}
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
  connect(
    (state) => {
      return {
        attributes: getCommentAttributes(state),
      };
    },
    {
      fetchCommentAttributes,
    },
    null,
    {withRef: true}
  ),
)(CommentPanel);
