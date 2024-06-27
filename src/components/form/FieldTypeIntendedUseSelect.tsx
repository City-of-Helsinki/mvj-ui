import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "/src/components/form/AsyncSelect";
import { addEmptyOption, sortStringByKeyAsc } from "util/helpers";
import { getContentIntendedUse } from "/src/leases/helpers";
import { fetchIntendedUses } from "/src/leases/requestsAsync";
import type { ServiceUnit } from "/src/serviceUnits/types";
type Props = {
  disabled?: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  onChange: (...args: Array<any>) => any;
  placeholder?: string;
  serviceUnit: ServiceUnit;
};
const FieldTypeIntendedUseSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  serviceUnit
}: Props): React.ReactNode => {
  const getIntendedUses = debounce(async (inputValue: string, callback: (...args: Array<any>) => any) => {
    const intendedUses = await fetchIntendedUses({
      search: inputValue,
      limit: 20,
      service_unit: serviceUnit?.id || ""
    });
    callback(addEmptyOption(intendedUses.map((intendedUse) => getContentIntendedUse(intendedUse)).sort((a, b) => sortStringByKeyAsc(a, b, 'label'))));
  }, 500);
  return <AsyncSelect disabled={disabled} displayError={displayError} getOptions={getIntendedUses} input={input} isDirty={isDirty} onChange={onChange} placeholder={placeholder} />;
};

export default FieldTypeIntendedUseSelect;