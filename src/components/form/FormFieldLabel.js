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
  required?: boolean,
  uiDataKey?: ?string,
}

type State = {
  showAddButton: boolean,
}

class FormFieldLabel extends PureComponent<Props, State> {
  timer: any;

  state = {
    showAddButton: false,
  }

  static defaultProps = {
    enableUiDataEdit: false,
    required: false,
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer = () => {
    this.timer = setInterval(
      () => {
        this.showAddButton();
        this.stopTimer();
      },
      500
    );
  }

  stopTimer = () => {
    clearInterval(this.timer);
  }

  handleMouseEnter = () => {
    this.startTimer();
  }

  handleMouseLeave = (event: any) => {
    const target = event.target,
      el = ReactDOM.findDOMNode(this);

    if (el && (target === el || el.contains(target))) {
      this.stopTimer();
      this.hideAddButton();
    }
  }

  handleTooltipClose = () => {
    this.stopTimer();
    this.hideAddButton();
  }

  hideAddButton = () => {
    this.setState({showAddButton: false});
  }

  showAddButton = () => {
    this.setState({showAddButton: true});
  }

  render() {
    const {
      children,
      className,
      enableUiDataEdit = false,
      htmlFor,
      required,
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
            uiDataKey={uiDataKey}
          />
        }
      </label>
    );
  }
}

export default FormFieldLabel;
