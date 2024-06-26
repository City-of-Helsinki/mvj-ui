import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "/src/components/form/AsyncSelect";
import { fetchDecisions } from "leases/requestsAsync";
import { formatDecisionName } from "plotSearch/helpers";
type Props = {
  disabled?: boolean;
  name: string;
  onBlur?: (...args: Array<any>) => any;
  placeholder?: string;
  onChange: (...args: Array<any>) => any;
  value?: Record<string, any>;
  getOptions?: (...args: Array<any>) => any;
  cacheOptions?: any;
  hasError: boolean;
};

const DecisionSelectInput = ({
  disabled,
  name,
  onChange,
  onBlur,
  placeholder,
  value,
  getOptions,
  cacheOptions,
  hasError
}: Props): React.ReactNode => {
  const getDecisionOptions = (decisionList: Array<Record<string, any>>): Array<Record<string, any>> => decisionList.map(decision => {
    return {
      value: decision.id,
      label: formatDecisionName(decision),
      data: decision
    };
  });

  const getDecisionList = debounce(async (inputValue: string, callback: (...args: Array<any>) => any) => {
    let decisionList;

    if (getOptions) {
      decisionList = await getOptions(inputValue);
    } else {
      decisionList = await fetchDecisions({
        reference_number: inputValue,
        limit: 10
      });
    }

    callback(getDecisionOptions(decisionList));
  }, 500);
  const input = {
    name,
    onBlur,
    onChange,
    value
  };
  return <AsyncSelect disabled={disabled} displayError={hasError} getOptions={getDecisionList} input={input} isDirty={false} placeholder={placeholder} cacheOptions={cacheOptions} />;
};

export default DecisionSelectInput;