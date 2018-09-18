// @flow
import React from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import BackButton from '$components/button/BackButton';
import {hasAnyPageDirtyForms} from '$src/helpers';


type Props = {
  buttonComponent?: any,
  infoComponent?: any,
  onBack: Function;
}

const ControlButtonBar = ({buttonComponent, infoComponent, onBack}: Props) =>
  <AppConsumer>
    {({dispatch}) => {
      const handleBack = () => {
        const hasDirtyPages = hasAnyPageDirtyForms();

        if(hasDirtyPages) {
          dispatch({
            type: ActionTypes.SHOW_CANCEL_CHANGES_MODAL,
            cancelChangesFunction: () => {
              onBack();
            },
          });
        } else {
          onBack();
        }
      };

      return(
        <div className='control-button-bar'>
          {onBack &&
            <div className='back-button-wrapper'>
              <BackButton
                onClick={handleBack}
              />
            </div>
          }

          <div className='info-component-wrapper'>{infoComponent}</div>
          <div className='control-buttons-wrapper'>{buttonComponent}</div>
        </div>
      );
    }}
  </AppConsumer>;

export default ControlButtonBar;
