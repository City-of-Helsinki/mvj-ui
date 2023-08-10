// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {flowRight} from 'lodash/util';
import {getFormValues, reduxForm} from 'redux-form';

import ApplicationSubsection from '$src/application/components/ApplicationSubsection';
import {getInitialApplicationForm} from '$src/application/helpers';
import {getFieldTypeMapping} from '$src/application/selectors';
import {FormNames} from '$src/enums';
import {receiveFormValidFlags} from '$src/areaSearch/actions';

type OwnProps = {
  formData: Object,
};

type Props = {
  ...OwnProps,
  fieldTypeMapping: Object,
  formValues: Object,
  initialize: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
};

class AreaSearchApplicationCreateForm extends Component<Props> {
  componentDidMount() {
    const {
      initialize,
      formData,
      formValues,
      fieldTypeMapping,
      receiveFormValidFlags,
      valid,
    } = this.props;

    receiveFormValidFlags({
      [FormNames.AREA_SEARCH_CREATE_FORM]: valid,
    });

    if (formValues.form === null) {
      initialize({
        form: getInitialApplicationForm(
          fieldTypeMapping,
          formData,
        ),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.AREA_SEARCH_CREATE_FORM]: this.props.valid,
      });
    }
  }

  render(): React$Node {
    const {formData, formValues} = this.props;

    if (!formValues?.form) {
      return null;
    }

    return (
      <div>
        {formData.sections.map((section) => (
          <ApplicationSubsection
            path={['form.sections']}
            section={section}
            headerTag="h2"
            key={section.id}
            formName={FormNames.AREA_SEARCH_CREATE_FORM}
            formPath='form'
            sectionTitleTransformers={[]}
            answerId={null}
          />
        ))}
      </div>
    );
  }
}

export default (flowRight(
  connect(
    (state) => ({
      fieldTypeMapping: getFieldTypeMapping(state),
      formValues: getFormValues(FormNames.AREA_SEARCH_CREATE_FORM)(state),
    }), {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: FormNames.AREA_SEARCH_CREATE_FORM,
    destroyOnUnmount: false,
  }),
)(AreaSearchApplicationCreateForm): React$ComponentType<OwnProps>);
