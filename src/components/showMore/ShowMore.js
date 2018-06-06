import React, {PureComponent} from 'react';
import classNames from 'classnames';

const MAX_CHARS = 130;

type Props = {
  className: String,
  maxChars?: number,
  open: Boolean,
  text: string,
};

type State = {
  open: boolean,
  overflows: boolean,
}

class ShowMore extends PureComponent {
  props: Props;

  state: State = {
    open: this.props.open || false,
    overflows: false,
  }

  componentDidMount() {
    this.checkOverflow();
  }

  componentDidUpdate() {
    this.checkOverflow();
  }

  checkOverflow = (textOverFlow) => {
    const {maxChars, text} = this.props;
    const t = textOverFlow || text;
    if(t.length > (maxChars || MAX_CHARS)) {
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
    return this.state.open ? 'Näytä vähemmän' : 'Näytä lisää';
  };

  onReadMoreClick = () => {
    this.setState({
      open: !this.state.open,
    });
    this.checkOverflow();
  };

  getTextToDisplay = () => {
    const {maxChars, text} = this.props;
    if (this.state.open) {
      return text;
    }
    if(text.length > (maxChars || MAX_CHARS)) {
      return `${this.props.text.substring(0, (maxChars || MAX_CHARS))}...`;
    } else {
      return text;
    }
  }

  render() {
    const {className} = this.props,
      {overflows} = this.state;

    return (
      <div className={classNames('show-more', className)}>
        <p>
          <span className='show-more__text'>{this.getTextToDisplay()}&nbsp;</span>
          {overflows &&
            <a className={classNames('show-more__read-more')}
              onClick={this.onReadMoreClick}>

              {this.getLinkText()}
            </a>
          }
        </p>
      </div>
    );
  }
}

export default ShowMore;
