// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {fetchDecisions} from '$src/leases/requestsAsync';
import {formatDecisionName} from '$src/plotSearch/helpers';

type Props = {
  disabled?: boolean,
  name: string,
  onBlur?: Function,
  placeholder?: string,
  onChange: Function,
  value?: Object,
  getOptions?: Function,
  cacheOptions?: any,
  hasError: boolean,
}

const DecisionSelectInput = ({
  disabled,
  name,
  onChange,
  onBlur,
  placeholder,
  value,
  getOptions,
  cacheOptions,
  hasError,
}: Props): React$Node => {
  const getDecisionOptions = (decisionList: Array<Object>): Array<Object> =>
    decisionList
      .map((decision) => {
        return {
          value: decision.id,
          label: formatDecisionName(decision),
          data: decision,
        };
      });

  const getDecisionList = debounce(async(inputValue: string, callback: Function) => {
    let decisionList;

    if (getOptions) {
      decisionList = await getOptions(inputValue);
    } else {
      decisionList = await fetchDecisions({
        reference_number: inputValue,
        limit: 10,
      });
    }

    callback(getDecisionOptions(decisionList));
  }, 500);

  const input = {
    name,
    onBlur,
    onChange,
    value,
  };

  return(
    <AsyncSelect
      disabled={disabled}
      displayError={hasError}
      getOptions={getDecisionList}
      input={input}
      isDirty={false}
      placeholder={placeholder}
      cacheOptions={cacheOptions}
    />
  );
};

export default DecisionSelectInput;
