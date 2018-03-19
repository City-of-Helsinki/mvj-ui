import React, {Component} from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import lineHeight from 'line-height';

type Props = {
  className: String,
  children: Object,
  open: Boolean,
  onReadMoreClick: Function,
  lines: Number,
  preserveSpace: Boolean,
};

type State = {
  open: boolean,
  overflows: boolean,
  bodyStyle: ?any,
  lineHeight: ?any,
}

class ShowMore extends Component {
  props: Props;

  state: State = {
    open: this.props.open || false,
    overflows: false,
    bodyStyle: null,
    lineHeight: null,
  }

  static defaultProps = {
    lines: 2,
    preserveSpace: false,
    onReadMoreClick: () => {},
  };

  componentDidMount() {
    this.checkOverflow();
    this.calculateBodyStyle();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.checkOverflow();
    this.calculateBodyStyle();
  };

  checkOverflow = () => {
    if (this.state.open) {
      return true;
    }

    const innerEl = ReactDOM.findDOMNode(this.bodyInner);

    if (!innerEl) {
      return;
    }

    const lh = lineHeight(innerEl);
    this.setState({
      overflows: innerEl.offsetHeight > (lh * this.props.lines),
    });
  };

  getLinkText = () => {
    return this.state.open ? 'Näytä vähemmän' : 'Näytä lisää';
  };

  onReadMoreClick = () => {
    this.props.onReadMoreClick(!this.state.open);
    this.setState({
      open: !this.state.open,
    });
  };

  calculateBodyStyle = () => {
    if (this.state.open) {
      return null;
    }

    const outerEl = ReactDOM.findDOMNode(this.body),
      innerEl = ReactDOM.findDOMNode(this.bodyInner);

    if (!outerEl || !innerEl) {
      return null;
    }

    const lh = lineHeight(innerEl),
      height = this.props.lines * lh,
      style = {
        maxHeight: height,
      };

    if (this.props.preserveSpace) {
      style.minHeight = height;
    }

    this.setState({
      lineHeight: lh,
      bodyStyle: style,
    });
  };

  render() {
    const {className, children} = this.props,
      {open, overflows, bodyStyle, lineHeight} = this.state;

    return (
      <div className={classNames(
        'show-more', className, {
          'show-more--open': open,
          'show-more--overflows': overflows,
        })}>
        <div className="show-more__body"
          ref={(c) => {this.body = c;}}
          style={!open ? bodyStyle : null}>
          <div className="show-more__body-inner"
            ref={(c) => {this.bodyInner = c;}}>
            {children}
          </div>
          <span className="show-more__line-end"
            style={lineHeight ? {height: lineHeight} : null}/>
        </div>
        {overflows &&
          <a className={classNames('show-more__read-more')}
            onClick={this.onReadMoreClick}>
            {this.getLinkText()}
          </a>
        }
      </div>
    );
  }
}

export default ShowMore;
