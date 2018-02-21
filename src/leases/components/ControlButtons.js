// @flow
import React from 'react';
import Button from '../../components/button/Button';

type Props = {
  commentAmount: number,
  isEditMode: boolean,
  isValid: boolean,
  onCancelClick: Function,
  onCommentClick: Function,
  onEditClick: Function,
  onSaveClick: Function,
}

const ControlButtons = ({commentAmount, isEditMode, isValid, onCancelClick, onCommentClick, onEditClick, onSaveClick}: Props) => {
  return (
    <div className='control-buttons'>
      {isEditMode ?
        <div className='left-buttons'>
          <Button className='button-red' text='Hylkää muutokset' onClick={onCancelClick}/>
          <Button disabled={isValid} className='button-green' text='Tallenna' onClick={onSaveClick}/>
        </div>
        :
        <div className='left-buttons'>
          <Button text='Muokkaa' onClick={onEditClick}/>
        </div>
      }
      <div className="comment-button" onClick={onCommentClick}>
        <svg className="commentIcon" viewBox="0 0 30 30">
          <path d="M.38 1.85h29.24v22.5H18.87l-3 3.1-.84.7-.84-.7-3-3.1H.38V1.85zM2.62 4.1v18h9.43l.42.28L15 25l2.53-2.6.47-.3h9.43v-18zm4.5 3.38h15.76v2.25H7.12zm0 4.5h15.76v2.25H7.12zm0 4.5h11.26v2.25H7.12z"/>
        </svg>
        <div className="circle">{commentAmount}</div>
      </div>
    </div>
  );
};

export default ControlButtons;
