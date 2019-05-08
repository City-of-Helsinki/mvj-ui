// @flow
import React, {PureComponent} from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

import AccordionIcon from '$components/icons/AccordionIcon';
import MultiItemCollapse from './MultiItemCollapse';
import type {Column} from './SortableTable';

type Props = {
  className?: string,
  columns: Array<Column>,
  columnStyles?: Array<Object>,
  id: string,
  grouping: ?Object,
  groupRow: boolean,
  isSelected: boolean,
  onRowClick?: Function,
  row: Object,
  showCollapseArrowColumn?: boolean,
}

type State = {
  collapse: boolean,
}

class SortableTableRow extends PureComponent<Props, State> {
  _isMounted = false;

  component: any
  buttonPressTimer: any;
  isClicked = false;
  isLongPress = false;

  state = {
    collapse: false,
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setRef = (el: any) => {
    this.component = el;
  }

  handleRowClick = () => {
    const {onRowClick, row} = this.props;

    if(onRowClick) {
      onRowClick(row.id, row);
    }
  };

  handleButtonPress = () => {
    this.isClicked = true;
    this.isLongPress = false;

    this.buttonPressTimer = setTimeout(() => {
      this.isLongPress = true;
    }, 1000);
  };

  handleButtonRelease = () => {
    if(!this.isLongPress && this.isClicked) {
      this.handleRowClick();
    }

    this.isClicked = false;
    clearTimeout(this.buttonPressTimer);
  };

  handleKeyDown = (e: any) => {
    if(e.target === this.component && e.keyCode === 13) {
      e.preventDefault();
      this.handleRowClick();
    }
  };

  handleCollapseArrowIconClick = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  handleCollapseArrowIconKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      this.handleCollapseArrowIconClick();
    }
  };

  shouldShowCollapseArrowIcon = () => {
    const {columns, row} = this.props;
    let showIcon = false;

    columns.forEach((column) => {
      if(isArray(row[column.key]) && row[column.key].length > 1) {
        showIcon = true;
        return true;
      }
    });

    return showIcon;
  }

  forceUpdateHandler = () => {
    this.forceUpdate();
  }

  render() {
    const {
      className,
      columns,
      id,
      grouping,
      groupRow,
      isSelected,
      onRowClick,
      row,
      showCollapseArrowColumn,
    } = this.props;
    const {collapse} = this.state;

    const showCollapseArrowIcon = this.shouldShowCollapseArrowIcon();

    return (
      <tr
        ref={this.setRef}
        id={id}
        tabIndex={onRowClick ? 0 : undefined}
        onKeyDown={this.handleKeyDown}
        className={classNames(className, {'selected': isSelected}, {'collapsed': collapse})}
      >
        {showCollapseArrowColumn &&
          <td className={classNames('collapse-arrow-column', {'no-icon': !showCollapseArrowIcon})}>
            {showCollapseArrowIcon &&
              <a
                className='sortable-table-row-collapse-link'
                onClick={this.handleCollapseArrowIconClick}
                onKeyDown={this.handleCollapseArrowIconKeyDown}
                tabIndex={0}
              >
                <AccordionIcon className='sortable-table-row-collapse-icon'/>
              </a>
            }
          </td>
        }
        {columns.map(({arrayRenderer, dataClassName, disabled, key, renderer}) => {
          const hide = groupRow && get(grouping, 'columnsToHide', []).indexOf(key) !== -1;

          const handleTouchStart = () => {
            if(!disabled) {
              this.handleButtonPress();
            }
          };

          const handleTouchEnd = () => {
            if(!disabled) {
              this.handleButtonRelease();
            }
          };

          const handleMouseDown = () => {
            if(!disabled) {
              this.handleButtonPress();
            }
          };

          const handleMouseRelease = () => {
            if(!disabled) {
              this.handleButtonRelease();
            }
          };

          return hide
            ? <td
              key={`${row.id}_${key}`}
              className={classNames(dataClassName, {'disabled': disabled})}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={this.handleButtonRelease}
            ></td>
            : <td
              key={`${row.id}_${key}`}
              className={classNames(dataClassName, {'disabled': disabled})}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseRelease}
            >
              {renderer
                ? isArray(get(row, key))
                  ? <MultiItemCollapse items={get(row, key)} itemRenderer={(value) => renderer(value, row, this) || '-'} open={collapse}/>
                  : renderer(get(row, key), row, this) || '-'
                : isArray(get(row, key))
                  ? arrayRenderer
                    ? arrayRenderer(get(row, key), this)
                    : <MultiItemCollapse items={get(row, key)} itemRenderer={(value) => value || '-'} open={collapse}/>
                  : get(row, key) || '-'
              }
            </td>;
        })}
      </tr>
    );
  }
}

export default SortableTableRow;
