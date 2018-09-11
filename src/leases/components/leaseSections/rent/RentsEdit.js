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
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormSectionComponent from '$components/form/FormSection';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentItemEdit from './RentItemEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveFormValidFlags} from '$src/leases/actions';
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
                  type: ActionTypes.SHOW_DELETE_MODAL,
                  deleteFunction: () => {
                    fields.remove(index);
                  },
                  deleteModalLabel: DeleteModalLabels.RENT,
                  deleteModalTitle: DeleteModalTitles.RENT,
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
                    title='Lisää vuokra'
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
  isSaveClicked: boolean,
  params: Object,
  receiveFormValidFlags: Function,
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

  render() {
    const {isSaveClicked} = this.props;
    const {rentsData} = this.state;
    const rents = get(rentsData, 'rents', []),
      rentsArchived = get(rentsData, 'rentsArchived', []);

    return (
      <form>
        <FormSectionComponent>
          <h2>Vuokra</h2>
          <RightSubtitle
            text={
              <FormField
                fieldAttributes={{}}
                name='is_rent_info_complete'
                optionLabel='Vuokratiedot kunnossa'
                overrideValues={{
                  fieldType: 'switch',
                }}
              />
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
  }
}

const formName = FormNames.RENTS;

export default flowRight(
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
        errors: getErrorsByFormName(state, formName),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
  withRouter,
)(RentsEdit);
