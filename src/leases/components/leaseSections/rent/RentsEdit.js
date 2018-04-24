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
import {FormNames} from '$src/leases/enums';
import {getSearchQuery} from '$util/helpers';
import {getIsRentsFormValid} from '$src/leases/selectors';

type Props = {
  fetchDecisions: Function,
  handleSubmit: Function,
  isRentsFormValid: boolean,
  params: Object,
  receiveRentsFormValid: Function,
  valid: boolean,
}

class RentsEdit extends Component {
  props: Props

  componentWillMount() {
    const {fetchDecisions, params: {leaseId}} = this.props;
    const query = {
      lease: leaseId,
      limit: 1000,
    };

    fetchDecisions(getSearchQuery(query));
  }

  componentDidUpdate() {
    const {isRentsFormValid, receiveRentsFormValid, valid} = this.props;
    if(isRentsFormValid !== valid) {
      receiveRentsFormValid(valid);
    }
  }

  render() {
    const {handleSubmit} = this.props;

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
            component={RentItemEdit}
            name='rents'
          />

          <h2>Vuokranperusteet</h2>
          <Divider />

          <GreenBoxEdit>
            <FieldArray
              component={BasisOfRentsEdit}
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
        isRentsFormValid: getIsRentsFormValid(state),
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
