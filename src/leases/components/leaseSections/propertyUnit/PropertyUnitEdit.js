// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {FieldArray, reduxForm, formValueSelector} from 'redux-form';

import DistrictItemsEdit from './DistrictItemsEdit';
import FormSection from '../../../../components/form/FormSection';

type Props = {
  areas: Array<Object>,
  handleSubmit: Function,
  dispatch: Function,
}

class PropertyUnitEdit extends Component {
  props: Props

  render () {
    const {areas, dispatch, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray name="areas" areas={areas} dispatch={dispatch} component={DistrictItemsEdit}/>
        </FormSection>
      </form>
    );
  }
}

const formName = 'property-unit-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        areas: selector(state, 'areas'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(PropertyUnitEdit);
