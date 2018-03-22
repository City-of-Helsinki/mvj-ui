// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import EditButton from '$components/button/EditButton';
import ShowMore from '../showMore/ShowMore';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {formatDate} from '../../util/helpers';

type Props = {
  date: string,
  onEdit: Function,
  text: string,
  user: Object,
}

type State = {
  editedText: string,
  isEditMode: boolean,
  showMore: boolean,
}

class Comment extends Component {
  props: Props

  state: State = {
    editedText: '',
    isEditMode: false,
    showMore: false,
  }

  handleTextFieldChange = (e: Object) => {
    this.setState({editedText: e.target.value});
  }

  openEditMode = () => {
    const {text} = this.props;
    this.setState({
      editedText: text,
      isEditMode: true,
    });
  }

  render() {
    const {
      editedText,
      isEditMode,
    } = this.state;
    const {
      date,
      onEdit,
      text,
      user,
    } = this.props;
    return (
      <div className='comment'>
        {!isEditMode &&
          <div>
            <EditButton
              className='position-topright'
              onClick={this.openEditMode}
              title='Muokkaa'
            />
            <div className='content-wrapper'>
              <p className='comment-info'>
                <span className='date'>{formatDate(date)}</span>
                &nbsp;
                <span>{user.last_name} {user.first_name}</span>
              </p>
              <div className='comment-text'>
                <ShowMore text={text} />
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
                    onClick={() => {
                      onEdit(editedText);
                      this.setState({isEditMode: false});
                    }}
                    title='Tallenna'
                  />
                  <Button
                    className='button-red pull-right'
                    label='Kumoa'
                    onClick={() => this.setState({isEditMode: false})}
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

export default Comment;
