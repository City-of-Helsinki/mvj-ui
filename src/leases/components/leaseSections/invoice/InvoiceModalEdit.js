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
import {FormNames} from '$src/leases/enums';

const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;

type Props = {
  containerHeight: ?number,
  editedInvoice: Object,
  invoice: Object,
  isValid: boolean,
  minHeight?: number,
  onClose: Function,
  onKeyCodeDown: Function,
  onKeyCodeUp: Function,
  onCreditInvoice: Function,
  onCreditedInvoiceClick: Function,
  onResize: Function,
  onSave: Function,
  show: boolean,
}

class InvoiceModalEdit extends Component<Props> {
  modal: any
  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  onResize = () => {
    const {onResize} = this.props;
    onResize();
  }

  handleSave = () => {
    const {editedInvoice, onSave} = this.props;
    onSave(editedInvoice);
  }

  handleKeyDown = (e: any) => {
    const {onKeyCodeDown, onKeyCodeUp} = this.props;

    switch(e.keyCode) {
      case ARROW_DOWN_KEY:
        onKeyCodeDown();
        e.preventDefault();
        break;
      case ARROW_UP_KEY:
        onKeyCodeUp();
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  render() {
    const {
      invoice,
      isValid,
      minHeight,
      onClose,
      onCreditedInvoiceClick,
      show,
    } = this.props;

    return (
      <div
        className={classNames('invoice-modal', {'is-open': show})}
        ref={(ref) => this.modal = ref}
      >
        <ReactResizeDetector
          handleHeight
          onResize={this.onResize}
          refreshMode='debounce'
          refreshRate={1}
        />
        <div className="invoice-modal__container" style={{minHeight: minHeight}}>
          <div className='invoice-modal__header'>
            <h1>Laskun tiedot</h1>
            <CloseButton
              className='position-topright'
              onClick={onClose}
              title='Sulje'
            />
          </div>

          <div className="invoice-modal__body with-footer">
            {show &&
              <div>
                {(!invoice || !invoice.sap_id)
                  ? (
                    <EditInvoiceForm
                      invoice={invoice}
                      initialValues={{...invoice}}
                      onCreditedInvoiceClick={onCreditedInvoiceClick}
                    />
                  ) : (
                    <InvoiceTemplate
                      invoice={invoice}
                      onCreditedInvoiceClick={onCreditedInvoiceClick}
                    />
                  )
                }
              </div>
            }
          </div>
          <div className='invoice-modal__footer'>
            {(!invoice || !invoice.sap_id) &&
              <Button
                className="button-green no-margin pull-right"
                disabled={!isValid}
                label='Tallenna'
                onClick={this.handleSave}
                title='Tallenna'
              />
            }
            {(!invoice || !invoice.sap_id) &&
              <Button
                className="button-red pull-right"
                label='Peruuta'
                onClick={onClose}
                title='Peruuta'
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
        isValid: isValid(FormNames.INVOICE_EDIT)(state),
      };
    },
    null,
    null,
    {
      withRef: true,
    },
  ),
)(InvoiceModalEdit);
