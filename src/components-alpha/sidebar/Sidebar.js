// @flow
import React, {Component, createElement} from 'react';
import classnames from 'classnames';

type Props = {
  className: string,
  component: Object,
  handleClose: Function,
  isOpen: boolean,
  position: string,
};

class Sidebar extends Component<Props> {
  render() {
    const {isOpen, handleClose, className, component, position, ...rest} = this.props;

    return (
      <div className={classnames(
        'mvj__sidebar',
        'off-canvas is-transition-overlap',
        `position-${position}`,
        className,
        {'is-open': isOpen}
      )}
      aria-hidden={!isOpen}>
        <span className="mvj__sidebar__close" onClick={handleClose}>
          <i className="mi mi-close"/>
        </span>

        <div className="mvj__sidebar__content">
          {createElement(component, {...rest})}
        </div>
      </div>
    );
  }
}

export default Sidebar;
