import { $Shape } from "utility-types";
import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { Row, Column } from "react-foundation";
import ReactResizeDetector from "react-resize-detector";
import AccordionIcon from "@/components/icons/AccordionIcon";
import ArchiveButton from "@/components/form/ArchiveButton";
import CollapseHeaderTitle from "./CollapseHeaderTitle";
import AttachButton from "@/components/form/AttachButton";
import CopyToClipboardButton from "@/components/form/CopyToClipboardButton";
import RemoveButton from "@/components/form/RemoveButton";
import UnarchiveButton from "@/components/form/UnarchiveButton";
type Props = {
  archived?: boolean;
  children: any;
  className?: string;
  defaultOpen: boolean;
  enableUiDataEdit?: boolean;
  hasErrors: boolean;
  headerSubtitles?: any;
  headerTitle: any;
  headerExtras?: any;
  onArchive?: (...args: Array<any>) => any;
  onAttach?: (...args: Array<any>) => any;
  onCopyToClipboard?: (...args: Array<any>) => any;
  onRemove?: (...args: Array<any>) => any;
  onToggle?: (...args: Array<any>) => any;
  onUnarchive?: (...args: Array<any>) => any;
  showTitleOnOpen?: boolean;
  tooltipStyle?: Record<string, any>;
  uiDataKey?: string | null | undefined;
  isOpen?: boolean;
};
type State = {
  contentHeight: number | null | undefined;
  isCollapsing: boolean;
  isExpanding: boolean;
  isOpen: boolean;
};

class Collapse extends PureComponent<Props, State> {
  component: any;
  content: any;
  tooltip: any;
  static defaultProps: $Shape<Props> = {
    defaultOpen: false,
    hasErrors: false,
    showTitleOnOpen: false
  };
  state: State = {
    contentHeight: (this.props.isOpen !== undefined ? this.props.isOpen : this.props.defaultOpen) ? null : 0,
    isCollapsing: false,
    isExpanding: false,
    isOpen: this.props.isOpen !== undefined ? this.props.isOpen : this.props.defaultOpen
  };
  setComponentRef: (arg0: any) => void = el => {
    this.component = el;
  };
  setContentRef: (arg0: any) => void = el => {
    this.content = el;
  };

  componentDidMount() {
    this.component.addEventListener('transitionend', this.transitionEnds);
  }

  componentWillUnmount() {
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  componentDidUpdate(prevProps: Record<string, any>, prevState: Record<string, any>) {
    if (this.props.isOpen !== undefined && this.props.isOpen !== this.state.isOpen) {
      this.handleToggleStateChange(this.props.isOpen);
    }

    if (this.state.isOpen && !this.state.contentHeight || this.state.isOpen !== prevState.isOpen) {
      this.calculateHeight();
    }
  }

  onResize: () => void = () => {
    this.calculateHeight();
  };
  calculateHeight: () => void = () => {
    const {
      clientHeight
    } = this.content;
    const {
      isOpen
    } = this.state;
    this.setState({
      contentHeight: isOpen ? clientHeight || null : 0
    });
  };
  transitionEnds: () => void = () => {
    this.setState({
      isCollapsing: false,
      isExpanding: false
    });
  };
  handleToggle: (arg0: React.SyntheticEvent<HTMLAnchorElement>) => void = e => {
    const {
      onToggle,
      isOpen: externalIsOpen
    } = this.props;
    const {
      isOpen
    } = this.state;
    const target = e.currentTarget;
    const tooltipEl = ReactDOM.findDOMNode(this.tooltip);
    const isExternallyControlled = externalIsOpen !== undefined;

    if (!tooltipEl || tooltipEl && target !== tooltipEl && !tooltipEl.contains(target)) {
      if (!isExternallyControlled) {
        this.handleToggleStateChange(!isOpen);
      }

      if (onToggle) {
        onToggle(!isOpen);
      }
    }
  };
  handleToggleStateChange: (arg0: boolean) => void = newIsOpen => {
    if (newIsOpen) {
      this.setState({
        isCollapsing: false,
        isExpanding: true,
        isOpen: true
      });
    } else {
      this.setState({
        isCollapsing: true,
        isExpanding: false,
        isOpen: false
      });
    }
  };
  handleKeyDown: (arg0: React.KeyboardEvent<HTMLAnchorElement>) => void = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleToggle(e);
    }
  };

  render(): React.ReactNode {
    const {
      contentHeight,
      isOpen,
      isCollapsing,
      isExpanding
    } = this.state;
    const {
      archived,
      children,
      className,
      enableUiDataEdit,
      hasErrors,
      headerSubtitles,
      headerTitle,
      headerExtras,
      onArchive,
      onAttach,
      onCopyToClipboard,
      onRemove,
      onUnarchive,
      showTitleOnOpen,
      tooltipStyle,
      uiDataKey
    } = this.props;
    return <div ref={this.setComponentRef} className={classNames('collapse', className, {
      'open': isOpen
    }, {
      'is-archived': archived
    }, {
      'is-collapsing': isCollapsing
    }, {
      'is-expanding': isExpanding
    })}>
        <div className="collapse__header">
          <div className='header-info-wrapper'>
            <Row>
              {headerTitle && <Column>
                  <a tabIndex={0} className='header-info-link' onKeyDown={this.handleKeyDown} onClick={this.handleToggle}>
                    <AccordionIcon className="arrow-icon" />
                    <CollapseHeaderTitle enableUiDataEdit={enableUiDataEdit} uiDataKey={uiDataKey} tooltipRef={ref => this.tooltip = ref} tooltipStyle={tooltipStyle}>
                      {headerTitle}
                    </CollapseHeaderTitle>
                  </a>
                  {headerExtras}
                </Column>}
              {(showTitleOnOpen || !isOpen) && headerSubtitles}
            </Row>
            <div className='collapse__header_button-wrapper'>
              {!isOpen && hasErrors && <span className='collapse__header_error-badge' />}

              {onAttach && <AttachButton onClick={onAttach} />}
              {onCopyToClipboard && <CopyToClipboardButton onClick={onCopyToClipboard} />}
              {onArchive && <ArchiveButton onClick={onArchive} />}
              {onUnarchive && <UnarchiveButton onClick={onUnarchive} />}
              {onRemove && <RemoveButton onClick={onRemove} />}
            </div>
          </div>
        </div>
        <div className={classNames('collapse__content')} style={{
        maxHeight: contentHeight
      }}>
          <div ref={this.setContentRef} className="collapse__content-wrapper" hidden={!isOpen && !isCollapsing && !isExpanding}>
            <ReactResizeDetector handleHeight onResize={this.onResize} />
            {children}
          </div>
        </div>
      </div>;
  }

}

export default Collapse;