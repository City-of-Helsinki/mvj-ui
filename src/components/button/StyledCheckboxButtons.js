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

  handleSelectAllClick = () => {
    const areAllSelected = this.areAllOptionsSelected();

    if(!areAllSelected) {
      this.selectAll();
    } else {
      this.unselectAll();
    }
  }

  handleSelectAllKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      this.handleSelectAllClick();
    }
  };

  unselectAll = () => {
    const {onChange} = this.props;
    onChange([]);
  }

  selectAll = () => {
    const {onChange, options} = this.props,
      newValues = [];

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
          <label
            aria-label='Valitse kaikki'
            className='label select-all'
            onKeyDown={this.handleSelectAllKeyDown}
            tabIndex={0}
          >
            <input
              checked={areAllSelected}
              className='checkbox'
              onKeyDown={this.handleSelectAllKeyDown}
              type='checkbox'
            />
            <span className='option-label'>{selectAllButtonLabel}</span>
          </label>
        }
        {options.map((option, index) => {
          const handleChange = () => {
            const {onChange, value} = this.props,
              newValue = value ? [...value] : [],
              optionValue = option.value;

            if (newValue.indexOf(optionValue) === -1) {
              newValue.push(optionValue);
            } else {
              newValue.splice(newValue.indexOf(optionValue), 1);
            }
            onChange(newValue);
          };

          const handleKeyDown = (e: any) => {
            if(e.keyCode === 13) {
              e.preventDefault();
              handleChange();
            }
          };

          const isChecked = value ? value.toString().indexOf(option.value.toString()) !== -1 : false;

          return (
            <label
              key={index}
              aria-label={option.label}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className='label'
            >
              <input
                className='checkbox'
                checked={isChecked}
                name={checkboxName}
                onChange={handleChange}
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
