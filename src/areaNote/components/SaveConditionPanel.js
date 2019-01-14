// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import FormFieldLabel from '$components/form/FormFieldLabel';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {DeleteModalLabels, DeleteModalTitles} from '$src/areaNote/enums';
import {ButtonColors} from '$components/enums';
import {getMethods as getAreaNoteMethods} from '$src/areaNote/selectors';

import type {Methods} from '$src/types';

type Props = {
  areaNoteMethods: Methods,
  disableDelete: boolean,
  disableSave: boolean,
  isNew: boolean,
  onCancel: Function,
  onCreate: Function,
  onDelete: Function,
  onEdit: Function,
  show: boolean,
}

type State = {
  note: string,
}

class SaveConditionPanel extends Component<Props, State> {
  firstField: any

  state = {
    note: '',
  }

  componentDidUpdate(prevProps: Props)  {
    if(!prevProps.show && this.props.show) {
      this.firstField.focus();
    }
  }

  setFirstFieldRef = (element: any) => {
    this.firstField = element;
  }

  setNoteField = (note: string) => {
    this.setState({note: note});
  }

  handleFieldChange = (e: any) => {
    this.setState({
      note: e.target.value,
    });
  }

  handleCreate = () => {
    const {onCreate} = this.props;
    const {note} = this.state;

    onCreate(note);
  }

  handleEdit = () => {
    const {onEdit} = this.props;
    const {note} = this.state;

    onEdit(note);
  }

  render() {
    const {areaNoteMethods, disableDelete, disableSave, isNew, onCancel, onDelete, show} = this.props;
    const {note} = this.state;

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleDelete = () => {

            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                onDelete();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: 'Poista',
              confirmationModalLabel: DeleteModalLabels.AREA_NOTE,
              confirmationModalTitle: DeleteModalTitles.AREA_NOTE,
            });
          };

          return(
            <div className={classNames('save-condition-panel', {'is-panel-open': show})}>
              <div className='save-condition-panel__container'>
                <h2>{isNew ? 'Luo muistettava ehto' : areaNoteMethods.PATCH ? 'Muokkaa muistettavaa ehtoa' : 'Muokattava ehto'}</h2>

                <Row>
                  <Column>
                    <FormFieldLabel className='invisible' htmlFor='area-note__comment'>Kirjoita huomautus</FormFieldLabel>
                    <TextAreaInput
                      className="no-margin"
                      id='area-note__comment'
                      onChange={this.handleFieldChange}
                      placeholder='Kirjoita huomautus'
                      rows={4}
                      setRefForField={this.setFirstFieldRef}
                      value={note}
                    />
                  </Column>
                </Row>
                <div className='save-condition-panel__buttons-wrapper'>
                  <Row>
                    <Column>
                      <Authorization allow={areaNoteMethods.DELETE}>
                        {!isNew &&
                          <Button
                            className={ButtonColors.ALERT}
                            disabled={disableDelete}
                            onClick={handleDelete}
                            text='Poista'
                          />
                        }
                      </Authorization>
                      <Button
                        className={ButtonColors.SECONDARY}
                        onClick={onCancel}
                        text='Peruuta'
                      />
                      {isNew
                        ? <Authorization allow={areaNoteMethods.POST}>
                          <Button
                            className={ButtonColors.SUCCESS}
                            disabled={disableSave}
                            onClick={this.handleCreate}
                            text='Luo muistettava ehto'
                          />
                        </Authorization>
                        : <Authorization allow={areaNoteMethods.PATCH}>
                          <Button
                            className={ButtonColors.SUCCESS}
                            disabled={disableSave}
                            onClick={this.handleEdit}
                            text='Tallenna'
                          />
                        </Authorization>
                      }
                    </Column>
                  </Row>
                </div>
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
      areaNoteMethods: getAreaNoteMethods(state),
    };
  },
  null,
  null,
  {withRef: true}
)(SaveConditionPanel);
