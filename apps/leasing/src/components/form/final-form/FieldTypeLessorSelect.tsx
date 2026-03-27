import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "@/components/form/AsyncSelect";
import { getContentLessor } from "@/lessor/helpers";
import { addEmptyOption, sortStringByKeyAsc } from "@/util/helpers";
import { fetchContacts } from "@/contacts/requestsAsync";
import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeLessorSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  serviceUnit,
}: FieldComponentProps): JSX.Element => {
  const getLessors = debounce(
    async (inputValue: string, callback: (...args: Array<any>) => any) => {
      const lessors = await fetchContacts({
        is_lessor: true,
        search: inputValue,
        service_unit: serviceUnit?.id || "",
      });
      callback(
        addEmptyOption(
          lessors
            .map((lessor) => getContentLessor(lessor))
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
      getOptions={getLessors}
      input={input}
      isDirty={isDirty}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default FieldTypeLessorSelect;
