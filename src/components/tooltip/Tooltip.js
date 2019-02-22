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
import {ButtonColors} from '$components/enums';
import {DeleteUiDataModalTexts} from '$src/uiData/enums';
import {Methods} from '$src/enums';
import {getFieldAttributes, isMethodAllowed} from '$util/helpers';
import {getUiDataByKey} from '$src/uiData/helpers';
import {
  getAttributes as getUiDataAttributes,
  getMethods as getUiDataMethods,
  getUiDataList,
} from '$src/uiData/selectors';
import {genericValidator} from '$components/form/validations';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {UiDataList} from '$src/uiData/types';

type Props = {
  createUiData: Function,
  deleteUiData: Function,
  enableUiDataEdit: boolean,
  editUiData: Function,
  onTooltipClose: Function,
  uiDataAttributes: Attributes,
  uiDataList: UiDataList,
  uiDataMethods: MethodsType,
  uiDataKey: ?string,
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
  uiDataList: UiDataList,
  uiDataMethods: MethodsType,
}

class Tooltip extends PureComponent<Props, State> {
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
    uiDataList: [],
    uiDataMethods: null,
  }

  componentDidMount() {
    const {uiDataKey} = this.props;

    if(uiDataKey) {
      document.addEventListener('click', this.onDocumentClick);
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

    if(props.uiDataMethods !== state.uiDataMethods) {
      newState.uiDataMethods = props.uiDataMethods;
      newState.allowToAddUiData = isMethodAllowed(props.uiDataMethods, Methods.POST);
      newState.allowToDeleteUiData = isMethodAllowed(props.uiDataMethods, Methods.DELETE);
      newState.allowToEditUiData = isMethodAllowed(props.uiDataMethods, Methods.PATCH);
    }

    if(props.uiDataList !== state.uiDataList && props.uiDataKey) {
      newState.uiDataList = props.uiDataList,
      newState.uiData = getUiDataByKey(props.uiDataList, props.uiDataKey);
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (event: any) => {
    const {isOpen} = this.state;
    const target = event.target,
      el = ReactDOM.findDOMNode(this);

    if (isOpen) event.preventDefault();

    if (isOpen && el && target !== el && !el.contains(target)) {
      this.closeTooltip();
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

    if(e) e.preventDefault();

    this.setState({isOpen: false});
    onTooltipClose();
  }

  openTooltip = (e: any) => {
    if(e) e.preventDefault();

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
    const {innerHeight: screenHeight, innerWidth: screenWidth} = window;
    const el = ReactDOM.findDOMNode(this);

    if(el) {
      // $FlowFixMe
      const {x, y} = el.getBoundingClientRect();
      const top = !!(y > screenHeight - y);
      const left = !!(x > screenWidth - x);

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
    const {enableUiDataEdit, uiDataKey} = this.props;
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

    console.log('pos', position);
    if(!uiDataKey && !enableUiDataEdit) return null;

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
              confirmationModalButtonText: DeleteUiDataModalTexts.BUTTON,
              confirmationModalLabel: DeleteUiDataModalTexts.LABEL,
              confirmationModalTitle: DeleteUiDataModalTexts.TITLE,
            });
          };

          return(
            <div className='tooltip__component'>
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

export default connect(
  (state) => {
    return {
      uiDataAttributes: getUiDataAttributes(state),
      uiDataList: getUiDataList(state),
      uiDataMethods: getUiDataMethods(state),
    };
  },
  {
    createUiData,
    deleteUiData,
    editUiData,
  }
)(Tooltip);
