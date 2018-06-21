// @flow
import React from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

type Props = {
  data: Array<any>,
  dataKeys: Array<any>,
  noDataText?: string,
  onRowClick?: Function,
  selectedRow?: ?Object,
}
const SortableTableBody = ({
  data,
  dataKeys,
  noDataText,
  onRowClick,
  selectedRow,
}: Props) =>
  <tbody>
    {data.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className={classNames({'selected': selectedRow && selectedRow.id === row.id})}
        onClick={() => onRowClick && onRowClick(row.id, row)}
      >
        {dataKeys.map(({key, renderer}, cellIndex) => (
          <td key={cellIndex}>
            {renderer ?
              isArray(key) ? key.map(item => renderer(get(row, item), row)) : renderer(get(row, key), row) :
              isArray(key) ? key.map(item => `${get(row, item)} `) : get(row, key, '-') || ' - '
            }
          </td>
        ))}
      </tr>
    ))}
    {!data.length &&
      <tr className='no-data'><td colSpan={dataKeys.length}>{noDataText ? noDataText : 'Ei tuloksia'}</td></tr>
    }
  </tbody>;

export default SortableTableBody;
