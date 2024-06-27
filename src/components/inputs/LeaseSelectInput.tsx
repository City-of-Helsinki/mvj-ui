import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "/src/components/form/AsyncSelect";
import { getContentLeaseIdentifier } from "/src/leases/helpers";
import { fetchLeases } from "/src/leases/requestsAsync";
import { fetchAreaSearches, fetchTargetStatuses, fetchPlotSearches } from "/src/leases/requestsAsync";
import { getLabelOfOption, getFieldOptions } from "/src/util/helpers";
import { getAttributes as getLeaseAttributes } from "/src/leases/selectors";
import { store } from "/src/root/startApp";
import { LeaseFieldPaths, LeaseHistoryItemTypes, LeaseHistoryContentTypes } from "/src/leases/enums";
import type { UserServiceUnit } from "/src/usersPermissions/types";
type Props = {
  disabled?: boolean;
  name: string;
  onBlur?: (...args: Array<any>) => any;
  onChange: (...args: Array<any>) => any;
  placeholder?: string;
  leaseHistoryItems: Array<Record<string, any>>;
  serviceUnit: UserServiceUnit;
  value?: Record<string, any>;
};

const LeaseSelectInput = ({
  disabled,
  name,
  onBlur,
  onChange,
  placeholder,
  leaseHistoryItems,
  serviceUnit,
  value
}: Props) => {
  const leaseAttributes = getLeaseAttributes(store.getState());

  const getHistoryItemOptions = (leases: Array<Record<string, any>>, plotSearches: Array<Record<string, any>>, plotApplications: Array<Record<string, any>>, areaSearches: Array<Record<string, any>>): Array<Record<string, any>> => {
    const filterOutExisting = item => leaseHistoryItems.find(leaseHistoryItem => item.id === leaseHistoryItem.lease.id) ? false : true;

    leases = leases.filter(filterOutExisting).map(lease => {
      const stateOptions = getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE);
      return {
        value: lease.id,
        label: `${getContentLeaseIdentifier(lease) || ''}, ${getLabelOfOption(stateOptions, lease.state) || ''}`,
        type: 'lease'
      };
    });
    plotSearches = plotSearches.filter(filterOutExisting).map(plotSearch => {
      const maxLength = 24;
      const displayName = plotSearch.name.length > maxLength ? plotSearch.name.substr(0, maxLength) + "..." : plotSearch.name;
      return {
        value: plotSearch.id,
        label: `${displayName}, ${LeaseHistoryItemTypes.PLOTSEARCH}`,
        type: 'related_plot_application',
        content_type_model: LeaseHistoryContentTypes.PLOTSEARCH
      };
    });
    plotApplications = plotApplications.filter(filterOutExisting).map(plotApplication => {
      return {
        value: plotApplication.id,
        label: `${plotApplication.application_identifier}, ${LeaseHistoryItemTypes.PLOT_APPLICATION}`,
        type: 'related_plot_application',
        content_type_model: LeaseHistoryContentTypes.TARGET_STATUS
      };
    });
    areaSearches = areaSearches.filter(filterOutExisting).map(areaSearch => {
      return {
        value: areaSearch.id,
        label: `${areaSearch.identifier}, ${LeaseHistoryItemTypes.AREA_SEARCH}`,
        type: 'related_plot_application',
        content_type_model: LeaseHistoryContentTypes.AREA_SEARCH
      };
    });
    return [...leases, ...plotSearches, ...plotApplications, ...areaSearches].sort((a, b) => a.label && b.label && a.label > b.label ? 1 : -1);
  };

  const getHistoryItems = debounce(async (inputValue: string, callback: (...args: Array<any>) => any) => {
    const [leases, plotSearches, plotApplications, areaSearches] = await Promise.all([fetchLeases({
      succinct: true,
      identifier: inputValue,
      limit: 10
    }), fetchPlotSearches({
      name: inputValue,
      limit: 10
    }), fetchTargetStatuses({
      identifier: inputValue,
      limit: 10
    }), fetchAreaSearches({
      identifier: inputValue,
      limit: 10
    })]);
    callback(getHistoryItemOptions(leases, plotSearches, plotApplications, areaSearches));
  }, 500);
  const input = {
    name,
    onBlur,
    onChange,
    value
  };
  return <AsyncSelect disabled={disabled} displayError={false} getOptions={getHistoryItems} input={input} isDirty={false} placeholder={placeholder} />;
};

export default LeaseSelectInput;