// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentContact} from '$src/contacts/helpers';
import {addEmptyOption, sortStringByKeyAsc} from '$util/helpers';
import {fetchContacts} from '$src/contacts/requestsAsync';

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

const FieldTypeContactSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  serviceUnit,
}: Props): React$Node => {
  const getContacts = debounce(async(inputValue: string, callback: Function) => {
    const contacts = await fetchContacts({
      search: inputValue,
      limit: 20,
      service_unit: serviceUnit ? serviceUnit.id : '',
    });

    callback(addEmptyOption(contacts.map((lessor) => getContentContact(lessor)).sort((a, b) => sortStringByKeyAsc(a, b, 'label'))));
  }, 500);

  return(
    <AsyncSelect
      disabled={disabled}
      displayError={displayError}
      getOptions={getContacts}
      input={input}
      isDirty={isDirty}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default FieldTypeContactSelect;
