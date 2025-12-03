import React, { cloneElement, PureComponent } from "react";
import classNames from "classnames";
import { debounce } from "@/util/helpers";

const TABLE_MIN_HEIGHT = 521;
const PANEL_WIDTH = 607.5;
type Props = {
  hasData: boolean;
  isPanelOpen: boolean;
  onPanelClosed?: (...args: Array<any>) => any;
  onPanelOpened?: (...args: Array<any>) => any;
  panelComponent: any;
  tableComponent: any;
};
type State = {
  tableHeight: number | null | undefined;
  tableWidth: number | null | undefined;
};

class TableAndPanelWrapper extends PureComponent<Props, State> {
  panel: any;
  table: any;
  state = {
    tableHeight: null,
    tableWidth: null,
  };
  container: any;
  containerResizeObserver: ResizeObserver | null = null;
  panelResizeObserver: ResizeObserver | null = null;
  panelWrapper: HTMLDivElement | null = null;
  handleResizeDebounced: (() => void) | null = null;
  handlePanelResizeDebounced: (() => void) | null = null;

  setPanelRef = (el: any) => {
    this.panel = el;
  };
  setTableRef = (el: any) => {
    this.table = el;
  };

  componentDidMount() {
    this.calculateTableHeight();
    this.calculateTableWidth();
    this.panelWrapper.addEventListener("transitionend", this.transitionEnds);

    this.handleResizeDebounced = debounce(this.handleResize, 400);
    this.handlePanelResizeDebounced = debounce(this.handlePanelResize, 1);

    if (this.container) {
      this.containerResizeObserver = new ResizeObserver(() => {
        this.handleResizeDebounced!();
      });
      this.containerResizeObserver.observe(this.container);
    }

    if (this.panelWrapper) {
      this.panelResizeObserver = new ResizeObserver(() => {
        this.handlePanelResizeDebounced!();
      });
      this.panelResizeObserver.observe(this.panelWrapper);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isPanelOpen !== this.props.isPanelOpen) {
      this.setHidden(this.props.isPanelOpen);
      this.calculateTableHeight();
      this.calculateTableWidth();
    }
  }

  componentWillUnmount() {
    this.panelWrapper.removeEventListener("transitionend", this.transitionEnds);

    if (this.containerResizeObserver) {
      this.containerResizeObserver.disconnect();
    }
    if (this.panelResizeObserver) {
      this.panelResizeObserver.disconnect();
    }
  }

  setHidden = (isPanelOpen: boolean) => {
    const wrapper = document.querySelector(
      ".table__table-and-panel-wrapper",
    ) as HTMLElement;
    if (wrapper) {
      if (isPanelOpen) {
        wrapper.style.overflow = "visible";
      } else {
        wrapper.style.overflow = "hidden";
      }
    }
  };
  setContainerRef = (el: any) => {
    this.container = el;
  };
  setPanelWrapperRef = (el: any) => {
    this.panelWrapper = el;
  };
  handleResize = () => {
    this.calculateTableHeight();
    this.calculateTableWidth();
  };
  handlePanelResize = () => {
    this.calculateTableHeight();
    this.calculateTableWidth();
  };
  scrollToPanel = () => {
    setTimeout(() => {
      if (this.panelWrapper) {
        const panelWrapperBoundingRect =
          this.panelWrapper.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: panelWrapperBoundingRect.top + scrollTop - 190,
          behavior: "smooth",
        });
      }
    }, 50);
  };
  transitionEnds = () => {
    const { isPanelOpen, onPanelClosed, onPanelOpened } = this.props;

    if (isPanelOpen) {
      if (onPanelOpened) {
        onPanelOpened();
      }
    } else {
      if (onPanelClosed) {
        onPanelClosed();
      }
    }
  };
  calculateTableHeight = () => {
    const { isPanelOpen } = this.props;
    const { scrollHeight: panelHeight } = this.panelWrapper;
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
  };
  calculateTableWidth = () => {
    if (!this.container) return;
    let { clientWidth } = this.container;
    const { isPanelOpen } = this.props;

    if (isPanelOpen) {
      if (clientWidth - PANEL_WIDTH <= 0) {
        clientWidth = 0;
      } else {
        clientWidth = clientWidth - PANEL_WIDTH;
      }
    }

    this.setState({
      tableWidth: clientWidth,
    });
  };

  render() {
    const { hasData, isPanelOpen, panelComponent, tableComponent } = this.props;
    const { tableHeight, tableWidth } = this.state;
    return (
      <div
        className="table__table-and-panel-wrapper"
        ref={this.setContainerRef}
      >
        <div
          className="table__table-and-panel-wrapper_table-wrapper"
          style={{
            minHeight: hasData ? tableHeight || null : null,
            maxWidth: tableWidth || null,
          }}
        >
          {cloneElement(tableComponent, {
            ref: this.setTableRef,
            maxHeight: tableHeight,
          })}
        </div>
        <div
          ref={this.setPanelWrapperRef}
          className={classNames(
            "table__table-and-panel-wrapper_panel-wrapper",
            {
              "table__table-and-panel-wrapper_panel-wrapper--is-open":
                isPanelOpen,
            },
          )}
        >
          {cloneElement(panelComponent, {
            ref: this.setPanelRef,
          })}
        </div>
      </div>
    );
  }
}

export default TableAndPanelWrapper;
