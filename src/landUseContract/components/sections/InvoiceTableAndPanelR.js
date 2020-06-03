// @flow
import flowRight from 'lodash/flowRight';
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

// import SortableTable from '$components/table/SortableTable';
import TableAndPanelWrapper from '$components/table/TableAndPanelWrapper';
import InvoicePanelR from './InvoicePanelR';
import SortableTable from '$components/table/SortableTable';
import {TableSortOrder} from '$src/enums';
import mockData from './mockData';
import {
  formatNumber,
} from '$util/helpers';

type Props = {
}

type State = {
  columns: Array<Object>,
}

class InvoiceTableAndPanelR extends PureComponent<Props, State> {

  state = {
    columns: [],
  }

  componentDidMount() {
    this.setColumns();
  }

  componentDidUpdate() {
  }

  setColumns = () => {
    this.setState({
      columns: this.getColumns(),
    });
  }

  getColumns = () => {
    const columns = [];

    columns.push({
      key: 'number',
      dataClassName: 'no-wrap',
      text: 'Laskunro',
    });

    columns.push({
      key: 'totalShare',
      dataClassName: 'no-wrap',
      renderer: (val) => val != null  ? `${formatNumber(val * 100)} %` : '-',
      text: 'Laskunosuus',
    });
    
    return columns;
  }

  componentWillUnmount() {
  }

  render() {
    const {columns} = this.state;

    return (
      <TableAndPanelWrapper
        ref={()=>{}}
        hasData={false}
        isPanelOpen={false}
        panelComponent={<InvoicePanelR/>}
        tableComponent={<SortableTable
          columns={columns}
          data={mockData}
          defaultSortOrder={TableSortOrder.DESCENDING}
          fixedHeader={true}
          sortable={false}
        />}
      />
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    () => {
      return {
      };
    }
  ),
)(InvoiceTableAndPanelR);
