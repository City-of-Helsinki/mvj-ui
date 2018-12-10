import React from 'react';

const Context = React.createContext();

export const ActionTypes = {
  HIDE_CONFIRMATION_MODAL: 'HIDE_CONFIRMATION_MODAL',
  SHOW_CONFIRMATION_MODAL: 'SHOW_CONFIRMATION_MODAL',
};

const reducer = (state, action) => {
  switch(action.type) {
    case ActionTypes.HIDE_CONFIRMATION_MODAL:
      return {...state, isConfirmationModalOpen: false};
    case ActionTypes.SHOW_CONFIRMATION_MODAL:
      const {
        confirmationFunction,
        confirmationModalButtonClassName,
        confirmationModalButtonText,
        confirmationModalLabel,
        confirmationModalTitle,
      } = action;

      return {
        ...state,
        confirmationFunction: confirmationFunction,
        confirmationModalButtonClassName: confirmationModalButtonClassName,
        confirmationModalButtonText: confirmationModalButtonText,
        confirmationModalLabel: confirmationModalLabel,
        confirmationModalTitle: confirmationModalTitle,
        isConfirmationModalOpen: true,
      };
  }
};

type Props = {
  children: any,
}

type AppContextState = {
  confirmationFunction: ?Function,
  confirmationModalButtonClassName: ?string,
  confirmationModalButtonText: ?string,
  confirmationModalLabel: ?string,
  confirmationModalTitle: ?string,
  isConfirmationModalOpen: boolean,
}

export class AppProvider extends React.Component<Props, AppContextState> {
  state = {
    confirmationFunction: null,
    confirmationModalButtonClassName: null,
    confirmationModalButtonText: null,
    confirmationModalLabel: null,
    confirmationModalTitle: null,
    isConfirmationModalOpen: false,

    dispatch: action => {
      this.setState(state => reducer(state, action));
    },
  };
  render() {
    const {state, props: {children}} = this;

    return <Context.Provider value={state}>{children}</Context.Provider>;
  }
}

export const AppConsumer = Context.Consumer;
