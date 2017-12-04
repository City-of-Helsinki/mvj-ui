// @flow
import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import FieldTypeSelect from '../../../components/form/FieldTypeSelect';


type Props = {
  districtOptions: Array<Object>,
  municipalityOptions: Array<Object>,
  typeOptions: Array<Object>,
}

class CreateLease extends Component {
  props: Props

  render () {
    const {districtOptions, municipalityOptions, typeOptions} = this.props;

    return (
      <form className='lease-info-edit'>
        <div className='lease-info-edit__column'>
          <Field
            label='Vuokrauksen laji'
            name={'type'}
            options={typeOptions}
            component={FieldTypeSelect}/>
        </div>
        <div className='lease-info-edit__column'>
          <Field
            label='Kunta'
            name={'municipality'}
            options={municipalityOptions}
            component={FieldTypeSelect}/>
        </div>
        <div className='lease-info-edit__column'>
          <Field
            label='Kaupunginosa'
            name={'district'}
            options={districtOptions}
            component={FieldTypeSelect}/>
        </div>
      </form>
    );
  }
}

const formName = 'create-lease-form';

export default flowRight(
  reduxForm({
    form: formName,
  }),
)(CreateLease);
