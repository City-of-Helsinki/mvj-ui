import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "src/components/form/AsyncSelect";
import { getContentPlanUnitIdentifier } from "src/plotSearch/helpers";
import { fetchPlanUnitListWithIdentifiersList, fetchCustomDetailedPlanListWithIdentifiersList } from "src/plotSearch/requestsAsync";
type Props = {
  disabled?: boolean;
  name: string;
  onBlur?: (...args: Array<any>) => any;
  placeholder?: string;
  onChange: (...args: Array<any>) => any;
  value?: Record<string, any>;
};

const PlanUnitSelectInput = ({
  disabled,
  name,
  onChange,
  onBlur,
  placeholder,
  value
}: Props): React.ReactNode => {
  const getPlanUnitOptions = (planUnitList: Array<Record<string, any>>, customDetailedPlanList: Array<Record<string, any>>): Array<Record<string, any>> => {
    return [...planUnitList, ...customDetailedPlanList].map(planUnit => {
      return {
        value: planUnit.id,
        label: getContentPlanUnitIdentifier(planUnit),
        identifierType: planUnit.identifier_type
      };
    });
  };

  const getPlanUnitList = debounce(async (inputValue: string, callback: (...args: Array<any>) => any) => {
    const planUnitList = await fetchPlanUnitListWithIdentifiersList({
      limit: 10,
      search: inputValue
    });
    const customDetailedPlanList = await fetchCustomDetailedPlanListWithIdentifiersList({
      limit: 10,
      search: inputValue
    });
    callback(getPlanUnitOptions(planUnitList, customDetailedPlanList));
  }, 500);
  const input = {
    name,
    onBlur,
    onChange,
    value
  };
  return <AsyncSelect disabled={disabled} displayError={false} getOptions={(inputValue, callBack) => getPlanUnitList(inputValue, callBack)} input={input} isDirty={false} placeholder={placeholder} />;
};

export default PlanUnitSelectInput;