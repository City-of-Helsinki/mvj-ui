// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import EditButton from '$components/button/EditButton';
import ShowMore from '../showMore/ShowMore';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {editComment, hideEditModeById, showEditModeById} from '$src/comments/actions';
import {ButtonColors} from '$components/enums';
import {getCommentPatchPayload} from '$src/comments/helpers';
import {formatDateObj} from '$util/helpers';
import {getIsEditModeById} from '$src/comments/selectors';

type Props = {
  comment: Object,
  editComment: Function,
  hideEditModeById: Function,
  isEditMode: boolean,
  showEditModeById: Function,
  user: Object,
}

type State = {
  editedText: string,
}

class Comment extends PureComponent<Props, State> {
  state = {
    editedText: '',
  }

  handleTextFieldChange = (e: Object) => {
    this.setState({editedText: e.target.value});
  }

  handleCancelButtonClick = () => {
    const {comment: {id}, hideEditModeById} = this.props;

    hideEditModeById(id);
  }

  handleEditButtonClick = () => {
    const {comment: {id, text}, showEditModeById} = this.props;

    showEditModeById(id);
    this.setState({
      editedText: text,
    });
  }

  handleSaveButtonClick = () => {
    const {comment, editComment} = this.props;
    const {editedText} = this.state;

    editComment(getCommentPatchPayload({...comment, text: editedText}));
  }

  render() {
    const {editedText} = this.state;
    const {comment, isEditMode, user} = this.props;

    return (
      <div className='comment'>
        {!isEditMode &&
          <div>
            <EditButton
              className='position-topright'
              onClick={this.handleEditButtonClick}
              title='Muokkaa kommenttia'
            />
            <div className='comment__content-wrapper'>
              <p className='comment__info'>
                <span className='comment__info_date'>{formatDateObj(comment.modified_at)}</span>
                &nbsp;
                <span>{user.last_name} {user.first_name}</span>
              </p>
              <div className='comment__text'>
                <ShowMore text={comment.text} />
              </div>
            </div>
          </div>
        }
        {isEditMode &&
          <div>
            <div className='comment__content-wrapper no-padding'>
              <Row>
                <Column>
                  <TextAreaInput
                    onChange={this.handleTextFieldChange}
                    id={`comment_${comment.id}`}
                    placeholder='Kommentti'
                    rows={3}
                    value={editedText}
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <div className='comment__button-wrapper'>
                    <Button
                      className={ButtonColors.SECONDARY}
                      onClick={this.handleCancelButtonClick}
                      text='Peruuta'
                    />
                    <Button
                      className={ButtonColors.SUCCESS}
                      disabled={!editedText}
                      onClick={this.handleSaveButtonClick}
                      text='Tallenna'
                    />
                  </div>
                </Column>
              </Row>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      isEditMode: getIsEditModeById(state, props.comment.id),
    };
  },
  {
    editComment,
    hideEditModeById,
    showEditModeById,
  }
)(Comment);
