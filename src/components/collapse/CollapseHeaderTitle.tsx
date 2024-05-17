import { $Shape } from "utility-types";
import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import UIDataTooltip from "src/components/tooltip/UIDataTooltip";
type Props = {
  children?: any;
  enableUiDataEdit?: boolean;
  style?: Record<string, any>;
  tooltipRef?: (...args: Array<any>) => any;
  tooltipStyle?: Record<string, any>;
  uiDataKey?: string | null | undefined;
};
type State = {
  showAddButton: boolean;
};

class CollapseHeaderTitle extends PureComponent<Props, State> {
  timer: any;
  state: State = {
    showAddButton: false
  };
  static defaultProps: $Shape<Props> = {
    enableUiDataEdit: false
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
  handleMouseLeave: (arg0: React.MouseEvent<HTMLHeadingElement>) => void = event => {
    const target = event.currentTarget;
    const el = ReactDOM.findDOMNode(this);

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

  render(): React.ReactNode {
    const {
      children,
      enableUiDataEdit,
      style,
      tooltipRef,
      tooltipStyle,
      uiDataKey
    } = this.props;
    const {
      showAddButton
    } = this.state;
    return <span onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} className={classNames('collapse__header_title', {
      'show-add-button': showAddButton
    })} style={style}>
      <span>{children}</span>
      {(!!uiDataKey || enableUiDataEdit) && <UIDataTooltip innerRef={tooltipRef} enableUiDataEdit={enableUiDataEdit} onTooltipClose={this.handleTooltipClose} style={tooltipStyle} uiDataKey={uiDataKey} />}
    </span>;
  }

}

export default CollapseHeaderTitle;