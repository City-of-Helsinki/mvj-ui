// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {FieldArray, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import Authorization from '$components/authorization/Authorization';
import BasisOfRentsEdit from './BasisOfRentsEdit';
import Button from '$components/button/Button';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import GreenBox from '$components/content/GreenBox';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RentItemEdit from './RentItemEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveFormValidFlags, setRentInfoComplete, setRentInfoUncomplete} from '$src/leases/actions';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
  LeaseRentsFieldPaths,
  LeaseRentsFieldTitles,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {validateRentForm} from '$src/leases/formValidators';
import {getContentRentsFormData} from '$src/leases/helpers';
import {hasPermissions, isFieldAllowedToRead} from '$util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type RentsProps = {
  archived: boolean,
  fields: any,
  rents: Array<Object>,
  usersPermissions: UsersPermissionsType,
};

const renderRents = ({
  archived,
  fields,
  rents,
  usersPermissions,
}:RentsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({
      contract_rents: [{}],
    });
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_RENT) &&
              !archived &&
              (!fields || !fields.length) &&
              <FormText className='no-margin'>Ei vuokria</FormText>
            }

            {archived && !!fields && !!fields.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}

            {fields && !!fields.length && fields.map((item, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.RENT,
                  confirmationModalTitle: DeleteModalTitles.RENT,
                });
              };

              return <RentItemEdit
                key={index}
                field={item}
                index={index}
                onRemove={handleRemove}
                rents={rents}
              />;
            })}
            {!archived &&
              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_RENT)}>
                <Row>
                  <Column>
                    <AddButton
                      label='Lisää vuokra'
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              </Authorization>
            }
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  change: Function,
  currentLease: Lease,
  editedActiveBasisOfRents: Array<Object>,
  editedArchivedBasisOfRents: Array<Object>,
  isRentInfoComplete: boolean,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  params: Object,
  receiveFormValidFlags: Function,
  setRentInfoComplete: Function,
  setRentInfoUncomplete: Function,
  usersPermissions: UsersPermissionsType,
  valid: boolean,
}

type State = {
  lease: Lease,
  rentsData: Object,
};

class RentsEdit extends PureComponent<Props, State> {
  activeBasisOfRentsComponent: any
  archivedBasisOfRentsComponent: any

  state = {
    lease: {},
    rentsData: {},
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if(props.currentLease !== state.lease) {
      newState.lease = props.currentLease;
      newState.rentsData = getContentRentsFormData(props.currentLease);
    }
    return newState;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.RENTS]: this.props.valid,
      });
    }
  }

  setRentInfoComplete = () => {
    const {currentLease, setRentInfoComplete} = this.props;

    setRentInfoComplete(currentLease.id);
  }

  setRentInfoUncomplete = () => {
    const {currentLease, setRentInfoUncomplete} = this.props;

    setRentInfoUncomplete(currentLease.id);
  }

  setActiveBasisOfRentsRef = (ref: any) => {
    this.activeBasisOfRentsComponent = ref;
  }

  setArchivedBasisOfRentsRef = (ref: any) => {
    this.archivedBasisOfRentsComponent = ref;
  }

  handleArchive = (index: number, item: Object) => {
    this.activeBasisOfRentsComponent.getRenderedComponent().removeBasisOfRent(index);
    this.addArchivedItemToUnarchivedItems(item);
  }

  addArchivedItemToUnarchivedItems = (item: Object) => {
    const {change, editedArchivedBasisOfRents} = this.props,
      newItems = [...editedArchivedBasisOfRents, {...item, archived_at: new Date().toISOString()}];

    change('basis_of_rents_archived', newItems);
  }

  handleUnarchive = (index: number, item: Object) => {
    this.archivedBasisOfRentsComponent.getRenderedComponent().removeBasisOfRent(index);
    this.addUnarchivedItemToArchivedItems(item);
  }

  addUnarchivedItemToArchivedItems = (item: Object) => {
    const {change, editedActiveBasisOfRents} = this.props,
      newItems = [...editedActiveBasisOfRents, {...item, archived_at: null}];

    change('basis_of_rents', newItems);
  }

  render() {
    const {
      isRentInfoComplete,
      isSaveClicked,
      leaseAttributes,
      usersPermissions,
    } = this.props;
    const {rentsData} = this.state;
    const rents = get(rentsData, 'rents', []),
      rentsArchived = get(rentsData, 'rentsArchived', []);

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleSetRentInfoComplete = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.setRentInfoComplete();
              },
              confirmationModalButtonClassName: ButtonColors.SUCCESS,
              confirmationModalButtonText: 'Merkitse valmiiksi',
              confirmationModalLabel: 'Haluatko varmasti merkitä vuokratiedot valmiiksi?',
              confirmationModalTitle: 'Merkitse vuokratiedot valmiiksi',
            });
          };

          const handleSetRentInfoUncomplete = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.setRentInfoUncomplete();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: 'Merkitse keskeneräisiksi',
              confirmationModalLabel: 'Haluatko varmasti merkitä vuokratiedot keskeneräisiksi?',
              confirmationModalTitle: 'Merkitse vuokratiedot keskeneräisiksi',
            });
          };

          return(
            <form>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.RENTS)}>
                <h2>{LeaseRentsFieldTitles.RENTS}</h2>

                <RightSubtitle
                  buttonComponent={
                    <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.CHANGE_LEASE_IS_RENT_INFO_COMPLETE)}>
                      {isRentInfoComplete
                        ? <Button
                          className={ButtonColors.NEUTRAL}
                          onClick={handleSetRentInfoUncomplete}
                          text='Merkitse keskeneräisiksi'
                        />
                        : <Button
                          className={ButtonColors.NEUTRAL}
                          onClick={handleSetRentInfoComplete}
                          text='Merkitse valmiiksi'
                        />
                      }
                    </Authorization>
                  }
                  text={<Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.IS_RENT_INFO_COMPLETE)}>
                    {isRentInfoComplete
                      ? <span className="success">Tiedot kunnossa<i /></span>
                      : <span className="alert">Tiedot keskeneräiset<i /></span>
                    }
                  </Authorization>}
                />
                <Divider />

                <FieldArray
                  component={renderRents}
                  archive={false}
                  name='rents'
                  rents={rents}
                  usersPermissions={usersPermissions}
                />

                {/* Archived rents */}
                <FieldArray
                  component={renderRents}
                  archived={true}
                  name='rentsArchived'
                  rents={rentsArchived}
                  usersPermissions={usersPermissions}
                />
              </Authorization>

              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)}>
                <h2>Vuokralaskelma</h2>
                <Divider />
                <GreenBox>
                  <RentCalculator />
                </GreenBox>
              </Authorization>

              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)}>
                <h2>{LeaseBasisOfRentsFieldTitles.BASIS_OF_RENTS}</h2>
                <Divider />
                <FieldArray
                  ref={this.setActiveBasisOfRentsRef}
                  archived={false}
                  component={BasisOfRentsEdit}
                  isSaveClicked={isSaveClicked}
                  name="basis_of_rents"
                  onArchive={this.handleArchive}
                  forwardRef
                />

                <FieldArray
                  ref={this.setArchivedBasisOfRentsRef}
                  archived={true}
                  component={BasisOfRentsEdit}
                  isSaveClicked={isSaveClicked}
                  name="basis_of_rents_archived"
                  onUnarchive={this.handleUnarchive}
                  forwardRef
                />
              </Authorization>
            </form>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.RENTS;
const selector = formValueSelector(formName);

export default flowRight(
  // $FlowFixMe
  withRouter,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);

      return {
        currentLease: currentLease,
        editedActiveBasisOfRents: selector(state, 'basis_of_rents'),
        editedArchivedBasisOfRents: selector(state, 'basis_of_rents_archived'),
        errors: getErrorsByFormName(state, formName),
        isRentInfoComplete: currentLease ? currentLease.is_rent_info_complete : null,
        isSaveClicked: getIsSaveClicked(state),
        leaseAttributes: getLeaseAttributes(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      receiveFormValidFlags,
      setRentInfoComplete,
      setRentInfoUncomplete,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate: validateRentForm,
  }),
)(RentsEdit);
