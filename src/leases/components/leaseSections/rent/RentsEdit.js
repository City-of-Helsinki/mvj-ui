// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {reduxForm, FieldArray} from 'redux-form';
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
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentItemEdit from './RentItemEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveFormValidFlags, setRentInfoComplete, setRentInfoUncomplete} from '$src/leases/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getContentRentsFormData} from '$src/leases/helpers';
import {getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

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
    fields.push({});
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
  currentLease: Lease,
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
  state = {
    lease: {},
    rentsData: {},
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.lease) {
      return {
        lease: props.currentLease,
        rentsData: getContentRentsFormData(props.currentLease),
      };
    }
    return null;
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
              confirmationModalButtonText: 'Merkkaa valmiiksi',
              confirmationModalLabel: 'Haluatko varmasti merkata vuokratiedot valmiiksi?',
              confirmationModalTitle: 'Merkkaa vuokratiedot valmiiksi',
            });
          };

          const handleSetRentInfoUncomplete = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.setRentInfoUncomplete();
              },
              confirmationModalButtonText: 'Merkkaa keskeneräisiksi',
              confirmationModalLabel: 'Haluatko varmasti merkata vuokratiedot keskeneräisiksi?',
              confirmationModalTitle: 'Merkkaa vuokratiedot keskeneräisiksi',
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
                      text='Merkkaa keskeneräisiksi'
                    />
                    : <Button
                      className='button-green'
                      onClick={handleSetRentInfoComplete}
                      text='Merkkaa valmiiksi'
                    />
                  }
                  text={isRentInfoComplete
                    ? <span className="success">Vuokratiedot kunnossa<i /></span>
                    : <span className="alert">Vaatii toimenpiteitä<i /></span>
                  }
                />

                <Divider />
                <FieldArray
                  component={renderRents}
                  name='rents.rents'
                  rents={rents}
                  showAddButton={true}
                />

                {/* Archived rents */}
                <FieldArray
                  component={renderRents}
                  name='rents.rentsArchived'
                  rents={rentsArchived}
                  showAddButton={false}
                />

                <h2>Vuokranperusteet</h2>
                <Divider />
                <GreenBoxEdit>
                  <FieldArray
                    component={BasisOfRentsEdit}
                    isSaveClicked={isSaveClicked}
                    name="basis_of_rents"
                  />
                </GreenBoxEdit>

              </FormSectionComponent>
            </form>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.RENTS;

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        currentLease: currentLease,
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
  }),
  withRouter,
)(RentsEdit);
