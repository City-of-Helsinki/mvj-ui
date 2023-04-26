// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddIcon from '$components/icons/AddIcon';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import ErrorBlock from '$components/form/ErrorBlock';
import FormFieldLabel from '$components/form/FormFieldLabel';
import InfoIcon from '$components/icons/InfoIcon';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {createUiData, deleteUiData, editUiData} from '$src/uiData/actions';
import {ConfirmationModalTexts} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getFieldAttributes, hasPermissions} from '$util/helpers';
import {getUiDataByKey} from '$src/uiData/helpers';
import {
  getAttributes as getUiDataAttributes,
  getUiDataList,
} from '$src/uiData/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/types';
import type {UiDataList} from '$src/uiData/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type OwnProps = {
  relativeTo?: any,
  enableUiDataEdit?: boolean,
  innerRef?: Function,
  onTooltipClose: Function,
  style?: Object,
  uiDataKey: ?string,
};

type Props = {
  ...OwnProps,
  createUiData: Function,
  deleteUiData: Function,
  editUiData: Function,
  uiDataAttributes: Attributes,
  uiDataList: UiDataList,
  usersPermissions: UsersPermissionsType,
}

type State = {
  allowToAddUiData: boolean,
  allowToDeleteUiData: boolean,
  allowToEditUiData: boolean,
  editedText: string,
  error: ?string,
  isOpen: boolean,
  isSaveClicked: boolean,
  position: 'position-top-left' | 'position-top-right' | 'position-bottom-left' | 'position-bottom-right';
  uiData: ?Object,
  uiDataKey: ?string,
  uiDataList: UiDataList,
  usersPermissions: UsersPermissionsType,
}

class UIDataTooltip extends PureComponent<Props, State> {
  state = {
    allowToAddUiData: false,
    allowToDeleteUiData: false,
    allowToEditUiData: false,
    editedText: '',
    error: undefined,
    isOpen: false,
    isSaveClicked: false,
    position: 'position-bottom-right',
    uiData: null,
    uiDataKey: null,
    uiDataList: [],
    usersPermissions: [],
  }

  componentDidMount() {
    const {uiDataKey} = this.props;

    if(uiDataKey) {
      window.addEventListener('click', this.onDocumentClick);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(!prevState.isOpen && this.state.isOpen) {
      const {uiData} = this.state;
      const editedText = uiData
        ? uiData.value || ''
        : '';

      this.setState({
        editedText: editedText,
        error: this.validate(editedText),
        isSaveClicked: false,
      });
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.usersPermissions !== state.usersPermissions) {
      newState.usersPermissions = props.usersPermissions;
      newState.allowToAddUiData = hasPermissions(props.usersPermissions, UsersPermissions.EDIT_GLOBAL_UI_DATA);
      newState.allowToDeleteUiData = hasPermissions(props.usersPermissions, UsersPermissions.EDIT_GLOBAL_UI_DATA);
      newState.allowToEditUiData = hasPermissions(props.usersPermissions, UsersPermissions.EDIT_GLOBAL_UI_DATA);
    }

    if (props.uiDataList !== state.uiDataList || props.uiDataKey !== state.uiDataKey) {
      newState.uiDataList = props.uiDataList;
      newState.uiDataKey = props.uiDataKey;
      newState.uiData = getUiDataByKey(props.uiDataList, props.uiDataKey || '');
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentWillUnmount() {
    const {uiDataKey} = this.props;

    if(uiDataKey) {
      window.removeEventListener('click', this.onDocumentClick);
    }
  }

  onDocumentClick = (event: any) => {
    const {isOpen} = this.state;
    const target = event.target,
      el = ReactDOM.findDOMNode(this);

    if (isOpen) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (isOpen && el && target !== el && !el.contains(target)) {
      this.closeTooltip(event);
    }
  };

  handleTextChange = (e: any) => {
    const value = e.target.value;

    this.setState({
      editedText: value,
      error: this.validate(value),
    });
  }

  closeTooltip = (e: any) => {
    const {onTooltipClose} = this.props;

    if(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setState({isOpen: false});
    onTooltipClose();
  }

  openTooltip = (e: any) => {
    if(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.setState({
      isOpen: true,
      position: this.calculatePosition(),
    });
  }

  handleDelete = () => {
    const {deleteUiData} = this.props;
    const {uiData} = this.state;

    if(uiData) {
      deleteUiData(uiData.id);
    }
  }

  calculatePosition = () => {
    const {relativeTo} = this.props;
    let {innerHeight: height, innerWidth: width} = window;
    const el = ReactDOM.findDOMNode(this);

    if(el) {
      // $FlowFixMe
      let {x, y} = el.getBoundingClientRect();

      if(relativeTo) {
        const {x: x2, y: y2, height: height2, width: width2} = relativeTo.getBoundingClientRect();
        x -= x2;
        y -= y2;
        height = height2;
        width = width2;
      }

      const top = !!(y > height - y);
      const left = !!(x > width - x);

      if(top) {
        if(left) {
          return 'position-top-left';
        } else {
          return 'position-top-right';
        }
      } else {
        if(left) {
          return 'position-bottom-left';
        } else {
          return 'position-bottom-right';
        }
      }
    }

    return 'position-bottom-right';
  }

  handleSave = (e: any) => {
    const {createUiData, editUiData, uiDataKey} = this.props;
    const {editedText, error, uiData} = this.state;

    if(e) e.preventDefault();

    if(!error) {
      if(uiData) {
        editUiData({
          id: uiData.id,
          key: uiData.key,
          value: editedText,
        });
      } else {
        createUiData({
          key: uiDataKey,
          value: editedText,
          user: null,
        });
      }

      this.closeTooltip();
    }

    this.setState({isSaveClicked: true});
  }

  validate = (value: ?string) => {
    const {uiDataAttributes} = this.props;

    return genericValidator(value, getFieldAttributes(uiDataAttributes, 'value'));
  }

  render() {
    const {enableUiDataEdit, innerRef, style, uiDataKey} = this.props;
    const {
      allowToAddUiData,
      allowToDeleteUiData,
      allowToEditUiData,
      editedText,
      error,
      isOpen,
      isSaveClicked,
      position,
      uiData,
    } = this.state;
    const showEditContainer = enableUiDataEdit && (uiData && allowToEditUiData) || (!uiData && allowToAddUiData);
    const text = uiData ? uiData.value || '' : '';
    const name = `${uiDataKey || ''}__input`;

    if (!uiDataKey && !enableUiDataEdit) {
      return null;
    }

    return(
      <AppConsumer>
        {({dispatch}) => {
          const handleDelete = (e: any) => {
            e.preventDefault();

            this.closeTooltip();
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.handleDelete();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_UI_DATA.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_UI_DATA.BUTTON,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_UI_DATA.TITLE,
            });
          };

          return(
            <div className='tooltip__component' ref={innerRef} style={style}>
              <div className='tooltip__container'>
                {enableUiDataEdit && allowToAddUiData && !uiData &&
                  <button className='tooltip__add-button' onClick={this.openTooltip} style={{display: isOpen ? 'inherit' : null}} type='button'>
                    <AddIcon />
                  </button>
                }
                {!!uiData &&
                  <button className='tooltip__open-button' onClick={this.openTooltip} type='button'>
                    <InfoIcon />
                  </button>
                }
                {isOpen &&
                  <Fragment>
                    {showEditContainer &&
                      <div className={classNames('tooltip__text-container', position)}>
                        <div className='tooltip__text-container_wrapper edit-container'>
                          <CloseButton onClick={this.closeTooltip} />

                          <FormFieldLabel htmlFor={name}>Ohjeteksti</FormFieldLabel>
                          <TextAreaInput
                            id={name}
                            name={name}
                            onChange={this.handleTextChange}
                            rows={4}
                            value={editedText}
                          />
                          {isSaveClicked && !!error && <ErrorBlock error={error} />}

                          <ModalButtonWrapper>
                            {allowToDeleteUiData && !!uiData &&
                              <Button
                                className={ButtonColors.ALERT}
                                onClick={handleDelete}
                                text='Poista'
                              />
                            }
                            <Button
                              className={ButtonColors.SECONDARY}
                              onClick={this.closeTooltip}
                              text='Peruuta'
                            />
                            <Button
                              className={ButtonColors.SUCCESS}
                              disabled={isSaveClicked && !!error}
                              onClick={this.handleSave}
                              text='Tallenna'
                            />
                          </ModalButtonWrapper>
                        </div>
                      </div>
                    }
                    {!showEditContainer &&
                      <div className={classNames('tooltip__text-container', position)}>
                        <div className='tooltip__text-container_wrapper'>
                          <p>{text}</p>
                        </div>
                      </div>
                    }
                  </Fragment>
                }
              </div>
            </div>
          );
        }}
      </AppConsumer>
    );
  }
}

export default (connect(
  (state) => {
    return {
      uiDataAttributes: getUiDataAttributes(state),
      uiDataList: getUiDataList(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    createUiData,
    deleteUiData,
    editUiData,
  }
)(UIDataTooltip): React$ComponentType<OwnProps>);
