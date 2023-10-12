// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {fetchLeases} from '$src/leases/requestsAsync';

type Props = {
  disabled?: boolean,
  name: string,
  onBlur?: Function,
  onChange: Function,
  placeholder?: string,
  leaseHistoryItems: Array<Object>,
  value?: Object,
}

const LeaseSelectInput = ({
  disabled,
  name,
  onBlur,
  onChange,
  placeholder,
  leaseHistoryItems,
  value,
}: Props) => {
  const getLeaseOptions = (leases: Array<Object>): Array<Object> =>
    leases
      .filter((lease) => leaseHistoryItems.find((leaseHistoryItem) => lease.id === leaseHistoryItem.lease.id) ? false : true)
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
