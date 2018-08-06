// @flow
import React from 'react';

import SortableTableBodyRow from './SortableTableBodyRow';

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
    {data.map((row, index) =>
      <SortableTableBodyRow
        key={index}
        dataKeys={dataKeys}
        onRowClick={onRowClick}
        row={row}
        selectedRow={selectedRow}
      />
    )}
    {!data.length &&
      <tr className='no-data'><td colSpan={dataKeys.length}>{noDataText ? noDataText : 'Ei tuloksia'}</td></tr>
    }
  </tbody>;

export default SortableTableBody;
