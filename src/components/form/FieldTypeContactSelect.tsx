import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "@/components/form/AsyncSelect";
import { getContentContact } from "@/contacts/helpers";
import { addEmptyOption, sortStringByKeyAsc } from "@/util/helpers";
import { fetchContacts } from "@/contacts/requestsAsync";
import type { UserServiceUnit } from "@/usersPermissions/types";
type Props = {
  disabled?: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  onChange: (...args: Array<any>) => any;
  placeholder?: string;
  serviceUnit: UserServiceUnit;
};

const FieldTypeContactSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  serviceUnit
}: Props): JSX.Element => {
  const getContacts = debounce(async (inputValue: string, callback: (...args: Array<any>) => any) => {
    const contacts = await fetchContacts({
      search: inputValue,
      limit: 20,
      service_unit: serviceUnit?.id || ""
    });
    callback(addEmptyOption(contacts.map(lessor => getContentContact(lessor)).sort((a, b) => sortStringByKeyAsc(a, b, 'label'))));
  }, 500);
  return <AsyncSelect disabled={disabled} displayError={displayError} getOptions={getContacts} input={input} isDirty={isDirty} onChange={onChange} placeholder={placeholder} />;
};

export default FieldTypeContactSelect;