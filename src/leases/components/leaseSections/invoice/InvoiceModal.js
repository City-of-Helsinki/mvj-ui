// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';

import CloseButton from '$components/button/CloseButton';
import InvoiceTemplate from './InvoiceTemplate';

const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;

type Props = {
  invoice: Object,
  minHeight: ?number,
  onClose: Function,
  onKeyCodeDown: Function,
  onKeyCodeUp: Function,
  onResize: Function,
  show: boolean,
}

class InvoiceModal extends Component<Props> {
  modal: any
  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
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

  onResize = () => {
    const {onResize} = this.props;
    onResize();
  }


  render() {
    const {
      invoice,
      minHeight,
      onClose,
      show,
    } = this.props;

    return(
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

          <div className="invoice-modal__body">
            <InvoiceTemplate
              invoice={invoice}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default InvoiceModal;
