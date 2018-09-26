// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {getFormValues, isValid} from 'redux-form';

import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import EditInvoiceForm from './forms/EditInvoiceForm';
import InvoiceTemplate from './InvoiceTemplate';
import {receiveIsEditClicked} from '$src/invoices/actions';
import {KeyCodes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getIsEditClicked} from '$src/invoices/selectors';

type Props = {
  editedInvoice: Object,
  invoice: ?Object,
  isEditClicked: boolean,
  isEditMode: boolean,
  isOpen: boolean,
  minHeight: number,
  onClose: Function,
  onCreditedInvoiceClick: Function,
  onKeyDown?: Function,
  receiveIsEditClicked: Function,
  valid: boolean,
}

type State = {
  isClosing: boolean,
  isOpening: boolean,
}

class InvoicePanel extends Component<Props, State> {
  closeButton: any
  invoiceFormFirstField: any
  panel: any

  state = {
    isClosing: false,
    isOpening: false,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.panel.addEventListener('transitionend', this.transitionEnds);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.panel.removeEventListener('transitionend', this.transitionEnds);
  }

  handleKeyDown = (e: any) => {
    const {onKeyDown} = this.props;
    switch(e.keyCode) {
      case KeyCodes.ARROW_LEFT:
      case KeyCodes.ARROW_RIGHT:
        if(onKeyDown) {
          onKeyDown(e.keyCode);
          e.preventDefault();
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

  transitionEnds = () => {
    this.setState({
      isClosing: false,
      isOpening: false,
    });
  }

  setCloseButtonReference = (element: any) => {
    this.closeButton = element;
  }

  setFocusOnCloseButton = () => {
    if(this.closeButton) {
      this.closeButton.focus();
    }
  }

  setInvoiceFormFirstFieldRef = (element: any) => {
    this.invoiceFormFirstField = element;
  }

  setFocusOnInvoiceForm = () => {
    if(this.invoiceFormFirstField) {
      this.invoiceFormFirstField.setFocus();
    }
  }

  handleSave = () => {
    console.log('save');
  }

  render() {
    const {
      invoice,
      isEditClicked,
      isEditMode,
      isOpen,
      minHeight,
      onClose,
      onCreditedInvoiceClick,
      valid,
    } = this.props;
    const {isClosing, isOpening} = this.state;

    return(
      <div
        className={classNames('invoice-panel', {'is-open': isOpen})}
        ref={(ref) => this.panel = ref}
      >
        <div
          className="invoice-panel__container"
          style={{minHeight: minHeight}}
          hidden={!isOpen && !isClosing && !isOpening}
        >
          <div className='invoice-panel__header'>
            <h1>Laskun tiedot</h1>
            <CloseButton
              className='position-topright'
              onClick={onClose}
              setReference={this.setCloseButtonReference}
              title='Sulje'
            />
          </div>

          <div className="invoice-modal__body">
            {isEditMode && (!invoice || !invoice.sap_id)
              ? <EditInvoiceForm
                invoice={invoice}
                initialValues={{...invoice}}
                onCreditedInvoiceClick={onCreditedInvoiceClick}
                setRefForFirstField={this.setInvoiceFormFirstFieldRef}
              />
              :
              <InvoiceTemplate
                invoice={invoice}
                onCreditedInvoiceClick={onCreditedInvoiceClick}
              />
            }
            {isEditMode}
          </div>
          {isEditMode  && (!invoice || !invoice.sap_id) &&
            <div className='invoice-modal__footer'>
              {(!invoice || !invoice.sap_id) &&
                <Button
                  className="button-red"
                  onClick={onClose}
                  text='Peruuta'
                />
              }
              {(!invoice || !invoice.sap_id) &&
                <Button
                  className="button-green"
                  disabled={isEditClicked && !valid}
                  onClick={this.handleSave}
                  text='Tallenna'
                />
              }
            </div>
          }

        </div>
      </div>
    );
  }
}

const formName = FormNames.INVOICE_EDIT;
export default connect(
  (state) => {
    return {
      editedInvoice: getFormValues(formName)(state),
      isEditClicked: getIsEditClicked(state),
      valid: isValid(formName)(state),
    };
  },
  {
    receiveIsEditClicked,
  },
  null,
  {
    withRef: true,
  },
)(InvoicePanel);
