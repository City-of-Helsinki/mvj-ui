// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentLessor} from '$src/lessor/helpers';
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

const FieldTypeLessorSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
}: Props) => {
  const getLessors = debounce(async(inputValue: string, callback: Function) => {
    const lessors = await fetchContacts({
      is_lessor: true,
      search: inputValue,
    });

    callback(addEmptyOption(lessors.map((lessor) => getContentLessor(lessor)).sort((a, b) => sortStringByKeyAsc(a, b, 'label'))));
  }, 500);

  return(
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
