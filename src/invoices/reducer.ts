import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "@/types";
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  Invoice,
  InvoiceListMap,
  ReceiveInvoicesByLeaseAction,
  ReceiveInvoiceToCreditAction,
  ReceiveIsCreateInvoicePanelOpenAction,
  ReceiveIsCreditInvoicePanelOpenAction,
  ReceiveIsCreateClickedAction,
  ReceiveIsCreditClickedAction,
  ReceiveIsEditClickedAction,
  ReceivePatchedInvoiceAction,
} from "./types";
const isFetchingReducer: Reducer<boolean> = handleActions(
  {
    "mvj/invoices/CREATE": () => true,
    "mvj/invoices/FETCH_BY_LEASE": () => true,
    "mvj/invoices/NOT_FOUND": () => false,
    "mvj/invoices/RECEIVE_BY_LEASE": () => false,
  },
  false,
);
const isSavingReducer: Reducer<boolean> = handleActions(
  {
    "mvj/invoices/PATCH": () => true,
    "mvj/invoices/EXPORT_TO_LASKE_AND_UPDATE": () => true,
    "mvj/invoices/NOT_FOUND": () => false,
    "mvj/invoices/RECEIVE_BY_LEASE": () => false,
    "mvj/invoices/DELETE": () => true,
  },
  false,
);
const isFetchingAttributesReducer: Reducer<boolean> = handleActions(
  {
    "mvj/invoices/FETCH_ATTRIBUTES": () => true,
    "mvj/invoices/RECEIVE_ATTRIBUTES": () => false,
    "mvj/invoices/RECEIVE_METHODS": () => false,
    "mvj/invoices/ATTRIBUTES_NOT_FOUND": () => false,
  },
  false,
);
const isCreatePanelOpenReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/invoices/RECEIVE_IS_CREATE_PANEL_OPEN"]: (
      state: boolean,
      { payload: isOpen }: ReceiveIsCreateInvoicePanelOpenAction,
    ) => {
      return isOpen;
    },
  },
  false,
);
const isCreditPanelOpenReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/invoices/RECEIVE_IS_CREDIT_PANEL_OPEN"]: (
      state: boolean,
      { payload: isOpen }: ReceiveIsCreditInvoicePanelOpenAction,
    ) => {
      return isOpen;
    },
  },
  false,
);
const isCreateClickedReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/invoices/RECEIVE_CREATE_CLICKED"]: (
      state: boolean,
      { payload: isClicked }: ReceiveIsCreateClickedAction,
    ) => {
      return isClicked;
    },
  },
  false,
);
const isCreditClickedReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/invoices/RECEIVE_CREDIT_CLICKED"]: (
      state: boolean,
      { payload: isClicked }: ReceiveIsCreditClickedAction,
    ) => {
      return isClicked;
    },
  },
  false,
);
const isEditClickedReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/invoices/RECEIVE_EDIT_CLICKED"]: (
      state: boolean,
      { payload: isClicked }: ReceiveIsEditClickedAction,
    ) => {
      return isClicked;
    },
  },
  false,
);
const attributesReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/invoices/RECEIVE_ATTRIBUTES"]: (
      state: Attributes,
      { payload: attributes }: ReceiveAttributesAction,
    ) => {
      return attributes;
    },
  },
  null,
);
const methodsReducer: Reducer<Methods> = handleActions(
  {
    ["mvj/invoices/RECEIVE_METHODS"]: (
      state: Methods,
      { payload: methods }: ReceiveMethodsAction,
    ) => {
      return methods;
    },
  },
  null,
);
const byLeaseReducer: Reducer<InvoiceListMap> = handleActions(
  {
    ["mvj/invoices/RECEIVE_BY_LEASE"]: (
      state: InvoiceListMap,
      { payload }: ReceiveInvoicesByLeaseAction,
    ) => {
      return { ...state, [payload.leaseId]: payload.invoices };
    },
  },
  {},
);
const invoiceToCreditReducer: Reducer<string | null | undefined> =
  handleActions(
    {
      ["mvj/invoices/RECEIVE_INVOICE_TO_CREDIT"]: (
        state: string | null | undefined,
        { payload: invoiceId }: ReceiveInvoiceToCreditAction,
      ) => {
        return invoiceId;
      },
    },
    null,
  );
const patchedInvoiceReducer: Reducer<Invoice | null | undefined> =
  handleActions(
    {
      ["mvj/invoices/RECEIVE_PATCHED"]: (
        state: Invoice | null | undefined,
        { payload: invoice }: ReceivePatchedInvoiceAction,
      ) => {
        return invoice;
      },
      "mvj/invoices/CLEAR_PATCHED": () => null,
    },
    null,
  );
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  byLease: byLeaseReducer,
  invoiceToCredit: invoiceToCreditReducer,
  isCreateClicked: isCreateClickedReducer,
  isCreatePanelOpen: isCreatePanelOpenReducer,
  isCreditClicked: isCreditClickedReducer,
  isCreditPanelOpen: isCreditPanelOpenReducer,
  isSaving: isSavingReducer,
  isEditClicked: isEditClickedReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
  patchedInvoice: patchedInvoiceReducer,
});
