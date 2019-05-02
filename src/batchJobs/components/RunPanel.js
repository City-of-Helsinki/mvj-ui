// @flow
import React, {PureComponent} from 'react';

import SortableTable from '$components/table/SortableTable';
import TablePanel from '$components/table/TablePanel';
import {formatDate} from '$util/helpers';

const data = [
  {
    id: 1,
    time: '2019-04-04T15:16:46.379318+03:00',
    text: 'Lorem ipsum 1',
  },
  {
    id: 2,
    time: '2019-04-04T15:16:46.379318+03:00',
    text: 'Lorem ipsum 2',
  },
  {
    id: 3,
    time: '2019-04-04T15:16:46.379318+03:00',
    text: 'Lorem ipsum 3',
  },
];

type Props = {
  onClose: Function,
  runId: ?number,
}

class RunPanel extends PureComponent<Props> {
  getColumns = () => {
    const columns = [];

    // TODO: Set correct columns when API is ready
    columns.push({
      key: 'time',
      text: 'Aika',
      renderer: (val) => formatDate(val, 'DD.MM.YYYY H:mm:ss'),
    });

    columns.push({
      key: 'text',
      text: 'Tulos',
    });

    return columns;
  }

  render() {
    const {onClose} = this.props;
    const columns = this.getColumns();

    return (
      <TablePanel onClose={onClose}>
        <SortableTable
          columns={columns}
          data={data}
        />
      </TablePanel>
    );
  }
}

export default RunPanel;
