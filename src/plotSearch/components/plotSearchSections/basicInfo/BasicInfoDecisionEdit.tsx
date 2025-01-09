import React from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import RemoveButton from "@/components/form/RemoveButton";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { getAttributes, getIsSaveClicked } from "@/plotSearch/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import DecisionSelectInput from "@/components/form/DecisionSelectInput";
import { formatDecisionName } from "@/plotSearch/helpers";
type OwnProps = {
  disabled: boolean;
  field: any;
  formName: string;
  onRemove: (...args: Array<any>) => any;
  onChange: (...args: Array<any>) => any;
  attributes: Attributes;
  getPlotUnitDecisions: (...args: Array<any>) => any;
  cacheKey: string;
};
type Props = OwnProps & {
  currentAmountPerArea: number;
  initialYearRent: number;
  isSaveClicked: boolean;
  getPlotUnitDecisions: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  initialValue: Record<string, any>;
};

const BasicInfoDecisionEdit = ({
  disabled,
  field,
  onRemove,
  initialValue,
  onChange,
  getPlotUnitDecisions,
  cacheKey,
}: Props) => {
  return (
    <Row>
      <Column large={8}>
        <DecisionSelectInput
          value={
            initialValue?.id
              ? {
                  id: initialValue.id,
                  label: formatDecisionName(initialValue),
                }
              : null
          }
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
          {!disabled && (
            <RemoveButton
              className="third-level"
              onClick={onRemove}
              style={{
                height: "unset",
              }}
              title="Poista päätös"
            />
          )}
        </Authorization>
      </Column>
    </Row>
  );
};

export default connect((state, props: Props) => {
  const formName = props.formName;
  const selector = formValueSelector(formName);
  return {
    attributes: getAttributes(state),
    isSaveClicked: getIsSaveClicked(state),
    decisionToList: selector(state, `${props.field}.decision_to_list`),
    initialValue: selector(state, `${props.field}`),
    usersPermissions: getUsersPermissions(state),
  };
})(BasicInfoDecisionEdit) as React.ComponentType<OwnProps>;
