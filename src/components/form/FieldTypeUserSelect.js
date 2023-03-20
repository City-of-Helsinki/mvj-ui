// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentUser} from '$src/users/helpers';
import {addEmptyOption, sortStringByKeyAsc} from '$util/helpers';
import {fetchUsers} from '$src/users/requestsAsync';

type Props = {
  disabled?: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  onChange: Function,
  placeholder?: string,
  multiSelect?: boolean
}

const FieldTypeUserSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  multiSelect,
}: Props): React$Node => {
  const getUsers = debounce(async(inputValue: string, callback: Function) => {
    const contacts = await fetchUsers({
      search: inputValue,
    });

    callback(addEmptyOption(contacts.map((lessor) => getContentUser(lessor)).sort((a, b) => sortStringByKeyAsc(a, b, 'label'))));
  }, 500);

  return(
    <AsyncSelect
      disabled={disabled}
      displayError={displayError}
      getOptions={getUsers}
      input={input}
      isDirty={isDirty}
      onChange={onChange}
      placeholder={placeholder}
      multiSelect={multiSelect}
    />
  );
};

export default FieldTypeUserSelect;
