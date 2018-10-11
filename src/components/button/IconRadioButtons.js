// @flow
import React, {Component} from 'react';

type Props = {
  legend?: string,
  onChange: Function,
  options: Array<Object>,
  radioName: string,
  value?: string,
}

class IconRadioButtons extends Component<Props> {
  render () {
    const {legend, options, radioName, value} = this.props;

    return (
      <fieldset className='icon-radio-buttons'>
        {legend && <legend>{legend}</legend>}
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
            <label aria-label={option.label} className='option' key={index}>
              <div className='label' onKeyDown={handleKeyDown} tabIndex={0}>
                <input className='radio' type='radio' name={radioName} checked={isChecked} value={option.value} onChange={handleChange} />
                <span className='option-label'>{option.label}</span>
                {option.icon}
              </div>
            </label>
          );
        })}
      </fieldset>
    );
  }
}

export default IconRadioButtons;
