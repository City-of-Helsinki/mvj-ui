// @flow
import React, {PureComponent} from 'react';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import ReactResizeDetector from 'react-resize-detector';

import AccordionIcon from '../icons/AccordionIcon';
import ArchiveButton from '../form/ArchiveButton';
import CopyToClipboardButton from '../form/CopyToClipboardButton';
import RemoveButton from '../form/RemoveButton';
import UnarchiveButton from '../form/UnarchiveButton';

type Props = {
  children: Object,
  className?: string,
  defaultOpen: boolean,
  hasErrors: boolean,
  headerSubtitles: any,
  headerTitle: any,
  onArchive?: Function,
  onCopyToClipboard?: Function,
  onRemove: Function,
  onToggle: ?Function,
  onUnarchive?: Function,
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
  _isMounted: boolean

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

  setComponentRef = (el: ?Object) => {
    this.component = el;
  }

  setContentRef = (el: ?Object) => {
    this.content = el;
  }

  componentDidMount() {
    this.component.addEventListener('transitionend', this.transitionEnds);
    this._isMounted = true;
  }

  componentWillUnmount() {
    this.component.removeEventListener('transitionend', this.transitionEnds);
    this._isMounted = false;
  }

  componentDidUpdate = (prevProps: Object, prevState: Object) => {
    if((this.state.isOpen && !this.state.contentHeight) ||
      (this.state.isOpen !== prevState.isOpen)) {
      this.calculateHeight();
    }
  }

  onResize = () => {
    if(!this._isMounted) {
      return;
    }

    this.calculateHeight();
  }

  calculateHeight = () => {
    const {clientHeight} = this.content;
    const {isOpen} = this.state;

    this.setState({contentHeight: isOpen ? (clientHeight || null) : 0});
  }

  transitionEnds = () => {
    if(!this._isMounted) {
      return;
    }

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

  handleKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      this.handleToggle();
    }
  };

  render() {
    const {contentHeight, isOpen, isCollapsing, isExpanding} = this.state;
    const {
      children,
      className,
      hasErrors,
      headerSubtitles,
      headerTitle,
      onArchive,
      onCopyToClipboard,
      onRemove,
      onUnarchive,
      showTitleOnOpen,
    } = this.props;

    return (
      <div
        ref={this.setComponentRef}
        className={classNames(
          'collapse',
          className,
          {'open': isOpen},
          {'is-collapsing': isCollapsing},
          {'is-expanding': isExpanding},
        )}
      >
        <div className="collapse__header">
          <div className='header-info-wrapper'>
            <Row>
              {headerTitle &&
                <Column>
                  <a
                    tabIndex={0}
                    className='header-info-link'
                    onKeyDown={this.handleKeyDown}
                    onClick={this.handleToggle}
                  >
                    <AccordionIcon className="arrow-icon"/>
                    {headerTitle}
                  </a>
                </Column>
              }
              {(showTitleOnOpen || !isOpen) && headerSubtitles}
            </Row>
            <div className='collapse__header_button-wrapper'>
              {!isOpen && hasErrors && <span className='collapse__header_error-badge' />}
              {onCopyToClipboard &&
                <CopyToClipboardButton
                  onClick={onCopyToClipboard}
                />
              }
              {onArchive &&
                <ArchiveButton
                  onClick={onArchive}
                />
              }
              {onUnarchive &&
                <UnarchiveButton
                  onClick={onUnarchive}
                />
              }
              {onRemove &&
                <RemoveButton
                  onClick={onRemove}
                />
              }
            </div>
          </div>
        </div>
        <div
          className={classNames('collapse__content')}
          style={{maxHeight: contentHeight}}>
          <div
            ref={this.setContentRef}
            className="collapse__content-wrapper"
            hidden={!isOpen && !isCollapsing && !isExpanding}
          >
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
