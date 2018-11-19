// @flow
import React from 'react';
import get from 'lodash/get';

import SortableTableRow from './SortableTableRow';

import type {Column} from './SortableTable';

const TableGroup = (props: Object) =>
  props.children.length ? props.children : null;

type Props = {
  clickedRow?: Object | null,
  columns: Array<Column>,
  disabled: boolean,
  onRowClick?: Function,
  onSelectRow?: Function,
  radioButtonDisabledFunction?: Function,
  row: Object,
  selectedRow?: Object | null,
  showRadioButton?: boolean,
}

const SortableTableGroup = ({
  clickedRow,
  disabled,
  columns,
  onRowClick,
  onSelectRow,
  radioButtonDisabledFunction,
  row,
  selectedRow,
  showRadioButton,
}: Props) => {
  const isGroupSelected = Boolean(selectedRow && selectedRow.tableGroupName && (selectedRow.id === row.id));

  const isRadioButtonDisabled = () => {
    if(radioButtonDisabledFunction) {
      return radioButtonDisabledFunction(row);
    }

    return false;
  };

  const handleClickRadioButton = () => {
    if(isGroupSelected && onSelectRow) {
      onSelectRow(null);
    }
  };

  const handleKeyDownRadioButton = (e: any) => {
    if(isGroupSelected && e.keyCode === 32) {
      e.preventDefault();
      handleClickRadioButton();
    }
  };

  const handleSelectGroup = () => {
    if(onSelectRow) {
      onSelectRow(row);
    }
  };

  return(
    <TableGroup>
      <tr className='group-row'>
        {showRadioButton &&
          <td>
            <label className='form-field__label invisible' htmlFor={`group_${row.id}`}>Ryhmä {row.id}</label>
            <input type='radio'
              checked={isGroupSelected}
              disabled={disabled}
              id={`group_${row.id}`}
              name={`group_${row.id}`}
              onChange={handleSelectGroup}
              onClick={handleClickRadioButton}
              onKeyDown={handleKeyDownRadioButton}
            />
          </td>
        }
        {columns.map(({dataClassName, grouping, key, renderer}, columnIndex) => {
          const show = grouping ? grouping.columnKeys.indexOf(key) : -1;
          return show !== -1
            ? <td key={columnIndex} className={dataClassName}>
              {renderer
                ? renderer(get(row, key), row)
                : get(row, key) || ' - '
              }
            </td>
            : <td key={columnIndex}></td>;
        })}
      </tr>
      {row.tableRows.map((row, rowIndex) => {
        const isRadioDisabled = isRadioButtonDisabled();
        const isClicked = Boolean(clickedRow && (clickedRow.id === row.id));
        const isSelected = Boolean(selectedRow && (selectedRow.id === row.id));

        return <SortableTableRow
          key={rowIndex}
          className='group-item-row'
          columns={columns}
          disabled={isRadioDisabled}
          groupRow={true}
          isClicked={isClicked}
          isSelected={isSelected}
          onRowClick={onRowClick}
          onSelectRow={onSelectRow}
          row={row}
          showRadioButton={showRadioButton || false}
        />;
      })}
    </TableGroup>
  );
};

export default SortableTableGroup;
