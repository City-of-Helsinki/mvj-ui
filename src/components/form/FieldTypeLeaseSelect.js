// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentLeaseOption} from '$src/leases/helpers';
import {addEmptyOption, sortStringByKeyAsc} from '$util/helpers';
import {fetchLeases} from '$src/leases/requestsAsync';

type Props = {
  disabled?: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  onChange: Function,
  placeholder?: string,
}

const FieldTypeLeaseSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
}: Props): React$Node => {
  const getLeases = debounce(async(inputValue: string, callback: Function) => {
    const leases = await fetchLeases({
      succinct: true,
      identifier: inputValue,
      limit: 15,
    });

    callback(addEmptyOption(leases.map((lease) => getContentLeaseOption(lease)).sort((a, b) => sortStringByKeyAsc(a, b, 'label'))));
  }, 500);

  return(
    <AsyncSelect
      disabled={disabled}
      displayError={displayError}
      getOptions={getLeases}
      input={input}
      isDirty={isDirty}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default FieldTypeLeaseSelect;
