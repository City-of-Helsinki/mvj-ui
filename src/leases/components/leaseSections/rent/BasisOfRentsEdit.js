// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {change} from 'redux-form';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import BasisOfRentEdit from './BasisOfRentEdit';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import GrayBox from '$components/content/GrayBox';
import GreenBox from '$components/content/GreenBox';
import {ButtonColors} from '$components/enums';
import {
  ArchiveBasisOfRentsText,
  DeleteModalLabels,
  DeleteModalTitles,
  LeaseBasisOfRentsFieldPaths,
  UnarchiveBasisOfRentsText,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  getFieldOptions,
  hasPermissions,
  isEmptyValue,
  sortByLabelDesc,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  archived: boolean,
  change: Function,
  fields: any,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  onArchive?: Function,
  onUnarchive?: Function,
  usersPermissions: UsersPermissionsType,
}

type State = {
  areaUnitOptions: Array<Object>,
  indexOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
  leaseAttributes: Attributes,
}

class BasisOfRentsEdit extends PureComponent<Props, State> {
  state = {
    areaUnitOptions: [],
    indexOptions: [],
    intendedUseOptions: [],
    leaseAttributes: {},
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.areaUnitOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT, true, (option) =>
        !isEmptyValue(option.display_name) ? option.display_name.replace('^2', '²') : option.display_name
      );
      newState.indexOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX, true, null, sortByLabelDesc);
      newState.intendedUseOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE);
    }

    return newState;
  }

  handleAdd = () => {
    const {fields} = this.props;

    fields.push({});
  }

  removeBasisOfRent = (index: number) => {
    const {fields} = this.props;

    fields.remove(index);
  }

  render() {
    const {
      archived,
      fields,
      isSaveClicked,
      onArchive,
      onUnarchive,
      usersPermissions,
    } = this.props;
    const {areaUnitOptions, indexOptions, intendedUseOptions} = this.state;

    if(!archived && (!fields || !fields.length)) {
      return(
        <Authorization
          allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEBASISOFRENT)}
          errorComponent={<FormText className='no-margin'>Ei vuokralaskureita</FormText>}
        >
          <Row>
            <Column>
              <AddButtonSecondary
                className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                label='Lisää vuokralaskuri'
                onClick={this.handleAdd}
              />
            </Column>
          </Row>
        </Authorization>
      );
    }

    return (
      <AppConsumer>
        {({dispatch}) => {
          if(archived) {
            if(!fields || !fields.length) return null;

            return(
              <Fragment>
                <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
                <GrayBox>
                  <BoxItemContainer>
                    {fields && !!fields.length && fields.map((field, index) => {
                      const handleRemove = () => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            fields.remove(index);
                          },
                          confirmationModalButtonClassName: ButtonColors.ALERT,
                          confirmationModalButtonText: 'Poista',
                          confirmationModalLabel: DeleteModalLabels.BASIS_OF_RENT,
                          confirmationModalTitle: DeleteModalTitles.BASIS_OF_RENT,
                        });
                      };

                      const handleUnarchive = (savedItem: Object) => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            if(onUnarchive) {
                              onUnarchive(index, savedItem);
                            }
                          },
                          confirmationModalButtonClassName: ButtonColors.ALERT,
                          confirmationModalButtonText: UnarchiveBasisOfRentsText.BUTTON,
                          confirmationModalLabel: UnarchiveBasisOfRentsText.LABEL,
                          confirmationModalTitle: UnarchiveBasisOfRentsText.TITLE,
                        });
                      };

                      return <BasisOfRentEdit
                        key={index}
                        archived={true}
                        areaUnitOptions={areaUnitOptions}
                        field={field}
                        indexOptions={indexOptions}
                        intendedUseOptions={intendedUseOptions}
                        isSaveClicked={isSaveClicked}
                        onRemove={handleRemove}
                        onUnarchive={handleUnarchive}
                      />;
                    })}
                  </BoxItemContainer>
                </GrayBox>
              </Fragment>
            );
          } else {
            return(
              <GreenBox>
                <BoxItemContainer>
                  {fields && !!fields.length && fields.map((field, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          fields.remove(index);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText: 'Poista',
                        confirmationModalLabel: DeleteModalLabels.BASIS_OF_RENT,
                        confirmationModalTitle: DeleteModalTitles.BASIS_OF_RENT,
                      });
                    };

                    const handleArchive = (savedItem: Object) => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          if(onArchive) {
                            onArchive(index, savedItem);
                          }
                        },
                        confirmationModalButtonClassName: ButtonColors.SUCCESS,
                        confirmationModalButtonText: ArchiveBasisOfRentsText.BUTTON,
                        confirmationModalLabel: ArchiveBasisOfRentsText.LABEL,
                        confirmationModalTitle: ArchiveBasisOfRentsText.TITLE,
                      });
                    };

                    return <BasisOfRentEdit
                      key={index}
                      archived={false}
                      areaUnitOptions={areaUnitOptions}
                      field={field}
                      indexOptions={indexOptions}
                      intendedUseOptions={intendedUseOptions}
                      isSaveClicked={isSaveClicked}
                      onArchive={handleArchive}
                      onRemove={handleRemove}
                    />;
                  })}
                </BoxItemContainer>

                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEBASISOFRENT)}>
                  <Row>
                    <Column>
                      <AddButtonSecondary
                        className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                        label='Lisää vuokralaskuri'
                        onClick={this.handleAdd}
                      />
                    </Column>
                  </Row>
                </Authorization>
              </GreenBox>
            );
          }
        }}
      </AppConsumer>
    );
  }
}

export default connect(
  (state) => {
    return {
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    change,
  },
  null,
  {
    withRef: true,
  },
)(BasisOfRentsEdit);
