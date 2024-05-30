import React from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import FormField from "components/form/FormField";
import RemoveButton from "components/form/RemoveButton";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type Props = {
  attributes: Attributes;
  disabled: boolean;
  field: any;
  formName: string;
  isSaveClicked: boolean;
  onRemove: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const ConditionItemEdit = ({
  disabled,
  field,
  isSaveClicked,
  attributes,
  onRemove
}: Props) => {
  return <Row>
      <Column small={6} medium={4} large={2}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'conditions.child.children.form_of_management')} name={`${field}.form_of_management`} invisibleLabel />
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'conditions.child.children.obligated_area')} name={`${field}.obligated_area`} invisibleLabel />
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'conditions.child.children.actualized_area')} name={`${field}.actualized_area`} invisibleLabel />
      </Column>
      <Column small={3} medium={2} large={1}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'conditions.child.children.subvention_amount')} name={`${field}.subvention_amount`} invisibleLabel />
      </Column>
      <Column small={3} medium={2} large={1}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'conditions.child.children.compensation_pc')} name={`${field}.compensation_pc`} invisibleLabel />
      </Column>
      <Column small={3} medium={2} large={2}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'conditions.child.children.supervised_date')} name={`${field}.supervised_date`} invisibleLabel />
      </Column>
      <Column small={3} medium={2} large={1}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'conditions.child.children.supervision_date')} name={`${field}.supervision_date`} invisibleLabel />
      </Column>
      <Column large={1}>
        {!disabled && <RemoveButton className='third-level' onClick={onRemove} style={{
        height: 'unset'
      }} title='Poista hallintamuoto' />}
      </Column>
    </Row>;
};

export default connect((state, props: Props) => {
  const formName = props.formName;
  const selector = formValueSelector(formName);
  return {
    type: selector(state, `${props.field}.type`),
    usersPermissions: getUsersPermissions(state)
  };
})(ConditionItemEdit);