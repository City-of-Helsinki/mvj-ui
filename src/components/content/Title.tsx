import { $Shape } from "utility-types";
import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import UIDataTooltip from "@/components/tooltip/UIDataTooltip";
type Props = {
  children?: any;
  enableUiDataEdit?: boolean;
  relativeTo?: any;
  style?: Record<string, any>;
  uiDataKey?: string | null | undefined;
};
type State = {
  showAddButton: boolean;
};

class Title extends PureComponent<Props, State> {
  timer: any;
  state: State = {
    showAddButton: false,
  };
  static defaultProps: $Shape<Props> = {
    enableUiDataEdit: false,
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
  handleMouseLeave: (arg0: React.MouseEvent<HTMLHeadingElement>) => void = (
    event,
  ) => {
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
      showAddButton: false,
    });
  };
  showAddButton: () => void = () => {
    this.setState({
      showAddButton: true,
    });
  };

  render(): JSX.Element {
    const { children, enableUiDataEdit, relativeTo, style, uiDataKey } =
      this.props;
    const { showAddButton } = this.state;
    return (
      <h2
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={classNames("content__title", {
          "show-add-button": showAddButton,
        })}
        style={style}
      >
        <span>{children}</span>
        {(!!uiDataKey || enableUiDataEdit) && (
          <UIDataTooltip
            enableUiDataEdit={enableUiDataEdit}
            onTooltipClose={this.handleTooltipClose}
            relativeTo={relativeTo}
            uiDataKey={uiDataKey}
          />
        )}
      </h2>
    );
  }
}

export default Title;
