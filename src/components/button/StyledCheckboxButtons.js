// @flow
import React, {Component} from 'react';
import forEach from 'lodash/forEach';

type Props = {
  checkboxName: string,
  onChange: Function,
  options: Array<Object>,
  selectAllButton?: boolean,
  selectAllButtonLabel?: string,
  value?: Array<string>,
}

class StyledCheckboxButtons extends Component<Props> {
  handleChange = (event: any) => {
    const {onChange, value} = this.props;
    const newValue = value ? [...value] : [];
    const optionValue = event.target.value;

    if (event.target.checked) {
      newValue.push(optionValue);
    } else {
      newValue.splice(newValue.indexOf(optionValue), 1);
    }
    onChange(newValue);
  }

  areAllOptionsSelected = () => {
    const {options, value} = this.props;

    let allSelected = true;
    forEach(options, (option) => {
      if(value ? value.toString().indexOf(option.value.toString()) === -1 : false) {
        allSelected = false;
        return;
      }
    });
    return allSelected;
  }

  unselectAll = () => {
    const {onChange} = this.props;
    onChange([]);
  }

  selectAll = () => {
    const {onChange, options} = this.props;
    const newValues = [];
    forEach(options, (option) => {
      newValues.push(option.value.toString());
    });

    onChange(newValues);
  }

  render () {
    const {checkboxName, options, selectAllButton, selectAllButtonLabel = 'Kaikki', value} = this.props;
    const areAllSelected = this.areAllOptionsSelected();

    return (
      <div className='styled-checkbox-buttons'>
        {selectAllButton &&
          <label className='label select-all'>
            <input
              checked={areAllSelected}
              className='checkbox'
              onChange={() => {
                if(!areAllSelected) {
                  this.selectAll();
                } else {
                  this.unselectAll();
                }
              }}
              type='checkbox'
            />
            <span className='option-label'>{selectAllButtonLabel}</span>
          </label>
        }
        {options.map((option, index) => {
          return (
            <label className='label' key={index}>
              <input
                className='checkbox'
                checked={value ? value.toString().indexOf(option.value.toString()) !== -1 : false}
                name={checkboxName}
                onChange={this.handleChange}
                type='checkbox'
                value={option.value}
              />
              <span className='option-label'>{option.label}</span>
            </label>
          );
        })}
      </div>
    );
  }
}

export default StyledCheckboxButtons;
