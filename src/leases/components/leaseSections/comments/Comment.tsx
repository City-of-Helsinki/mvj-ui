import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Button from "/src/components/button/Button";
import EditButton from "/src/components/button/EditButton";
import ShowMore from "/src/components/showMore/ShowMore";
import TextAreaInput from "/src/components/inputs/TextAreaInput";
import { editComment, hideEditModeById, showEditModeById } from "/src/comments/actions";
import { ButtonColors } from "/src/components/enums";
import { getPayloadComment } from "/src/comments/helpers";
import { formatDate } from "/src/util/helpers";
import { getIsEditModeById } from "/src/comments/selectors";
type Props = {
  allowEdit: boolean;
  comment: Record<string, any>;
  editComment: (...args: Array<any>) => any;
  hideEditModeById: (...args: Array<any>) => any;
  editMode: boolean;
  showEditModeById: (...args: Array<any>) => any;
  user: Record<string, any>;
};
type State = {
  editedText: string;
};

class Comment extends PureComponent<Props, State> {
  state = {
    editedText: ''
  };
  handleTextFieldChange = (e: Record<string, any>) => {
    this.setState({
      editedText: e.target.value
    });
  };
  handleCancelButtonClick = () => {
    const {
      comment: {
        id
      },
      hideEditModeById
    } = this.props;
    hideEditModeById(id);
  };
  handleEditButtonClick = () => {
    const {
      comment: {
        id,
        text
      },
      showEditModeById
    } = this.props;
    showEditModeById(id);
    this.setState({
      editedText: text
    });
  };
  handleEdit = () => {
    const {
      comment,
      editComment
    } = this.props;
    const {
      editedText
    } = this.state;
    editComment(getPayloadComment({ ...comment,
      text: editedText
    }));
  };

  render() {
    const {
      editedText
    } = this.state;
    const {
      allowEdit,
      comment,
      editMode,
      user
    } = this.props;

    if (editMode) {
      return <div className='comment-panel__comment'>
          <div className='comment-panel__comment_content-wrapper no-padding'>
            <Row>
              <Column>
                <TextAreaInput onChange={this.handleTextFieldChange} id={`comment_${comment.id}`} placeholder='Kommentti' rows={3} value={editedText} />
              </Column>
            </Row>
            <Row>
              <Column>
                <div className='comment-panel__comment_button-wrapper'>
                  <Button className={ButtonColors.SECONDARY} onClick={this.handleCancelButtonClick} text='Peruuta' />
                  <Button className={ButtonColors.SUCCESS} disabled={!editedText} onClick={this.handleEdit} text='Tallenna' />
                </div>
              </Column>
            </Row>
          </div>
        </div>;
    } else {
      return <div className='comment-panel__comment'>
          {allowEdit && <EditButton className='position-topright' onClick={this.handleEditButtonClick} title='Muokkaa kommenttia' />}
          <div className='comment-panel__comment_content-wrapper'>
            <p className='comment-panel__comment_info'>
              <span className='comment-panel__comment_info_date'>{formatDate(comment.modified_at, 'dd.MM.yyyy HH:mm')}</span>
              &nbsp;
              <span>{user.last_name} {user.first_name}</span>
            </p>
            <div className='comment-panel__comment_text'>
              <ShowMore text={comment.text} />
            </div>
          </div>
        </div>;
    }
  }

}

export default connect((state, props) => {
  return {
    editMode: getIsEditModeById(state, props.comment.id)
  };
}, {
  editComment,
  hideEditModeById,
  showEditModeById
})(Comment);