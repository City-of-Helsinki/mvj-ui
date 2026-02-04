import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Button from "@/components/button/Button";
import Collapse from "@/components/collapse/Collapse";
import CreateAndCreditInvoice from "./CreateAndCreditInvoice";
import CreateCollectionLetter from "./CreateCollectionLetter";
import DebtCollection from "./DebtCollection";
import Divider from "@/components/content/Divider";
import InvoiceNotes from "./InvoiceNotes";
import InvoiceSimulator from "@/components/invoice-simulator/InvoiceSimulator";
import InvoiceTableAndPanel from "./InvoiceTableAndPanel";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import SuccessField from "@/components/form/SuccessField";
import Title from "@/components/content/Title";
import WarningContainer from "@/components/content/WarningContainer";
import WarningField from "@/components/form/WarningField";
import { fetchCollectionCourtDecisionsByLease } from "@/collectionCourtDecision/actions";
import { fetchCollectionLettersByLease } from "@/collectionLetter/actions";
import { fetchCollectionNotesByLease } from "@/collectionNote/actions";
import { fetchInvoiceSetsByLease } from "@/invoiceSets/actions";
import {
  receiveInvoiceToCredit,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditInvoicePanelOpen,
} from "@/invoices/actions";
import {
  receiveCollapseStates,
  startInvoicing as startInvoicingForLease,
  stopInvoicing as stopInvoicingForLease,
} from "@/leases/actions";
import {
  ConfirmationModalTexts,
  PermissionMissingTexts,
  ViewModes,
} from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  LeaseInvoiceNotesFieldPaths,
  LeaseInvoiceNotesFieldTitles,
  LeaseInvoicingFieldPaths,
  LeaseInvoicingFieldTitles,
  LeaseRentsFieldPaths,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentInvoiceNotes } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { hasPermissions, isFieldAllowedToRead } from "@/util/helpers";
import { getCollectionCourtDecisionsByLease } from "@/collectionCourtDecision/selectors";
import { getCollectionLettersByLease } from "@/collectionLetter/selectors";
import { getCollectionNotesByLease } from "@/collectionNote/selectors";
import { getInvoiceToCredit } from "@/invoices/selectors";
import { getInvoiceSetsByLease } from "@/invoiceSets/selectors";
import {
  getAttributes as getLeaseAttributes,
  getCollapseStateByKey,
  getCurrentLease,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";

import {
  getAttributes as getCollectionCourtDecisionAttributes,
  getIsFetchingAttributes as getIsFetchingCollectionCourtDecisionAttributes,
} from "@/collectionCourtDecision/selectors";
import {
  getAttributes as getCollectionLetterAttributes,
  getIsFetchingAttributes as getIsFetchingCollectionLetterAttributes,
} from "@/collectionLetter/selectors";
import {
  getAttributes as getCollectionNoteAttributes,
  getIsFetchingAttributes as getIsFetchingCollectionNoteAttributes,
} from "@/collectionNote/selectors";
import {
  getAttributes as getCreateCollectionLetterAttributes,
  getIsFetchingAttributes as getIsFetchingCreateCollectionLetterAttributes,
} from "@/createCollectionLetter/selectors";
import {
  getAttributes as getInvoiceNoteAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceNoteAttributes,
} from "@/invoiceNote/selectors";
import {
  getAttributes as getLeaseCreateChargeAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseCreateChargeAttributes,
} from "@/leaseCreateCharge/selectors";
import { fetchAttributes as fetchCollectionCourtDecisionAttributes } from "@/collectionCourtDecision/actions";
import { fetchAttributes as fetchCollectionLetterAttributes } from "@/collectionLetter/actions";
import { fetchAttributes as fetchCollectionNoteAttributes } from "@/collectionNote/actions";
import { fetchAttributes as fetchCreateCollectionLetterAttributes } from "@/createCollectionLetter/actions";
import { fetchAttributes as fetchInvoiceNoteAttributes } from "@/invoiceNote/actions";
import { fetchAttributes as fetchLeaseCreateChargeAttributes } from "@/leaseCreateCharge/actions";

const Invoices: React.FC = () => {
  const currentLease: Lease = useSelector(getCurrentLease);
  const collectionCourtDecisions = useSelector((state) =>
    getCollectionCourtDecisionsByLease(state, currentLease.id),
  );
  const collectionLetters = useSelector((state) =>
    getCollectionLettersByLease(state, currentLease.id),
  );
  const collectionNotes = useSelector((state) =>
    getCollectionNotesByLease(state, currentLease.id),
  );
  const invoiceSets = useSelector((state) =>
    getInvoiceSetsByLease(state, currentLease.id),
  );
  const invoicesCollapseState = useSelector((state) =>
    getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoices`),
  );
  const invoiceNotesCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.READONLY}.invoices.invoice_notes`,
    ),
  );
  const invoiceToCredit = useSelector(getInvoiceToCredit);

  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const previewInvoicesCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.READONLY}.invoices.preview_invoices`,
    ),
  );
  const usersPermissions = useSelector(getUsersPermissions);

  const isInvoicingEnabled = useMemo(() => {
    return currentLease ? !!currentLease.invoicing_enabled_at : null;
  }, [currentLease]);

  const [invoiceNotes, setInvoiceNotes] = useState<Array<Record<string, any>>>(
    [],
  );

  const dispatch = useDispatch();

  const [
    isFetchingLeaseInvoiceTabAttributes,
    setIsFetchingLeaseInvoiceTabAttributes,
  ] = useState<boolean>(false);

  const collectionCourtDecisionAttributes = useSelector(
    getCollectionCourtDecisionAttributes,
  );
  const collectionLetterAttributes = useSelector(getCollectionLetterAttributes);
  const collectionNoteAttributes = useSelector(getCollectionNoteAttributes);
  const createCollectionLetterAttributes = useSelector(
    getCreateCollectionLetterAttributes,
  );
  const invoiceNoteAttributes = useSelector(getInvoiceNoteAttributes);
  const isFetchingCollectionCourtDecisionAttributes = useSelector(
    getIsFetchingCollectionCourtDecisionAttributes,
  );
  const isFetchingCollectionLetterAttributes = useSelector(
    getIsFetchingCollectionLetterAttributes,
  );
  const isFetchingCollectionNoteAttributes = useSelector(
    getIsFetchingCollectionNoteAttributes,
  );
  const isFetchingCreateCollectionLetterAttributes = useSelector(
    getIsFetchingCreateCollectionLetterAttributes,
  );
  const isFetchingInvoiceNoteAttributes = useSelector(
    getIsFetchingInvoiceNoteAttributes,
  );
  const isFetchingLeaseCreateChargeAttributes = useSelector(
    getIsFetchingLeaseCreateChargeAttributes,
  );

  const leaseCreateChargeAttributes = useSelector(
    getLeaseCreateChargeAttributes,
  );

  useEffect(() => {
    const isFetching =
      isFetchingCollectionCourtDecisionAttributes ||
      isFetchingCollectionLetterAttributes ||
      isFetchingCollectionNoteAttributes ||
      isFetchingCreateCollectionLetterAttributes ||
      isFetchingInvoiceNoteAttributes ||
      isFetchingLeaseCreateChargeAttributes;
    setIsFetchingLeaseInvoiceTabAttributes(isFetching);
  }, [
    isFetchingCollectionCourtDecisionAttributes,
    isFetchingCollectionLetterAttributes,
    isFetchingCollectionNoteAttributes,
    isFetchingCreateCollectionLetterAttributes,
    isFetchingInvoiceNoteAttributes,
    isFetchingLeaseCreateChargeAttributes,
  ]);

  useEffect(() => {
    if (
      !isFetchingCollectionCourtDecisionAttributes &&
      !collectionCourtDecisionAttributes
    ) {
      dispatch(fetchCollectionCourtDecisionAttributes());
    }

    if (!isFetchingCollectionLetterAttributes && !collectionLetterAttributes) {
      dispatch(fetchCollectionLetterAttributes());
    }

    if (!isFetchingCollectionNoteAttributes && !collectionNoteAttributes) {
      dispatch(fetchCollectionNoteAttributes());
    }

    if (
      !isFetchingCreateCollectionLetterAttributes &&
      !createCollectionLetterAttributes
    ) {
      dispatch(fetchCreateCollectionLetterAttributes());
    }

    if (!isFetchingInvoiceNoteAttributes && !invoiceNoteAttributes) {
      dispatch(fetchInvoiceNoteAttributes());
    }

    if (
      !isFetchingLeaseCreateChargeAttributes &&
      !leaseCreateChargeAttributes
    ) {
      dispatch(fetchLeaseCreateChargeAttributes());
    }
  }, [
    dispatch,
    isFetchingCollectionCourtDecisionAttributes,
    collectionCourtDecisionAttributes,
    isFetchingCollectionLetterAttributes,
    collectionLetterAttributes,
    isFetchingCollectionNoteAttributes,
    collectionNoteAttributes,
    isFetchingCreateCollectionLetterAttributes,
    createCollectionLetterAttributes,
    isFetchingInvoiceNoteAttributes,
    invoiceNoteAttributes,
    isFetchingLeaseCreateChargeAttributes,
    leaseCreateChargeAttributes,
  ]);

  useEffect(() => {
    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICESET) &&
      !invoiceSets
    ) {
      dispatch(fetchInvoiceSetsByLease(currentLease.id));
    }

    if (
      hasPermissions(
        usersPermissions,
        UsersPermissions.VIEW_COLLECTIONCOURTDECISION,
      ) &&
      !collectionCourtDecisions
    ) {
      dispatch(fetchCollectionCourtDecisionsByLease(currentLease.id));
    }

    if (
      hasPermissions(
        usersPermissions,
        UsersPermissions.VIEW_COLLECTIONLETTER,
      ) &&
      !collectionLetters
    ) {
      dispatch(fetchCollectionLettersByLease(currentLease.id));
    }

    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONNOTE) &&
      !collectionNotes
    ) {
      dispatch(fetchCollectionNotesByLease(currentLease.id));
    }

    dispatch(receiveIsCreateInvoicePanelOpen(false));
    dispatch(receiveIsCreditInvoicePanelOpen(false));
    dispatch(receiveInvoiceToCredit(null));
    setInvoiceNotes(getContentInvoiceNotes(currentLease));
  }, [
    collectionCourtDecisions,
    collectionLetters,
    collectionNotes,
    currentLease,
    dispatch,
    invoiceSets,
    usersPermissions,
  ]);

  const handleCollapseToggle = (key: string, val: boolean) => {
    dispatch(
      receiveCollapseStates({
        [ViewModes.READONLY]: {
          invoices: {
            [key]: val,
          },
        },
      }),
    );
  };

  const handleInvoicesCollapseToggle = (val: boolean) => {
    handleCollapseToggle("invoices", val);
  };

  const handleInvoiceNotesCollapseToggle = (val: boolean) => {
    handleCollapseToggle("invoice_notes", val);
  };

  const handlePreviewInvoicesCollapseToggle = (val: boolean) => {
    handleCollapseToggle("preview_invoices", val);
  };

  const handleInvoiceToCreditChange = (val: string) => {
    dispatch(receiveInvoiceToCredit(val));
  };

  const startInvoicing = () => {
    dispatch(startInvoicingForLease(currentLease.id));
  };

  const stopInvoicing = () => {
    dispatch(stopInvoicingForLease(currentLease.id));
  };

  if (isFetchingLeaseInvoiceTabAttributes)
    return (
      <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>
    );
  if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE))
    return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        const handleStartInvoicing = () => {
          appDispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              startInvoicing();
            },
            confirmationModalButtonClassName: ButtonColors.SUCCESS,
            confirmationModalButtonText:
              ConfirmationModalTexts.START_INVOICING.BUTTON,
            confirmationModalLabel:
              ConfirmationModalTexts.START_INVOICING.LABEL,
            confirmationModalTitle:
              ConfirmationModalTexts.START_INVOICING.TITLE,
          });
        };

        const handleStopInvoicing = () => {
          appDispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              stopInvoicing();
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText:
              ConfirmationModalTexts.STOP_INVOICING.BUTTON,
            confirmationModalLabel: ConfirmationModalTexts.STOP_INVOICING.LABEL,
            confirmationModalTitle: ConfirmationModalTexts.STOP_INVOICING.TITLE,
          });
        };

        return (
          <>
            <Title
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.INVOICING)}
            >
              {LeaseInvoicingFieldTitles.INVOICING}
            </Title>
            <WarningContainer
              alignCenter
              buttonComponent={
                <Authorization
                  allow={hasPermissions(
                    usersPermissions,
                    UsersPermissions.CHANGE_LEASE_INVOICING_ENABLED_AT,
                  )}
                >
                  {isInvoicingEnabled ? (
                    <Button
                      className={ButtonColors.NEUTRAL}
                      onClick={handleStopInvoicing}
                      text="Keskeytä laskutus"
                    />
                  ) : (
                    <Button
                      disabled={!currentLease.rent_info_completed_at}
                      className={ButtonColors.NEUTRAL}
                      onClick={handleStartInvoicing}
                      text="Käynnistä laskutus"
                    />
                  )}
                </Authorization>
              }
              success={isInvoicingEnabled}
            >
              <Authorization
                allow={
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseInvoicingFieldPaths.INVOICING_ENABLED_AT,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentsFieldPaths.RENT_INFO_COMPLETED_AT,
                  )
                }
              >
                {isInvoicingEnabled && currentLease.rent_info_completed_at ? (
                  <SuccessField
                    meta={{
                      warning: LeaseInvoicingFieldTitles.INVOICING_ENABLED,
                    }}
                    showWarning={true}
                  />
                ) : currentLease.rent_info_completed_at ? (
                  <WarningField
                    meta={{
                      warning: LeaseInvoicingFieldTitles.INVOICING_DISABLED,
                    }}
                    showWarning={true}
                  />
                ) : (
                  <WarningField
                    meta={{
                      warning:
                        LeaseInvoicingFieldTitles.INVOICING_INCOMPLETE_INFO,
                    }}
                    showWarning={true}
                  />
                )}
              </Authorization>
            </WarningContainer>
            <Divider />

            <Collapse
              defaultOpen={
                invoicesCollapseState !== undefined
                  ? invoicesCollapseState
                  : true
              }
              headerTitle={LeaseInvoicingFieldTitles.INVOICES}
              onToggle={handleInvoicesCollapseToggle}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.INVOICES)}
            >
              <InvoiceTableAndPanel
                invoiceToCredit={invoiceToCredit}
                onInvoiceToCreditChange={handleInvoiceToCreditChange}
              />
              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.ADD_INVOICE,
                )}
              >
                <CreateAndCreditInvoice invoiceToCredit={invoiceToCredit} />
              </Authorization>
            </Collapse>

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.VIEW_INVOICENOTE,
              )}
            >
              <Collapse
                defaultOpen={
                  invoiceNotesCollapseState !== undefined
                    ? invoiceNotesCollapseState
                    : true
                }
                headerTitle={`${LeaseInvoiceNotesFieldTitles.INVOICE_NOTES} (${invoiceNotes.length})`}
                onToggle={handleInvoiceNotesCollapseToggle}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseInvoiceNotesFieldPaths.INVOICE_NOTES,
                )}
              >
                <InvoiceNotes
                  initialValues={{
                    invoice_notes: invoiceNotes,
                  }}
                  invoiceNotes={invoiceNotes}
                />
              </Collapse>
            </Authorization>

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.VIEW_INVOICE,
              )}
            >
              <Collapse
                defaultOpen={
                  previewInvoicesCollapseState !== undefined
                    ? previewInvoicesCollapseState
                    : true
                }
                headerTitle={LeaseInvoicingFieldTitles.PREVIEW_INVOICES}
                onToggle={handlePreviewInvoicesCollapseToggle}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseInvoicingFieldPaths.PREVIEW_INVOICES,
                )}
              >
                <InvoiceSimulator />
              </Collapse>
            </Authorization>
            <Authorization
              allow={
                hasPermissions(
                  usersPermissions,
                  UsersPermissions.VIEW_COLLECTIONCOURTDECISION,
                ) ||
                hasPermissions(
                  usersPermissions,
                  UsersPermissions.VIEW_COLLECTIONLETTER,
                ) ||
                hasPermissions(
                  usersPermissions,
                  UsersPermissions.VIEW_COLLECTIONNOTE,
                )
              }
            >
              <>
                <Title
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseInvoicingFieldPaths.DEBT_COLLECTION,
                  )}
                >
                  {LeaseInvoicingFieldTitles.DEBT_COLLECTION}
                </Title>
                <Divider />
                <DebtCollection />
                <Authorization
                  allow={hasPermissions(
                    usersPermissions,
                    UsersPermissions.ADD_COLLECTIONLETTER,
                  )}
                >
                  <CreateCollectionLetter />
                </Authorization>
              </>
            </Authorization>
          </>
        );
      }}
    </AppConsumer>
  );
};

export default Invoices;
