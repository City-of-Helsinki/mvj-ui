import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initialize } from "redux-form";
import AmountWithVat from "@/components/vat/AmountWithVat";
import FormText from "@/components/form/FormText";
import InvoicePanel from "./InvoicePanel";
import SingleRadioInput from "@/components/inputs/SingleRadioInput";
import SortableTable, { Column } from "@/components/table/SortableTable";
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
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import Loader from "@/components/loader/Loader";
type Props = {
  invoiceToCredit: Record<string, any> | null | undefined;
  onInvoiceToCreditChange: (...args: Array<any>) => any;
};

const InvoiceTableAndPanel: React.FC<Props> = ({
  invoiceToCredit,
  onInvoiceToCreditChange,
}) => {
  const currentLease = useSelector(getCurrentLease);
  const invoiceAttributes: Attributes = useSelector(getInvoiceAttributes);
  const invoiceListData: InvoiceList | null | undefined = useSelector((state) =>
    getInvoicesByLease(state, currentLease.id),
  );
  const invoiceSets: InvoiceSetList | null | undefined = useSelector((state) =>
    getInvoiceSetsByLease(state, currentLease.id),
  );
  const patchedInvoice: Invoice | null | undefined =
    useSelector(getPatchedInvoice);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const dispatch = useDispatch();

  const tableAndPanelWrapper = useRef<TableAndPanelWrapper>(null);

  const [columns, setColumns] = useState<Array<Column>>([]);
  const [invoices, setInvoices] = useState<Array<Record<string, any>>>([]);
  const [invoiceToCreditRowId, setInvoiceToCreditRowId] = useState<
    string | null
  >(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [openedInvoice, setOpenedInvoice] = useState<Invoice | null>(null);

  const forceUpdateInvoiceToCreditRow = useCallback(
    (rowId: string | null | undefined) => {
      const el = findReactById(rowId);

      if (el) {
        el.forceUpdateHandler();
      }
    },
    [],
  );

  const getColumns = useCallback(() => {
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
          const handleRadioChange = (checked: boolean) => {
            onInvoiceToCreditChange(checked ? row : null);
            setInvoiceToCreditRowId((prevRowId) => {
              if (prevRowId !== row.id) {
                forceUpdateInvoiceToCreditRow(prevRowId);
              }
              return checked ? row.id : null;
            });
          };

          const isTableGroup = row.isTableGroup || false;
          const disabled = isTableRadioButtonDisabled(row);
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
  }, [
    invoiceAttributes,
    invoiceSets,
    usersPermissions,
    invoiceToCredit,
    onInvoiceToCreditChange,
    forceUpdateInvoiceToCreditRow,
  ]);

  const openNextInvoice = useCallback(() => {
    if (openedInvoice && tableAndPanelWrapper.current) {
      tableAndPanelWrapper.current.table.selectNext();
    }
  }, [openedInvoice]);

  const openPreviousInvoice = useCallback(() => {
    if (openedInvoice && tableAndPanelWrapper.current) {
      tableAndPanelWrapper.current.table.selectPrevious();
    }
  }, [openedInvoice]);

  const handleKeyDown = useCallback(
    (e: any) => {
      if (!isPanelOpen) return false;

      switch (e.keyCode) {
        case KeyCodes.ARROW_LEFT:
          e.preventDefault();
          openPreviousInvoice();
          break;

        case KeyCodes.ARROW_RIGHT:
          e.preventDefault();
          openNextInvoice();
          break;

        default:
          break;
      }
    },
    [isPanelOpen, openNextInvoice, openPreviousInvoice],
  );

  const initilizeEditInvoiceForm = useCallback(
    (invoice: Record<string, any>) => {
      dispatch(initialize(FormNames.LEASE_INVOICE_EDIT, invoice));
    },
    [dispatch],
  );

  const scrollToOpenedRow = useCallback(() => {
    if (!tableAndPanelWrapper.current) return;
    const selectedRows =
      tableAndPanelWrapper.current.table.scrollBodyWrapper.getElementsByClassName(
        "selected",
      );

    if (selectedRows.length) {
      scrollIntoViewIfNeeded(
        selectedRows[0],
        selectedRows[0].parentNode.parentNode.parentNode,
      );
    }
  }, [tableAndPanelWrapper]);

  useEffect(() => {
    const invoices = getContentInvoices(invoiceListData || []);
    setInvoices(invoices);
  }, [invoiceListData]);

  useEffect(() => {
    dispatch(clearPatchedInvoice());
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, handleKeyDown]);

  useEffect(() => {
    if (tableAndPanelWrapper.current) {
      if (openedInvoice) {
        tableAndPanelWrapper.current.scrollToPanel();
      }
      scrollToOpenedRow();
      tableAndPanelWrapper.current.calculateTableHeight();
      tableAndPanelWrapper.current.calculateTableWidth();
      initilizeEditInvoiceForm(openedInvoice);
    }
  }, [initilizeEditInvoiceForm, openedInvoice, scrollToOpenedRow]);

  useEffect(() => {
    if (patchedInvoice) {
      initilizeEditInvoiceForm(getContentIncoive(patchedInvoice));
      dispatch(clearPatchedInvoice());
    }
  }, [dispatch, initilizeEditInvoiceForm, patchedInvoice]);

  useEffect(() => {
    setColumns(getColumns());
  }, [getColumns]);

  const handleDataUpdate = useCallback(() => {
    if (tableAndPanelWrapper.current) {
      forceUpdateInvoiceToCreditRow(invoiceToCreditRowId);
      tableAndPanelWrapper.current.calculateTableHeight();
      scrollToOpenedRow();
    }
  }, [forceUpdateInvoiceToCreditRow, invoiceToCreditRowId, scrollToOpenedRow]);

  const selectOpenedInvoice = (invoice: Invoice) => {
    setOpenedInvoice(invoice);
  };

  const handleRowClick = (id: number, row: Record<string, any>) => {
    setIsPanelOpen(true);
    setOpenedInvoice(row);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
  };

  const handlePanelClosed = () => {
    setOpenedInvoice(null);
  };

  const handleInvoiceLinkClick = (invoiceId: number) => {
    const selectedInvoice = invoices.find(
      (invoice) => invoice.id === invoiceId,
    );

    if (selectedInvoice) {
      setOpenedInvoice(selectedInvoice);
    }
  };

  const handleSelectRow = (row: Record<string, any>) => {
    onInvoiceToCreditChange(row);
  };

  const isTableRadioButtonDisabled = (row: Record<string, any>) => {
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

  const scrollIntoViewIfNeeded = (element: any, parent: any) => {
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

  const editInvoice = (invoice: Record<string, any>) => {
    dispatch(patchInvoice(getPayloadEditInvoice(invoice)));
  };

  if (!invoiceListData) {
    return (
      <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>
    );
  }

  return (
    <TableAndPanelWrapper
      ref={tableAndPanelWrapper}
      hasData={!!invoices.length}
      isPanelOpen={isPanelOpen}
      onPanelClosed={handlePanelClosed}
      panelComponent={
        <InvoicePanel
          invoice={openedInvoice}
          onClose={handlePanelClose}
          onInvoiceLinkClick={handleInvoiceLinkClick}
          onSave={editInvoice}
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
          onDataUpdate={handleDataUpdate}
          onRowClick={handleRowClick}
          onSelectNext={selectOpenedInvoice}
          onSelectPrevious={selectOpenedInvoice}
          onSelectRow={handleSelectRow}
          selectedRow={openedInvoice}
          sortable={true}
        />
      }
    />
  );
};

export default InvoiceTableAndPanel;
