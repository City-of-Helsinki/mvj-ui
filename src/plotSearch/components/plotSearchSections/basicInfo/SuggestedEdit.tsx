import React from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import Authorization from "/src/components/authorization/Authorization";
import FormField from "/src/components/form/FormField";
import RemoveButton from "/src/components/form/RemoveButton";
import { getFieldOptions } from "util/helpers";
import { getUsersPermissions } from "usersPermissions/selectors";
import { getAttributes, getIsSaveClicked } from "/src/plotSearch/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type OwnProps = {
  disabled: boolean;
  field: any;
  formName: string;
  onRemove: (...args: Array<any>) => any;
  attributes: Attributes;
  isSaveClicked: boolean;
};
type Props = OwnProps & {
  currentAmountPerArea: number;
  initialYearRent: number;
  subventionAmount: string;
  usersPermissions: UsersPermissionsType;
};

const SuggestedEdit = ({
  disabled,
  field,
  isSaveClicked,
  attributes,
  onRemove
}: Props) => {
  const suggestedOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.suggested.child.children.name');
  return <Row>
      <Column large={7}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'plotSearch_sites.child.children.suggested.child.children.name')} name={`${field}.name`} overrideValues={{
        label: 'Ehdotettu varauksensaaja',
        options: suggestedOptions
      }} invisibleLabel />
      </Column>
      <Column large={1.5}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'plotSearch_sites.child.children.suggested.child.children.share_numerator')} name={`${field}.share_numerator`} invisibleLabel />
      </Column>
      {'/'}
      <Column large={1.5}>
        <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'plotSearch_sites.child.children.suggested.child.children.share_denominator')} name={`${field}.share_denominator`} invisibleLabel />
      </Column>
      <Column large={1}>
        <Authorization allow={true}>
          {!disabled && <RemoveButton className='third-level' onClick={onRemove} style={{
          height: 'unset'
        }} title='Poista päätös' />}
        </Authorization>
      </Column>
    </Row>;
};

export default (connect((state, props: Props) => {
  const formName = props.formName;
  const selector = formValueSelector(formName);
  return {
    attributes: getAttributes(state),
    isSaveClicked: getIsSaveClicked(state),
    type: selector(state, `${props.field}.type`),
    decisionToList: selector(state, `${props.field}.decision_to_list`),
    usersPermissions: getUsersPermissions(state)
  };
})(SuggestedEdit) as React.ComponentType<OwnProps>);