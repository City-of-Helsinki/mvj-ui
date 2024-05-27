import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "src/components/form/AsyncSelect";
import { fetchEstateIdList } from "src/landUseContract/requestsAsync";
type Props = {
  disabled?: boolean;
  name: string;
  onBlur?: (...args: Array<any>) => any;
  placeholder?: string;
  onChange: (...args: Array<any>) => any;
  value?: Record<string, any>;
  initialValues: any;
};

const EstateIdSelectInput = ({
  disabled,
  name,
  onChange,
  onBlur,
  placeholder,
  value,
  initialValues
}: Props) => {
  const getEstateIdOptions = (EstateIdList: Array<Record<string, any>>): Array<Record<string, any>> => {
    return EstateIdList.map(lease => {
      return {
        id: lease.id,
        value: lease.identifier,
        label: lease.identifier
      };
    });
  };

  const getEstateIdList = debounce(async (inputValue: string, callback: (...args: Array<any>) => any) => {
    const EstateIdList = await fetchEstateIdList({
      search: inputValue,
      limit: 10
    });
    callback(getEstateIdOptions(EstateIdList));
  }, 500);
  const input = {
    name,
    onBlur,
    onChange,
    value
  };
  return <AsyncSelect disabled={disabled} displayError={false} getOptions={getEstateIdList} input={input} isDirty={false} placeholder={placeholder} initialValues={initialValues?.estate_id} />;
};

export default EstateIdSelectInput;