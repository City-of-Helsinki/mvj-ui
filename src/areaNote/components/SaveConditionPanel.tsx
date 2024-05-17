import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "src/app/AppContext";
import Authorization from "src/components/authorization/Authorization";
import Button from "src/components/button/Button";
import FormFieldLabel from "src/components/form/FormFieldLabel";
import TextAreaInput from "src/components/inputs/TextAreaInput";
import { ConfirmationModalTexts, Methods } from "src/enums";
import { ButtonColors } from "src/components/enums";
import { isMethodAllowed } from "src/util/helpers";
import { getMethods as getAreaNoteMethods } from "src/areaNote/selectors";
import type { Methods as MethodsType } from "src/types";
type Props = {
  areaNoteMethods: MethodsType;
  disableDelete: boolean;
  disableSave: boolean;
  isNew: boolean;
  onCancel: (...args: Array<any>) => any;
  onCreate: (...args: Array<any>) => any;
  onDelete: (...args: Array<any>) => any;
  onEdit: (...args: Array<any>) => any;
  show: boolean;
};
type State = {
  note: string;
};

class SaveConditionPanel extends Component<Props, State> {
  firstField: any;
  state = {
    note: ''
  };

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.show && this.props.show) {
      this.firstField.focus();
    }
  }

  setFirstFieldRef = (element: any) => {
    this.firstField = element;
  };
  setNoteField = (note: string) => {
    this.setState({
      note: note
    });
  };
  handleFieldChange = (e: any) => {
    this.setState({
      note: e.target.value
    });
  };
  handleCreate = () => {
    const {
      onCreate
    } = this.props;
    const {
      note
    } = this.state;
    onCreate(note);
  };
  handleEdit = () => {
    const {
      onEdit
    } = this.props;
    const {
      note
    } = this.state;
    onEdit(note);
  };

  render() {
    const {
      areaNoteMethods,
      disableDelete,
      disableSave,
      isNew,
      onCancel,
      onDelete,
      show
    } = this.props;
    const {
      note
    } = this.state;
    return <AppConsumer>
        {({
        dispatch
      }) => {
        const handleDelete = () => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              onDelete();
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText: ConfirmationModalTexts.DELETE_AREA_NOTE.BUTTON,
            confirmationModalLabel: ConfirmationModalTexts.DELETE_AREA_NOTE.LABEL,
            confirmationModalTitle: ConfirmationModalTexts.DELETE_AREA_NOTE.TITLE
          });
        };

        return <div className={classNames('area-note-map__save-condition-panel', {
          'area-note-map__save-condition-panel--is-open': show
        })}>
              <div className='area-note-map__save-condition-panel_container'>
                <h2>{isNew ? 'Luo muistettava ehto' : 'Muokkaa muistettavaa ehtoa'}</h2>

                <Row>
                  <Column>
                    <FormFieldLabel className='invisible' htmlFor='area-note__comment'>Kirjoita huomautus</FormFieldLabel>
                    <TextAreaInput className="no-margin" id='area-note__comment' onChange={this.handleFieldChange} placeholder='Kirjoita huomautus' rows={4} setRefForField={this.setFirstFieldRef} value={note} />
                  </Column>
                </Row>
                <div className='area-note-map__save-condition-panel_buttons-wrapper'>
                  <Row>
                    <Column>
                      <Authorization allow={isMethodAllowed(areaNoteMethods, Methods.DELETE)}>
                        {!isNew && <Button className={ButtonColors.ALERT} disabled={disableDelete} onClick={handleDelete} text='Poista' />}
                      </Authorization>
                      <Button className={ButtonColors.SECONDARY} onClick={onCancel} text='Peruuta' />
                      {isNew ? <Authorization allow={isMethodAllowed(areaNoteMethods, Methods.POST)}>
                          <Button className={ButtonColors.SUCCESS} disabled={disableSave} onClick={this.handleCreate} text='Luo muistettava ehto' />
                        </Authorization> : <Authorization allow={isMethodAllowed(areaNoteMethods, Methods.PATCH)}>
                          <Button className={ButtonColors.SUCCESS} disabled={disableSave} onClick={this.handleEdit} text='Tallenna' />
                        </Authorization>}
                    </Column>
                  </Row>
                </div>
              </div>
            </div>;
      }}
      </AppConsumer>;
  }

}

export default connect(state => {
  return {
    areaNoteMethods: getAreaNoteMethods(state)
  };
}, null, null, {
  forwardRef: true
})(SaveConditionPanel);