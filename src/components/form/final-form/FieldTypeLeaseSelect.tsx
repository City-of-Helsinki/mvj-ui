import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "@/components/form/AsyncSelect";
import { getContentLeaseOption } from "@/leases/helpers";
import { addEmptyOption, sortStringByKeyAsc } from "@/util/helpers";
import { fetchLeases } from "@/leases/requestsAsync";
import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeLeaseSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  serviceUnit,
}: FieldComponentProps): JSX.Element => {
  const getLeases = debounce(
    async (inputValue: string, callback: (...args: Array<any>) => any) => {
      const leases = await fetchLeases({
        succinct: true,
        identifier: inputValue,
        limit: 15,
        service_unit: serviceUnit?.id || "",
      });
      callback(
        addEmptyOption(
          leases
            .map((lease) => getContentLeaseOption(lease))
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
      getOptions={getLeases}
      input={input}
      isDirty={isDirty}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default FieldTypeLeaseSelect;
