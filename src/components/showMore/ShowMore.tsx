import React, { PureComponent } from "react";
import classNames from "classnames";
const MAX_CHARS = 130;
type Props = {
  className?: string;
  maxChars?: number;
  open?: boolean;
  text: string;
};
type State = {
  open: boolean;
  overflows: boolean;
};

class ShowMore extends PureComponent<Props, State> {
  state: State = {
    open: this.props.open || false,
    overflows: false,
  };

  componentDidMount() {
    this.checkOverflow();
  }

  componentDidUpdate() {
    this.checkOverflow();
  }

  checkOverflow = (textOverFlow?: string | null | undefined) => {
    const { maxChars, text } = this.props;
    const t = textOverFlow || text;

    if (t && t.length > (maxChars || MAX_CHARS)) {
      this.setState({
        overflows: true,
      });
    } else {
      this.setState({
        overflows: false,
      });
    }
  };
  getLinkText = () => {
    return this.state.open ? "Näytä vähemmän" : "Näytä lisää";
  };
  handleReadMoreClick = () => {
    this.setState({
      open: !this.state.open,
    });
    this.checkOverflow();
  };
  handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleReadMoreClick();
    }
  };
  replaceLineBreakWithBr = (text: string): any => {
    const items = text.split("\n");
    return items.map((item, index) => (
      <span key={index}>
        {item}
        {index < items.length - 1 && <br />}
      </span>
    ));
  };
  getTextToDisplay = () => {
    const { maxChars, text } = this.props;

    if (this.state.open) {
      return this.replaceLineBreakWithBr(text);
    }

    if (text && text.length > (maxChars || MAX_CHARS)) {
      return this.replaceLineBreakWithBr(
        `${this.props.text.substring(0, maxChars || MAX_CHARS)}...`,
      );
    } else {
      return this.replaceLineBreakWithBr(text);
    }
  };

  render() {
    const { className } = this.props,
      { overflows } = this.state;
    return (
      <div className={classNames("show-more", className)}>
        <p>
          <span className="show-more__text">
            {this.getTextToDisplay()}&nbsp;
          </span>
          {overflows && (
            <a
              className={classNames("show-more__read-more")}
              onClick={this.handleReadMoreClick}
              onKeyDown={this.handleKeyDown}
              tabIndex={0}
            >
              {this.getLinkText()}
            </a>
          )}
        </p>
      </div>
    );
  }
}

export default ShowMore;
