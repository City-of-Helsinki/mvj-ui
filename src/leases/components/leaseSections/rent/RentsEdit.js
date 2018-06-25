// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {reduxForm, FieldArray} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BasisOfRentsEdit from './BasisOfRentsEdit';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormSectionComponent from '$components/form/FormSection';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentItemsEdit from './RentItemsEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getContentRentsFormData} from '$src/leases/helpers';
import {getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  errors: ?Object,
  handleSubmit: Function,
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
    const {errors, handleSubmit, isSaveClicked} = this.props;
    const {rentsData} = this.state;

    const rents = get(rentsData, 'rents', []);
    const rentsArchived = get(rentsData, 'rentsArchived', []);

    return (
      <form onSubmit={handleSubmit}>
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
            component={RentItemsEdit}
            enableAddButton={true}
            errors={errors}
            isSaveClicked={isSaveClicked}
            name='rents.rents'
            rents={rents}
          />

          {!!rentsArchived.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
          {!!rentsArchived.length &&
            <FieldArray
              component={RentItemsEdit}
              enableAddButton={false}
              errors={errors}
              isSaveClicked={isSaveClicked}
              name='rents.rentsArchived'
              rents={rentsArchived}
            />
          }

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
