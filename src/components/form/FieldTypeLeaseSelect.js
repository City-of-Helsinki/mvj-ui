// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentLeaseOption} from '$src/leases/helpers';
import {addEmptyOption, sortStringByKeyAsc} from '$util/helpers';
import {fetchLeases} from '$src/leases/requestsAsync';

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

const FieldTypeLeaseSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
  serviceUnit,
}: Props): React$Node => {
  const getLeases = debounce(async(inputValue: string, callback: Function) => {
    const leases = await fetchLeases({
      succinct: true,
      identifier: inputValue,
      limit: 15,
      service_unit: serviceUnit?.id || "",
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
