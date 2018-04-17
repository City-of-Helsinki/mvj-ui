// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form';
import flowRight from 'lodash/flowRight';

import BasisOfRentsEdit from './BasisOfRentsEdit';
import Divider from '$components/content/Divider';
import FieldTypeSwitch from '$components/form/FieldTypeSwitch';
import FormSectionComponent from '$components/form/FormSection';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentItemEdit from './RentItemEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {fetchDecisions, receiveRentsFormValid} from '$src/leases/actions';
import {getDecisions, getIsRentsFormValid, getRentsFormValues} from '$src/leases/selectors';
import {getDecisionsOptions, getSearchQuery} from '$util/helpers';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisionOptionsData: Array<Object>,
  fetchDecisions: Function,
  handleSubmit: Function,
  isRentsFormValid: boolean,
  params: Object,
  receiveRentsFormValid: Function,
  rentsFormValues: Object,
  valid: boolean,
}

class RentsEdit extends Component {
  props: Props

  componentWillMount() {
    const {
      fetchDecisions,
      params: {leaseId},
    } = this.props;
    const query = {
      lease: leaseId,
      limit: 1000,
    };
    const search = getSearchQuery(query);
    fetchDecisions(search);
  }

  componentDidUpdate() {
    const {isRentsFormValid, receiveRentsFormValid, valid} = this.props;
    if(isRentsFormValid !== valid) {
      receiveRentsFormValid(valid);
    }
  }

  render() {
    const {attributes, decisionOptionsData, handleSubmit, rentsFormValues} = this.props;
    const decisionOptions = getDecisionsOptions(decisionOptionsData);

    return (
      <form onSubmit={handleSubmit}>
        <FormSectionComponent>
          <h2>Vuokra</h2>
          <RightSubtitle
            text={
              <Field
                component={FieldTypeSwitch}
                name="is_rent_info_complete"
                optionLabel="Vuokratiedot kunnossa"
              />
            }
          />
          <Divider />

          <FieldArray
            attributes={attributes}
            component={RentItemEdit}
            decisionOptions={decisionOptions}
            name='rents'
            rentsFormValues={rentsFormValues}
          />

          <h2>Vuokranperusteet</h2>
          <Divider />

          <GreenBoxEdit>
            <FieldArray
              attributes={attributes}
              component={BasisOfRentsEdit}
              name="basis_of_rents"
            />
          </GreenBoxEdit>

        </FormSectionComponent>
      </form>
    );
  }
}

const formName = 'rents-form';

export default flowRight(
  connect(
    (state) => {
      return {
        decisionOptionsData: getDecisions(state),
        isRentsFormValid: getIsRentsFormValid(state),
        rentsFormValues: getRentsFormValues(state),
      };
    },
    {
      fetchDecisions,
      receiveRentsFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
  withRouter,
)(RentsEdit);
