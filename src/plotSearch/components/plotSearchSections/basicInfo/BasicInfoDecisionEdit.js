// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {PlotSearchFieldTitles} from '$src/plotSearch/enums';
import {
  getFieldOptions,
} from '$util/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {
  getAttributes,
  getIsSaveClicked,
} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  attributes: Attributes,
  currentAmountPerArea: number,
  disabled: boolean,
  field: any,
  formName: string,
  initialYearRent: number,
  isSaveClicked: boolean,
  onRemove: Function,
  subventionAmount: string,
  usersPermissions: UsersPermissionsType,
}

const BasicInfoDecisionEdit = ({
  disabled,
  field,
  isSaveClicked,
  attributes,
  onRemove,
}: Props) => {

  const decisionOptions = getFieldOptions(attributes, 'decision.child.children.type');

  return (
    <Row>
      <Column large={8}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'decision.child.children.type')}
          name={`${field}.type`}
          overrideValues={{
            fieldType: 'choice',
            label: PlotSearchFieldTitles.DECISION,
            options: decisionOptions,
          }}
          invisibleLabel
        />
      </Column>
      <Column large={3}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'decision.child.children.decision_to_list')}
          name={`${field}.decision_to_list`}
          overrideValues={{
            fieldType: 'checkbox',
            label: PlotSearchFieldTitles.DECISION_TO_LIST,
          }}
          invisibleLabel
        />
      </Column>
      <Column large={1}>
        <Authorization allow={true}>
          {!disabled &&
            <RemoveButton
              className='third-level'
              onClick={onRemove}
              style={{height: 'unset'}}
              title='Poista päätös'
            />
          }
        </Authorization>
      </Column>
    </Row>
  );
};

export default connect(
  (state, props: Props) => {
    const formName = props.formName;
    const selector = formValueSelector(formName);

    return {
      attributes: getAttributes(state),
      isSaveClicked: getIsSaveClicked(state),
      type: selector(state, `${props.field}.type`),
      decisionToList: selector(state, `${props.field}.decision_to_list`),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(BasicInfoDecisionEdit);
