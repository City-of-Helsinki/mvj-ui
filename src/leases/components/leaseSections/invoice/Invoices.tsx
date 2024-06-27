import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import Authorization from "/src/components/authorization/Authorization";
import AuthorizationError from "/src/components/authorization/AuthorizationError";
import Button from "/src/components/button/Button";
import Collapse from "/src/components/collapse/Collapse";
import CreateAndCreditInvoice from "./CreateAndCreditInvoice";
import CreateCollectionLetter from "./CreateCollectionLetter";
import DebtCollection from "./DebtCollection";
import Divider from "/src/components/content/Divider";
import InvoiceNotes from "./InvoiceNotes";
import InvoiceSimulator from "/src/components/invoice-simulator/InvoiceSimulator";
import InvoiceTableAndPanel from "./InvoiceTableAndPanel";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import SuccessField from "/src/components/form/SuccessField";
import Title from "/src/components/content/Title";
import WarningContainer from "/src/components/content/WarningContainer";
import WarningField from "/src/components/form/WarningField";
import { fetchCollectionCourtDecisionsByLease } from "/src/collectionCourtDecision/actions";
import { fetchCollectionLettersByLease } from "/src/collectionLetter/actions";
import { fetchCollectionNotesByLease } from "/src/collectionNote/actions";
import { fetchInvoiceSetsByLease } from "/src/invoiceSets/actions";
import { receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen } from "/src/invoices/actions";
import { receiveCollapseStates, startInvoicing, stopInvoicing } from "leases/actions";
import { ConfirmationModalTexts, PermissionMissingTexts, ViewModes } from "enums";
import { ButtonColors } from "/src/components/enums";
import { LeaseInvoiceNotesFieldPaths, LeaseInvoiceNotesFieldTitles, LeaseInvoicingFieldPaths, LeaseInvoicingFieldTitles, LeaseRentsFieldPaths } from "leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getContentInvoiceNotes } from "leases/helpers";
import { getUiDataLeaseKey } from "uiData/helpers";
import { hasPermissions, isFieldAllowedToRead } from "util/helpers";
import { getCollectionCourtDecisionsByLease } from "/src/collectionCourtDecision/selectors";
import { getCollectionLettersByLease } from "/src/collectionLetter/selectors";
import { getCollectionNotesByLease } from "/src/collectionNote/selectors";
import { getInvoiceToCredit } from "/src/invoices/selectors";
import { getInvoiceSetsByLease } from "/src/invoiceSets/selectors";
import { getAttributes as getLeaseAttributes, getCollapseStateByKey, getCurrentLease } from "leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import { withLeaseInvoiceTabAttributes } from "/src/components/attributes/LeaseInvoiceTabAttributes";
import type { Attributes } from "types";
import type { Lease } from "leases/types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type Props = {
  collectionCourtDecisions: Array<Record<string, any>> | null | undefined;
  collectionLetters: Array<Record<string, any>> | null | undefined;
  collectionNotes: Array<Record<string, any>> | null | undefined;
  currentLease: Lease;
  fetchCollectionCourtDecisionsByLease: (...args: Array<any>) => any;
  fetchCollectionLettersByLease: (...args: Array<any>) => any;
  fetchCollectionNotesByLease: (...args: Array<any>) => any;
  fetchInvoiceSetsByLease: (...args: Array<any>) => any;
  invoiceNotesCollapseState: boolean;
  invoicesCollapseState: boolean;
  invoiceSets: Array<Record<string, any>> | null | undefined;
  invoiceToCredit: string | null | undefined;
  isFetchingLeaseInvoiceTabAttributes: boolean;
  // Get via withLeaseInvoiceTabAttributes HOC
  isInvoicingEnabled: boolean;
  leaseAttributes: Attributes;
  match: {
    params: Record<string, any>;
  };
  previewInvoicesCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  receiveIsCreateInvoicePanelOpen: (...args: Array<any>) => any;
  receiveIsCreditInvoicePanelOpen: (...args: Array<any>) => any;
  receiveInvoiceToCredit: (...args: Array<any>) => any;
  startInvoicing: (...args: Array<any>) => any;
  stopInvoicing: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};
type State = {
  currentLease: Lease;
  invoiceNotes: Array<Record<string, any>>;
};

class Invoices extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    invoiceNotes: []
  };
  creditPanel: any;
  componentDidMount = () => {
    const {
      collectionCourtDecisions,
      collectionLetters,
      collectionNotes,
      fetchCollectionCourtDecisionsByLease,
      fetchCollectionLettersByLease,
      fetchCollectionNotesByLease,
      fetchInvoiceSetsByLease,
      invoiceSets,
      match: {
        params: {
          leaseId
        }
      },
      receiveInvoiceToCredit,
      receiveIsCreateInvoicePanelOpen,
      receiveIsCreditInvoicePanelOpen,
      usersPermissions
    } = this.props;

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICESET) && !invoiceSets) {
      fetchInvoiceSetsByLease(leaseId);
    }

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONCOURTDECISION) && !collectionCourtDecisions) {
      fetchCollectionCourtDecisionsByLease(leaseId);
    }

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONLETTER) && !collectionLetters) {
      fetchCollectionLettersByLease(leaseId);
    }

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONNOTE) && !collectionNotes) {
      fetchCollectionNotesByLease(leaseId);
    }

    receiveIsCreateInvoicePanelOpen(false);
    receiveIsCreditInvoicePanelOpen(false);
    receiveInvoiceToCredit(null);
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.invoiceNotes = getContentInvoiceNotes(props.currentLease);
    }

    return !isEmpty(newState) ? newState : null;
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {
      receiveCollapseStates
    } = this.props;
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        invoices: {
          [key]: val
        }
      }
    });
  };
  handleInvoicesCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('invoices', val);
  };
  handleInvoiceNotesCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('invoice_notes', val);
  };
  handlePreviewInvoicesCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('preview_invoices', val);
  };
  handleInvoiceToCreditChange = (val: string) => {
    const {
      receiveInvoiceToCredit
    } = this.props;
    receiveInvoiceToCredit(val);
  };
  startInvoicing = () => {
    const {
      currentLease,
      startInvoicing
    } = this.props;
    startInvoicing(currentLease.id);
  };
  stopInvoicing = () => {
    const {
      currentLease,
      stopInvoicing
    } = this.props;
    stopInvoicing(currentLease.id);
  };

  render() {
    const {
      currentLease,
      invoiceNotesCollapseState,
      invoicesCollapseState,
      invoiceToCredit,
      isFetchingLeaseInvoiceTabAttributes,
      isInvoicingEnabled,
      leaseAttributes,
      previewInvoicesCollapseState,
      usersPermissions
    } = this.props;
    const {
      invoiceNotes
    } = this.state;
    if (isFetchingLeaseInvoiceTabAttributes) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;
    if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
    return <AppConsumer>
        {({
        dispatch
      }) => {
        const handleStartInvoicing = () => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              this.startInvoicing();
            },
            confirmationModalButtonClassName: ButtonColors.SUCCESS,
            confirmationModalButtonText: ConfirmationModalTexts.START_INVOICING.BUTTON,
            confirmationModalLabel: ConfirmationModalTexts.START_INVOICING.LABEL,
            confirmationModalTitle: ConfirmationModalTexts.START_INVOICING.TITLE
          });
        };

        const handleStopInvoicing = () => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              this.stopInvoicing();
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText: ConfirmationModalTexts.STOP_INVOICING.BUTTON,
            confirmationModalLabel: ConfirmationModalTexts.STOP_INVOICING.LABEL,
            confirmationModalTitle: ConfirmationModalTexts.STOP_INVOICING.TITLE
          });
        };

        return <Fragment>
              <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.INVOICING)}>
                {LeaseInvoicingFieldTitles.INVOICING}
              </Title>
              <WarningContainer alignCenter buttonComponent={<Authorization allow={hasPermissions(usersPermissions, UsersPermissions.CHANGE_LEASE_IS_INVOICING_ENABLED)}>
                    {isInvoicingEnabled ? <Button className={ButtonColors.NEUTRAL} onClick={handleStopInvoicing} text='Keskeytä laskutus' /> : <Button disabled={!currentLease.is_rent_info_complete} className={ButtonColors.NEUTRAL} onClick={handleStartInvoicing} text='Käynnistä laskutus' />}
                  </Authorization>} success={isInvoicingEnabled}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInvoicingFieldPaths.IS_INVOICING_ENABLED) && isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.IS_RENT_INFO_COMPLETE)}>
                  {isInvoicingEnabled && currentLease.is_rent_info_complete ? <SuccessField meta={{
                warning: LeaseInvoicingFieldTitles.INVOICING_ENABLED
              }} showWarning={true} /> : currentLease.is_rent_info_complete ? <WarningField meta={{
                warning: LeaseInvoicingFieldTitles.INVOICING_DISABLED
              }} showWarning={true} /> : <WarningField meta={{
                warning: 'Tiedot keskeneräiset'
              }} showWarning={true} />}
                </Authorization>
              </WarningContainer>
              <Divider />

              <Collapse defaultOpen={invoicesCollapseState !== undefined ? invoicesCollapseState : true} headerTitle={LeaseInvoicingFieldTitles.INVOICES} onToggle={this.handleInvoicesCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.INVOICES)}>
                <InvoiceTableAndPanel invoiceToCredit={invoiceToCredit} onInvoiceToCreditChange={this.handleInvoiceToCreditChange} />
                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}>
                  <CreateAndCreditInvoice invoiceToCredit={invoiceToCredit} />
                </Authorization>
              </Collapse>

              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICENOTE)}>
                <Collapse defaultOpen={invoiceNotesCollapseState !== undefined ? invoiceNotesCollapseState : true} headerTitle={`${LeaseInvoiceNotesFieldTitles.INVOICE_NOTES} (${invoiceNotes.length})`} onToggle={this.handleInvoiceNotesCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInvoiceNotesFieldPaths.INVOICE_NOTES)}>
                  <InvoiceNotes initialValues={{
                invoice_notes: invoiceNotes
              }} invoiceNotes={invoiceNotes} />
                </Collapse>
              </Authorization>

              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)}>
                <Collapse defaultOpen={previewInvoicesCollapseState !== undefined ? previewInvoicesCollapseState : true} headerTitle={LeaseInvoicingFieldTitles.PREVIEW_INVOICES} onToggle={this.handlePreviewInvoicesCollapseToggle} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.PREVIEW_INVOICES)}>
                  <InvoiceSimulator />
                </Collapse>
              </Authorization>
              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONCOURTDECISION) || hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONLETTER) || hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONNOTE)}>
                <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.DEBT_COLLECTION)}>
                  {LeaseInvoicingFieldTitles.DEBT_COLLECTION}
                </Title>
                <Divider />
                <DebtCollection />
                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_COLLECTIONLETTER)}>
                  <CreateCollectionLetter />
                </Authorization>
              </Authorization>
            </Fragment>;
      }}
      </AppConsumer>;
  }

}

export default flowRight(withRouter, withLeaseInvoiceTabAttributes, connect(state => {
  const currentLease = getCurrentLease(state);
  return {
    collectionCourtDecisions: getCollectionCourtDecisionsByLease(state, currentLease.id),
    collectionLetters: getCollectionLettersByLease(state, currentLease.id),
    collectionNotes: getCollectionNotesByLease(state, currentLease.id),
    currentLease: currentLease,
    invoiceSets: getInvoiceSetsByLease(state, currentLease.id),
    invoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoices`),
    invoiceNotesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoice_notes`),
    invoiceToCredit: getInvoiceToCredit(state),
    isInvoicingEnabled: currentLease ? currentLease.is_invoicing_enabled : null,
    leaseAttributes: getLeaseAttributes(state),
    previewInvoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.preview_invoices`),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  fetchCollectionCourtDecisionsByLease,
  fetchCollectionLettersByLease,
  fetchCollectionNotesByLease,
  fetchInvoiceSetsByLease,
  receiveCollapseStates,
  receiveInvoiceToCredit,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditInvoicePanelOpen,
  startInvoicing,
  stopInvoicing
}))(Invoices) as React.ComponentType<any>;