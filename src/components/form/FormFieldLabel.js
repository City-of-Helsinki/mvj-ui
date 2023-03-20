// @flow
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Tooltip from '$components/tooltip/Tooltip';

type Props = {
  children?: any,
  className?: string,
  enableUiDataEdit?: boolean,
  htmlFor: string,
  relativeTo?: any,
  required?: boolean,
  tooltipStyle?: Object,
  uiDataKey?: ?string,
}

type State = {
  showAddButton: boolean,
}

class FormFieldLabel extends PureComponent<Props, State> {
  timer: any;

  state: State = {
    showAddButton: false,
  }

  static defaultProps: $Shape<Props> = {
    enableUiDataEdit: false,
    required: false,
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer: () => void = () => {
    this.timer = setInterval(
      () => {
        this.showAddButton();
        this.stopTimer();
      },
      500
    );
  }

  stopTimer: () => void = () => {
    clearInterval(this.timer);
  }

  handleMouseEnter: () => void = () => {
    this.startTimer();
  }

  handleMouseLeave: (SyntheticFocusEvent<HTMLLabelElement>) => void = (event) => {
    const target = event.currentTarget,
      el = ReactDOM.findDOMNode(this);

    if (el && (target === el || el.contains(target))) {
      this.stopTimer();
      this.hideAddButton();
    }
  }

  handleTooltipClose: () => void = () => {
    this.stopTimer();
    this.hideAddButton();
  }

  hideAddButton: () => void = () => {
    this.setState({showAddButton: false});
  }

  showAddButton: () => void = () => {
    this.setState({showAddButton: true});
  }

  render(): React$Node {
    const {
      children,
      className,
      enableUiDataEdit = false,
      htmlFor,
      relativeTo,
      required,
      tooltipStyle,
      uiDataKey,
    } = this.props;
    const {showAddButton} = this.state;

    return (
      <label
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={classNames('form-field__label', className, {'show-add-button': showAddButton})}
        htmlFor={htmlFor}
      >
        {children}
        {required &&<i className='required'> *</i>}
        {(!!uiDataKey || enableUiDataEdit) &&
          <Tooltip
            enableUiDataEdit={enableUiDataEdit}
            onTooltipClose={this.handleTooltipClose}
            relativeTo={relativeTo}
            style={tooltipStyle}
            uiDataKey={uiDataKey}
          />
        }
      </label>
    );
  }
}

export default FormFieldLabel;
