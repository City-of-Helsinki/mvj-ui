import classNames from "classnames";
import flowRight from "lodash/flowRight";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { initialize } from "redux-form";
import AmountWithVat from "@/components/vat/AmountWithVat";
import FormText from "@/components/form/FormText";
import InvoicePanel from "./InvoicePanel";
import SingleRadioInput from "@/components/inputs/SingleRadioInput";
import SortableTable from "@/components/table/SortableTable";
import TableAndPanelWrapper from "@/components/table/TableAndPanelWrapper";
import { clearPatchedInvoice, patchInvoice } from "@/invoices/actions";
import { FormNames, KeyCodes, TableSortOrder } from "@/enums";
import {
  InvoiceFieldPaths,
  InvoiceFieldTitles,
  InvoiceRowsFieldPaths,
  InvoiceRowsFieldTitles,
  InvoiceType,
} from "@/invoices/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContactFullName } from "@/contacts/helpers";
import {
  formatReceivableTypesString,
  getContentIncoive,
  getContentInvoices,
  getPayloadEditInvoice,
  isInvoiceOverdue,
} from "@/invoices/helpers";
import {
  findReactById,
  formatDate,
  formatDateRange,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToRead,
  sortByOptionsAsc,
  sortByOptionsDesc,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
  sortStringAsc,
  sortStringDesc,
} from "@/util/helpers";
import {
  getAttributes as getInvoiceAttributes,
  getInvoicesByLease,
  getPatchedInvoice,
} from "@/invoices/selectors";
import { getInvoiceSetsByLease } from "@/invoiceSets/selectors";
import { getCurrentLease } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Invoice, InvoiceList } from "@/invoices/types";
import type { InvoiceSetList } from "@/invoiceSets/types";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  clearPatchedInvoice: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  invoiceAttributes: Attributes;
  invoiceListData: InvoiceList | null | undefined;
  invoiceSets: InvoiceSetList | null | undefined;
  invoiceToCredit: Record<string, any> | null | undefined;
  onInvoiceToCreditChange: (...args: Array<any>) => any;
  patchInvoice: (...args: Array<any>) => any;
  patchedInvoice: Invoice | null | undefined;
  usersPermissions: UsersPermissionsType;
};
type State = {
  columns: Array<Record<string, any>>;
  invoiceListData: InvoiceList | null | undefined;
  invoices: Array<Record<string, any>>;
  invoiceToCreditRowId: string | null | undefined;
  isPanelOpen: boolean;
  openedInvoice: Invoice | null | undefined;
};

class InvoiceTableAndPanel extends PureComponent<Props, State> {
  tableAndPanelWrapper: any;
  state = {
    columns: [],
    invoiceListData: null,
    invoices: [],
    invoiceToCreditRowId: null,
    isPanelOpen: false,
    openedInvoice: null,
  };

  componentDidMount() {
    const { clearPatchedInvoice } = this.props;
    clearPatchedInvoice();
    this.setColumns();
    document.addEventListener("keydown", this.handleKeyDown);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.invoiceListData !== state.invoiceListData) {
      const invoices = getContentInvoices(props.invoiceListData || []);
      newState.invoiceListData = props.invoiceListData;
      newState.invoices = invoices;
    }

    return newState;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.openedInvoice !== this.state.openedInvoice) {
      if (this.state.openedInvoice) {
        this.tableAndPanelWrapper.scrollToPanel();
      }

      this.scrollToOpenedRow();
      this.tableAndPanelWrapper.calculateTableHeight();
      this.tableAndPanelWrapper.calculateTableWidth();
      this.initilizeEditInvoiceForm(this.state.openedInvoice);
    }

    if (this.props.patchedInvoice) {
      const { clearPatchedInvoice, patchedInvoice } = this.props;
      this.initilizeEditInvoiceForm(getContentIncoive(patchedInvoice));
      clearPatchedInvoice();
    }

    if (
      this.props.invoiceAttributes !== prevProps.invoiceAttributes ||
      this.props.invoiceSets !== prevProps.invoiceSets ||
      this.props.usersPermissions !== prevProps.usersPermissions
    ) {
      this.setColumns();
    }
  }

  setColumns = () => {
    const { invoiceAttributes, invoiceSets, usersPermissions } = this.props;
    this.setState({
      columns: this.getColumns(
        invoiceAttributes,
        invoiceSets,
        usersPermissions,
      ),
    });
  };

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  setTableAndPanelWrapperRef = (el: any) => {
    this.tableAndPanelWrapper = el;
  };
  forceUpdateInvoiceToCreditRow = (rowId: string | null | undefined) => {
    const el = findReactById(rowId);

    if (el) {
      el.forceUpdateHandler();
    }
  };
  getColumns = (
    invoiceAttributes: Attributes,
    invoiceSets: InvoiceSetList | null | undefined,
    usersPermissions: UsersPermissionsType,
  ) => {
    const receivableTypeOptions = getFieldOptions(
      invoiceAttributes,
      InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
    );
    const stateOptions = getFieldOptions(
      invoiceAttributes,
      InvoiceFieldPaths.STATE,
    );
    const typeOptions = getFieldOptions(
      invoiceAttributes,
      InvoiceFieldPaths.TYPE,
    );
    const invoiceSetOptions = invoiceSets
      ? invoiceSets.map((set) => ({ ...set, invoiceset: set.id }))
      : [];
    const columns = [];

    const sortByRecipientNameAsc = (a, b) => {
      const valA = getContactFullName(a.recipientFull)
          ? getContactFullName(a.recipientFull).toLowerCase()
          : "",
        valB = getContactFullName(a.recipientFull)
          ? getContactFullName(b.recipientFull).toLowerCase()
          : "";
      return sortStringAsc(valA, valB);
    };

    const sortByRecipientNameDesc = (a, b) => {
      const valA = getContactFullName(a.recipientFull)
          ? getContactFullName(a.recipientFull).toLowerCase()
          : "",
        valB = getContactFullName(a.recipientFull)
          ? getContactFullName(b.recipientFull).toLowerCase()
          : "";
      return sortStringDesc(valA, valB);
    };

    const sortByReceivableTypesAsc = (a, b) => {
      const valA =
          formatReceivableTypesString(
            receivableTypeOptions,
            a.receivableTypes,
          ) || "",
        valB =
          formatReceivableTypesString(
            receivableTypeOptions,
            b.receivableTypes,
          ) || "";
      return sortStringAsc(valA, valB);
    };

    const sortByReceivableTypesDesc = (a, b) => {
      const valA =
          formatReceivableTypesString(
            receivableTypeOptions,
            a.receivableTypes,
          ) || "",
        valB =
          formatReceivableTypesString(
            receivableTypeOptions,
            b.receivableTypes,
          ) || "";
      return sortStringDesc(valA, valB);
    };

    const sortByTypeAsc = (a, b) => sortByOptionsAsc(a, b, "type", typeOptions);

    const sortByTypeDesc = (a, b) =>
      sortByOptionsDesc(a, b, "type", typeOptions);

    const sortByStateAsc = (a, b) =>
      sortByOptionsAsc(a, b, "state", stateOptions);

    const sortByStateDesc = (a, b) =>
      sortByOptionsDesc(a, b, "state", stateOptions);

    if (hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)) {
      columns.push({
        disabled: true,
        key: "select",
        text: "",
        renderer: (val, row, component) => {
          const { invoiceToCredit } = this.props;

          const handleRadioChange = (checked: boolean) => {
            const { onInvoiceToCreditChange } = this.props;
            const { invoiceToCreditRowId } = this.state;
            onInvoiceToCreditChange(checked ? row : null);
            this.setState(
              {
                invoiceToCreditRowId: checked ? component.props.id : null,
              },
              () => {
                component.forceUpdateHandler();

                if (component.props.id !== invoiceToCreditRowId) {
                  this.forceUpdateInvoiceToCreditRow(invoiceToCreditRowId);
                }
              },
            );
          };

          const isTableGroup = row.isTableGroup || false;
          const disabled = this.isTableRadioButtonDisabled(row);
          return (
            <SingleRadioInput
              checked={
                invoiceToCredit && invoiceToCredit.id === row.id ? true : false
              }
              disabled={disabled}
              invisibleLabel
              label={isTableGroup ? `Laskuryhmä ${row.id}` : `Lasku ${row.id}`}
              name={
                isTableGroup ? `invoice_group_${row.id}` : `invoice_${row.id}`
              }
              onChange={handleRadioChange}
            />
          );
        },
        sortable: false,
      });
    }

    if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.INVOICESET)) {
      columns.push({
        key: "invoiceset",
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        grouping: {
          key: "invoiceset",
          options: invoiceSetOptions,
          columnKeys: ["billing_period_start_date", "invoiceset", "select"],
          columnsToHide: ["invoiceset"],
        },
        text: InvoiceFieldTitles.INVOICESET,
      });
    }

    if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)) {
      columns.push({
        key: "recipientFull",
        ascSortFunction: sortByRecipientNameAsc,
        descSortFunction: sortByRecipientNameDesc,
        renderer: (val) => getContactFullName(val) || "-",
        text: InvoiceFieldTitles.RECIPIENT,
        minWidth: 190,
      });
    }

    if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)) {
      columns.push({
        key: "due_date",
        dataClassName: "no-wrap",
        renderer: (val, invoice) => (
          <FormText
            className={classNames("no-margin", {
              alert: isInvoiceOverdue(invoice),
            })}
          >
            {formatDate(val)}
          </FormText>
        ),
        text: InvoiceFieldTitles.DUE_DATE,
      });
    }

    if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NUMBER)) {
      columns.push({
        key: "number",
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: "no-wrap",
        text: "Laskunro",
      });
    }

    columns.push({
      key: "totalShare",
      ascSortFunction: sortNumberByKeyAsc,
      descSortFunction: sortNumberByKeyDesc,
      dataClassName: "no-wrap",
      renderer: (val) => (val != null ? `${formatNumber(val * 100)} %` : "-"),
      text: InvoiceFieldTitles.SHARE,
    });

    if (
      isFieldAllowedToRead(
        invoiceAttributes,
        InvoiceFieldPaths.BILLING_PERIOD_START_DATE,
      )
    ) {
      columns.push({
        key: "billing_period_start_date",
        dataClassName: "no-wrap",
        grouping: {
          key: "invoiceset",
          options: invoiceSetOptions,
          columnKeys: ["billing_period_start_date", "invoiceset", "select"],
          columnsToHide: ["invoiceset"],
        },
        renderer: (val, invoice) =>
          formatDateRange(
            invoice.billing_period_start_date,
            invoice.billing_period_end_date,
          ) || "-",
        text: InvoiceFieldTitles.BILLING_PERIOD,
      });
    }

    if (
      isFieldAllowedToRead(
        invoiceAttributes,
        InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
      )
    ) {
      columns.push({
        key: "receivableTypes",
        ascSortFunction: sortByReceivableTypesAsc,
        descSortFunction: sortByReceivableTypesDesc,
        arrayRenderer: (val) =>
          formatReceivableTypesString(receivableTypeOptions, val) || "-",
        text: InvoiceRowsFieldTitles.RECEIVABLE_TYPE,
      });
    }

    if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.TYPE)) {
      columns.push({
        key: "type",
        ascSortFunction: sortByTypeAsc,
        descSortFunction: sortByTypeDesc,
        renderer: (val) => getLabelOfOption(typeOptions, val) || "-",
        text: "Tyyppi",
      });
    }

    if (isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.STATE)) {
      columns.push({
        key: "state",
        ascSortFunction: sortByStateAsc,
        descSortFunction: sortByStateDesc,
        renderer: (val, invoice) => (
          <FormText
            className={classNames("no-margin", {
              alert: isInvoiceOverdue(invoice),
            })}
          >
            {getLabelOfOption(stateOptions, val) || "-"}
          </FormText>
        ),
        text: InvoiceFieldTitles.STATE,
      });
    }

    if (
      isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLED_AMOUNT)
    ) {
      columns.push({
        key: "billed_amount",
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: "no-wrap",
        renderer: (val, row) => (
          <AmountWithVat amount={row.billed_amount || 0} date={row.due_date} />
        ),
        text: "Laskutettu",
      });
    }

    if (
      isFieldAllowedToRead(
        invoiceAttributes,
        InvoiceFieldPaths.OUTSTANDING_AMOUNT,
      )
    ) {
      columns.push({
        key: "outstanding_amount",
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: "no-wrap",
        renderer: (val, row) => (
          <AmountWithVat
            amount={row.outstanding_amount || 0}
            date={row.due_date}
          />
        ),
        text: "Maksamatta",
      });
    }

    return columns;
  };
  handleDataUpdate = () => {
    const { invoiceToCreditRowId } = this.state;
    this.forceUpdateInvoiceToCreditRow(invoiceToCreditRowId);
    this.tableAndPanelWrapper.calculateTableHeight();
    this.scrollToOpenedRow();
  };
  handleKeyDown = (e: any) => {
    const { isPanelOpen } = this.state;
    if (!isPanelOpen) return false;

    switch (e.keyCode) {
      case KeyCodes.ARROW_LEFT:
        e.preventDefault();
        this.openPreviousInvoice();
        break;

      case KeyCodes.ARROW_RIGHT:
        e.preventDefault();
        this.openNextInvoice();
        break;

      default:
        break;
    }
  };
  openNextInvoice = () => {
    const { openedInvoice } = this.state;

    if (openedInvoice) {
      this.tableAndPanelWrapper.table.selectNext();
    }
  };
  openPreviousInvoice = () => {
    const { openedInvoice } = this.state;

    if (openedInvoice) {
      this.tableAndPanelWrapper.table.selectPrevious();
    }
  };
  selectOpenedInvoice = (invoice: Invoice) => {
    this.setState({
      openedInvoice: invoice,
    });
  };
  handleRowClick = (id: number, row: Record<string, any>) => {
    this.setState({
      isPanelOpen: true,
      openedInvoice: row,
    });
  };
  handlePanelClose = () => {
    this.setState({
      isPanelOpen: false,
    });
  };
  handlePanelClosed = () => {
    this.setState({
      openedInvoice: null,
    });
  };
  handleInvoiceLinkClick = (invoiceId: number) => {
    const { invoices } = this.state,
      selectedInvoice = invoices.find((invoice) => invoice.id === invoiceId);

    if (selectedInvoice) {
      this.setState({
        openedInvoice: selectedInvoice,
      });
    }
  };
  handleSelectRow = (row: Record<string, any>) => {
    const { onInvoiceToCreditChange } = this.props;
    onInvoiceToCreditChange(row);
  };
  isTableRadioButtonDisabled = (row: Record<string, any>) => {
    if (row.tableGroupName === "invoiceset") {
      let disabled = true;
      row.tableRows.forEach((invoice) => {
        if (invoice.type !== InvoiceType.CREDIT_NOTE) {
          disabled = false;
          return false;
        }
      });
      return disabled;
    }

    return row.type === InvoiceType.CREDIT_NOTE;
  };
  scrollToOpenedRow = () => {
    const selectedRows =
      this.tableAndPanelWrapper.table.scrollBodyWrapper.getElementsByClassName(
        "selected",
      );

    if (selectedRows.length) {
      this.scrollIntoViewIfNeeded(
        selectedRows[0],
        selectedRows[0].parentNode.parentNode.parentNode,
      );
    }
  };
  scrollIntoViewIfNeeded = (element: any, parent: any) => {
    const parentComputedStyle = window.getComputedStyle(parent, null),
      parentBorderTopWidth = parseInt(
        parentComputedStyle.getPropertyValue("border-top-width"),
      ),
      overTop = element.offsetTop - parent.offsetTop < parent.scrollTop,
      overBottom =
        element.offsetTop + element.clientHeight - parentBorderTopWidth >
        parent.scrollTop + parent.clientHeight;

    if (overTop || overBottom) {
      parent.scrollTop =
        element.offsetTop -
        parent.clientHeight / 2 -
        parentBorderTopWidth +
        element.clientHeight / 2;
    }
  };
  initilizeEditInvoiceForm = (invoice: Record<string, any>) => {
    const { initialize } = this.props;
    initialize(FormNames.LEASE_INVOICE_EDIT, invoice);
  };
  editInvoice = (invoice: Record<string, any>) => {
    const { patchInvoice } = this.props;
    patchInvoice(getPayloadEditInvoice(invoice));
  };

  render() {
    const { invoiceToCredit } = this.props;
    const { columns, isPanelOpen, invoices, openedInvoice } = this.state;
    return (
      <TableAndPanelWrapper
        ref={this.setTableAndPanelWrapperRef}
        hasData={!!invoices.length}
        isPanelOpen={isPanelOpen}
        onPanelClosed={this.handlePanelClosed}
        panelComponent={
          <InvoicePanel
            invoice={openedInvoice}
            onClose={this.handlePanelClose}
            onInvoiceLinkClick={this.handleInvoiceLinkClick}
            onSave={this.editInvoice}
          />
        }
        tableComponent={
          <SortableTable
            columns={columns}
            data={invoices}
            defaultSortKey="due_date"
            defaultSortOrder={TableSortOrder.DESCENDING}
            fixedHeader={true}
            invoiceToCredit={invoiceToCredit}
            onDataUpdate={this.handleDataUpdate}
            onRowClick={this.handleRowClick}
            onSelectNext={this.selectOpenedInvoice}
            onSelectPrevious={this.selectOpenedInvoice}
            onSelectRow={this.handleSelectRow}
            selectedRow={openedInvoice}
            sortable={true}
          />
        }
      />
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        invoiceAttributes: getInvoiceAttributes(state),
        invoiceListData: getInvoicesByLease(state, currentLease.id),
        invoiceSets: getInvoiceSetsByLease(state, currentLease.id),
        patchedInvoice: getPatchedInvoice(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      clearPatchedInvoice,
      initialize,
      patchInvoice,
    },
  ),
)(InvoiceTableAndPanel) as React.ComponentType<any>;
