import React from 'react';

const Context = React.createContext();

export const ActionTypes = {
  HIDE_CANCEL_CHANGES_MODAL: 'HIDE_CANCEL_CHANGES_MODAL',
  SHOW_CANCEL_CHANGES_MODAL: 'SHOW_CANCEL_CHANGES_MODAL',
  HIDE_DELETE_MODAL: 'HIDE_DELETE_MODAL',
  SHOW_DELETE_MODAL: 'SHOW_DELETE_MODAL',
};

const reducer = (state, action) => {
  switch(action.type) {
    case ActionTypes.HIDE_CANCEL_CHANGES_MODAL:
      return {...state, isCancelChangesModalOpen: false};
    case ActionTypes.SHOW_CANCEL_CHANGES_MODAL:
      const {cancelChangesFunction} = action;

      return {
        ...state,
        cancelChangesFunction: cancelChangesFunction,
        isCancelChangesModalOpen: true,
      };
    case ActionTypes.HIDE_DELETE_MODAL:
      return {...state, isDeleteModalOpen: false};
    case ActionTypes.SHOW_DELETE_MODAL:
      const {deleteFunction, deleteModalLabel, deleteModalTitle} = action;
      return {
        ...state,
        deleteFunction: deleteFunction,
        deleteModalLabel: deleteModalLabel,
        deleteModalTitle: deleteModalTitle,
        isDeleteModalOpen: true,
      };
  }
};

type Props = {
  children: any,
}

type AppContextState = {
  cancelChangesFunction: ?Function,
  isCancelChangesModalOpen: boolean,
  deleteFunction: ?Function,
  deleteModalLabel: ?string,
  deleteModalTitle: ?string,
  isDeleteModalOpen: boolean,
}

export class AppProvider extends React.Component<Props, AppContextState> {
  state = {
    cancelChangesFunction: null,
    isCancelChangesModalOpen: false,
    deleteFunction: null,
    deleteModalLabel: null,
    deleteModalTitle: null,
    isDeleteModalOpen: false,

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
