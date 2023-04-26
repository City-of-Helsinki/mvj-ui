// @flow
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import UIDataTooltip from '$components/tooltip/UIDataTooltip';

type Props = {
  children?: any,
  enableUiDataEdit?: boolean,
  relativeTo?: any,
  style?: Object,
  uiDataKey?: ?string,
}

type State = {
  showAddButton: boolean,
}

class SubTitle extends PureComponent<Props, State> {
  timer: any;

  state = {
    showAddButton: false,
  }

  static defaultProps = {
    enableUiDataEdit: false,
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
      relativeTo,
      style,
      uiDataKey,
    } = this.props;
    const {showAddButton} = this.state;

    return <span
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.handleMouseLeave}
      className={classNames('content__sub-title', {'show-add-button': showAddButton})}
      style={style}
    >
      <span>{children}</span>
      {(!!uiDataKey || enableUiDataEdit) &&
        <UIDataTooltip
          enableUiDataEdit={enableUiDataEdit}
          onTooltipClose={this.handleTooltipClose}
          relativeTo={relativeTo}
          uiDataKey={uiDataKey}
        />
      }
    </span>;
  }
}

export default SubTitle;
