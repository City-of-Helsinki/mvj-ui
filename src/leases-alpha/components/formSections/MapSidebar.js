// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {FieldArray, getFormInitialValues, reduxForm} from 'redux-form';
import {translate} from 'react-i18next';
import {getAreas} from '../../selectors';
import FieldTypeMulti from '../../../components-alpha/form/FieldTypeMulti';

type Props = {
  availableAreas: Array<any>,
  handleSubmit: Function,
  initialValues: Object,
  invalid: Boolean,
  isOpenApplication: Boolean,
  pristine: Boolean,
  submitSucceeded: Boolean,
  submitting: Boolean,
  t: Function,
};

class MapSidebar extends Component {
  props: Props;

  render() {
    const {
      availableAreas,
    } = this.props;

    const areaOpts = availableAreas.map(area => ({value: area, label: area.name}));

    return (
      <div className="areas__sidebar">
        <h2>Alueet</h2>
        <div className="areas">
          <FieldArray name="areas"
            title="Alueet"
            fieldValues={[
              {name: 'name', label: 'Alue', type: 'select', required: true, options: areaOpts},
            ]}
            component={FieldTypeMulti}/>
        </div>
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        initialValues: getFormInitialValues('preparer-form')(state),
        availableAreas: getAreas(state),
      };
    },
    {},
  ),
  reduxForm({
    form: 'areasEditForm',
    enableReinitialize: true,
  }),
  translate(['common', 'applications']),
)(MapSidebar);
