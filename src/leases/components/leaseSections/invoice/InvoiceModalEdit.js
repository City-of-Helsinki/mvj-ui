// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getFormValues, isValid} from 'redux-form';
import classNames from 'classnames';
import flowRight from 'lodash/flowRight';
import ReactResizeDetector from 'react-resize-detector';

import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import EditInvoiceForm from './forms/EditInvoiceForm';
import InvoiceTemplate from './InvoiceTemplate';
import {receiveIsEditClicked} from '$src/invoices/actions';
import {FormNames} from '$src/leases/enums';
import {getIsEditClicked} from '$src/invoices/selectors';

const ARROW_LEFT_KEY = 37;
const ARROW_RIGHT_KEY = 39;

type Props = {
  containerHeight: ?number,
  editedInvoice: Object,
  invoice: Object,
  isEditClicked: boolean,
  isOpen: boolean,
  isValid: boolean,
  minHeight?: number,
  onClose: Function,
  onKeyCodeRight: Function,
  onKeyCodeLeft: Function,
  onCreditedInvoiceClick: Function,
  onResize: Function,
  onSave: Function,
  receiveIsEditClicked: Function,
}

type State = {
  isClosing: boolean,
  isOpening: boolean,
}

class InvoiceModalEdit extends Component<Props, State> {
  closeButton: any
  invoiceFormFirstField: any
  modal: any

  state = {
    isClosing: false,
    isOpening: false,
  }

  componentDidMount() {
    const {receiveIsEditClicked} = this.props;

    receiveIsEditClicked(false);
    document.addEventListener('keydown', this.handleKeyDown);
    this.modal.addEventListener('transitionend', this.transitionEnds);
  }


  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.modal.removeEventListener('transitionend', this.transitionEnds);
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.invoice !== this.props.invoice) {
      const {receiveIsEditClicked} = this.props;

      receiveIsEditClicked(false);
    }
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

  transitionEnds = () => {
    this.setState({
      isClosing: false,
      isOpening: false,
    });
  }

  setFocus = () => {
    const {invoice} = this.props;
    if(!invoice || !invoice.sap_id) {
      this.setFocusOnInvoiceForm();
    } else {
      this.setFocusOnCloseButton();
    }
  }

  setCloseButtonReference = (element: any) => {
    this.closeButton = element;
  }

  setFocusOnCloseButton = () => {
    if(this.closeButton) {
      this.closeButton.focus();
    }
  }

  handleSetRefForInvoiceFormFirstField = (element: any) => {
    this.invoiceFormFirstField = element;
  }

  setFocusOnInvoiceForm = () => {
    if(this.invoiceFormFirstField) {
      this.invoiceFormFirstField.setFocus();
    }
  }

  onResize = () => {
    const {onResize} = this.props;

    onResize();
  }

  handleSave = () => {
    const {editedInvoice, isValid, onSave, receiveIsEditClicked} = this.props;

    receiveIsEditClicked(true);
    if(isValid) {
      onSave(editedInvoice);
    }
  }

  handleKeyDown = (e: any) => {
    const {onKeyCodeRight, onKeyCodeLeft} = this.props;

    switch(e.keyCode) {
      case ARROW_RIGHT_KEY:
        onKeyCodeRight();
        e.preventDefault();
        break;
      case ARROW_LEFT_KEY:
        onKeyCodeLeft();
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  render() {
    const {
      invoice,
      isEditClicked,
      isOpen,
      isValid,
      minHeight,
      onClose,
      onCreditedInvoiceClick,
    } = this.props;
    const {isClosing, isOpening} = this.state;

    return (
      <div
        className={classNames('invoice-modal', {'is-open': isOpen})}
        ref={(ref) => this.modal = ref}
      >
        <ReactResizeDetector
          handleHeight
          onResize={this.onResize}
          refreshMode='debounce'
          refreshRate={1}
        />
        <div className="invoice-modal__container" style={{minHeight: minHeight}} hidden={!isOpen && !isClosing && !isOpening}>
          <div className='invoice-modal__header'>
            <h1>Laskun tiedot</h1>
            <CloseButton
              className='position-topright'
              onClick={onClose}
              title='Sulje'
            />
          </div>

          <div className="invoice-modal__body with-footer">
            {(!invoice || !invoice.sap_id)
              ? (
                <EditInvoiceForm
                  invoice={invoice}
                  initialValues={{...invoice}}
                  onCreditedInvoiceClick={onCreditedInvoiceClick}
                  setRefForFirstField={this.handleSetRefForInvoiceFormFirstField}
                />
              ) : (
                <InvoiceTemplate
                  invoice={invoice}
                  onCreditedInvoiceClick={onCreditedInvoiceClick}
                />
              )
            }
          </div>
          <div className='invoice-modal__footer'>
            {(!invoice || !invoice.sap_id) &&
              <Button
                className="button-red"
                disabled={!isOpen}
                label='Peruuta'
                onClick={onClose}
                title='Peruuta'
              />
            }
            {(!invoice || !invoice.sap_id) &&
              <Button
                className="button-green"
                disabled={!isOpen || (isEditClicked && !isValid)}
                label='Tallenna'
                onClick={this.handleSave}
                title='Tallenna'
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        editedInvoice: getFormValues(FormNames.INVOICE_EDIT)(state),
        isEditClicked: getIsEditClicked(state),
        isValid: isValid(FormNames.INVOICE_EDIT)(state),
      };
    },
    {
      receiveIsEditClicked,
    },
    null,
    {
      withRef: true,
    },
  ),
)(InvoiceModalEdit);
