import React, { Component } from "react";
import flowRight from "lodash/flowRight";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import Select from "react-select";
import FormFieldLabel from "components/form/FormFieldLabel";
import DropdownIndicator from "components/inputs/DropdownIndicator";
import LoadingIndicator from "components/inputs/SelectLoadingIndicator";
import { FormNames } from "enums";
import { setUserActiveServiceUnit } from "usersPermissions/actions";
import type { UserServiceUnit, UserServiceUnits } from "usersPermissions/types";
type Props = {
  userServiceUnits: UserServiceUnits;
  userActiveServiceUnit: UserServiceUnit;
  setUserActiveServiceUnit: (...args: Array<any>) => any;
};

class UserServiceUnitSelectInput extends Component<Props, any> {
  handleChange = (val: any) => {
    const {
      setUserActiveServiceUnit,
      userServiceUnits
    } = this.props;
    const selected = userServiceUnits.find(u => u.id === val?.value);

    if (selected) {
      setUserActiveServiceUnit(selected);
    }
  };
  getOptions = (): Array<Record<string, any>> => this.props.userServiceUnits.map(userServiceUnit => {
    return {
      id: userServiceUnit.id,
      value: userServiceUnit.id,
      label: userServiceUnit.name
    };
  });

  render() {
    const {
      userActiveServiceUnit,
      userServiceUnits
    } = this.props;

    if (!userServiceUnits.length || !userActiveServiceUnit) {
      return null;
    }

    return <form>
        <div className={'form-field'}>
          <FormFieldLabel htmlFor={'userServiceUnitSelect'}>
            Oma palvelukokonaisuus
          </FormFieldLabel>
          <div className={'form-field__component'}>
            <div className={'form-field__select'}>
              <Select className='select-input' classNamePrefix='select-input' components={{
              DropdownIndicator,
              IndicatorSeparator: null,
              LoadingIndicator
            }} isDisabled={userActiveServiceUnit.length <= 1} id={'userServiceUnitSelect'} onBlur={this.handleChange} onChange={this.handleChange} noOptionsMessage={() => 'Ei tuloksia'} options={this.getOptions()} placeholder={'Valitse...'} value={this.getOptions() && this.getOptions().find(option => option.value == userActiveServiceUnit.id) || ''} />
            </div>
          </div>
        </div>
      </form>;
  }

}

const formName = FormNames.USER_SERVICE_UNIT_SELECT;
export default flowRight(connect(state => ({}), {
  setUserActiveServiceUnit
}), reduxForm({
  form: formName
}))(UserServiceUnitSelectInput) as React.ComponentType<any>;