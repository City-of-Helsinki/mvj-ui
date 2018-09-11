import React from 'react';

const Context = React.createContext();

export const ActionTypes = {
  HIDE_DELETE_MODAL: 'HIDE_DELETE_MODAL',
  SHOW_DELETE_MODAL: 'SHOW_DELETE_MODAL',
};

const reducer = (state, action) => {
  switch(action.type) {
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
  deleteFunction: ?Function,
  deleteModalLabel: ?string,
  deleteModalTitle: ?string,
  isDeleteModalOpen: boolean,
}

export class AppProvider extends React.Component<Props, AppContextState> {
  state = {
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
