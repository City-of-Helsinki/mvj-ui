// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentPlanUnitIdentifier} from '$src/plotSearch/helpers';
import {fetchPlanUnitListWithIdentifiersList} from '$src/plotSearch/requestsAsync';

type Props = {
  disabled?: boolean,
  name: string,
  onBlur?: Function,
  placeholder?: string,
  onChange: Function,
  value?: Object,
}

const PlanUnitSelectInput = ({
  disabled,
  name,
  onChange,
  onBlur,
  placeholder,
  value,
}: Props) => {
  const getPlanUnitOptions = (planUnitList: Array<Object>): Array<Object> =>
    planUnitList
      .map((plan_unit) => {
        return {
          value: plan_unit.id,
          label: getContentPlanUnitIdentifier(plan_unit),
        };
      });

  const getPlanUnitList = debounce(async(inputValue: string, callback: Function) => {
    const planUnitList = await fetchPlanUnitListWithIdentifiersList({
      search: inputValue,
      limit: 10,
    });

    callback(getPlanUnitOptions(planUnitList));
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
      displayError={false}
      getOptions={getPlanUnitList}
      input={input}
      isDirty={false}
      placeholder={placeholder}
    />
  );
};

export default PlanUnitSelectInput;
