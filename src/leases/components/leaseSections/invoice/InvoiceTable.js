// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import get from 'lodash/get';

import SortableTableHeader from '$components/table/SortableTableHeader';
import {
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from '$util/helpers';
import {getContentInvoices} from '$src/invoices/helpers';
import {getAttributes, getInvoices} from '$src/invoices/selectors';
import {getInvoiceSetsByLease} from '$src/invoiceSets/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/invoices/types';

type BodyGroupProps = {
  columns: Array<any>,
  onCreditItemChange: Function,
  onRowClick: Function,
  row: Object,
  selectedCreditItem: ?string,
  selectedRow: ?Object,
}

const TableBodyGroup = ({
  columns,
  onCreditItemChange,
  onRowClick,
  row,
  selectedCreditItem,
  selectedRow,
}: BodyGroupProps) => {
  const handleOptionChange = (e: any) => {
    onCreditItemChange(e.target.value);
  };

  return (
    <tbody>
      <tr>
        <td>
          <input type="radio" value={`invoiceset_${row.data.id}`}
            checked={selectedCreditItem === `invoiceset_${row.data.id}`}
            onChange={handleOptionChange}
          />
        </td>
        <td colSpan={columns.length}>
          {row.data.invoiceset || '-'}
        </td>
      </tr>
      {row.invoices.map((row, index) => {
        return (
          <TableBodyRow
            key={index}
            columns={columns}
            hasGroup={true}
            onCreditItemChange={onCreditItemChange}
            onRowClick={onRowClick}
            row={row}
            selectedCreditItem={selectedCreditItem}
            selectedRow={selectedRow}
          />
        );
      })}
    </tbody>
  );
};

type BodyRowProps = {
  columns: Array<any>,
  hasGroup: boolean,
  onCreditItemChange: Function,
  onRowClick: Function,
  row: Object,
  selectedCreditItem: ?string,
  selectedRow: ?Object,
}

const TableBodyRow = ({
  columns,
  hasGroup,
  onCreditItemChange,
  onRowClick,
  row,
  selectedCreditItem,
  selectedRow,
}: BodyRowProps) => {
  let buttonPressTimer;
  let isClicked = false;
  let isLongPress = false;

  const handleOptionChange = (e: any) => {
    onCreditItemChange(e.target.value);
  };

  const handleRowClick = () => {
    onRowClick(row.data.id, row);
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

  return (
    <tr
      className={classNames({'selected': selectedRow && selectedRow.id === row.data.id, 'has-group': hasGroup})}
    >
      <td>
        <input type="radio" value={`invoice_${row.data.id}`}
          checked={selectedCreditItem === `invoice_${row.data.id}`}
          onChange={handleOptionChange}
        />
      </td>
      {columns.map(({key, renderer}, index) => (
        <td
          key={index}
          onTouchStart={handleButtonPress}
          onTouchEnd={handleButtonRelease}
          onMouseDown={handleButtonPress}
          onMouseUp={handleButtonRelease}
        >
          {renderer ?
            renderer(get(row, `data.${key}`), row) :
            get(row, `data.${key}`) || ' - '
          }
        </td>
      ))}
    </tr>
  );
};

type Props = {
  columns: Array<Object>,
  invoiceAttributes: Attributes,
  invoices: Array<Object>,
  invoiceSets: Array<Object>,
  maxHeight: ?number,
  onCreditItemChange: Function,
  onDataUpdate: Function,
  onRowClick: Function,
  onSelectNext: Function,
  onSelectPrevious: Function,
  selectedCreditItem: ?string,
  selectedRow: ?Object,
}

type State = {
  sortedData: Array<Object>,
  sortings: Array<string>,
}

class InvoiceTable extends Component<Props, State> {
  tableElement: any

  static defaultProps = {
    maxHeight: null,
  };

  state = {
    sortedData: [],
    sortings: [],
  }

  componentWillMount() {
    const {columns, invoices} = this.props,
      invoiceItems = getContentInvoices(invoices),
      groupedData = this.groupData(invoiceItems),
      sortedData = this.sortData(groupedData);

    this.setState({
      sortedData: sortedData,
      sortings: this.getDefaultSortings(columns),
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(this.state.sortings !== prevState.sortings ||
      this.props.columns !== prevProps.columns
    ) {
      const {invoices} = this.props,
        invoiceItems = getContentInvoices(invoices),
        groupedData = this.groupData(invoiceItems),
        sortedData = this.sortData(groupedData);

      this.setState({
        sortedData: sortedData,
      });
    }

    if(this.state.sortedData !== prevState.sortedData) {
      const {onDataUpdate} = this.props;
      if(onDataUpdate) {
        onDataUpdate();
      }
    }
  }

  getDefaultSortings = (dataKeys: Array<Object>): Array<string> => {
    return dataKeys.map((column) => {
      let sorting = 'both';
      if (column.defaultSorting) {
        const defaultSorting = column.defaultSorting.toLowerCase();
        if (defaultSorting == 'desc') {
          sorting = 'desc';
        } else if (defaultSorting == 'asc') {
          sorting = 'asc';
        }
      }
      return sorting;
    });
  };

  onSortingChange = (index: number) => {
    const {sortings} = this.state;
    const newSortings = sortings.map(((sorting, i) => {
      if (i == index) {
        return this.nextSorting(sorting);
      }
      return 'both';
    }));

    this.setState({
      sortings: newSortings,
    });
  }

  nextSorting = (state: string) => {
    switch (state) {
      case 'both':
        return 'desc';
      case 'desc':
        return 'asc';
      case 'asc':
        return 'desc';
      default:
        return 'both';
    }
  }

  groupData = (data: Array<Object>) => {
    const {sortings} = this.state,
      {columns, invoiceSets} = this.props,
      invoiceSetsData = [];
    let groupedData = [];

    forEach(sortings, (sorting, index) => {
      if(index >= columns.length) {
        return false;
      }
      const column = columns[index];
      switch (sorting) {
        case 'desc':
        case 'asc':
          if(column.key === 'invoiceset') {
            data.forEach((invoice) => {
              if(invoice.invoiceset) {
                const invoiceSet = invoiceSets && invoiceSets.find((set) => set.id === invoice.invoiceset);
                if(invoiceSet) {
                  const index = invoiceSetsData.findIndex((set) => set.data.id === invoice.invoiceset);
                  if(index !== -1) {
                    invoiceSetsData[index].invoices.push({type: 'invoice', data: invoice});
                  } else {
                    invoiceSetsData.push({
                      type: 'invoiceset',
                      data: {...invoiceSet, invoiceset: invoiceSet.id},
                      invoices: [{type: 'invoice', data: invoice}],
                    });
                  }
                }
              } else {
                groupedData.push({type: 'invoice', data: invoice});
              }
            });
          }
      }
    });
    groupedData = [...invoiceSetsData, ...groupedData];
    return groupedData.length ? groupedData : data.map((invoice) => {return {type: 'invoice', data: invoice};});
  }

  sortData = (data: Array<Object>) => {
    const {sortings} = this.state,
      {columns} = this.props;
    let sortedData = data;

    forEach(sortings, (sorting, index) => {
      if(index >= columns.length) {
        return false;
      }
      const column = columns[index];
      const key = `data.${column.key}`;

      switch (sorting) {
        case 'desc':
          if (column.descSortFunction &&
            typeof(column.descSortFunction) == 'function') {
            sortedData.sort((a, b) => column.descSortFunction(a, b, key));
          } else {
            sortedData.sort((a, b) => sortStringByKeyDesc(a, b, key));
          }
          break;
        case 'asc':
          if (column.descSortFunction &&
            typeof(column.ascSortFunction) == 'function') {
            sortedData.sort((a, b) => column.ascSortFunction(a, b, key));
          } else {
            sortedData.sort((a, b) => sortStringByKeyAsc(a, b, key));
          }
          break;
      }
    });
    return sortedData;
  }

  getInvoicesFromSortedData = () => {
    const {sortedData} = this.state;
    let invoicesData = [];
    sortedData.forEach((row) => {
      if(row.type === 'invoice') {
        invoicesData.push(row);
      } else {
        invoicesData = [...invoicesData, ...row.invoices];
      }
    });
    return invoicesData;
  }

  selectPrevious = () => {
    const sortedInvoices = this.getInvoicesFromSortedData();
    const {onSelectPrevious, selectedRow} = this.props;

    if(!selectedRow || !onSelectPrevious) {
      return null;
    }

    const index = findIndex(sortedInvoices, (row) => row.data.id === selectedRow.id);
    if(index > 0) {
      onSelectPrevious(sortedInvoices[index - 1]);
    }
  }

  selectNext = () => {
    const sortedInvoices = this.getInvoicesFromSortedData();
    const {onSelectNext, selectedRow} = this.props;

    if(!selectedRow || !onSelectNext) {
      return null;
    }

    const index = findIndex(sortedInvoices, (row) => row.data.id === selectedRow.id);
    if(index < (sortedInvoices.length - 1)) {
      onSelectNext(sortedInvoices[index + 1]);
    }
  }

  render() {
    const {columns, maxHeight, onCreditItemChange, onRowClick, selectedCreditItem, selectedRow} = this.props,
      {sortedData, sortings} = this.state;

    return(
      <div className={'table__fixed-header'}>
        <div
          className={'table__fixed-header_wrapper'}
          style={{maxHeight: maxHeight}}>
          <div className="table__fixed-header_header-border" />
          <table
            ref={(ref) => this.tableElement = ref}
            className={classNames(
              'table',
              'table__fixed-layout',
              'clickable-row',
              'grouped-table',
            )}
          >
            <SortableTableHeader
              dataKeys={columns}
              emptyFirstColumn
              fixedHeader={true}
              sortable={true}
              sortings={sortings}
              onStateChange={this.onSortingChange}
            />
            {sortedData.map((row, index) => {
              if(row.type === 'invoice') {
                return (
                  <tbody key={index}>
                    <TableBodyRow
                      columns={columns}
                      hasGroup={false}
                      onCreditItemChange={onCreditItemChange}
                      onRowClick={onRowClick}
                      row={row}
                      selectedCreditItem={selectedCreditItem}
                      selectedRow={selectedRow}
                    />
                  </tbody>
                );
              } else {
                return (
                  <TableBodyGroup
                    key={index}
                    columns={columns}
                    onCreditItemChange={onCreditItemChange}
                    onRowClick={onRowClick}
                    row={row}
                    selectedCreditItem={selectedCreditItem}
                    selectedRow={selectedRow}
                  />
                );
              }
            })}
            {!sortedData.length &&
              <tbody><tr className='no-data'><td colSpan={columns.length + 1}>{'Ei laskuja'}</td></tr></tbody>
            }
          </table>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);
    return {
      invoiceAttributes: getAttributes(state),
      invoices: getInvoices(state),
      invoiceSets: getInvoiceSetsByLease(state, currentLease.id),
    };
  },
  null,
  null,
  {withRef: true},
)(InvoiceTable);
