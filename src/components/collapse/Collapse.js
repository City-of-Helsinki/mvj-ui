// @flow
import React, {PureComponent} from 'react';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import {Row, Column} from 'react-foundation';

type Props = {
  children: Object,
  className?: string,
  defaultOpen: boolean,
  hasErrors: boolean,
  header?: any,
  headerTitle: any,
  onToggle: ?Function,
  showTitleOnOpen?: boolean,
}

type State = {
  contentHeight: ?number,
  isCollapsing: boolean,
  isExpanding: boolean,
  isOpen: boolean,
}

class Collapse extends PureComponent<Props, State> {
  component: any
  content: any
  _isMounted: boolean;

  static defaultProps = {
    defaultOpen: false,
    hasErrors: false,
    showTitleOnOpen: false,
  };

  state = {
    contentHeight: this.props.defaultOpen ? null : 0,
    isCollapsing: false,
    isExpanding: false,
    isOpen: this.props.defaultOpen,
  };

  componentDidMount() {
    this.component.addEventListener('transitionend', this.transitionEnds);
    this._isMounted = true;
  }

  componentWillUnmount() {
    this.component.removeEventListener('transitionend', this.transitionEnds);
    this._isMounted = false;
  }

  componentDidUpdate = (prevProps: Object, prevState: Object) => {
    if(this.state.isOpen !== prevState.isOpen || this.props !== prevProps) {
      this.calculateHeight();
    }
  }

  onResize = () => {
    this.calculateHeight();
  }

  calculateHeight = () => {
    const {clientHeight} = this.content;
    const {isOpen} = this.state;

    this.setState({contentHeight: isOpen ? clientHeight : 0});
  }

  transitionEnds = () => {
    this.setState({
      isCollapsing: false,
      isExpanding: false,
    });
  }

  handleToggle = () => {
    const {onToggle} = this.props;
    const {isOpen} = this.state;
    if(isOpen) {
      this.setState({
        isCollapsing: true,
        isExpanding: false,
        isOpen: false,
      });
    } else {
      this.setState({
        isCollapsing: false,
        isExpanding: true,
        isOpen: true,
      });
    }
    if(onToggle) {
      onToggle(!isOpen);
    }
  };

  getChildrenOfHeader = (header: any) => {
    if(!header) {
      return null;
    }
    return header.props.children;
  }

  render() {
    const {contentHeight, isOpen, isCollapsing, isExpanding} = this.state;
    const {children, className, hasErrors, header, headerTitle, showTitleOnOpen} = this.props;

    return (
      <div
        ref={(ref) => this.component = ref}
        className={classNames(
          'collapse',
          className,
          {'open': isOpen},
          {'is-collapsing': isCollapsing},
          {'is-expanding': isExpanding},
        )}
      >
        <div className="collapse__header">
          <div className='icon-wrapper' onClick={this.handleToggle}>
            <i className="arrow-icon"/>
          </div>
          <div className='header-info-wrapper'>
            <Row>
              {headerTitle &&
                <Column>
                  <a
                    className='header-info-link'
                    onClick={this.handleToggle}>
                    {headerTitle}
                  </a>
                </Column>
              }
              {(showTitleOnOpen || !isOpen) && this.getChildrenOfHeader(header)}
            </Row>
            {!isOpen && hasErrors && <span className='collapse__header_error-badge' />}
          </div>
        </div>
        <div
          className={classNames('collapse__content')}
          style={{maxHeight: contentHeight}}>
          <div
            ref={(ref) => this.content = ref}
            className="collapse__content-wrapper">
            <ReactResizeDetector
              handleHeight
              onResize={this.onResize}
            />
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default flowRight(

)(Collapse);
