// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';

import CloseButton from '$components/button/CloseButton';


import {getEditBillFormErrors, getEditBillFormValues} from './selectors';
import Button from '$components/button/Button';
import EditBillForm from './forms/EditBillForm';

const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;

type Props = {
  bill: Object,
  containerHeight: ?number,
  dispatch: Function,
  errors: ?Object,
  newBill: ?Object,
  onClose: Function,
  onKeyCodeDown: Function,
  onKeyCodeUp: Function,
  onRefund: Function,
  onSave: Function,
  show: boolean,
}

class BillModalEdit extends Component {
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
      bill,
      containerHeight,
      errors,
      newBill,
      onClose,
      onRefund,
      onSave,
      show,
    } = this.props;

    return (
      <div className={classNames('bill-modal', {'is-open': show})} style={{height: containerHeight}}>
        <div className="bill-modal__container">
          <div className='bill-modal__header'>
            <h1>Laskun tiedot</h1>
            <CloseButton
              className='position-topright'
              onClick={onClose}
              title='Sulje'
            />
          </div>

          <div className="bill-modal__body with-footer">
            {show &&
              <EditBillForm
                bill={bill}
                initialValues={{...bill}}
              />
            }
          </div>
          <div className='bill-modal__footer'>
            <Button
              className="button-green no-margin"
              label='Hyvitä'
              onClick={() => onRefund(newBill)}
              title='Hyvitä'
            />
            {!get(bill, 'SAP_number') &&
              <Button
                className="button-green no-margin pull-right"
                disabled={!isEmpty(errors)}
                label='Tallenna'
                onClick={() => onSave(newBill)}
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
        newBill: getEditBillFormValues(state),
        errors: getEditBillFormErrors(state),
      };
    }
  ),
)(BillModalEdit);
