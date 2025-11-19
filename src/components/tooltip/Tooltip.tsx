import React, { Component } from "react";
import classNames from "classnames";
import CloseButton from "@/components/button/CloseButton";
import type { TooltipPosition } from "@/components/tooltip/types";
type Props = {
  isOpen: boolean;
  className?: string | Record<string, any>;
  onClose: (arg0: Event) => void;
  children: JSX.Element;
  relativeTo?: Element;
};
type State = {
  position: TooltipPosition;
};

class Tooltip extends Component<Props, State> {
  tooltipRef: React.RefObject<HTMLDivElement>;
  state: State = {
    position: "bottom-left",
  };

  constructor(props: Props) {
    super(props);
    this.tooltipRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    window.addEventListener("click", this.onDocumentClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onDocumentClick);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState(() => {
        return {
          position: this.calculatePosition(),
        };
      });
    }
  }

  onDocumentClick: (arg0: Event) => void = (event) => {
    const { isOpen } = this.props;
    const target = event.target;
    const el = this.tooltipRef.current;

    if (isOpen) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (
      isOpen &&
      el &&
      target !== el &&
      (!(target instanceof Node) || !el.contains(target))
    ) {
      this.onClose(event);
    }
  };
  onClose: (arg0: Event) => void = (event) => {
    const { onClose } = this.props;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
      onClose(event);
    }
  };
  calculatePosition: () => TooltipPosition = () => {
    const { relativeTo } = this.props;
    let { innerHeight: height, innerWidth: width } = window;
    const el = this.tooltipRef.current?.parentNode;

    if (el) {
      let { x, y } = (el as Element).getBoundingClientRect();

      if (relativeTo) {
        const {
          x: x2,
          y: y2,
          height: height2,
          width: width2,
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
          return "top-left";
        } else {
          return "top-right";
        }
      } else {
        if (left) {
          return "bottom-left";
        } else {
          return "bottom-right";
        }
      }
    }

    return "bottom-right";
  };

  render(): JSX.Element {
    const { isOpen, className, children } = this.props;
    const { position } = this.state;
    return (
      <>
        {isOpen && (
          <div
            ref={this.tooltipRef}
            className={classNames(
              "tooltip__text-container",
              `tooltip__text-container--position-${position}`,
              className,
            )}
          >
            <div className={classNames("tooltip__text-container-wrapper")}>
              <CloseButton onClick={this.onClose} />
              {children}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Tooltip;
