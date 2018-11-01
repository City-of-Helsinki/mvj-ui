// @flow
import React, {PureComponent} from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

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
  showRadioButton: boolean,
}

class SortableTableRow extends PureComponent<Props> {
  component: any
  buttonPressTimer: any;
  isClicked = false;
  isLongPress = false;

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

  handleSelectRow = () => {
    const {onSelectRow, row} = this.props;

    if(onSelectRow) {
      onSelectRow(row);
    }
  };

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
      showRadioButton,
    } = this.props;

    return (
      <tr
        ref={this.setRef}
        tabIndex={onRowClick ? 0 : undefined}
        onKeyDown={this.handleKeyDown}
        className={classNames(className, {'selected': isClicked})}
      >
        {showRadioButton &&
          <td>
            <label className='form-field__label invisible' htmlFor={`row_${row.id}`}>Rivi {row.id}</label>
            <input type='radio'
              checked={isSelected}
              disabled={disabled}
              id={`row_${row.id}`}
              name={`row_${row.id}`}
              onChange={this.handleSelectRow}
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
                ? renderer(get(row, key), row)
                : get(row, key) || '-'
              }
            </td>;
        })}
      </tr>
    );
  }
}

export default SortableTableRow;
