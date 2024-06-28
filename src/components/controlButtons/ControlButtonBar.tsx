import React from "react";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import BackButton from "/src/components/button/BackButton";
import { ConfirmationModalTexts } from "enums";
import { ButtonColors } from "/src/components/enums";
import { hasAnyPageDirtyForms } from "/src/util/forms";
type Props = {
  buttonComponent?: any;
  infoComponent?: any;
  onBack: (...args: Array<any>) => any;
};

const ControlButtonBar = ({
  buttonComponent,
  infoComponent,
  onBack
}: Props) => <AppConsumer>
    {({
    dispatch
  }) => {
    const handleBack = () => {
      const hasDirtyPages = hasAnyPageDirtyForms();

      if (hasDirtyPages) {
        dispatch({
          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
          confirmationFunction: () => {
            onBack();
          },
          confirmationModalButtonClassName: ButtonColors.ALERT,
          confirmationModalButtonText: ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
          confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
          confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE
        });
      } else {
        onBack();
      }
    };

    return <div className='control-button-bar'>
          <div className='control-button-bar__wrapper'>
            {onBack && <div className='back-button-wrapper'>
                <BackButton onClick={handleBack} />
              </div>}

            <div className='info-component-wrapper'>{infoComponent}</div>
            <div className='control-buttons-wrapper'>{buttonComponent}</div>
          </div>
        </div>;
  }}
  </AppConsumer>;

export default ControlButtonBar;