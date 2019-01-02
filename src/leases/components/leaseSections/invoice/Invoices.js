// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import Collapse from '$components/collapse/Collapse';
import DebtCollection from './DebtCollection';
import Divider from '$components/content/Divider';
import InvoiceSimulator from '$components/invoice-simulator/InvoiceSimulator';
import CreateAndCreditInvoice from './CreateAndCreditInvoice';
import CreateCollectionLetter from './CreateCollectionLetter';
import RightSubtitle from '$components/content/RightSubtitle';
import InvoiceTableAndPanel from './InvoiceTableAndPanel';
import {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} from '$src/invoices/actions';
import {receiveCollapseStates, startInvoicing, stopInvoicing} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {LeaseInvoicingFieldPaths, LeaseInvoicingFieldTitles} from '$src/leases/enums';
import {isFieldAllowedToRead} from '$util/helpers';
import {getInvoiceToCredit} from '$src/invoices/selectors';
import {getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';
import {withLeasePageAttributes} from '$components/attributes/LeasePageAttributes';

import type {Attributes, Methods} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  collectionCourtDecisionMethods: Methods, // Get vie withLeasePageAttributes HOC
  collectionLetterMethods: Methods, // Get vie withLeasePageAttributes HOC
  collectionNoteMethods: Methods, // Get vie withLeasePageAttributes HOC
  currentLease: Lease,
  invoiceMethods: Methods, // Get vie withLeasePageAttributes HOC
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
}

class Invoices extends Component<Props> {
  creditPanel: any

  componentDidMount = () => {
    const {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} = this.props;
    receiveIsCreateInvoicePanelOpen(false);
    receiveIsCreditInvoicePanelOpen(false);
    receiveInvoiceToCredit(null);
  }

  handleInvoicesCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        invoices: {
          invoices: val,
        },
      },
    });
  };

  handlePreviewInvoicesCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        invoices: {
          preview_invoices: val,
        },
      },
    });
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
      invoicesCollapseState,
      invoiceToCredit,
      isInvoicingEnabled,
      leaseAttributes,
      previewInvoicesCollapseState,
    } = this.props;

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
            <div>
              <h2>Laskutus</h2>
              {invoiceMethods.PATCH
                ? <RightSubtitle
                  buttonComponent={isInvoicingEnabled
                    ? <Button className={ButtonColors.NEUTRAL} onClick={handleStopInvoicing} text='Keskeytä laskutus' />
                    : <Button className={ButtonColors.NEUTRAL} onClick={handleStartInvoicing} text='Käynnistä laskutus' />
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
                : <RightSubtitle
                  text={
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInvoicingFieldPaths.IS_INVOICING_ENABLED)}>
                      {isInvoicingEnabled
                        ? <span className="success">{LeaseInvoicingFieldTitles.INVOICING_ENABLED}<i/></span>
                        : <span className="alert">{LeaseInvoicingFieldTitles.INVOICING_DISABLED}<i/></span>
                      }
                    </Authorization>
                  }
                />
              }
              <Divider />

              <Collapse
                defaultOpen={invoicesCollapseState !== undefined ? invoicesCollapseState : true}
                headerTitle='Laskut'
                onToggle={this.handleInvoicesCollapseToggle}
              >
                <InvoiceTableAndPanel
                  invoiceToCredit={invoiceToCredit}
                  onInvoiceToCreditChange={this.handleInvoiceToCreditChange}
                />

                <CreateAndCreditInvoice invoiceToCredit={invoiceToCredit} />
              </Collapse>

              <Authorization allow={invoiceMethods.GET}>
                <Collapse
                  defaultOpen={previewInvoicesCollapseState !== undefined ? previewInvoicesCollapseState : true}
                  headerTitle='Laskujen esikatselu'
                  onToggle={this.handlePreviewInvoicesCollapseToggle}
                >
                  <InvoiceSimulator />
                </Collapse>
              </Authorization>

              <Authorization
                allow={collectionLetterMethods.GET ||
                  collectionCourtDecisionMethods.GET ||
                  collectionNoteMethods.GET
                }
              >
                <h2>Perintä</h2>
                <Divider />
                <Authorization allow={collectionLetterMethods.GET || collectionCourtDecisionMethods.GET || collectionNoteMethods.GET}>
                  <DebtCollection />
                </Authorization>
                <Authorization allow={collectionLetterMethods.POST}>
                  <CreateCollectionLetter />
                </Authorization>
              </Authorization>
            </div>
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
        invoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoices`),
        invoiceToCredit: getInvoiceToCredit(state),
        isInvoicingEnabled: currentLease ? currentLease.is_invoicing_enabled : null,
        previewInvoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.preview_invoices`),
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
