import React from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "@/components/form/AsyncSelect";
import { addEmptyOption, sortStringByKeyAsc } from "@/util/helpers";
import { fetchAreaSearchDistricts } from "@/areaSearch/requestsAsync";
type Props = {
  disabled?: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  onChange: (...args: Array<any>) => any;
  placeholder?: string;
};

const getContentAreaSearchDistrict = (
  district: string | null | undefined,
): { value: string; label: string } | null => {
  if (!district) return null;
  return {
    value: district,
    label: district,
  };
};

const FieldTypeAreaSearchDistrictSelect = ({
  disabled,
  displayError,
  input,
  isDirty,
  onChange,
  placeholder,
}: Props): JSX.Element => {
  const getAreaSearchDistricts = debounce(
    async (inputValue: string, callback: (...args: Array<any>) => any) => {
      const districts = await fetchAreaSearchDistricts({
        district: inputValue,
      });
      callback(
        addEmptyOption(
          districts
            .map(({ district }) => getContentAreaSearchDistrict(district))
            .sort((a, b) => sortStringByKeyAsc(a, b, "label")),
        ),
      );
    },
    500,
  );

  return (
    <AsyncSelect
      disabled={disabled}
      displayError={displayError}
      getOptions={getAreaSearchDistricts}
      input={input}
      isDirty={isDirty}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default FieldTypeAreaSearchDistrictSelect;
