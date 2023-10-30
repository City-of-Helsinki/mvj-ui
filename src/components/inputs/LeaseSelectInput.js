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
  const getHistoryItemOptions = (leases: Array<Object>, plotApplications: Array<Object>, areaSearches: Array<Object>): Array<Object> => {
    const filterOutExisting = (item) => leaseHistoryItems.find((leaseHistoryItem) => item.id === leaseHistoryItem.lease.id) ? false : true
    
    console.log(plotApplications)
    console.log(areaSearches)
    
    leases = leases
      .filter(filterOutExisting)
      .map((lease) => {
        const stateOptions = getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE)
        return {
          value: lease.id,
          label: `${getContentLeaseIdentifier(lease) || ''}, ${getLabelOfOption(stateOptions, lease.state) || ''}`,
          type: 'lease'
        };
      });

    plotApplications = plotApplications
      .filter(filterOutExisting)
      .map((plotApplication) => {
        return {
          value: plotApplication.id,
          label: `${plotApplication.application_identifier}, Hakemus`,
          type: 'related_plot_application',
          content_type: 186 // TODO: change to "plotapplication" when backend is ready
        };
      });

    areaSearches = areaSearches
      .filter(filterOutExisting)
      .map((areaSearch) => {
        return {
          value: areaSearch.id,
          label: `${areaSearch.identifier}, Aluehakemus`,
          type: 'related_plot_application',
          content_type: 182 // TODO: change to "areasearch" when backend is ready
        };
      });

      return [...leases, ...plotApplications, ...areaSearches].sort((a, b) => (a.label && b.label) && a.label > b.label ? 1 : -1).slice(0,10)
  }

  const getLeases = debounce(async(inputValue: string, callback: Function) => {
    const leases = await fetchLeases({
      succinct: true,
      identifier: inputValue,
      limit: 10,
    });
        
    const plotApplications = await fetchTargetStatuses({
      application_identifier: inputValue,
      limit: 10,
    });
    
    const areaSearches = await fetchAreaSearches({
      identifier: inputValue,
      limit: 10,
    });

    callback(getHistoryItemOptions(leases, plotApplications, areaSearches));
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
