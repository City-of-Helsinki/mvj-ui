import React from "react";
const Context: React.Context<Partial<ModalContextState>> = React.createContext(
  {},
);
export const ActionTypes = {
  HIDE_CONFIRMATION_MODAL: "HIDE_CONFIRMATION_MODAL",
  SHOW_CONFIRMATION_MODAL: "SHOW_CONFIRMATION_MODAL",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.HIDE_CONFIRMATION_MODAL:
      return { ...state, isConfirmationModalOpen: false };

    case ActionTypes.SHOW_CONFIRMATION_MODAL: {
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
  }
};

type Props = {
  children: any;
};
type ModalContextState = {
  confirmationFunction: ((...args: Array<any>) => any) | null | undefined;
  confirmationModalButtonClassName: string | null | undefined;
  confirmationModalButtonText: string | null | undefined;
  confirmationModalLabel: string | null | undefined;
  confirmationModalTitle: string | null | undefined;
  isConfirmationModalOpen: boolean;
  modalDispatch: (...args: Array<any>) => any;
};
export class ModalProvider extends React.Component<Props, ModalContextState> {
  state: ModalContextState = {
    confirmationFunction: null,
    confirmationModalButtonClassName: null,
    confirmationModalButtonText: null,
    confirmationModalLabel: null,
    confirmationModalTitle: null,
    isConfirmationModalOpen: false,
    modalDispatch: (action) => {
      this.setState((state) => reducer(state, action));
    },
  };

  render() {
    const {
      state,
      props: { children },
    } = this;
    return <Context.Provider value={state}>{children}</Context.Provider>;
  }
}
export const ModalConsumer = Context.Consumer;
