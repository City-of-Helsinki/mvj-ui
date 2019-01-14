// @flow
import React from 'react';
import Button from '../button/Button';

import Authorization from '$components/authorization/Authorization';
import CommentButton from './CommentButton';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import {CancelChangesModalTexts} from '$src/enums';
import {hasAnyPageDirtyForms} from '$src/helpers';
import {ButtonColors} from '$components/enums';

type Props = {
  allowComments?: boolean,
  allowCopy?: boolean,
  allowEdit?: boolean,
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
  allowComments = false,
  allowCopy = false,
  allowEdit = false,
  commentAmount = 0,
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
            {isEditMode &&
              <div className='control-buttons__left-button-wrapper'>
                <Button
                  className={ButtonColors.SECONDARY}
                  disabled={isCancelDisabled}
                  onClick={handleCancel}
                  text='Hylkää muutokset'
                />
                {showCopyButton &&
                  <Authorization allow={allowCopy}>
                    <Button
                      className={ButtonColors.NEUTRAL}
                      disabled={isCopyDisabled}
                      onClick={handleCopy}
                      text='Kopioi'
                    />
                  </Authorization>
                }
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={!allowEdit || isSaveDisabled}
                  onClick={onSave}
                  text='Tallenna'
                />
              </div>
            }
            {!isEditMode &&
              <div className='control-buttons__left-button-wrapper'>
                <Authorization allow={allowEdit}>
                  <Button
                    className={ButtonColors.SUCCESS}
                    disabled={isEditDisabled}
                    onClick={onEdit}
                    text='Muokkaa'
                  />
                </Authorization>
              </div>
            }

            {!!showCommentButton &&
              <Authorization allow={allowComments}>
                <CommentButton
                  commentAmount={commentAmount}
                  onClick={handleComment}
                />
              </Authorization>
            }
          </div>
        );
      }}
    </AppConsumer>
  );
};

export default ControlButtons;
