import React, { PureComponent } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddIcon from "/src/components/icons/AddIcon";
import Button from "/src/components/button/Button";
import ErrorBlock from "/src/components/form/ErrorBlock";
import FormFieldLabel from "/src/components/form/FormFieldLabel";
import InfoIcon from "/src/components/icons/InfoIcon";
import ModalButtonWrapper from "/src/components/modal/ModalButtonWrapper";
import TextAreaInput from "/src/components/inputs/TextAreaInput";
import { createUiData, deleteUiData, editUiData } from "/src/uiData/actions";
import { ConfirmationModalTexts } from "enums";
import { ButtonColors } from "/src/components/enums";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { getFieldAttributes, hasPermissions } from "/src/util/helpers";
import { getUiDataByKey } from "/src/uiData/helpers";
import { getAttributes as getUiDataAttributes, getUiDataList } from "/src/uiData/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import { genericValidator } from "/src/components/form/validations";
import type { Attributes } from "types";
import type { UiDataList } from "/src/uiData/types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
import Tooltip from "/src/components/tooltip/Tooltip";
import TooltipWrapper from "/src/components/tooltip/TooltipWrapper";
import TooltipToggleButton from "/src/components/tooltip/TooltipToggleButton";
type OwnProps = {
  relativeTo?: Element;
  enableUiDataEdit?: boolean;
  innerRef?: (...args: Array<any>) => any;
  onTooltipClose: (...args: Array<any>) => any;
  style?: Record<string, any>;
  uiDataKey: string | null | undefined;
};
type Props = OwnProps & {
  createUiData: (...args: Array<any>) => any;
  deleteUiData: (...args: Array<any>) => any;
  editUiData: (...args: Array<any>) => any;
  uiDataAttributes: Attributes;
  uiDataList: UiDataList;
  usersPermissions: UsersPermissionsType;
};
type State = {
  allowToAddUiData: boolean;
  allowToDeleteUiData: boolean;
  allowToEditUiData: boolean;
  editedText: string;
  error: string | null | undefined;
  isOpen: boolean;
  isSaveClicked: boolean;
  uiData: Record<string, any> | null | undefined;
  uiDataKey: string | null | undefined;
  uiDataList: UiDataList;
  usersPermissions: UsersPermissionsType;
};

class UIDataTooltip extends PureComponent<Props, State> {
  state = {
    allowToAddUiData: false,
    allowToDeleteUiData: false,
    allowToEditUiData: false,
    editedText: '',
    error: undefined,
    isOpen: false,
    isSaveClicked: false,
    uiData: null,
    uiDataKey: null,
    uiDataList: [],
    usersPermissions: []
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.isOpen && this.state.isOpen) {
      const {
        uiData
      } = this.state;
      const editedText = uiData ? uiData.value || '' : '';
      this.setState({
        editedText: editedText,
        error: this.validate(editedText),
        isSaveClicked: false
      });
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.usersPermissions !== state.usersPermissions) {
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

  handleTextChange = (e: any) => {
    const value = e.target.value;
    this.setState({
      editedText: value,
      error: this.validate(value)
    });
  };
  closeTooltip = () => {
    const {
      onTooltipClose
    } = this.props;
    this.setState({
      isOpen: false
    });
    onTooltipClose();
  };
  openTooltip = () => {
    this.setState({
      isOpen: true
    });
  };
  handleDelete = () => {
    const {
      deleteUiData
    } = this.props;
    const {
      uiData
    } = this.state;

    if (uiData) {
      deleteUiData(uiData.id);
    }
  };
  handleSave = (e: any) => {
    const {
      createUiData,
      editUiData,
      uiDataKey
    } = this.props;
    const {
      editedText,
      error,
      uiData
    } = this.state;

    if (e) {
      e.preventDefault();
    }

    if (!error) {
      if (uiData) {
        editUiData({
          id: uiData.id,
          key: uiData.key,
          value: editedText
        });
      } else {
        createUiData({
          key: uiDataKey,
          value: editedText,
          user: null
        });
      }

      this.closeTooltip();
    }

    this.setState({
      isSaveClicked: true
    });
  };
  validate = (value: string | null | undefined) => {
    const {
      uiDataAttributes
    } = this.props;
    return genericValidator(value, getFieldAttributes(uiDataAttributes, 'value'));
  };

  render() {
    const {
      enableUiDataEdit,
      innerRef,
      style,
      uiDataKey,
      relativeTo
    } = this.props;
    const {
      allowToAddUiData,
      allowToDeleteUiData,
      allowToEditUiData,
      editedText,
      error,
      isOpen,
      isSaveClicked,
      uiData
    } = this.state;
    const showEditContainer = enableUiDataEdit && uiData && allowToEditUiData || !uiData && allowToAddUiData;
    const text = uiData ? uiData.value || '' : '';
    const name = `${uiDataKey || ''}__input`;

    if (!uiDataKey && !enableUiDataEdit) {
      return null;
    }

    return <AppConsumer>
        {({
        dispatch
      }) => {
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
            confirmationModalTitle: ConfirmationModalTexts.DELETE_UI_DATA.TITLE
          });
        };

        return <TooltipWrapper innerRef={innerRef} style={{
          style
        }}>
              {enableUiDataEdit && allowToAddUiData && !uiData && <TooltipToggleButton onClick={this.openTooltip} className='tooltip__add-button' style={{
            display: isOpen ? 'inherit' : null
          }}>
                  <AddIcon />
                </TooltipToggleButton>}
              {!!uiData && <TooltipToggleButton className='tooltip__open-button' onClick={this.openTooltip}>
                  <InfoIcon />
                </TooltipToggleButton>}
              <Tooltip isOpen={isOpen} className={showEditContainer ? 'edit-tooltip' : undefined} onClose={this.closeTooltip} relativeTo={relativeTo}>
                {showEditContainer ? <>
                    <FormFieldLabel htmlFor={name}>Ohjeteksti</FormFieldLabel>
                    <TextAreaInput id={name} name={name} onChange={this.handleTextChange} rows={4} value={editedText} />
                    {isSaveClicked && !!error && <ErrorBlock error={error} />}

                    <ModalButtonWrapper>
                      {allowToDeleteUiData && !!uiData && <Button className={ButtonColors.ALERT} onClick={handleDelete} text='Poista' />}
                      <Button className={ButtonColors.SECONDARY} onClick={this.closeTooltip} text='Peruuta' />
                      <Button className={ButtonColors.SUCCESS} disabled={isSaveClicked && !!error} onClick={this.handleSave} text='Tallenna' />
                    </ModalButtonWrapper>
                  </> : <p>{text}</p>}
              </Tooltip>
            </TooltipWrapper>;
      }}
      </AppConsumer>;
  }

}

export default (connect(state => {
  return {
    uiDataAttributes: getUiDataAttributes(state),
    uiDataList: getUiDataList(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  createUiData,
  deleteUiData,
  editUiData
})(UIDataTooltip) as React.ComponentType<OwnProps>);