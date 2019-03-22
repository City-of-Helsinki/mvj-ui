// @flow
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import ReactResizeDetector from 'react-resize-detector';

import AccordionIcon from '../icons/AccordionIcon';
import ArchiveButton from '../form/ArchiveButton';
import CollapseHeaderTitle from './CollapseHeaderTitle';
import AttachButton from '../form/AttachButton';
import CopyToClipboardButton from '../form/CopyToClipboardButton';
import RemoveButton from '../form/RemoveButton';
import UnarchiveButton from '../form/UnarchiveButton';

type Props = {
  archived?: boolean,
  children: Object,
  className?: string,
  defaultOpen: boolean,
  enableUiDataEdit?: boolean,
  hasErrors: boolean,
  headerSubtitles?: any,
  headerTitle: any,
  onArchive?: Function,
  onAttach?: Function,
  onCopyToClipboard?: Function,
  onRemove?: Function,
  onToggle?: Function,
  onUnarchive?: Function,
  showTitleOnOpen?: boolean,
  tooltipStyle?: Object,
  uiDataKey?: ?string,
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
  tooltip: any
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

  handleToggle = (e: any) => {
    const {onToggle} = this.props;
    const {isOpen} = this.state;
    const target = e.target;
    const tooltipEl = ReactDOM.findDOMNode(this.tooltip);

    if (!tooltipEl ||
      (tooltipEl && target !== tooltipEl && !tooltipEl.contains(target))) {
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
      archived,
      children,
      className,
      enableUiDataEdit,
      hasErrors,
      headerSubtitles,
      headerTitle,
      onArchive,
      onAttach,
      onCopyToClipboard,
      onRemove,
      onUnarchive,
      showTitleOnOpen,
      tooltipStyle,
      uiDataKey,
    } = this.props;

    return (
      <div
        ref={this.setComponentRef}
        className={classNames(
          'collapse',
          className,
          {'open': isOpen},
          {'is-archived': archived},
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
                    <CollapseHeaderTitle
                      enableUiDataEdit={enableUiDataEdit}
                      uiDataKey={uiDataKey}
                      tooltipRef={(ref) => this.tooltip = ref}
                      tooltipStyle={tooltipStyle}
                    >
                      {headerTitle}
                    </CollapseHeaderTitle>
                  </a>
                </Column>
              }
              {(showTitleOnOpen || !isOpen) && headerSubtitles}
            </Row>
            <div className='collapse__header_button-wrapper'>
              {!isOpen && hasErrors && <span className='collapse__header_error-badge' />}

              {onAttach && <AttachButton onClick={onAttach} />}
              {onCopyToClipboard && <CopyToClipboardButton onClick={onCopyToClipboard} />}
              {onArchive && <ArchiveButton onClick={onArchive}/>}
              {onUnarchive && <UnarchiveButton onClick={onUnarchive}/>}
              {onRemove && <RemoveButton onClick={onRemove}/>}
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
