// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {getFormValues, isValid} from 'redux-form';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import EditInvoiceForm from './forms/EditInvoiceForm';
import InvoiceTemplate from './InvoiceTemplate';
import ReactResizeDetector from 'react-resize-detector';
import {receiveIsEditClicked} from '$src/invoices/actions';
import {KeyCodes, Methods} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {FormNames} from '$src/leases/enums';
import {isMethodAllowed} from '$util/helpers';
import {
  getInvoicesByLease,
  getIsEditClicked,
  getMethods as getInvoiceMethods,
} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Methods as MethodsType} from '$src/types';
import type {InvoiceList} from '$src/invoices/types';

type Props = {
  editedInvoice: Object,
  invoice: ?Object,
  invoiceMethods: MethodsType,
  invoices: InvoiceList,
  isEditClicked: boolean,
  isOpen: boolean,
  minHeight: number,
  onClose: Function,
  onCreditedInvoiceClick: Function,
  onKeyDown?: Function,
  onResize: Function,
  receiveIsEditClicked: Function,
  onSave: Function,
  valid: boolean,
}

type State = {
  isClosing: boolean,
  isOpening: boolean,
}

class InvoicePanel extends PureComponent<Props, State> {
  closeButton: any
  component: any
  container: any
  invoiceFormFirstField: any

  state = {
    isClosing: false,
    isOpening: false,
  }

  setComponentRef = (el: any) => {
    this.component = el;
  }

  setContainerRef = (el: any) => {
    this.container = el;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.component.addEventListener('transitionend', this.transitionEnds);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  handleKeyDown = (e: any) => {
    const {isOpen, onKeyDown} = this.props;

    if(!isOpen) return false;

    switch(e.keyCode) {
      case KeyCodes.ARROW_LEFT:
      case KeyCodes.ARROW_RIGHT:
        if(onKeyDown) {
          onKeyDown(e.keyCode);
        }
        break;
      default:
        break;
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      this.setState({
        isOpening: true,
      });
    } else if(prevProps.isOpen && !this.props.isOpen) {
      this.setState({
        isClosing: true,
      });
    }
  }

  transitionEnds = (e: any) => {
    if(e.srcElement === this.component) {
      const {isOpen} = this.props;

      if(isOpen) {
        this.setFocusOnPanel();
      }

      this.setState({
        isClosing: false,
        isOpening: false,
      });
    }
  }

  setFocusOnPanel = () => {
    this.setFocusOnCloseButton();
  }

  setCloseButtonReference = (element: any) => {
    this.closeButton = element;
  }

  setFocusOnCloseButton = () => {
    if(this.closeButton) {
      this.closeButton.focus();
    }
  }

  handleResize = () => {
    const {onResize} = this.props;
    onResize();
  }

  handleClose = () => {
    const {onClose, receiveIsEditClicked} = this.props;

    receiveIsEditClicked(false);
    onClose();
  }

  handleSave = () => {
    const {editedInvoice, onSave, receiveIsEditClicked, valid} = this.props;

    receiveIsEditClicked(true);

    if(valid) {
      onSave(editedInvoice);
    }
  }

  getCreditedInvoice = () => {
    const {invoice, invoices} = this.props;
    if(isEmpty(invoice) || isEmpty(invoices)) {
      return null;
    }

    return invoices.find((item) => item.id === (invoice ? invoice.credited_invoice : 0));
  }

  render() {
    const {
      invoice,
      invoiceMethods,
      isEditClicked,
      isOpen,
      minHeight,
      onClose,
      onCreditedInvoiceClick,
      valid,
    } = this.props;
    const {isClosing, isOpening} = this.state;
    const creditedInvoice = this.getCreditedInvoice();

    return(
      <div
        className={classNames('invoice-panel', {'is-open': isOpen})}
        style={{minHeight: minHeight}}
        ref={this.setComponentRef}
      >
        <div
          ref={this.setContainerRef}
          className="invoice-panel__container"
          hidden={!isOpen && !isClosing && !isOpening}
        >
          <ReactResizeDetector
            handleHeight
            onResize={this.handleResize}
            refreshMode='debounce'
            refreshRate={1}
          />

          <div className='invoice-panel__header'>
            <h1>Laskun tiedot</h1>
            <CloseButton
              className='position-topright'
              onClick={onClose}
              setReference={this.setCloseButtonReference}
              title='Sulje'
            />
          </div>

          <div className={classNames('invoice-panel__body', {'with-footer': (isMethodAllowed(invoiceMethods, Methods.PATCH) && invoice && !invoice.sap_id)})}>
            {isMethodAllowed(invoiceMethods, Methods.PATCH) && (!invoice || !invoice.sap_id)
              ? <EditInvoiceForm
                creditedInvoice={creditedInvoice}
                invoice={invoice}
                initialValues={{...invoice}}
                onCreditedInvoiceClick={onCreditedInvoiceClick}
                relativeTo={this.component}
              />
              : <InvoiceTemplate
                creditedInvoice={creditedInvoice}
                invoice={invoice}
                onCreditedInvoiceClick={onCreditedInvoiceClick}
                relativeTo={this.component}
              />
            }
          </div>

          <Authorization allow={isMethodAllowed(invoiceMethods, Methods.PATCH)}>
            {invoice && !invoice.sap_id &&
              <div className='invoice-panel__footer'>
                <Button
                  className={ButtonColors.SECONDARY}
                  onClick={onClose}
                  text='Peruuta'
                />
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={isEditClicked && !valid}
                  onClick={this.handleSave}
                  text='Tallenna'
                />
              </div>
            }
          </Authorization>
        </div>
      </div>
    );
  }
}

const formName = FormNames.INVOICE_EDIT;
export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);

    return {
      editedInvoice: getFormValues(formName)(state),
      invoiceMethods: getInvoiceMethods(state),
      invoices: getInvoicesByLease(state, currentLease.id),
      isEditClicked: getIsEditClicked(state),
      valid: isValid(formName)(state),
    };
  },
  {
    receiveIsEditClicked,
  },
  null,
  {
    forwardRef: true,
  },
)(InvoicePanel);
