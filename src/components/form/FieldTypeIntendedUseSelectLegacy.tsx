import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "@/components/form/AsyncSelect";
import { addEmptyOption, sortStringByKeyAsc } from "@/util/helpers";
import { getContentIntendedUse } from "@/leases/helpers";
import { fetchIntendedUses } from "@/leases/requestsAsync";
import type { ServiceUnit } from "@/serviceUnits/types";
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
  serviceUnit,
}: Props): JSX.Element => {
  const getIntendedUses = debounce(
    async (inputValue: string, callback: (...args: Array<any>) => any) => {
      const intendedUses = await fetchIntendedUses({
        search: inputValue,
        limit: 500,
        service_unit: serviceUnit?.id || "",
        is_active: "true",
      });
      callback(
        addEmptyOption(
          intendedUses
            .map((intendedUse) => getContentIntendedUse(intendedUse))
            .sort((a, b) => sortStringByKeyAsc(a, b, "label")),
        ),
      );
    },
    500,
  );
  return (
    <AsyncSelect
      disabled={disabled}
      displayError={displayError}
      getOptions={getIntendedUses}
      input={input}
      isDirty={isDirty}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default FieldTypeIntendedUseSelect;
