// @flow
import React, {PureComponent} from 'react';

import GreenBox from '$components/content/GreenBox';
import SortableTable from '$components/table/SortableTable';

const data = [
  {
    id: 1,
    status: 'Käytössä',
    months: 'Kaikki',
    days: '1-7',
    week_day: 'su',
    hours: 4,
    minutes: 20,
    text: 'Viitekorkojen päivitys',
  },
  {
    id: 2,
    status: 'Käytössä',
    months: 'Kaikki',
    days: '1-7',
    week_day: 'su',
    hours: 4,
    minutes: 20,
    text: 'Viitekorkojen päivitys',
  },
  {
    id: 3,
    status: 'Käytössä',
    months: 'Kaikki',
    days: '1-7',
    week_day: 'su',
    hours: 4,
    minutes: 20,
    text: 'Viitekorkojen päivitys',
  },
];

type Props = {

}

class Schedules extends PureComponent<Props> {
  getColumns = () => {
    const columns = [];

    // TODO: Set correct columns when API is ready
    columns.push({
      key: 'id',
      text: '',
    });

    columns.push({
      key: 'status',
      text: 'Status',
    });

    columns.push({
      key: 'months',
      text: 'Kuukaudet',
    });

    columns.push({
      key: 'days',
      text: 'Päivät',
    });

    columns.push({
      key: 'week_day',
      text: 'Viikonpäivä',
    });

    columns.push({
      key: 'hours',
      text: 'tunnit',
    });

    columns.push({
      key: 'minutes',
      text: 'Minuutit',
    });

    columns.push({
      key: 'text',
      text: 'Työ',
    });

    return columns;
  }
  render() {
    const columns = this.getColumns();

    return(
      <GreenBox>
        <SortableTable
          columns={columns}
          data={data}
          style={{marginBottom: 10}}
        />
      </GreenBox>
    );
  }
}

export default Schedules;
