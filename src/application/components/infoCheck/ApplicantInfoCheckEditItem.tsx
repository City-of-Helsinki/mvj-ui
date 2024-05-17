import React from "react";
import flowRight from "lodash/flowRight";
import { connect } from "react-redux";
import { getFormValues, reduxForm } from "redux-form";
import { Column, Row } from "react-foundation";
import classNames from "classnames";
import { getApplicantInfoCheckAttributes } from "src/application/selectors";
import { getFieldOptions, getLabelOfOption } from "src/util/helpers";
import { getUserFullName } from "src/users/helpers";
import type { Attributes } from "src/types";
type OwnProps = {
  openModal: (...args: Array<any>) => any;
  formName: string;
};
type Props = OwnProps & {
  dirty: boolean;
  infoCheckAttributes: Attributes;
  formValues: Record<string, any>;
};

const ApplicantInfoCheckEditItem = ({
  formValues,
  dirty,
  openModal,
  formName,
  infoCheckAttributes
}: Props) => {
  const infoCheckStatusOptions = getFieldOptions(infoCheckAttributes, 'state');
  const statusText = getLabelOfOption(infoCheckStatusOptions, formValues.data.state);
  return <Column small={6} key={formValues.kind.type} className={classNames('ApplicantInfoCheckEditItem', {
    'ApplicantInfoCheckEditItem--dirty': dirty
  })}>
    <Row>
      <Column small={8}>
        {formValues.kind.external && <a onClick={() => openModal(formValues, formName, false)}>
            {formValues.kind.label}
          </a>}
        {!formValues.kind.external && <span>{formValues.kind.label}</span>}
      </Column>
      <Column small={4}>
        {formValues.kind.external && !formValues.data.preparer && <span>{statusText}</span>}
        {(!formValues.kind.external || formValues.data.preparer) && <a onClick={() => openModal(formValues, formName, true)}>
            {statusText}
            {formValues.data.preparer && <>, {getUserFullName(formValues.data.preparer)}</>}
          </a>}
      </Column>
    </Row>
  </Column>;
};

export default (flowRight(connect((state, props) => {
  const formValues = getFormValues(props.formName)(state);
  return {
    formValues,
    form: props.formName,
    infoCheckAttributes: getApplicantInfoCheckAttributes(state)
  };
}), reduxForm({
  destroyOnUnmount: false
}))(ApplicantInfoCheckEditItem) as React.ComponentType<OwnProps>);