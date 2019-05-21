// @flow
import React from 'react';
// $FlowFixMe
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentUser} from '$src/users/helpers';
import {addEmptyOption, sortByLabelAsc} from '$util/helpers';
import {fetchUsers} from '$src/users/requestsAsync';

type Props = {
  disabled?: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  onChange: Function,
  placeholder?: string,
}

const FieldTypeUserSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
}: Props) => {
  const getUsers = debounce(async(inputValue: string, callback: Function) => {
    const contacts = await fetchUsers({
      search: inputValue,
    });

    callback(addEmptyOption(contacts.map((lessor) => getContentUser(lessor)).sort(sortByLabelAsc)));
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
    />
  );
};

export default FieldTypeUserSelect;
