import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "@/components/form/AsyncSelect";
import { addEmptyOption, sortStringByKeyAsc } from "@/util/helpers";
import { fetchLeaseTypes } from "@/leases/requestsAsync";
import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeLeaseTypeSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
}: FieldComponentProps): JSX.Element => {
  const getLeaseTypes = debounce(
    async (inputValue: string, callback: (...args: Array<any>) => any) => {
      const leaseTypes = await fetchLeaseTypes({
        search: inputValue,
        limit: 500,
        is_active: "true",
      });
      callback(
        addEmptyOption(
          leaseTypes
            .map((leaseType) => {
              return {
                id: leaseType.id,
                value: leaseType.id,
                label: `${leaseType.identifier} ${leaseType.name}`,
                name: leaseType.name,
              };
            })
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
      getOptions={getLeaseTypes}
      input={input}
      isDirty={isDirty}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default FieldTypeLeaseTypeSelect;
