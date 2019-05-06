// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import Button from '$components/button/Button';
import Collapse from '$components/collapse/Collapse';
import CreateAndCreditInvoice from './CreateAndCreditInvoice';
import CreateCollectionLetter from './CreateCollectionLetter';
import DebtCollection from './DebtCollection';
import Divider from '$components/content/Divider';
import InvoiceNotes from './InvoiceNotes';
import InvoiceSimulator from '$components/invoice-simulator/InvoiceSimulator';
import RightSubtitle from '$components/content/RightSubtitle';
import InvoiceTableAndPanel from './InvoiceTableAndPanel2';
import Title from '$components/content/Title';
import {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} from '$src/invoices/actions';
import {receiveCollapseStates, startInvoicing, stopInvoicing} from '$src/leases/actions';
import {Methods, PermissionMissingTexts, ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  LeaseInvoiceNotesFieldPaths,
  LeaseInvoiceNotesFieldTitles,
  LeaseInvoicingFieldPaths,
  LeaseInvoicingFieldTitles,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContentInvoiceNotes} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {hasPermissions, isFieldAllowedToRead, isMethodAllowed} from '$util/helpers';
import {getInvoiceToCredit, getMethods as getInvoiceMethods} from '$src/invoices/selectors';
import {getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';
import {withLeasePageAttributes} from '$components/attributes/LeasePageAttributes';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  collectionCourtDecisionMethods: MethodsType, // Get via withLeasePageAttributes HOC
  collectionLetterMethods: MethodsType, // Get via withLeasePageAttributes HOC
  collectionNoteMethods: MethodsType, // Get via withLeasePageAttributes HOC
  currentLease: Lease,
  invoiceMethods: MethodsType,
  invoiceNotesCollapseState: boolean,
  invoicesCollapseState: boolean,
  invoiceToCredit: ?string,
  isInvoicingEnabled: boolean,
  leaseAttributes: Attributes, // Get via withCommonAttributes HOC
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
  currentLease: Lease,
  invoiceNotes: Array<Object>,
}

class Invoices extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    invoiceNotes: [],
  }

  creditPanel: any

  componentDidMount = () => {
    const {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} = this.props;
    receiveIsCreateInvoicePanelOpen(false);
    receiveIsCreditInvoicePanelOpen(false);
    receiveInvoiceToCredit(null);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.invoiceNotes = getContentInvoiceNotes(props.currentLease);
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
    const {currentLease, startInvoicing} = this.props;

    startInvoicing(currentLease.id);
  }

  stopInvoicing = () => {
    const {currentLease, stopInvoicing} = this.props;

    stopInvoicing(currentLease.id);
  }

  render() {
    const {
      collectionCourtDecisionMethods,
      collectionLetterMethods,
      collectionNoteMethods,
      invoiceMethods,
      invoiceNotesCollapseState,
      invoicesCollapseState,
      invoiceToCredit,
      isInvoicingEnabled,
      leaseAttributes,
      previewInvoicesCollapseState,
      usersPermissions,
    } = this.props;
    const {invoiceNotes} = this.state;

    if(!isMethodAllowed(invoiceMethods, Methods.GET)) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;

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
              confirmationModalButtonText: 'Käynnistä laskutus',
              confirmationModalLabel: 'Haluatko varmasti käynnistää laskutuksen?',
              confirmationModalTitle: 'Käynnistä laskutus',
            });
          };

          const handleStopInvoicing = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.stopInvoicing();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: 'Keskeytä laskutus',
              confirmationModalLabel: 'Haluatko varmasti keskeyttää laskutuksen?',
              confirmationModalTitle: 'Keskeytä laskutus',
            });
          };

          return(
            <Fragment>
              <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.INVOICING)}>
                {LeaseInvoicingFieldTitles.INVOICING}
              </Title>
              <RightSubtitle
                buttonComponent={
                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.CHANGE_LEASE_IS_INVOICING_ENABLED)}>
                    {isInvoicingEnabled
                      ? <Button className={ButtonColors.NEUTRAL} onClick={handleStopInvoicing} text='Keskeytä laskutus' />
                      : <Button className={ButtonColors.NEUTRAL} onClick={handleStartInvoicing} text='Käynnistä laskutus' />
                    }
                  </Authorization>
                }
                text={
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInvoicingFieldPaths.IS_INVOICING_ENABLED)}>
                    {isInvoicingEnabled
                      ? <span className="success">{LeaseInvoicingFieldTitles.INVOICING_ENABLED}<i/></span>
                      : <span className="alert">{LeaseInvoicingFieldTitles.INVOICING_DISABLED}<i/></span>
                    }
                  </Authorization>
                }
              />
              <Divider />

              <Collapse
                defaultOpen={invoicesCollapseState !== undefined ? invoicesCollapseState : true}
                headerTitle={LeaseInvoicingFieldTitles.INVOICES}
                onToggle={this.handleInvoicesCollapseToggle}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.INVOICES)}
              >
                <InvoiceTableAndPanel
                  invoiceToCredit={invoiceToCredit}
                  onInvoiceToCreditChange={this.handleInvoiceToCreditChange}
                />
                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}>
                  <CreateAndCreditInvoice invoiceToCredit={invoiceToCredit} />
                </Authorization>
              </Collapse>

              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICENOTE)}>
                <Collapse
                  defaultOpen={invoiceNotesCollapseState !== undefined ? invoiceNotesCollapseState : true}
                  headerTitle={`${LeaseInvoiceNotesFieldTitles.INVOICE_NOTES} (${invoiceNotes.length})`}
                  onToggle={this.handleInvoiceNotesCollapseToggle}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseInvoiceNotesFieldPaths.INVOICE_NOTES)}
                >
                  <InvoiceNotes
                    initialValues={{invoice_notes: invoiceNotes}}
                    invoiceNotes={invoiceNotes}
                  />
                </Collapse>
              </Authorization>

              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)}>
                <Collapse
                  defaultOpen={previewInvoicesCollapseState !== undefined ? previewInvoicesCollapseState : true}
                  headerTitle={LeaseInvoicingFieldTitles.PREVIEW_INVOICES}
                  onToggle={this.handlePreviewInvoicesCollapseToggle}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.PREVIEW_INVOICES)}
                >
                  <InvoiceSimulator />
                </Collapse>
              </Authorization>
              <Authorization
                allow={isMethodAllowed(collectionLetterMethods, Methods.GET) ||
                  isMethodAllowed(collectionCourtDecisionMethods, Methods.GET) ||
                  isMethodAllowed(collectionNoteMethods, Methods.GET) ||
                  hasPermissions(usersPermissions, UsersPermissions.ADD_COLLECTIONLETTER)}
              >
                <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInvoicingFieldPaths.DEBT_COLLECTION)}>
                  {LeaseInvoicingFieldTitles.DEBT_COLLECTION}
                </Title>
                <Divider />
                <Authorization allow={isMethodAllowed(collectionLetterMethods, Methods.GET) ||
                  isMethodAllowed(collectionCourtDecisionMethods, Methods.GET) ||
                  isMethodAllowed(collectionNoteMethods, Methods.GET)}>
                  <DebtCollection />
                </Authorization>
                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_COLLECTIONLETTER)}>
                  <CreateCollectionLetter />
                </Authorization>
              </Authorization>
            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

export default flowRight(
  withCommonAttributes,
  withLeasePageAttributes,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        currentLease: currentLease,
        invoiceMethods: getInvoiceMethods(state),
        invoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoices`),
        invoiceNotesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoice_notes`),
        invoiceToCredit: getInvoiceToCredit(state),
        isInvoicingEnabled: currentLease ? currentLease.is_invoicing_enabled : null,
        previewInvoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.preview_invoices`),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      receiveCollapseStates,
      receiveInvoiceToCredit,
      receiveIsCreateInvoicePanelOpen,
      receiveIsCreditInvoicePanelOpen,
      startInvoicing,
      stopInvoicing,
    }
  ),
)(Invoices);
