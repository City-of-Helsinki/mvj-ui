// @flow
import React, {Component} from 'react';

import IconRadioButtons from '../../components/button/IconRadioButtons';
import StyledCheckboxButtons from '../../components/button/StyledCheckboxButtons';

type Props = {
  buttonSelectorOptions?: Array<Object>,
  buttonSelectorValue?: Array<string>,
  iconSelectorOptions: Array<Object>,
  iconSelectorValue: string,
  onButtonSelectorChange: Function,
  onIconSelectorChange: Function,
  title: string,
}

class TableControllers extends Component {
  props: Props

  render () {
    const {
      buttonSelectorOptions,
      buttonSelectorValue,
      iconSelectorOptions,
      iconSelectorValue,
      onButtonSelectorChange,
      onIconSelectorChange,
      title,
    } = this.props;

    return (
      <div className='table-controllers'>
        <div className='table-info'>
          <div className='title-wrapper'>
            <span>{title}</span>
          </div>
          {buttonSelectorOptions && buttonSelectorOptions.length &&
            <div className='button-selector-wrapper'>
              <StyledCheckboxButtons
                checkboxName='checkbox-buttons-document-type'
                onChange={(value) => onButtonSelectorChange(value)}
                options={buttonSelectorOptions}
                selectAllButton
                selectAllButtonLabel='Kaikki'
                value={buttonSelectorValue}
              />
            </div>
          }
          <div className='icon-selector-wrapper'>
            <IconRadioButtons
              onChange={(value) => onIconSelectorChange(value)}
              options={iconSelectorOptions}
              radioName='radio-buttons-selector-type'
              value={iconSelectorValue}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TableControllers;
