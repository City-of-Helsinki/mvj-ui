import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "src/components/form/AsyncSelect";
import { getContentLessor } from "src/lessor/helpers";
import { addEmptyOption, sortStringByKeyAsc } from "src/util/helpers";
import { fetchContacts } from "src/contacts/requestsAsync";
import type { UserServiceUnit } from "src/usersPermissions/types";
type Props = {
  disabled?: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  onChange: (...args: Array<any>) => any;
  placeholder?: string;
  serviceUnit: UserServiceUnit;
};

const FieldTypeLessorSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  serviceUnit
}: Props): React.ReactNode => {
  const getLessors = debounce(async (inputValue: string, callback: (...args: Array<any>) => any) => {
    const lessors = await fetchContacts({
      is_lessor: true,
      search: inputValue,
      service_unit: serviceUnit?.id || ""
    });
    callback(addEmptyOption(lessors.map(lessor => getContentLessor(lessor)).sort((a, b) => sortStringByKeyAsc(a, b, 'label'))));
  }, 500);
  return <AsyncSelect disabled={disabled} displayError={displayError} getOptions={getLessors} input={input} isDirty={isDirty} onChange={onChange} placeholder={placeholder} />;
};

export default FieldTypeLessorSelect;