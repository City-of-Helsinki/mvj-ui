// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';

import Loader from '$components/loader/Loader';
import SortableTableHeader from '$components/table/SortableTableHeader';
import {InvoiceType} from '$src/invoices/enums';
import {
  formatDateRange,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from '$util/helpers';
import {getContentInvoices} from '$src/invoices/helpers';
import {getAttributes, getInvoicesByLease} from '$src/invoices/selectors';
import {getInvoiceSetsByLease} from '$src/invoiceSets/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/invoices/types';

type BodyGroupProps = {
  columns: Array<any>,
  invoiceToCredit: ?string,
  onInvoiceToCreditChange: Function,
  onRowClick: Function,
  row: Object,
  selectedRow: ?Object,
}

const TableBodyGroup = ({
  columns,
  invoiceToCredit,
  onInvoiceToCreditChange,
  onRowClick,
  row,
  selectedRow,
}: BodyGroupProps) => {
  const handleOptionChange = (e: any) => {
    onInvoiceToCreditChange(e.target.value);
  };

  const isGroupDisabled = () => {
    let isDisabled = true;
    const invoices = get(row, 'invoices', []);
    invoices.forEach((invoice) => {
      if(invoice.data.type !== InvoiceType.CREDIT_NOTE) {
        isDisabled = false;
      }
    });
    return isDisabled;
  };
  const isDisabled = isGroupDisabled();

  return (
    <tbody>
      <tr>
        <td>
          <input type="radio" value={`invoiceset_${row.data.id}`}
            checked={invoiceToCredit === `invoiceset_${row.data.id}`}
            disabled={isDisabled}
            onChange={handleOptionChange}
          />
        </td>
        <td colSpan={5}>
          {row.data.invoiceset || '-'}
        </td>
        {columns.length > 5 &&
          <td colSpan={columns.length - 5}>
            {formatDateRange(row.data.billing_period_start_date, row.data.billing_period_end_date) || '-'}
          </td>
        }
      </tr>
      {row.invoices.map((row, index) => {
        return (
          <TableBodyRow
            key={index}
            columns={columns}
            hasGroup={true}
            invoiceToCredit={invoiceToCredit}
            onInvoiceToCreditChange={onInvoiceToCreditChange}
            onRowClick={onRowClick}
            row={row}
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
  invoiceToCredit: ?string,
  onInvoiceToCreditChange: Function,
  onRowClick: Function,
  row: Object,
  selectedRow: ?Object,
}

const TableBodyRow = ({
  columns,
  hasGroup,
  invoiceToCredit,
  onInvoiceToCreditChange,
  onRowClick,
  row,
  selectedRow,
}: BodyRowProps) => {
  let buttonPressTimer;
  let isClicked = false;
  let isLongPress = false;

  const handleOptionChange = (e: any) => {
    onInvoiceToCreditChange(e.target.value);
  };

  const handleRowClick = () => {
    onRowClick(row.data.id, row);
  };

  const handleButtonPress = () => {
    isClicked = true;
    isLongPress = false;

    buttonPressTimer = setTimeout(() => {isLongPress = true;}, 1000);
  };

  const handleKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      handleRowClick();
    }
  };


  const handleButtonRelease = () => {
    if(!isLongPress && isClicked) {handleRowClick();}

    isClicked = false;
    clearTimeout(buttonPressTimer);
  };

  return (
    <tr
      className={classNames({'selected': selectedRow && selectedRow.id === row.data.id, 'has-group': hasGroup})}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <td colSpan={hasGroup ? 2 : 1}>
        <input type="radio" value={`invoice_${row.data.id}`}
          checked={invoiceToCredit === `invoice_${row.data.id}`}
          disabled={row.data.type === InvoiceType.CREDIT_NOTE|| !get(row, 'data.rows', []).length}
          onChange={handleOptionChange}
        />
      </td>
      {columns.map(({key, renderer}, index) => {
        if(!hasGroup || key !== 'invoiceset') {
          return (
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
          );
        } else {
          return null;
        }
      })}
    </tr>
  );
};

const groupData = (data: Array<Object>, sortings: Array<string>, columns: Array<Object>, invoiceSets: Array<Object>) => {
  const invoiceSetsData = [];
  let groupedData = [];

  sortings.forEach((sorting, index) => {
    if(index >= columns.length) {return false;}

    switch (sorting) {
      case 'desc':
      case 'asc':
        const column = columns[index];
        if(column.key === 'invoiceset' || column.key === 'billing_period_start_date') {
          data.forEach((invoice) => {
            if(invoice.invoiceset) {
              const index = invoiceSetsData.findIndex((set) => set.data.id === invoice.invoiceset);
              if(index !== -1) {
                invoiceSetsData[index].invoices.push({type: 'invoice', data: invoice});
              } else {
                const invoiceSet = invoiceSets && invoiceSets.find((set) => set.id === invoice.invoiceset);
                if(invoiceSet) {
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
};

const sortData = (data: Array<Object>, sortings: Array<string>, columns: Array<Object>) => {
  let sortedData = data;

  sortings.forEach((sorting, index) => {
    if(index >= columns.length) {return false;}

    const column = columns[index];
    const key = `data.${column.key}`;

    switch (sorting) {
      case 'desc':
        sortedData.sort(column.descSortFunction && typeof(column.descSortFunction) == 'function'
          ? (a, b) => column.descSortFunction(a, b, key)
          : (a, b) => sortStringByKeyDesc(a, b, key));
        // Sort also invoices inside invoice set if column is billing_period_start_date
        if(key === 'data.billing_period_start_date') {
          sortedData.forEach((item) => {
            if(item.type === 'invoiceset') {
              (item.invoices.sort(column.descSortFunction && typeof(column.descSortFunction)) == 'function'
                ? (a, b) => column.descSortFunction(a, b, key)
                : (a, b) => sortStringByKeyDesc(a, b, key));
            }
          });
        }
        break;
      case 'asc':
        sortedData.sort(column.ascSortFunction && typeof(column.ascSortFunction) == 'function'
          ? (a, b) => column.ascSortFunction(a, b, key)
          : (a, b) => sortStringByKeyAsc(a, b, key));
        // Sort also invoices inside invoice set if column is billing_period_start_date
        if(key === 'data.billing_period_start_date') {
          sortedData.forEach((item) => {
            if(item.type === 'invoiceset') {
              (item.invoices.sort(column.ascSortFunction && typeof(column.ascSortFunction)) == 'function'
                ? (a, b) => column.ascSortFunction(a, b, key)
                : (a, b) => sortStringByKeyAsc(a, b, key));
            }
          });
        }
        break;
    }
  });
  return sortedData;
};

type Props = {
  columns: Array<Object>,
  invoiceAttributes: Attributes,
  invoices: Array<Object>,
  invoiceToCredit: ?string,
  invoiceSets: Array<Object>,
  isLoading: boolean,
  maxHeight: ?number,
  onInvoiceToCreditChange: Function,
  onDataUpdate: Function,
  onRowClick: Function,
  onSelectNext: Function,
  onSelectPrevious: Function,
  selectedRow: ?Object,
}

type State = {
  columns: Array<Object>,
  invoices: Array<Object>,
  sortedData: Array<Object>,
  sortings: Array<string>,
}

class InvoiceTable extends Component<Props, State> {
  tableElement: any

  static defaultProps = {
    maxHeight: null,
  };

  state = {
    columns: [],
    invoices: [],
    sortedData: [],
    sortings: [],
  }

  componentDidMount() {
    const {columns} = this.props;
    this.setState({sortings: this.getDefaultSortings(columns)});
  }

  static getDerivedStateFromProps(props, state) {
    if(props.columns !== state.columns || props.invoices !== state.invoices) {
      const invoiceItems = getContentInvoices(props.invoices),
        groupedData = groupData(invoiceItems, state.sortings, props.columns, props.invoiceSets),
        sortedData = sortData(groupedData, state.sortings, props.columns);

      return {
        columns: props.columns,
        invoices: props.invoices,
        sortedData: sortedData,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(!this.state.sortings.length && this.props.columns !== prevProps.columns) {
      this.setState({sortings: this.getDefaultSortings(this.props.columns)});
    }

    if(this.state.sortedData !== prevState.sortedData) {
      const {onDataUpdate} = this.props;
      if(onDataUpdate) {onDataUpdate();}
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
    const {columns, invoices, invoiceSets} = this.props;
    const {sortings} = this.state;
    const newSortings = sortings.map(((sorting, i) => {
      if (i == index) {return this.nextSorting(sorting, columns[i].primarySorting);}
      return 'both';
    }));

    const invoiceItems = getContentInvoices(invoices),
      groupedData = groupData(invoiceItems, newSortings, columns, invoiceSets),
      sortedData = sortData(groupedData, newSortings, columns);

    this.setState({
      sortedData: sortedData,
      sortings: newSortings,
    });
  }

  nextSorting = (state: string, primarySorting: ?string) => {
    switch (state) {
      case 'both':
        return primarySorting || 'asc';
      case 'desc':
        return 'asc';
      case 'asc':
        return 'desc';
      default:
        return 'both';
    }
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
    const {onSelectPrevious, selectedRow} = this.props;
    if(!selectedRow || !onSelectPrevious) {return null;}

    const sortedInvoices = this.getInvoicesFromSortedData(),
      index = findIndex(sortedInvoices, (row) => row.data.id === selectedRow.id);

    if(index > 0) {onSelectPrevious(sortedInvoices[index - 1]);}
  }

  selectNext = () => {
    const {onSelectNext, selectedRow} = this.props;
    if(!selectedRow || !onSelectNext) {return null;}

    const sortedInvoices = this.getInvoicesFromSortedData(),
      index = findIndex(sortedInvoices, (row) => row.data.id === selectedRow.id);

    if(index < (sortedInvoices.length - 1)) {onSelectNext(sortedInvoices[index + 1]);}
  }

  render() {
    const {
      columns,
      invoiceToCredit,
      isLoading,
      maxHeight,
      onInvoiceToCreditChange,
      onRowClick,
      selectedRow,
    } = this.props;
    const {sortedData, sortings} = this.state;

    return(
      <div className={'table__fixed-header'}>
        <div
          className={'table__fixed-header_wrapper'}
          style={{maxHeight: maxHeight}}>
          <div className="table__fixed-header_header-border" />
          {isLoading &&
            <div className='invoice__invoice-table_loader-wrapper'><Loader isLoading={true} /></div>
          }
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
                      invoiceToCredit={invoiceToCredit}
                      onInvoiceToCreditChange={onInvoiceToCreditChange}
                      onRowClick={onRowClick}
                      row={row}
                      selectedRow={selectedRow}
                    />
                  </tbody>
                );
              } else {
                return (
                  <TableBodyGroup
                    key={index}
                    columns={columns}
                    invoiceToCredit={invoiceToCredit}
                    onInvoiceToCreditChange={onInvoiceToCreditChange}
                    onRowClick={onRowClick}
                    row={row}
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
      invoices: getInvoicesByLease(state, currentLease.id),
      invoiceSets: getInvoiceSetsByLease(state, currentLease.id),
    };
  },
  null,
  null,
  {withRef: true},
)(InvoiceTable);
