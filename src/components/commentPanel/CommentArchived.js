// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import DeleteButton from '$components/button/DeleteButton';
import EditButton from '$components/button/EditButton';
import ShowMore from '../showMore/ShowMore';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {formatDate} from '../../util/helpers';

type Props = {
  date: string,
  onDelete: Function,
  onUnarchive: Function,
  text: string,
  user: string,
}

type State = {
  editedText: string,
  isEditMode: boolean,
}

class CommentArchived extends Component {
  props: Props

  state: State = {
    editedText: '',
    isEditMode: false,
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
    const {editedText, isEditMode} = this.state;
    const {
      date,
      onDelete,
      onUnarchive,
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
                <span>{user}</span>
              </p>
              <div className='comment-text'>
                <ShowMore>
                  <div dangerouslySetInnerHTML={{__html: text}}/>
                </ShowMore>
              </div>
            </div>
          </div>
        }
        {isEditMode &&
          <div>
            <DeleteButton
              className='position-topright'
              onClick={onDelete}
              title='Poista'
            />
            <div className='content-wrapper'>
              <Row>
                <Column>
                  <TextAreaInput
                    disabled={true}
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
                    label='Palauta'
                    onClick={() => {
                      onUnarchive();
                      this.setState({isEditMode: false});
                    }}
                    title='Palauta'
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

export default CommentArchived;
