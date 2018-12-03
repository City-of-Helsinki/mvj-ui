// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {FieldArray, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import BasisOfRentsEdit from './BasisOfRentsEdit';
import Button from '$components/button/Button';
import Divider from '$components/content/Divider';
import FormSectionComponent from '$components/form/FormSection';
import GreenBox from '$components/content/GreenBox';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RentItemEdit from './RentItemEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveFormValidFlags, setRentInfoComplete, setRentInfoUncomplete} from '$src/leases/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {validateRentForm} from '$src/leases/formValidators';
import {getContentRentsFormData} from '$src/leases/helpers';
import {getAttributes, getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type RentsProps = {
  fields: any,
  rents: Array<Object>,
  showAddButton: boolean,
};

const renderRents = ({
  fields,
  rents,
  showAddButton,
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
          <div>
            {!showAddButton && !!fields && !!fields.length &&
              <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
            }
            {fields && !!fields.length && fields.map((item, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
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
            {showAddButton &&
              <Row>
                <Column>
                  <AddButton
                    label='Lisää vuokra'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            }
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  change: Function,
  currentLease: Lease,
  editedActiveBasisOfRents: Array<Object>,
  editedArchivedBasisOfRents: Array<Object>,
  isRentInfoComplete: boolean,
  isSaveClicked: boolean,
  params: Object,
  receiveFormValidFlags: Function,
  setRentInfoComplete: Function,
  setRentInfoUncomplete: Function,
  valid: boolean,
}

type State = {
  lease: Lease,
  rentsData: Object,
};

class RentsEdit extends Component<Props, State> {
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
    this.activeBasisOfRentsComponent.getRenderedComponent().wrappedInstance.removeBasisOfRent(index);
    this.addArchivedItemToUnarchivedItems(item);
  }

  addArchivedItemToUnarchivedItems = (item: Object) => {
    const {change, editedArchivedBasisOfRents} = this.props,
      newItems = [...editedArchivedBasisOfRents, {...item, archived_at: new Date().toISOString()}];

    console.log(item);
    change('basis_of_rents_archived', newItems);
  }

  handleUnarchive = (index: number, item: Object) => {
    this.archivedBasisOfRentsComponent.getRenderedComponent().wrappedInstance.removeBasisOfRent(index);
    this.addUnarchivedItemToArchivedItems(item);
  }

  addUnarchivedItemToArchivedItems = (item: Object) => {
    const {change, editedActiveBasisOfRents} = this.props,
      newItems = [...editedActiveBasisOfRents, {...item, archived_at: null}];

    change('basis_of_rents', newItems);
  }

  render() {
    const {isRentInfoComplete, isSaveClicked} = this.props;
    const {rentsData} = this.state;
    const rents = get(rentsData, 'rents', []),
      rentsArchived = get(rentsData, 'rentsArchived', []);

    return (
      <AppConsumer>
        {({
          dispatch,
        }) => {
          const handleSetRentInfoComplete = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.setRentInfoComplete();
              },
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
              confirmationModalButtonText: 'Merkitse keskeneräisiksi',
              confirmationModalLabel: 'Haluatko varmasti merkitä vuokratiedot keskeneräisiksi?',
              confirmationModalTitle: 'Merkitse vuokratiedot keskeneräisiksi',
            });
          };

          return(
            <form>
              <FormSectionComponent>
                <h2>Vuokra</h2>
                <RightSubtitle
                  buttonComponent={isRentInfoComplete
                    ? <Button
                      className='button-red'
                      onClick={handleSetRentInfoUncomplete}
                      text='Merkitse keskeneräisiksi'
                    />
                    : <Button
                      className='button-green'
                      onClick={handleSetRentInfoComplete}
                      text='Merkitse valmiiksi'
                    />
                  }
                  text={isRentInfoComplete
                    ? <span className="success">Tiedot kunnossa<i /></span>
                    : <span className="alert">Tiedot keskeneräiset<i /></span>
                  }
                />

                <Divider />
                <FieldArray
                  component={renderRents}
                  name='rents'
                  rents={rents}
                  showAddButton={true}
                />

                {/* Archived rents */}
                <FieldArray
                  component={renderRents}
                  name='rentsArchived'
                  rents={rentsArchived}
                  showAddButton={false}
                />

                <h2>Vuokralaskelma</h2>
                <Divider />
                <GreenBox>
                  <RentCalculator />
                </GreenBox>

                <h2>Vuokralaskuri</h2>
                <Divider />
                <FieldArray
                  ref={this.setActiveBasisOfRentsRef}
                  archived={false}
                  component={BasisOfRentsEdit}
                  isSaveClicked={isSaveClicked}
                  name="basis_of_rents"
                  onArchive={this.handleArchive}
                  withRef={true}
                />
                <FieldArray
                  ref={this.setArchivedBasisOfRentsRef}
                  archived={true}
                  component={BasisOfRentsEdit}
                  isSaveClicked={isSaveClicked}
                  name="basis_of_rents_archived"
                  onUnarchive={this.handleUnarchive}
                  withRef={true}
                />
              </FormSectionComponent>
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
  withRouter,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);

      return {
        attributes: getAttributes(state),
        currentLease: currentLease,
        editedActiveBasisOfRents: selector(state, 'basis_of_rents'),
        editedArchivedBasisOfRents: selector(state, 'basis_of_rents_archived'),
        errors: getErrorsByFormName(state, formName),
        isRentInfoComplete: currentLease ? currentLease.is_rent_info_complete : null,
        isSaveClicked: getIsSaveClicked(state),
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
