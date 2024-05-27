import React, { Component, Fragment } from "react";
import classNames from "classnames";
import CloseButton from "src/components/button/CloseButton";
import type { TooltipPosition } from "src/components/tooltip/types";
import ReactDOM from "react-dom";
type Props = {
  isOpen: boolean;
  className?: string | Record<string, any>;
  onClose: (arg0: Event) => void;
  children: React.ReactNode;
  relativeTo?: Element;
};
type State = {
  position: TooltipPosition;
};

class Tooltip extends Component<Props, State> {
  state: State = {
    position: 'bottom-left'
  };

  componentDidMount() {
    window.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onDocumentClick);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState(() => {
        return {
          position: this.calculatePosition()
        };
      });
    }
  }

  onDocumentClick: (arg0: Event) => void = event => {
    const {
      isOpen
    } = this.props;
    const target = event.target;
    const el = ReactDOM.findDOMNode(this);

    if (isOpen) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (isOpen && el && target !== el && (!(target instanceof Node) || !el.contains(target))) {
      this.onClose(event);
    }
  };
  onClose: (arg0: Event) => void = event => {
    const {
      onClose
    } = this.props;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
      onClose(event);
    }
  };
  calculatePosition: () => TooltipPosition = () => {
    const {
      relativeTo
    } = this.props;
    let {
      innerHeight: height,
      innerWidth: width
    } = window;
    const el = ReactDOM.findDOMNode(this)?.parentNode;

    if (el) {
      // @ts-ignore: x and y are defined for DOMRect, but not recognised by Typescript.
      let { x, y } = el.getBoundingClientRect();

      if (relativeTo) {
        const {
          x: x2,
          y: y2,
          height: height2,
          width: width2
        } = relativeTo.getBoundingClientRect();
        x -= x2;
        y -= y2;
        height = height2;
        width = width2;
      }

      const top = y > height - y;
      const left = x > width - x;

      if (top) {
        if (left) {
          return 'top-left';
        } else {
          return 'top-right';
        }
      } else {
        if (left) {
          return 'bottom-left';
        } else {
          return 'bottom-right';
        }
      }
    }

    return 'bottom-right';
  };

  render(): React.ReactNode {
    const {
      isOpen,
      className,
      children
    } = this.props;
    const {
      position
    } = this.state;
    return <Fragment>
      {isOpen && <div className={classNames('tooltip__text-container', `tooltip__text-container--position-${position}`, className)}>
        <div className={classNames('tooltip__text-container-wrapper')}>
          <CloseButton onClick={this.onClose} />
          {children}
        </div>
      </div>}
    </Fragment>;
  }

}

export default Tooltip;