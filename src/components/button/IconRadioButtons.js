// @flow
import React, {Component} from 'react';

type Props = {
  value?: string,
  radioName: string,
  options: Array<Object>,
  onChange: Function,
}

class StyledRadioButtons extends Component<Props> {
  render () {
    const {radioName, options, value} = this.props;

    return (
      <div className='icon-radio-buttons'>
        {options.map((option, index) => {
          const handleChange = () => {
            const {onChange} = this.props;
            onChange(option.value);
          };

          const handleKeyDown = (e: any) => {
            if(e.keyCode === 13) {
              e.preventDefault();
              handleChange();
            }
          };

          const isChecked = (value === option.value);

          return (
            <label className='option' key={index}>
              <label aria-checked={isChecked} aria-label={option.label} className='label' onKeyDown={handleKeyDown} tabIndex={0}>
                <input className='radio' type='radio' name={radioName} checked={isChecked} value={option.value} onChange={handleChange} />
                <span className='option-label'>{option.label}</span>
                {option.icon}
              </label>
            </label>
          );
        })}
      </div>
    );
  }
}

export default StyledRadioButtons;
