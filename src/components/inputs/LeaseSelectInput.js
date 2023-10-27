// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {fetchLeases} from '$src/leases/requestsAsync';
import {
  fetchAreaSearches,
  fetchTargetStatuses,
} from "$src/leases/requestsAsync";
import { getLabelOfOption, getFieldOptions } from "$src/util/helpers";
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';
import {store} from '$src/root/startApp';
import { LeaseFieldPaths } from "$src/leases/enums";

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
  const leaseAttributes = getLeaseAttributes(store.getState());
  const getHistoryItemOptions = (leases: Array<Object>, plotSearches: Array<Object>, areaSearches: Array<Object>): Array<Object> => {
    const filterOutExisting = (item) => leaseHistoryItems.find((leaseHistoryItem) => item.id === leaseHistoryItem.lease.id) ? false : true
    leases = leases
      .filter(filterOutExisting)
      .map((lease) => {
        const stateOptions = getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE)
        return {
          value: lease.id,
          label: `${getContentLeaseIdentifier(lease) || ''}, ${getLabelOfOption(stateOptions, lease.state) || ''}`,
        };
      });

    plotSearches = plotSearches
      .filter(filterOutExisting)
      .map((plotSearch) => {
        return {
          value: plotSearch.id,
          label: `${plotSearch.application_identifier}, Haku`,
        };
      });

    areaSearches = areaSearches
      .filter(filterOutExisting)
      .map((areaSearch) => {
        return {
          value: areaSearch.id,
          label: `${areaSearch.identifier}, Hakemus`,
        };
      });

      return [...leases, ...plotSearches, ...areaSearches].sort((a, b) => (a.label && b.label) && a.label > b.label ? 1 : -1).slice(0,10)
  }

  const getLeases = debounce(async(inputValue: string, callback: Function) => {
    const leases = await fetchLeases({
      succinct: true,
      identifier: inputValue,
      limit: 10,
    });
    
    const plotSearches = await fetchTargetStatuses({
      identifier: inputValue,
      limit: 10,
    });
    
    const areaSearches = await fetchAreaSearches({
      identifier: inputValue,
      limit: 10,
    });

    callback(getHistoryItemOptions(leases, plotSearches, areaSearches));
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
