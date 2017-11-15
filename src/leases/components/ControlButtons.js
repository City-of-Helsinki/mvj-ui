// @flow
import React from 'react';

import iconComment from '../../../assets/icons/comment.svg';
import Button from '../../components/button';

type Props = {
  isEditMode: boolean,
  onEditClick: Function,
  onCancelClick: Function,
  onSaveClick: Function,
  onCommentClick: Function,
}

const ControlButtons = ({isEditMode, onCancelClick, onEditClick, onSaveClick, onCommentClick}: Props) => {
  return (
    <div className='control-buttons'>
      {isEditMode ?
        <div className='left-buttons'>
          <Button className='button-red' text='Kumoa' onClick={onCancelClick}/>
          <Button className='button-green' text='Tallenna' onClick={onSaveClick}/>
        </div>
        :
        <div className='left-buttons'>
          <Button text='Muokkaa' onClick={onEditClick}/>
        </div>
      }
      <button className='comment-button' onClick={onCommentClick}><img src={iconComment} /></button>
    </div>
  );
};

export default ControlButtons;
