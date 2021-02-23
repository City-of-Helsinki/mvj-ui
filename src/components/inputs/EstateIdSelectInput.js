// @flow
import React from 'react';
import debounce from 'lodash/debounce';

import AsyncSelect from '$components/form/AsyncSelect';
import {fetchEstateIdList} from '$src/landUseContract/requestsAsync';

type Props = {
  disabled?: boolean,
  name: string,
  onBlur?: Function,
  placeholder?: string,
  onChange: Function,
  value?: Object,
}

const EstateIdSelectInput = ({
  disabled,
  name,
  onChange,
  onBlur,
  placeholder,
  value,
}: Props) => {
  const getEstateIdOptions = (EstateIdList: Array<Object>): Array<Object> => {
    return  EstateIdList
      .map(lease => {
        return {
          id: lease.id,
          value: lease.identifier,
          label: lease.identifier,
        };
      });
  };

  const getEstateIdList = debounce(async(inputValue: string, callback: Function) => {
    const EstateIdList = await fetchEstateIdList({
      search: inputValue,
      limit: 10,
    });

    callback(getEstateIdOptions(EstateIdList));
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
      getOptions={getEstateIdList}
      input={input}
      isDirty={false}
      placeholder={placeholder}
    />
  );
};

export default EstateIdSelectInput;
