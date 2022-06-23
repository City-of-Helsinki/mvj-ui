// @flow
import React from 'react';
// $FlowFixMe
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentUser} from '$src/users/helpers';
import {addEmptyOption, sortStringByKeyAsc} from '$util/helpers';
import {fetchUsers} from '$src/users/requestsAsync';

import type {UserServiceUnit} from '$src/usersPermissions/types';

type Props = {
  disabled?: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  onChange: Function,
  placeholder?: string,
  serviceUnit: UserServiceUnit,
}

const FieldTypeUserSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  serviceUnit,
}: Props) => {
  const getUsers = debounce(async(inputValue: string, callback: Function) => {
    const contacts = await fetchUsers({
      search: inputValue,
      service_unit: serviceUnit ? serviceUnit.id : '',
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
    />
  );
};

export default FieldTypeUserSelect;
