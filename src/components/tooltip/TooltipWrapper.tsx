import React, { Component } from "react";
type Props = {
  style?: Record<string, any>;
  innerRef?: any;
  children: JSX.Element;
};

class TooltipWrapper extends Component<Props> {
  render(): JSX.Element {
    const { style, innerRef, children } = this.props;
    return (
      <div className="tooltip__component" ref={innerRef} style={style}>
        <div className="tooltip__container">{children}</div>
      </div>
    );
  }
}

export default TooltipWrapper;
