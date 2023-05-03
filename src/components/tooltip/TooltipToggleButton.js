// @flow

import React, {Component} from 'react';

type Props = {
  className?: string,
  onClick: (SyntheticMouseEvent<HTMLButtonElement>) => void,
  style?: Object,
  children: React$Node,
};

class TooltipToggleButton extends Component<Props> {
  openTooltip: (SyntheticMouseEvent<HTMLButtonElement>) => void = (event) => {
    const {onClick} = this.props;

    if (event) {
      event.stopPropagation();
      event.preventDefault();
      onClick(event);
    }
  };

  render(): React$Node {
    const {className, style, children} = this.props;

    return (
      <button className={className} style={style} onClick={this.openTooltip} type='button'>
        {children}
      </button>
    );
  }
}

export default TooltipToggleButton;
