// @flow
import React from 'react';
// $FlowFixMe
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentContact} from '../../contacts/helpers';
import {addEmptyOption, sortStringByKeyAsc} from '$util/helpers';
import {fetchContacts} from '$src/contacts/requestsAsync';

type Props = {
  disabled?: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  onChange: Function,
  placeholder?: string,
}

const FieldTypeContactSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
}: Props) => {
  const getContacts = debounce(async(inputValue: string, callback: Function) => {
    const contacts = await fetchContacts({
      search: inputValue,
      limit: 20,
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
