// @flow
import React from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

type Props = {
  dataKeys: Array<any>,
  onRowClick?: Function,
  row: Object,
  selectedRow?: ?Object,
}

const SortableTableBodyRow = ({
  dataKeys,
  onRowClick,
  row,
  selectedRow,
}: Props) => {
  let buttonPressTimer;
  let isClicked = false;
  let isLongPress = false;

  const handleRowClick = () => {
    if(!onRowClick) {return;}
    onRowClick(row.id, row);
  };

  const handleButtonPress = () => {
    isClicked = true;
    isLongPress = false;

    buttonPressTimer = setTimeout(() => {isLongPress = true;}, 1000);
  };

  const handleButtonRelease = () => {
    if(!isLongPress && isClicked) {handleRowClick();}

    isClicked = false;
    clearTimeout(buttonPressTimer);
  };

  const handleKeyUp = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      handleRowClick();
    }
  };

  return (
    <tr
      tabIndex={onRowClick ? 0 : undefined}
      onKeyUp={handleKeyUp}
      className={classNames({'selected': selectedRow && selectedRow.id === row.id})}
      onTouchStart={handleButtonPress}
      onTouchEnd={handleButtonRelease}
      onMouseDown={handleButtonPress}
      onMouseUp={handleButtonRelease}
    >
      {dataKeys.map(({key, renderer}, index) => (
        <td key={index}>
          {renderer ?
            isArray(key) ? key.map(item => renderer(get(row, item), row)) : renderer(get(row, key), row) :
            isArray(key) ? key.map(item => `${get(row, item)} `) : get(row, key, '-') || ' - '
          }
        </td>
      ))}
    </tr>
  );
};

export default SortableTableBodyRow;
