import React, { useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "@/components/form/AsyncSelect";
import { getContentUser } from "@/users/helpers";
import { addEmptyOption, sortStringByKeyAsc } from "@/util/helpers";
import { fetchSingleUser, fetchUsers } from "@/users/requestsAsync";
import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeUserSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  multiSelect,
  serviceUnit,
}: FieldComponentProps): JSX.Element => {
  // If a plain ID value has already been set when the component mounts,
  // retrieve the corresponding single user object and set the state up accordingly
  // so that we can show the user's name in the closed dropdown properly.
  // However, if another user is selected while the fetch is still underway,
  // don't use the result when the fetch completes.
  const [initialUser, setInitialUser] = useState<Record<string, any> | null>(
    null,
  );
  const [isLoadingSingleUser, setIsLoadingSingleUser] =
    useState<boolean>(false);
  const singleUserLoadCancelled = useRef<boolean>(false);
  useEffect(() => {
    if (input.value && ["string", "number"].includes(typeof input.value)) {
      setIsLoadingSingleUser(true);
      fetchSingleUser(input.value).then((user) => {
        if (singleUserLoadCancelled.current === false) {
          if (user) {
            setInitialUser(getContentUser(user));
            input.onChange(getContentUser(user));
          } else {
            singleUserLoadCancelled.current = true;
            input.onChange(null);
          }

          setIsLoadingSingleUser(false);
        }
      });
    }
  }, []);

  const handleChange = (newValue) => {
    singleUserLoadCancelled.current = true;

    if (onChange) {
      onChange(newValue);
    }
  };

  const getUsers = debounce(
    async (inputValue: string, callback: (...args: Array<any>) => any) => {
      const contacts = await fetchUsers({
        search: inputValue,
        service_unit: serviceUnit?.id || "",
      });
      callback(
        addEmptyOption(
          contacts
            .map((lessor) => getContentUser(lessor))
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
      getOptions={getUsers}
      input={input}
      isDirty={isDirty}
      isLoading={isLoadingSingleUser && !singleUserLoadCancelled.current}
      onChange={handleChange}
      placeholder={placeholder}
      multiSelect={multiSelect}
      defaultOptions={initialUser ? [initialUser] : []}
    />
  );
};

export default FieldTypeUserSelect;
