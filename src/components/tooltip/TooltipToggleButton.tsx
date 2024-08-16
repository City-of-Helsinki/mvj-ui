import React, { Component } from "react";
type Props = {
  className?: string;
  onClick: (arg0: React.MouseEvent<HTMLButtonElement>) => void;
  style?: Record<string, any>;
  children: JSX.Element;
};

class TooltipToggleButton extends Component<Props> {
  openTooltip: (arg0: React.MouseEvent<HTMLButtonElement>) => void = event => {
    const {
      onClick
    } = this.props;

    if (event) {
      event.stopPropagation();
      event.preventDefault();
      onClick(event);
    }
  };

  render(): JSX.Element {
    const {
      className,
      style,
      children
    } = this.props;
    return <button className={className} style={style} onClick={this.openTooltip} type='button'>
        {children}
      </button>;
  }

}

export default TooltipToggleButton;