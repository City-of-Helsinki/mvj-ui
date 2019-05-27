// @flow
import React, {cloneElement, PureComponent} from 'react';
import classNames from 'classnames';
import scrollToComponent from 'react-scroll-to-component';
import ReactResizeDetector from 'react-resize-detector';

const TABLE_MIN_HEIGHT = 521;
const PANEL_WIDTH = 607.5;

type Props = {
  hasData: boolean,
  isPanelOpen: boolean,
  onPanelClosed?: Function,
  onPanelOpened?: Function,
  panelComponent: any,
  tableComponent: any,
}

type State = {
  tableHeight: ?number,
  tableWidth: ?number,
}

class TableAndPanelWrapper extends PureComponent<Props, State> {
  panel: any
  table: any

  state = {
    tableHeight: null,
    tableWidth: null,
  }

  container: any
  panelWrapper: any

  setPanelRef = (el: any) => {
    this.panel = el;
  }

  setTableRef = (el: any) => {
    this.table = el;
  }

  componentDidMount() {
    this.calculateTableHeight();
    this.calculateTableWidth();
    this.panelWrapper.addEventListener('transitionend', this.transitionEnds);
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.isPanelOpen !== this.props.isPanelOpen) {
      this.calculateTableHeight();
      this.calculateTableWidth();
    }
  }

  componentWillUnmount() {
    this.panelWrapper.removeEventListener('transitionend', this.transitionEnds);
  }

  setContainerRef = (el: any) => {
    this.container = el;
  }

  setPanelWrapperRef = (el: any) => {
    this.panelWrapper = el;
  }

  handleResize = () => {
    this.calculateTableHeight();
    this.calculateTableWidth();
  }

  handlePanelResize = () => {
    this.calculateTableHeight();
    this.calculateTableWidth();
  }

  scrollToPanel = () => {
    setTimeout(() => {
      scrollToComponent(this.panelWrapper, {
        offset: -190,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  transitionEnds = () => {
    const {isPanelOpen, onPanelClosed, onPanelOpened} = this.props;
    if(isPanelOpen) {
      if(onPanelOpened) {
        onPanelOpened();
      }
    } else {
      if(onPanelClosed) {
        onPanelClosed();
      }
    }
  }

  calculateTableHeight = () => {
    const {isPanelOpen} = this.props;
    const {scrollHeight: panelHeight} = this.panelWrapper;
    const tableMinHeight = TABLE_MIN_HEIGHT,
      borderHeight = 2;
    let tableHeight = 0;

    tableHeight = isPanelOpen
      ? panelHeight > tableMinHeight
        ? panelHeight
        : tableMinHeight
      : tableMinHeight - borderHeight;

    this.setState({
      tableHeight: tableHeight,
    });
  }

  calculateTableWidth = () => {
    if(!this.container) return;

    let {clientWidth} = this.container;
    const {isPanelOpen} = this.props;

    if(isPanelOpen) {
      if(clientWidth - PANEL_WIDTH <= 0) {
        clientWidth = 0;
      }
      else {
        clientWidth = clientWidth - PANEL_WIDTH;
      }
    }
    this.setState({
      tableWidth: clientWidth,
    });
  }

  render() {
    const {
      hasData,
      isPanelOpen,
      panelComponent,
      tableComponent,
    } = this.props;
    const {
      tableHeight,
      tableWidth,
    } = this.state;

    return(
      <div className='table__table-and-panel-wrapper' ref={this.setContainerRef}>
        <ReactResizeDetector
          handleWidth
          onResize={this.handleResize}
          refreshMode='debounce'
          refreshRate={400}
        />
        <div
          className='table__table-and-panel-wrapper_table-wrapper'
          style={{minHeight: hasData ? tableHeight || null : null, maxWidth: tableWidth || null}}
        >
          {cloneElement(tableComponent, {ref: this.setTableRef, maxHeight: tableHeight})}
        </div>
        <div
          ref={this.setPanelWrapperRef}
          className={classNames(
            'table__table-and-panel-wrapper_panel-wrapper',
            {'table__table-and-panel-wrapper_panel-wrapper--is-open': isPanelOpen}
          )}
        >
          <ReactResizeDetector
            handleHeight
            onResize={this.handlePanelResize}
            refreshMode='debounce'
            refreshRate={1}
          />
          {cloneElement(panelComponent, {ref: this.setPanelRef})}
        </div>
      </div>
    );
  }
}

export default TableAndPanelWrapper;
