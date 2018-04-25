// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getFormValues, isValid} from 'redux-form';
import classNames from 'classnames';
import flowRight from 'lodash/flowRight';

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
  onClose: Function,
  onKeyCodeDown: Function,
  onKeyCodeUp: Function,
  onRefund: Function,
  onSave: Function,
  show: boolean,
}

class InvoiceModalEdit extends Component {
  props: Props

  componentWillMount(){
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeyDown);
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
      containerHeight,
      editedInvoice,
      invoice,
      isValid,
      onClose,
      onRefund,
      onSave,
      show,
    } = this.props;

    return (
      <div className={classNames('invoice-modal', {'is-open': show})} style={{height: containerHeight}}>
        <div className="invoice-modal__container">
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
                    />
                  ) : (
                    <InvoiceTemplate
                      invoice={invoice}
                    />
                  )
                }
              </div>
            }
          </div>
          <div className='invoice-modal__footer'>
            <Button
              className="button-green no-margin"
              label='Hyvitä'
              onClick={() => onRefund(editedInvoice)}
              title='Hyvitä'
            />
            {(!invoice || !invoice.sap_id) &&
              <Button
                className="button-green no-margin pull-right"
                disabled={!isValid}
                label='Tallenna'
                onClick={() => onSave(editedInvoice)}
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
        isValid: isValid(FormNames.INVOICE_EDIT)(state),
      };
    }
  ),
)(InvoiceModalEdit);
