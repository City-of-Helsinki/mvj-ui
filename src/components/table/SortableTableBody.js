// @flow
import React from 'react';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

type Props = {
  data: Array<any>,
  dataKeys: Array<any>,
  noDataText?: string,
  onRowClick?: Function,
}
const SortableTableBody = ({
  data,
  dataKeys,
  noDataText,
  onRowClick,
}: Props) =>
  <tbody>
    {data.map((row, rowIndex) => (
      <tr key={rowIndex} onClick={() => onRowClick && onRowClick(row.id)}>
        {dataKeys.map(({key, renderer}, cellIndex) => (
          <td key={cellIndex}>
            {renderer ?
              isArray(key) ? key.map(item => renderer(get(row, item))) : renderer(get(row, key)) :
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
