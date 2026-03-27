import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import AddButton from "@/components/form/AddButton";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import CreditInvoiceForm from "./forms/CreditInvoiceForm";
import NewInvoiceForm from "./forms/NewInvoiceForm";
import { createCharge } from "@/leases/actions";
import {
  createInvoice,
  creditInvoice,
  deleteInvoice,
  receiveIsCreateClicked,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditClicked,
  receiveIsCreditInvoicePanelOpen,
} from "@/invoices/actions";
import { creditInvoiceSet } from "@/invoiceSets/actions";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { RecipientOptions } from "@/leases/enums";
import {
  getPayloadCreateInvoice,
  getPayloadCreditInvoice,
} from "@/invoices/helpers";
import { getCreditInvoiceSetPayload } from "@/invoiceSets/helpers";
import { getPayloadLeaseCreateCharge } from "@/leaseCreateCharge/helpers";
import { hasPermissions } from "@/util/helpers";
import { getCurrentLease } from "@/leases/selectors";
import {
  getIsCreateInvoicePanelOpen,
  getIsCreditInvoicePanelOpen,
} from "@/invoices/selectors";
import {
  getUserActiveServiceUnit,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import { AppConsumer, ActionTypes } from "@/app/AppContext";
import { ConfirmationModalTexts } from "@/enums";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  invoiceToCredit: Record<string, any> | null | undefined;
};

const CreateAndCreditInvoice: React.FC<Props> = ({ invoiceToCredit }) => {
  const currentLease: Lease = useSelector(getCurrentLease);
  const isCreateInvoicePanelOpen = useSelector(getIsCreateInvoicePanelOpen);
  const isCreditInvoicePanelOpen = useSelector(getIsCreditInvoicePanelOpen);
  const isInvoicingEnabled = currentLease
    ? !!currentLease.invoicing_enabled_at
    : null;
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);
  const activeServiceUnit = useSelector(getUserActiveServiceUnit);

  const creditPanel = useRef<HTMLDivElement | null>(null);
  const creditPanelFirstField = useRef<HTMLElement | null>(null);
  const createPanel = useRef<HTMLDivElement | null>(null);
  const createPanelFirstField = useRef<HTMLElement | null>(null);

  const dispatch = useDispatch();

  const isServiceUnitSameAsActiveServiceUnit = () => {
    return activeServiceUnit?.id === currentLease?.service_unit?.id;
  };

  const setCreatePanelRef = (el: HTMLDivElement | null) => {
    createPanel.current = el;
  };

  const setCreditPanelRef = (el: HTMLDivElement | null) => {
    creditPanel.current = el;
  };

  const handleOpenCreateInvoicePanelButtonClick = () => {
    dispatch(receiveIsCreateClicked(false));
    dispatch(receiveIsCreateInvoicePanelOpen(true));
    setTimeout(() => {
      if (createPanel.current) {
        const panelRect = createPanel.current.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: panelRect.top + scrollTop - 200,
          behavior: "smooth",
        });
      }
      setFocusOnCreatePanel();
    }, 50);
  };

  const handleSetRefForCreatePanelFirstField = (
    element: HTMLElement | null,
  ) => {
    createPanelFirstField.current = element;
  };

  const setFocusOnCreatePanel = () => {
    if (createPanelFirstField.current) {
      createPanelFirstField.current.focus();
    }
  };

  const handleCloseCreateInvoicePanel = () => {
    dispatch(receiveIsCreateInvoicePanelOpen(false));
  };

  const handleCreateInvoice = (invoice: Record<string, any>) => {
    invoice.lease = currentLease.id;

    if (invoice.tenant === RecipientOptions.ALL) {
      dispatch(
        createCharge({
          leaseId: currentLease.id,
          data: getPayloadLeaseCreateCharge(invoice),
        }),
      );
    } else {
      const { recipient, ...getInvoiceTenant } = invoice;
      dispatch(createInvoice(getPayloadCreateInvoice(getInvoiceTenant)));
    }
  };

  const handleOpenCreditInvoicePanelButtonClick = () => {
    dispatch(receiveIsCreditClicked(false));
    dispatch(receiveIsCreditInvoicePanelOpen(true));
    setTimeout(() => {
      if (creditPanel.current) {
        const panelRect = creditPanel.current.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: panelRect.top + scrollTop - 200,
          behavior: "smooth",
        });
      }
      setFocusOnCreditPanel();
    }, 50);
  };

  const handleDeleteInvoicePanelButtonClick = () => {
    dispatch(deleteInvoice({ ...invoiceToCredit, lease: currentLease.id }));
  };

  const handleSetRefForCreditPanelFirstField = (
    element: HTMLElement | null,
  ) => {
    creditPanelFirstField.current = element;
  };

  const setFocusOnCreditPanel = () => {
    if (creditPanelFirstField.current) {
      creditPanelFirstField.current.focus();
    }
  };

  const handleCloseCreditInvoicePanel = () => {
    dispatch(receiveIsCreditInvoicePanelOpen(false));
  };

  const isInvoiceSet = () => {
    return invoiceToCredit && invoiceToCredit.tableGroupName ? true : false;
  };

  const handleCreditInvoice = (creditInvoiceData: Record<string, any>) => {
    if (isInvoiceSet()) {
      dispatch(
        creditInvoiceSet({
          creditData: getCreditInvoiceSetPayload(creditInvoiceData),
          invoiceSetId: invoiceToCredit && invoiceToCredit.id,
          lease: currentLease.id,
        }),
      );
    } else {
      dispatch(
        creditInvoice({
          creditData: getPayloadCreditInvoice(creditInvoiceData),
          invoiceId: invoiceToCredit && invoiceToCredit.id,
          lease: currentLease.id,
        }),
      );
    }
  };

  return (
    <div className="invoice__new-invoice">
      <Authorization
        allow={
          hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE) &&
          isServiceUnitSameAsActiveServiceUnit()
        }
      >
        <Button
          className={`${ButtonColors.NEUTRAL} no-margin`}
          disabled={!invoiceToCredit || isCreditInvoicePanelOpen}
          onClick={handleOpenCreditInvoicePanelButtonClick}
          text="Hyvitä lasku"
        />
      </Authorization>

      <AppConsumer>
        {({ dispatch: appDispatch }) => {
          const handleDelete = () => {
            appDispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                handleDeleteInvoicePanelButtonClick();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText:
                ConfirmationModalTexts.DELETE_INVOICE.BUTTON,
              confirmationModalLabel:
                ConfirmationModalTexts.DELETE_INVOICE.LABEL,
              confirmationModalTitle:
                ConfirmationModalTexts.DELETE_INVOICE.TITLE,
            });
          };

          return (
            <Authorization
              allow={
                hasPermissions(
                  usersPermissions,
                  UsersPermissions.DELETE_INVOICE,
                ) && isServiceUnitSameAsActiveServiceUnit()
              }
            >
              <Button
                className={ButtonColors.ALERT}
                disabled={
                  !invoiceToCredit ||
                  isCreditInvoicePanelOpen ||
                  invoiceToCredit.number
                }
                onClick={handleDelete}
                text="Poista lasku"
              />
            </Authorization>
          );
        }}
      </AppConsumer>

      <Authorization
        allow={
          hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE) &&
          isServiceUnitSameAsActiveServiceUnit()
        }
      >
        <div ref={setCreditPanelRef}>
          {isCreditInvoicePanelOpen && (
            <CreditInvoiceForm
              invoiceToCredit={invoiceToCredit}
              isInvoiceSet={isInvoiceSet}
              onClose={handleCloseCreditInvoicePanel}
              onSave={handleCreditInvoice}
              setRefForFirstField={handleSetRefForCreditPanelFirstField}
            />
          )}
        </div>
      </Authorization>

      <Authorization
        allow={
          hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE) &&
          isServiceUnitSameAsActiveServiceUnit()
        }
      >
        <Row>
          <Column>
            <AddButton
              disabled={isCreateInvoicePanelOpen || !isInvoicingEnabled}
              label="Luo lasku"
              onClick={handleOpenCreateInvoicePanelButtonClick}
              style={{
                marginTop: 15,
              }}
            />
          </Column>
        </Row>
      </Authorization>

      <Authorization
        allow={
          hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE) &&
          isServiceUnitSameAsActiveServiceUnit()
        }
      >
        <div ref={setCreatePanelRef}>
          {isCreateInvoicePanelOpen && (
            <NewInvoiceForm
              onClose={handleCloseCreateInvoicePanel}
              onSave={handleCreateInvoice}
              setRefForFirstField={handleSetRefForCreatePanelFirstField}
            />
          )}
        </div>
      </Authorization>
    </div>
  );
};

export default CreateAndCreditInvoice;
