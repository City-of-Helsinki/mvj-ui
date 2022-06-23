// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {fetchLeases} from '$src/leases/requestsAsync';

import type {UserServiceUnit} from '$src/usersPermissions/types';

type Props = {
  disabled?: boolean,
  name: string,
  onBlur?: Function,
  onChange: Function,
  placeholder?: string,
  relatedLeases: Array<Object>,
  serviceUnit: UserServiceUnit,
  value?: Object,
}

const LeaseSelectInput = ({
  disabled,
  name,
  onBlur,
  onChange,
  placeholder,
  relatedLeases,
  serviceUnit,
  value,
}: Props) => {
  const getLeaseOptions = (leases: Array<Object>): Array<Object> =>
    leases
      .filter((lease) => relatedLeases.find((relatedLease) => lease.id === relatedLease.lease.id) ? false : true)
      .map((lease) => {
        return {
          value: lease.id,
          label: getContentLeaseIdentifier(lease),
        };
      });

  const getLeases = debounce(async(inputValue: string, callback: Function) => {
    const leases = await fetchLeases({
      succinct: true,
      identifier: inputValue,
      limit: 10,
      service_unit: serviceUnit ? serviceUnit.id : '',
    });

    callback(getLeaseOptions(leases));
  }, 500);

  const input = {
    name,
    onBlur,
    onChange,
    value,
  };

  return(
    <AsyncSelect
      disabled={disabled}
      displayError={false}
      getOptions={getLeases}
      input={input}
      isDirty={false}
      placeholder={placeholder}
    />
  );
};

export default LeaseSelectInput;
