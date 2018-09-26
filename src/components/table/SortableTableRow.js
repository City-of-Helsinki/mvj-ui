// @flow
import React, {PureComponent} from 'react';
import classNames from 'classnames';
import get from 'lodash/get';

type Props = {
  className?: string,
  columns: Array<any>,
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
  buttonPressTimer: any;
  isClicked = false;
  isLongPress = false;

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

  handleKeyUp = (e: any) => {
    if(e.keyCode === 13) {
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
        tabIndex={onRowClick ? 0 : undefined}
        onKeyUp={this.handleKeyUp}
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
        {columns.map(({dataClassName, grouping, key, renderer}) => {
          const hide = groupRow && get(grouping, 'columnsToHide', []).indexOf(key) !== -1;
          return hide
            ? <td
              key={key}
              className={dataClassName}
              onTouchStart={this.handleButtonPress}
              onTouchEnd={this.handleButtonRelease}
              onMouseDown={this.handleButtonPress}
              onMouseUp={this.handleButtonRelease}
            ></td>
            : <td
              key={key}
              className={dataClassName}
              onTouchStart={this.handleButtonPress}
              onTouchEnd={this.handleButtonRelease}
              onMouseDown={this.handleButtonPress}
              onMouseUp={this.handleButtonRelease}
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
