// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import Button from '$components/button/Button';
import Collapse from '$components/collapse/Collapse';
import CreateAndCreditInvoiceR from './CreateAndCreditInvoiceR';
import Divider from '$components/content/Divider';
import InvoiceTableAndPanelR from './InvoiceTableAndPanelR';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SuccessField from '$components/form/SuccessField';
import Title from '$components/content/Title';
import WarningContainer from '$components/content/WarningContainer';
import {fetchCollectionCourtDecisionsByLease} from '$src/collectionCourtDecision/actions';
import {fetchCollectionLettersByLease} from '$src/collectionLetter/actions';
import {fetchCollectionNotesByLease} from '$src/collectionNote/actions';
import {fetchInvoiceSetsByLease} from '$src/invoiceSets/actions';
import {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} from '$src/invoices/actions';
import {receiveCollapseStates, startInvoicing, stopInvoicing} from '$src/landUseInvoices/actions';
import {ConfirmationModalTexts, PermissionMissingTexts, ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  LeaseInvoicingFieldPaths,
  LeaseInvoicingFieldTitles,
  LeaseRentsFieldPaths,
} from '$src/leases/enums'; // TODO
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContentInvoiceNotes} from '$src/leases/helpers'; // TODO
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {hasPermissions, isFieldAllowedToRead} from '$util/helpers';
import {
  getInvoiceToCredit,
} from '$src/invoices/selectors';
import {getInvoiceSetsByLease} from '$src/invoiceSets/selectors';
import {
  getAttributes as getLeaseAttributes,
  getCollapseStateByKey,
} from '$src/landUseInvoices/selectors';
import {
  getCurrentLandUseContract,
} from '$src/landUseContract/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {withLeaseInvoiceTabAttributes} from '$components/attributes/LeaseInvoiceTabAttributes';
import type {Attributes} from '$src/types';
import type {LandUseContract} from '$src/landUseContract/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  collectionCourtDecisions: ?Array<Object>,
  collectionLetters: ?Array<Object>,
  collectionNotes: ?Array<Object>,
  currentLandUseContract: LandUseContract,
  fetchCollectionCourtDecisionsByLease: Function,
  fetchCollectionLettersByLease: Function,
  fetchCollectionNotesByLease: Function,
  fetchInvoiceSetsByLease: Function,
  invoiceNotesCollapseState: boolean,
  invoicesCollapseState: boolean,
  invoiceSets: ?Array<Object>,
  invoiceToCredit: ?string,
  isFetchingLeaseInvoiceTabAttributes: boolean, // Get via withLeaseInvoiceTabAttributes HOC
  isInvoicingEnabled: boolean,
  leaseAttributes: Attributes,
  match: {
    params: Object,
  },
  previewInvoicesCollapseState: boolean,
  receiveCollapseStates: Function,
  receiveIsCreateInvoicePanelOpen: Function,
  receiveIsCreditInvoicePanelOpen: Function,
  receiveInvoiceToCredit: Function,
  startInvoicing: Function,
  stopInvoicing: Function,
  usersPermissions: UsersPermissionsType,
}

type State = {
  currentLandUseContract: LandUseContract,
  invoiceNotes: Array<Object>,
}

class InvoicesR extends PureComponent<Props, State> {
  state = {
    currentLandUseContract: {},
    invoiceNotes: [],
  }

  creditPanel: any

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
      match: {params: {leaseId}}, // TODO landuseid
      receiveInvoiceToCredit,
      receiveIsCreateInvoicePanelOpen,
      receiveIsCreditInvoicePanelOpen,
      usersPermissions,
    } = this.props;

    if(hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICESET) && !invoiceSets) {
      fetchInvoiceSetsByLease(leaseId);
    }

    if(hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONCOURTDECISION) && !collectionCourtDecisions) {
      fetchCollectionCourtDecisionsByLease(leaseId);
    }

    if(hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONLETTER) && !collectionLetters) {
      fetchCollectionLettersByLease(leaseId);
    }

    if(hasPermissions(usersPermissions, UsersPermissions.VIEW_COLLECTIONNOTE) && !collectionNotes) {
      fetchCollectionNotesByLease(leaseId);
    }

    receiveIsCreateInvoicePanelOpen(false);
    receiveIsCreditInvoicePanelOpen(false);
    receiveInvoiceToCredit(null);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.currentLandUseContract !== state.currentLandUseContract) {
      newState.currentLandUseContract = props.currentLandUseContract;
      newState.invoiceNotes = getContentInvoiceNotes(props.currentLandUseContract);
    }
    return !isEmpty(newState) ? newState : null;
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        invoices: {
          [key]: val,
        },
      },
    });
  }

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
    const {receiveInvoiceToCredit} = this.props;

    receiveInvoiceToCredit(val);
  };

  startInvoicing = () => {
    const {currentLandUseContract, startInvoicing} = this.props;

    startInvoicing(currentLandUseContract.id);
  }

  stopInvoicing = () => {
    const {currentLandUseContract, stopInvoicing} = this.props;

    stopInvoicing(currentLandUseContract.id);
  }

  render() {
    const {
      invoicesCollapseState,
      invoiceToCredit,
      isFetchingLeaseInvoiceTabAttributes,
      isInvoicingEnabled,
      leaseAttributes,
      usersPermissions,
    } = this.props;

    if(isFetchingLeaseInvoiceTabAttributes) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    if(!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;

    return (
      <AppConsumer>
        {({
          dispatch,
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
              confirmationModalTitle: ConfirmationModalTexts.START_INVOICING.TITLE,
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
              confirmationModalTitle: ConfirmationModalTexts.STOP_INVOICING.TITLE,
            });
          };

          return(
            <Fragment>
              <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.INVOICING)}>
                {LeaseInvoicingFieldTitles.INVOICING}
              </Title>
              <WarningContainer
                alignCenter
                buttonComponent={
                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.CHANGE_LEASE_IS_INVOICING_ENABLED)}>
                    {isInvoicingEnabled
                      ? <Button className={ButtonColors.NEUTRAL} onClick={handleStopInvoicing} text='Keskeytä laskutus' />
                      : <Button className={ButtonColors.NEUTRAL} onClick={handleStartInvoicing} text='Käynnistä laskutus' />
                    }
                  </Authorization>
                }
                success={isInvoicingEnabled}
              >
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInvoicingFieldPaths.IS_INVOICING_ENABLED) && isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.IS_RENT_INFO_COMPLETE)}>
                  <SuccessField
                    meta={{warning: LeaseInvoicingFieldTitles.INVOICING_ENABLED}}
                    showWarning={true}
                  />
                </Authorization>
              </WarningContainer>
              <Divider />

              <Collapse
                defaultOpen={invoicesCollapseState !== undefined ? invoicesCollapseState : true}
                headerTitle={LeaseInvoicingFieldTitles.INVOICES}
                onToggle={this.handleInvoicesCollapseToggle}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.INVOICES)}
              >
                <InvoiceTableAndPanelR
                  invoiceToCredit={invoiceToCredit}
                  onInvoiceToCreditChange={this.handleInvoiceToCreditChange}
                />
                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}>
                  <CreateAndCreditInvoiceR invoiceToCredit={invoiceToCredit} />
                </Authorization>
              </Collapse>

            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

export default flowRight(
  withRouter,
  withLeaseInvoiceTabAttributes,
  connect(
    (state) => {
      const currentLandUseContract = getCurrentLandUseContract(state);
      return {
        currentLandUseContract: currentLandUseContract,
        invoiceSets: getInvoiceSetsByLease(state, currentLandUseContract.id),
        invoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoices`),
        invoiceNotesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoice_notes`),
        invoiceToCredit: getInvoiceToCredit(state),
        isInvoicingEnabled: currentLandUseContract ? currentLandUseContract.is_invoicing_enabled : null,
        leaseAttributes: getLeaseAttributes(state),
        previewInvoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.preview_invoices`),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      fetchCollectionCourtDecisionsByLease,
      fetchCollectionLettersByLease,
      fetchCollectionNotesByLease,
      fetchInvoiceSetsByLease,
      receiveCollapseStates,
      receiveInvoiceToCredit,
      receiveIsCreateInvoicePanelOpen,
      receiveIsCreditInvoicePanelOpen,
      startInvoicing,
      stopInvoicing,
    }
  ),
)(InvoicesR);
