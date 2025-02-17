import React, { Component } from "react";
import classNames from "classnames";
import LoadingIndicator from "./LoadingIndicator";
type Props = {
  children?: any;
  contentComponent: any;
  contentProps: Record<string, any>;
  isLoading?: boolean;
  disabled?: boolean;
  onBlur: (...args: Array<any>) => any;
  shouldToggleOnHover?: boolean;
};
type State = {
  expanded: boolean;
  hasFocus: boolean;
};

class Dropdown extends Component<Props, State> {
  wrapper: Record<string, any> | null | undefined;
  state = {
    expanded: false,
    hasFocus: false,
  };
  setWrapperRef = (el: Record<string, any> | null | undefined) => {
    this.wrapper = el;
  };

  componentDidMount() {
    window.addEventListener("touchstart", this.handleDocumentClick);
    window.addEventListener("mousedown", this.handleDocumentClick);
  }

  componentWillUnmount() {
    window.removeEventListener("touchstart", this.handleDocumentClick);
    window.removeEventListener("mousedown", this.handleDocumentClick);
  }

  handleDocumentClick = (event: Event) => {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      const { onBlur } = this.props;
      const { expanded } = this.state;

      if (expanded) {
        onBlur();
      }

      this.setState({
        expanded: false,
      });
    }
  };
  handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    switch (e.which) {
      case 9:
        // Tab
        this.toggleExpanded(false);
        break;

      case 27:
        // Escape
        this.toggleExpanded(false);
        break;

      case 38:
        // Up Arrow
        this.toggleExpanded(false);
        break;

      case 40:
        // Down Arrow
        this.toggleExpanded(true);
        break;

      default:
        return;
    }

    if (e.which !== 9) {
      e.preventDefault();
    }
  };
  handleFocus = (e: { target: any }) => {
    const { hasFocus } = this.state;

    if (e.target === this.wrapper && !hasFocus) {
      this.setState({
        hasFocus: true,
      });
    }
  };
  handleBlur = () => {
    const { hasFocus } = this.state;

    if (hasFocus) {
      this.setState({
        hasFocus: false,
      });
    }
  };
  handleMouseEnter = () => {
    this.handleHover(true);
  };
  handleMouseLeave = () => {
    this.handleHover(false);
  };
  handleHover = (toggleExpanded: boolean) => {
    const { shouldToggleOnHover } = this.props;

    if (shouldToggleOnHover) {
      this.toggleExpanded(toggleExpanded);
    }
  };
  toggleExpanded = (value: any) => {
    const { isLoading } = this.props;
    const { expanded } = this.state;

    if (isLoading) {
      return;
    }

    const newExpanded = value === undefined ? !expanded : !!value;
    this.setState({
      expanded: newExpanded,
    });

    if (!newExpanded && this.wrapper) {
      this.wrapper.focus();
    }
  };

  renderPanel() {
    const { contentComponent: ContentComponent, contentProps } = this.props;
    return (
      <div className="multi-select__dropdown-content">
        <ContentComponent {...contentProps} />
      </div>
    );
  }

  render() {
    const { expanded, hasFocus } = this.state;
    const { children, isLoading, disabled } = this.props;
    return (
      <div
        ref={this.setWrapperRef}
        className="multi-select__dropdown"
        tabIndex={0}
        role="combobox"
        aria-expanded={expanded}
        aria-readonly="false"
        aria-disabled={disabled}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          className={classNames(
            "multi-select__dropdown-heading",
            {
              "is-expanded": expanded,
            },
            {
              "is-focused": hasFocus,
            },
          )}
          onClick={this.toggleExpanded}
        >
          <span
            className={classNames("multi-select__dropdown-heading-value", {
              disabled: disabled,
            })}
          >
            {children}
          </span>
          <span className="multi-select__dropdown-loading-container">
            {isLoading && <LoadingIndicator />}
          </span>
          <span className="multi-select__dropdown-arrow">
            <span
              className={classNames(
                {
                  "multi-select__dropdown-arrow-up": expanded,
                },
                {
                  "multi-select__dropdown-arrow-down": !expanded,
                },
              )}
            />
          </span>
        </div>
        {expanded && this.renderPanel()}
      </div>
    );
  }
}

export default Dropdown;
