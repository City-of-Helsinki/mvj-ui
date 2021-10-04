// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import RemoveButton from '$components/form/RemoveButton';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {
  getAttributes,
  getIsSaveClicked,
} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import DecisionSelectInput from "../../../../components/form/DecisionSelectInput";
import {formatDecisionName} from "../../../helpers";

type Props = {
  attributes: Attributes,
  currentAmountPerArea: number,
  disabled: boolean,
  field: any,
  formName: string,
  initialYearRent: number,
  isSaveClicked: boolean,
  onRemove: Function,
  getPlotUnitDecisions: Function,
  usersPermissions: UsersPermissionsType,
}

const BasicInfoDecisionEdit = ({
  disabled,
  field,
  attributes,
  onRemove,
  initialValue,
  onChange,
  getPlotUnitDecisions,
  cacheKey
}: Props) => {
  return (
    <Row>
      <Column large={8}>
        <DecisionSelectInput
          value={initialValue?.id ? {
            id: initialValue.id,
            label: formatDecisionName(initialValue)
          } : null}
          onChange={onChange}
          name={field}
          getOptions={getPlotUnitDecisions}
          hasError={initialValue?.id && !initialValue.relatedPlanUnitId}
          cacheOptions={false}
          key={cacheKey}
        />
      </Column>
      {/*<Column large={3}>
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
      </Column>*/}
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
      decisionToList: selector(state, `${props.field}.decision_to_list`),
      initialValue: selector(state, `${props.field}`),
      usersPermissions: getUsersPermissions(state)
    };
  },
)(BasicInfoDecisionEdit);
