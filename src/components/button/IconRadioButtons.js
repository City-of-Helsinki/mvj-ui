// @flow
import React, {Component} from 'react';

type Props = {
  value?: string,
  radioName: string,
  options: Array<Object>,
  onChange: Function,
}

class StyledRadioButtons extends Component<Props> {
  handleChange = (event: any) => {
    const {onChange} = this.props;
    onChange(event.target.value);
  }

  render () {
    const {radioName, options, value} = this.props;

    return (
      <div className='icon-radio-buttons'>
        {options.map((option, index) => {
          return (
            <div className='option' key={index}>
              <label className='label'>
                <input className='radio' type='radio' name={radioName} checked={value === option.value} value={option.value} onChange={this.handleChange} />
                <span className='option-label'>{option.label}</span>
                {option.icon}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default StyledRadioButtons;
