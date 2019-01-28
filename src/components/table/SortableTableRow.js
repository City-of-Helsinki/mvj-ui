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
  disabled?: boolean,
  groupRow: boolean,
  isClicked: boolean,
  isSelected: boolean,
  onRowClick?: Function,
  onSelectRow?: Function,
  radioButtonDisabledFunction?: Function,
  row: Object,
  showCollapseArrowColumn?: boolean,
  showRadioButton?: boolean,
}

type State = {
  collapse: boolean,
}

class SortableTableRow extends PureComponent<Props, State> {
  component: any
  buttonPressTimer: any;
  isClicked = false;
  isLongPress = false;

  state = {
    collapse: false,
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

  handleClickRadioButton = () => {
    const {isSelected, onSelectRow} = this.props;

    if(isSelected && onSelectRow) {
      onSelectRow(null);
    }
  }

  handleKeyDownRadioButton = (e: any) => {
    const {isSelected} = this.props;

    if(isSelected && e.keyCode === 32) {
      e.preventDefault();
      this.handleClickRadioButton();
    }
  }

  handleSelectRow = () => {
    const {onSelectRow, row} = this.props;

    if(onSelectRow) {
      onSelectRow(row);
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

  render() {
    const {
      className,
      columns,
      disabled,
      groupRow,
      isClicked,
      isSelected,
      onRowClick,
      row,
      showCollapseArrowColumn,
      showRadioButton,
    } = this.props;
    const {collapse} = this.state;

    const showCollapseArrowIcon = this.shouldShowCollapseArrowIcon();

    return (
      <tr
        ref={this.setRef}
        tabIndex={onRowClick ? 0 : undefined}
        onKeyDown={this.handleKeyDown}
        className={classNames(className, {'selected': isClicked}, {'collapsed': collapse})}
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
        {showRadioButton &&
          <td>
            <label className='form-field__label invisible' htmlFor={`row_${row.id}`}>Rivi {row.id}</label>
            <input type='radio'
              checked={isSelected}
              disabled={disabled}
              id={`row_${row.id}`}
              name={`row_${row.id}`}
              onChange={this.handleSelectRow}
              onClick={this.handleClickRadioButton}
              onKeyDown={this.handleKeyDownRadioButton}
            />
          </td>
        }
        {columns.map(({dataClassName, disabled, grouping, key, renderer}) => {
          const hide = groupRow && get(grouping, 'columnsToHide', []).indexOf(key) !== -1;
          const isDisabled = disabled && isArray(get(row, key)) && get(row, key).length > 1;

          const handleTouchStart = () => {
            if(!isDisabled) {
              this.handleButtonPress();
            }
          };

          const handleTouchEnd = () => {
            if(!isDisabled) {
              this.handleButtonRelease();
            }
          };

          const handleMouseDown = () => {
            if(!isDisabled) {
              this.handleButtonPress();
            }
          };

          const handleMouseRelease = () => {
            if(!isDisabled) {
              this.handleButtonRelease();
            }
          };

          return hide
            ? <td
              key={key}
              className={classNames(dataClassName, {'disabled': isDisabled})}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={this.handleButtonRelease}
            ></td>
            : <td
              key={key}
              className={classNames(dataClassName, {'disabled': isDisabled})}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseRelease}
            >
              {renderer
                ? isArray(get(row, key))
                  ? <MultiItemCollapse items={get(row, key)} itemRenderer={(value) => renderer(value, row) || '-'} open={collapse}/>
                  : renderer(get(row, key)) || '-'
                : isArray(get(row, key))
                  ? <MultiItemCollapse items={get(row, key)} itemRenderer={(value) => value || '-'} open={collapse}/>
                  : get(row, key) || '-'
              }
            </td>;
        })}
      </tr>
    );
  }
}

export default SortableTableRow;
