import { $Shape } from "utility-types";
import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import UIDataTooltip from "@/components/tooltip/UIDataTooltip";
type Props = {
  children?: any;
  enableUiDataEdit?: boolean;
  relativeTo?: any;
  required?: boolean;
  style?: Record<string, any>;
  title?: string;
  tooltipStyle?: Record<string, any>;
  uiDataKey?: string | null | undefined;
  id?: string;
};
type State = {
  showAddButton: boolean;
};

class FormTextTitle extends PureComponent<Props, State> {
  timer: any;
  state: State = {
    showAddButton: false
  };
  static defaultProps: $Shape<Props> = {
    enableUiDataEdit: false,
    required: false
  };

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer: () => void = () => {
    this.timer = setInterval(() => {
      this.showAddButton();
      this.stopTimer();
    }, 500);
  };
  stopTimer: () => void = () => {
    clearInterval(this.timer);
  };
  handleMouseEnter: () => void = () => {
    this.startTimer();
  };
  handleMouseLeave: (arg0: any) => void = event => {
    const target = event.currentTarget,
          el = ReactDOM.findDOMNode(this);

    if (el && (target === el || el.contains(target))) {
      this.stopTimer();
      this.hideAddButton();
    }
  };
  handleTooltipClose: () => void = () => {
    this.stopTimer();
    this.hideAddButton();
  };
  hideAddButton: () => void = () => {
    this.setState({
      showAddButton: false
    });
  };
  showAddButton: () => void = () => {
    this.setState({
      showAddButton: true
    });
  };

  render(): JSX.Element {
    const {
      children,
      enableUiDataEdit,
      relativeTo,
      required,
      style,
      title,
      tooltipStyle,
      uiDataKey
    } = this.props;
    const {
      showAddButton
    } = this.state;
    return <span onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} className={classNames('form__text-title', {
      'show-add-button': showAddButton
    })} style={style}>
      {children || title}
      {required && <i className='required'> *</i>}
      {(!!uiDataKey || enableUiDataEdit) && <UIDataTooltip enableUiDataEdit={enableUiDataEdit} onTooltipClose={this.handleTooltipClose} relativeTo={relativeTo} style={tooltipStyle} uiDataKey={uiDataKey} />}
    </span>;
  }

}

export default FormTextTitle;