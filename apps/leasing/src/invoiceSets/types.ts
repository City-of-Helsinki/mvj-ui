export type InvoiceSetState = {
  byLease: InvoiceSetListMap;
  isFetching: boolean;
};
export type InvoiceSetList = Array<Record<string, any>>;
export type InvoiceSetListMap = Record<number, InvoiceSetList>;
