import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { initialize, isDirty } from "redux-form";
import { withRouter } from "react-router";
import classNames from "classnames";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import Authorization from "/src/components/authorization/Authorization";
import CheckboxInput from "/src/components/inputs/CheckboxInput";
import CloseButton from "/src/components/button/CloseButton";
import Comment from "./Comment";
import FormText from "/src/components/form/FormText";
import NewCommentForm from "./NewCommentForm";
import { clearEditFlags, createComment, receiveIsSaveClicked } from "/src/comments/actions";
import { ConfirmationModalTexts, FormNames, Methods } from "enums";
import { ButtonColors } from "/src/components/enums";
import { CommentFieldPaths } from "/src/comments/enums";
import { getFieldOptions, isFieldAllowedToEdit, isMethodAllowed, sortStringByKeyDesc } from "util/helpers";
import { getContentComments } from "/src/comments/helpers";
import { getAttributes as getCommentAttributes, getCommentsByLease, getEditModeFlags, getMethods as getCommentMethods } from "/src/comments/selectors";
import { getCurrentLease } from "/src/leases/selectors";
import { getUserActiveServiceUnit } from "usersPermissions/selectors";
import type { Attributes, Methods as MethodsType } from "types";
import type { CommentList } from "/src/comments/types";
import type { Lease } from "/src/leases/types";
import type { UserServiceUnit } from "usersPermissions/types";
type Props = {
  clearEditFlags: (...args: Array<any>) => any;
  commentAttributes: Attributes;
  commentList: CommentList;
  commentMethods: MethodsType;
  createComment: (...args: Array<any>) => any;
  currentLease: Lease;
  editModeFlags: Record<string, any>;
  initialize: (...args: Array<any>) => any;
  isNewCommentFormDirty: boolean;
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  userActiveServiceUnit: UserServiceUnit;
};
type State = {
  allowEdit: boolean;
  commentAttributes: Attributes;
  commentMethods: MethodsType;
  comments: Array<Record<string, any>>;
  commentList: CommentList;
  isClosing: boolean;
  isOpening: boolean;
  selectedTopics: Array<string>;
  topicOptions: Array<Record<string, any>>;
};

const getCommentsByTopic = (comments: Array<Record<string, any>>, topic: Record<string, any>): Array<Record<string, any>> => {
  if (!comments || !comments.length) {
    return [];
  }

  return comments.filter(comment => comment.topic === topic.value);
};

class CommentPanel extends PureComponent<Props, State> {
  component: any;
  firstCommentModalField: any;
  state = {
    allowEdit: false,
    commentAttributes: null,
    commentMethods: null,
    comments: [],
    commentList: [],
    isClosing: false,
    isOpening: false,
    selectedTopics: [],
    topicOptions: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.commentList !== state.commentList) {
      newState.commentList = props.commentList;
      newState.comments = getContentComments(props.commentList);
    }

    if (props.commentAttributes !== state.commentAttributes) {
      newState.commentAttributes = props.commentAttributes;
      newState.topicOptions = getFieldOptions(props.commentAttributes, CommentFieldPaths.TOPIC, false);
    }

    if (props.commentMethods !== state.commentMethods || props.commentAttributes !== state.commentAttributes) {
      newState.commentAttributes = props.commentAttributes;
      newState.commentMethods = props.commentMethods;
      newState.allowEdit = isFieldAllowedToEdit(props.commentAttributes, CommentFieldPaths.TOPIC) && isMethodAllowed(props.commentMethods, Methods.PATCH);
    }

    return newState;
  }

  componentDidMount() {
    const {
      receiveIsSaveClicked
    } = this.props;
    receiveIsSaveClicked(false);
    this.component.addEventListener('transitionend', this.transitionEnds);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.initializeNewCommentForm();
      this.setState({
        isOpening: true
      });
    } else if (prevProps.isOpen && !this.props.isOpen) {
      this.setState({
        isClosing: true
      });
    }
  }

  componentWillUnmount() {
    const {
      clearEditFlags
    } = this.props;
    clearEditFlags();
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  transitionEnds = () => {
    const {
      isClosing
    } = this.state;
    const {
      clearEditFlags
    } = this.props;

    if (isClosing) {
      clearEditFlags();
    }

    this.setState({
      isClosing: false,
      isOpening: false
    });
  };
  getFilteredComments = () => {
    const {
      comments,
      selectedTopics
    } = this.state;
    const sortedComments = [...comments].sort((a, b) => sortStringByKeyDesc(a, b, 'modified_at'));
    return selectedTopics.length ? sortedComments.filter(comment => selectedTopics.indexOf(comment.topic) !== -1) : sortedComments;
  };
  setComponentRef = (element: any) => {
    this.component = element;
  };
  createComment = (text: string, topic: number) => {
    const {
      createComment,
      currentLease
    } = this.props;
    createComment({
      lease: currentLease.id,
      text: text,
      topic: topic
    });
  };
  initializeNewCommentForm = () => {
    const {
      initialize
    } = this.props;
    initialize(FormNames.LEASE_NEW_COMMENT, {
      text: '',
      topic: ''
    });
  };
  handleFilterChange = (value: Array<string>) => {
    this.setState({
      selectedTopics: value
    });
  };

  render() {
    const {
      commentMethods,
      currentLease,
      editModeFlags,
      isNewCommentFormDirty,
      isOpen,
      onClose,
      receiveIsSaveClicked,
      userActiveServiceUnit
    } = this.props;
    const {
      allowEdit,
      comments,
      isClosing,
      isOpening,
      selectedTopics,
      topicOptions
    } = this.state;
    const filteredComments = this.getFilteredComments();

    const isServiceUnitSameAsActiveServiceUnit = () => {
      return userActiveServiceUnit?.id === currentLease?.service_unit?.id;
    };

    return <div ref={this.setComponentRef} className={classNames('comment-panel', {
      'is-panel-open': isOpen
    })}>
        <div hidden={!isOpen && !isClosing && !isOpening}>
          <div className='comment-panel__wrapper'>
            <div className='comment-panel__title'>
              <h1>Kommentit</h1>
              <AppConsumer>
                {({
                dispatch
              }) => {
                const isAnyCommentEditOpen = () => {
                  if (isEmpty(editModeFlags)) return false;

                  for (const key of Object.keys(editModeFlags)) {
                    if (editModeFlags[key]) return true;
                  }

                  return false;
                };

                const handleClose = () => {
                  if (isNewCommentFormDirty || isAnyCommentEditOpen()) {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        onClose();
                        receiveIsSaveClicked(false);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: ConfirmationModalTexts.CLOSE_COMMENT_PANEL.BUTTON,
                      confirmationModalLabel: ConfirmationModalTexts.CLOSE_COMMENT_PANEL.LABEL,
                      confirmationModalTitle: ConfirmationModalTexts.CLOSE_COMMENT_PANEL.TITLE
                    });
                  } else {
                    onClose();
                    receiveIsSaveClicked(false);
                  }
                };

                return <CloseButton className='position-topright' onClick={handleClose} title='Sulje' />;
              }}
              </AppConsumer>
            </div>

            <Authorization allow={isMethodAllowed(commentMethods, Methods.POST) && isServiceUnitSameAsActiveServiceUnit()}>
              <NewCommentForm onAddComment={this.createComment} />
            </Authorization>

            {comments && !!comments.length && topicOptions && !!topicOptions.length && <div className='comment-panel__filters'>
                <span className='comment-panel__filters-title'>Suodatus</span>

                <CheckboxInput checkboxName='checkbox-buttons-document-type' legend='Suodata kommentteja' onChange={this.handleFilterChange} options={topicOptions} value={selectedTopics} />
              </div>}

            {!filteredComments || !filteredComments.length && <div className='comment-panel__comments'>
                <FormText>Ei kommentteja</FormText>
              </div>}
            {filteredComments && !!filteredComments.length && <div className='comment-panel__comments'>
                {topicOptions && !!topicOptions.length && topicOptions.map(topic => {
              const comments = getCommentsByTopic(filteredComments, topic);
              if (!comments.length) return null;
              return <div className='comment-panel__comments-section' key={topic.value}>
                      <h3>{topic.label}</h3>
                      {comments.map(comment => <Comment key={comment.id} allowEdit={allowEdit} comment={comment} user={comment.user} />)}
                    </div>;
            })}
              </div>}
          </div>
        </div>
      </div>;
  }

}

export default flowRight(withRouter, connect(state => {
  const currentLease = getCurrentLease(state);
  return {
    commentAttributes: getCommentAttributes(state),
    commentList: getCommentsByLease(state, currentLease.id),
    commentMethods: getCommentMethods(state),
    currentLease: currentLease,
    editModeFlags: getEditModeFlags(state),
    isNewCommentFormDirty: isDirty(FormNames.LEASE_NEW_COMMENT)(state),
    userActiveServiceUnit: getUserActiveServiceUnit(state)
  };
}, {
  clearEditFlags,
  createComment,
  initialize,
  receiveIsSaveClicked
}))(CommentPanel) as React.ComponentType<any>;