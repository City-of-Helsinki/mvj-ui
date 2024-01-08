// @flow

import React, {Component} from 'react';

type Props = {
  style?: Object,
  innerRef?: any,
  children: React$Node,
};

class TooltipWrapper extends Component<Props> {
  render(): React$Node {
    const {style, innerRef, children} = this.props;

    return (
      <div className='tooltip__component' ref={innerRef} style={style}>
        <div className='tooltip__container'>
          {children}
        </div>
      </div>
    );
  }
}

export default TooltipWrapper;
