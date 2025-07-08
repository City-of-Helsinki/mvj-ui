import React from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import FormFieldLabel from "@/components/form/FormFieldLabel";
import DropdownIndicator from "@/components/inputs/DropdownIndicator";
import LoadingIndicator from "@/components/inputs/SelectLoadingIndicator";
import { setUserActiveServiceUnit } from "@/usersPermissions/actions";
import type {
  UserServiceUnit,
  UserServiceUnits,
} from "@/usersPermissions/types";

type Props = {
  userServiceUnits: UserServiceUnits;
  userActiveServiceUnit: UserServiceUnit;
};

const UserServiceUnitSelectInput: React.FC<Props> = ({
  userServiceUnits,
  userActiveServiceUnit,
}) => {
  const dispatch = useDispatch();

  const handleChange = (val: any) => {
    const selected = userServiceUnits.find((u) => u.id === val?.value);

    if (selected) {
      dispatch(setUserActiveServiceUnit(selected));
    }
  };

  if (!userServiceUnits.length || !userActiveServiceUnit) {
    return null;
  }

  const options = userServiceUnits.map((userServiceUnit) => {
    return {
      id: userServiceUnit.id,
      value: userServiceUnit.id,
      label: userServiceUnit.name,
    };
  });

  const currentValue =
    options.find((option) => option.value === userActiveServiceUnit.id) || null;

  return (
    <form>
      <div className={"form-field"}>
        <FormFieldLabel htmlFor={"userServiceUnitSelect"}>
          Oma palvelukokonaisuus
        </FormFieldLabel>
        <div className={"form-field__component"}>
          <div className={"form-field__select"}>
            <Select
              className="select-input"
              classNamePrefix="select-input"
              components={{
                DropdownIndicator,
                IndicatorSeparator: null,
                LoadingIndicator,
              }}
              isDisabled={userServiceUnits.length <= 1}
              id={"userServiceUnitSelect"}
              onBlur={handleChange}
              onChange={handleChange}
              noOptionsMessage={() => "Ei tuloksia"}
              options={options}
              placeholder={"Valitse..."}
              value={currentValue}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserServiceUnitSelectInput;
