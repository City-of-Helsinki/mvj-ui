// @flow
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Tooltip from '$components/tooltip/Tooltip';

type Props = {
  children?: any,
  enableUiDataEdit?: boolean,
  style?: Object,
  tooltipRef?: Function,
  uiDataKey?: ?string,
}

type State = {
  showAddButton: boolean,
}

class CollapseHeaderTitle extends PureComponent<Props, State> {
  timer: any;

  state = {
    showAddButton: false,
  }

  static defaultProps = {
    enableUiDataEdit: false,
    required: false,
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer = () => {
    this.timer = setInterval(
      () => {
        this.showAddButton();
        this.stopTimer();
      },
      500
    );
  }

  stopTimer = () => {
    clearInterval(this.timer);
  }

  handleMouseEnter = () => {
    this.startTimer();
  }

  handleMouseLeave = (event: any) => {
    const target = event.target,
      el = ReactDOM.findDOMNode(this);

    if (el && (target === el || el.contains(target))) {
      this.stopTimer();
      this.hideAddButton();
    }
  }

  handleTooltipClose = () => {
    this.stopTimer();
    this.hideAddButton();
  }

  hideAddButton = () => {
    this.setState({showAddButton: false});
  }

  showAddButton = () => {
    this.setState({showAddButton: true});
  }

  render() {
    const {
      children,
      enableUiDataEdit,
      style,
      tooltipRef,
      uiDataKey,
    } = this.props;
    const {showAddButton} = this.state;

    return <span
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.handleMouseLeave}
      className={classNames('collapse__header_title', {'show-add-button': showAddButton})}
      style={style}
    >
      <span>{children}</span>
      {(!!uiDataKey || enableUiDataEdit) &&
        <Tooltip
          innerRef={tooltipRef}
          enableUiDataEdit={enableUiDataEdit}
          onTooltipClose={this.handleTooltipClose}
          uiDataKey={uiDataKey}
        />
      }
    </span>;
  }
}

export default CollapseHeaderTitle;
