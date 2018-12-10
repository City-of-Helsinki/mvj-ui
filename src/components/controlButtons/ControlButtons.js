// @flow
import React from 'react';
import Button from '../button/Button';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import {CancelChangesModalTexts} from '$src/enums';
import {hasAnyPageDirtyForms} from '$src/helpers';
import {ButtonColors} from '$components/enums';

type Props = {
  commentAmount?: number,
  isCancelDisabled?: boolean,
  isCopyDisabled?: boolean,
  isEditDisabled?: boolean,
  isEditMode: boolean,
  isSaveDisabled: boolean,
  onCancel: Function,
  onComment?: Function,
  onCopy?: Function,
  onEdit?: Function,
  onSave: Function,
  showCommentButton?: boolean,
  showCopyButton?: boolean,
}

const ControlButtons = ({
  commentAmount,
  isCancelDisabled = false,
  isCopyDisabled = true,
  isEditDisabled = false,
  isEditMode,
  isSaveDisabled = true,
  onCancel,
  onComment = () => console.error('Comment action missing'),
  onCopy = () => console.error('Copy action missing'),
  onEdit = () => console.error('Edit action missing'),
  onSave,
  showCommentButton = true,
  showCopyButton = false,
}: Props) => {
  const handleComment = () => {
    onComment();
  };

  const handleCommentKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();

      handleComment();
    }
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        const handleCancel = () => {
          const hasDirtyPages = hasAnyPageDirtyForms();

          if(hasDirtyPages) {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                onCancel();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: CancelChangesModalTexts.BUTTON,
              confirmationModalLabel: CancelChangesModalTexts.LABEL,
              confirmationModalTitle: CancelChangesModalTexts.TITLE,
            });
          } else {
            onCancel();
          }
        };

        const handleCopy = () => {
          const hasDirtyPages = hasAnyPageDirtyForms();

          if(hasDirtyPages) {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                onCopy();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: CancelChangesModalTexts.BUTTON,
              confirmationModalLabel: CancelChangesModalTexts.LABEL,
              confirmationModalTitle: CancelChangesModalTexts.TITLE,
            });
          } else {
            onCopy();
          }
        };

        return(
          <div className='control-buttons'>
            {isEditMode
              ? (
                <div className='left-buttons'>
                  <Button
                    className={ButtonColors.SECONDARY}
                    disabled={isCancelDisabled}
                    onClick={handleCancel}
                    text='Hylkää muutokset'
                  />
                  {showCopyButton &&
                    <Button
                      className={ButtonColors.NEUTRAL}
                      disabled={isCopyDisabled}
                      onClick={handleCopy}
                      text='Kopioi'
                    />
                  }
                  <Button
                    className={ButtonColors.SUCCESS}
                    disabled={isSaveDisabled}
                    onClick={onSave}
                    text='Tallenna'
                  />
                </div>
              ) : (
                <div className='left-buttons'>
                  <Button
                    className={ButtonColors.SUCCESS}
                    disabled={isEditDisabled}
                    onClick={onEdit}
                    text='Muokkaa'
                  />
                </div>
              )
            }
            {!!showCommentButton &&
              <div aria-label='Avaa kommentointi' onClick={handleComment} onKeyDown={handleCommentKeyDown} className="comment-button" tabIndex={0}>
                <svg className="commentIcon" focusable='false' viewBox="0 0 30 30">
                  <path d="M.38 1.85h29.24v22.5H18.87l-3 3.1-.84.7-.84-.7-3-3.1H.38V1.85zM2.62 4.1v18h9.43l.42.28L15 25l2.53-2.6.47-.3h9.43v-18zm4.5 3.38h15.76v2.25H7.12zm0 4.5h15.76v2.25H7.12zm0 4.5h11.26v2.25H7.12z"/>
                </svg>
                <div className="circle">{commentAmount || 0}</div>
              </div>
            }
          </div>
        );
      }}
    </AppConsumer>
  );
};

export default ControlButtons;
