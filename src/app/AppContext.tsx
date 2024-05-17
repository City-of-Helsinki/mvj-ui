import { $Shape } from "utility-types";
import React from "react";
const Context: React.Context<$Shape<AppContextState>> = React.createContext({});
export const ActionTypes = {
  HIDE_CONFIRMATION_MODAL: 'HIDE_CONFIRMATION_MODAL',
  SHOW_CONFIRMATION_MODAL: 'SHOW_CONFIRMATION_MODAL'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.HIDE_CONFIRMATION_MODAL:
      return { ...state,
        isConfirmationModalOpen: false
      };

    case ActionTypes.SHOW_CONFIRMATION_MODAL:
      const {
        confirmationFunction,
        confirmationModalButtonClassName,
        confirmationModalButtonText,
        confirmationModalLabel,
        confirmationModalTitle
      } = action;
      return { ...state,
        confirmationFunction: confirmationFunction,
        confirmationModalButtonClassName: confirmationModalButtonClassName,
        confirmationModalButtonText: confirmationModalButtonText,
        confirmationModalLabel: confirmationModalLabel,
        confirmationModalTitle: confirmationModalTitle,
        isConfirmationModalOpen: true
      };
  }
};

type Props = {
  children: any;
};
type AppContextState = {
  confirmationFunction: ((...args: Array<any>) => any) | null | undefined;
  confirmationModalButtonClassName: string | null | undefined;
  confirmationModalButtonText: string | null | undefined;
  confirmationModalLabel: string | null | undefined;
  confirmationModalTitle: string | null | undefined;
  isConfirmationModalOpen: boolean;
  dispatch: (...args: Array<any>) => any;
};
export class AppProvider extends React.Component<Props, AppContextState> {
  state: AppContextState = {
    confirmationFunction: null,
    confirmationModalButtonClassName: null,
    confirmationModalButtonText: null,
    confirmationModalLabel: null,
    confirmationModalTitle: null,
    isConfirmationModalOpen: false,
    dispatch: action => {
      this.setState(state => reducer(state, action));
    }
  };

  render(): React.ReactNode {
    const {
      state,
      props: {
        children
      }
    } = this;
    return <Context.Provider value={state}>{children}</Context.Provider>;
  }

}
export const AppConsumer = Context.Consumer;