// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';

import CloseButton from '$components/button/CloseButton';
import InvoiceTemplate from './InvoiceTemplate';

const ARROW_LEFT_KEY = 37;
const ARROW_RIGHT_KEY = 39;

type Props = {
  invoice: Object,
  isOpen: boolean,
  minHeight: ?number,
  onClose: Function,
  onKeyCodeRight: Function,
  onKeyCodeLeft: Function,
  onCreditedInvoiceClick: Function,
  onResize: Function,
}

class InvoiceModal extends Component<Props> {
  closeButton: any

  modal: any

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  setCloseButtonReference = (element: any) => {
    this.closeButton = element;
  }

  setFocusOnCloseButton = () => {
    if(this.closeButton) {
      this.closeButton.focus();
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

  onResize = () => {
    const {onResize} = this.props;
    onResize();
  }


  render() {
    const {
      invoice,
      isOpen,
      minHeight,
      onClose,
      onCreditedInvoiceClick,
    } = this.props;

    return(
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
        <div className="invoice-modal__container" style={{minHeight: minHeight}}>

          <div className='invoice-modal__header'>
            <h1>Laskun tiedot</h1>
            <CloseButton
              className='position-topright'
              disabled={!isOpen}
              onClick={onClose}
              setReference={this.setCloseButtonReference}
              title='Sulje'
            />
          </div>

          <div className="invoice-modal__body">
            <InvoiceTemplate
              invoice={invoice}
              onCreditedInvoiceClick={onCreditedInvoiceClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default InvoiceModal;
