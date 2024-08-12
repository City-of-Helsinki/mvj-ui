import React, { useEffect } from "react";
import { connect } from "react-redux";
import { flowRight } from "lodash/util";
import { getFormValues, reduxForm } from "redux-form";
import ApplicationSubsection from "application/components/ApplicationSubsection";
import { getInitialApplicationForm } from "application/helpers";
import { getFieldTypeMapping } from "application/selectors";
import { FormNames } from "enums";
import { receiveFormValidFlags } from "areaSearch/actions";
import { validateApplicationForm } from "application/formValidation";
type OwnProps = {
  formData: any;
};
type Props = OwnProps & {
  fieldTypeMapping: Record<string, any>;
  formValues: Record<string, any>;
  initialize: (...args: Array<any>) => any;
  receiveFormValidFlags: (...args: Array<any>) => any;
  valid: boolean;
};

const AreaSearchApplicationCreateForm = ({
  initialize,
  formData,
  formValues,
  fieldTypeMapping,
  receiveFormValidFlags,
  valid,
}: Props) => {
  useEffect(() => {
    receiveFormValidFlags({
      [FormNames.AREA_SEARCH_CREATE_FORM]: valid
    });

    if (formValues.form === null) {
      initialize({
        form: getInitialApplicationForm(fieldTypeMapping, formData)
      });
    }
  }, []);

  useEffect(() => {
    receiveFormValidFlags({
      [FormNames.AREA_SEARCH_CREATE_FORM]: valid,
    });
  }, [valid]);

  if (!formValues?.form) {
    return null;
  }

    return <div>
        {formData.sections.map(section => <ApplicationSubsection path={['form.sections']} section={section} headerTag="h2" key={section.id} formName={FormNames.AREA_SEARCH_CREATE_FORM} formPath='form' sectionTitleTransformers={[]} answerId={null} />)}
      </div>;
}

export default (flowRight(connect(state => ({
  fieldTypeMapping: getFieldTypeMapping(state),
  formValues: getFormValues(FormNames.AREA_SEARCH_CREATE_FORM)(state)
}), {
  receiveFormValidFlags
}), reduxForm({
  form: FormNames.AREA_SEARCH_CREATE_FORM,
  destroyOnUnmount: false,
  validate: validateApplicationForm('form')
}))(AreaSearchApplicationCreateForm) as React.ComponentType<OwnProps>);