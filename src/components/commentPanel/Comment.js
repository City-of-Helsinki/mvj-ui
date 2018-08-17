// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import EditButton from '$components/button/EditButton';
import ShowMore from '../showMore/ShowMore';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {editComment, hideEditModeById, showEditModeById} from '$src/comments/actions';
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

    comment.text = editedText;
    editComment(comment);
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
              title='Muokkaa'
            />
            <div className='content-wrapper'>
              <p className='comment-info'>
                <span className='date'>{formatDateObj(comment.modified_at)}</span>
                &nbsp;
                <span>{user.last_name} {user.first_name}</span>
              </p>
              <div className='comment-text'>
                <ShowMore text={comment.text} />
              </div>
            </div>
          </div>
        }
        {isEditMode &&
          <div>
            <div className='content-wrapper no-padding'>
              <Row>
                <Column>
                  <TextAreaInput
                    onChange={this.handleTextFieldChange}
                    placeholder='Kommentti'
                    rows={3}
                    value={editedText}
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <Button
                    className='button-green pull-right no-margin-right'
                    disabled={!editedText}
                    label='Tallenna'
                    onClick={this.handleSaveButtonClick}
                    title='Tallenna'
                  />
                  <Button
                    className='button-red pull-right'
                    label='Kumoa'
                    onClick={this.handleCancelButtonClick}
                    title='Kumoa'
                  />
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
