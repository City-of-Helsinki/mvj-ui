// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import {Row, Column} from 'react-foundation';

type Props = {
  children: Object,
  className?: string,
  defaultOpen: boolean,
  header?: any,
  headerTitle: any,
}

type State = {
  contentHeight: number,
  isOpen: boolean,
  isResizing: boolean,
  isVisible: boolean,
}

class Collapse extends Component {
  props: Props;

  state: State;

  component: any
  content: any

  static defaultProps = {
    defaultOpen: false,
  };

  componentWillMount() {
    const {defaultOpen} = this.props;
    this.setState({
      isOpen: defaultOpen,
      isResizing: false,
      isVisible: defaultOpen,
    });
  }

  componentDidMount() {
    this.component.addEventListener('transitionend', this.transitionEnds);
    this.calculateHeight();
  }

  componentWillUnmount() {
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  componentDidUpdate = (nextProps: Object, nextState: Object) => {
    if(this.state.isOpen !== nextState.isOpen || this.props !== nextProps) {
      this.calculateHeight();
    }
  }

  onResize = () => {
    this.setState({isResizing: true});
    this.calculateHeight();

    setTimeout(
      () => this.setState({isResizing: false}),
      200
    );
  }

  calculateHeight = () => {
    const {clientHeight} = this.content;
    const {isOpen} = this.state;

    this.setState({contentHeight: isOpen ? clientHeight : 0});
  }

  transitionEnds = () => {
    const {isOpen} = this.state;
    this.setState({isVisible: isOpen});
  }

  handleToggle = () => {
    return this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  getChildrenOfHeader = (header: any) => {
    if(!header) {
      return null;
    }
    return header.props.children;
  }

  render() {
    const {contentHeight, isOpen, isResizing, isVisible} = this.state;
    const {children, className, header, headerTitle} = this.props;

    return (
      <div
        ref={(ref) => this.component = ref}
        className={classNames('collapse', className, {'open': isOpen}, {'is-resizing': isResizing})}
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
              {this.getChildrenOfHeader(header)}
            </Row>
          </div>
        </div>
        <div
          className={classNames('collapse__content', {'visible': isVisible})}
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
