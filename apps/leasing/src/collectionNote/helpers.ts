export const getPayloadCollectionNote = (
  collectionNote: any,
  leaseId: number,
): any => {
  const payload = {
    lease: leaseId,
    note: collectionNote.note,
    collection_stage: collectionNote.collection_stage,
    sent_date: collectionNote.sent_date,
    inspection_date: collectionNote.inspection_date,
    postpone_date: collectionNote.postpone_date,
    entire_lease: collectionNote.entire_lease,
    // invoices: collectionNote.invoices,
    invoices: Array.isArray(collectionNote.invoices) //TODO, find a better way to handle array vs single value.
      ? collectionNote.invoices
      : collectionNote.invoices != null
        ? [collectionNote.invoices]
        : [],
  };
  return payload;
};
