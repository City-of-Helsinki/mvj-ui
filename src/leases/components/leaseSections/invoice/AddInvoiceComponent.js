// @flow
import React, {Component} from 'react';
import scrollToComponent from 'react-scroll-to-component';

import Button from '$components/button/Button';
import CreditInvoiceForm from './forms/CreditInvoiceForm';
import FormSection from '$components/form/FormSection';
import NewInvoiceForm from './forms/NewInvoiceForm';

type Props = {
  disableShowCreditButton: boolean,
  editMode: boolean,
  onAdd: Function,
  onClose: Function,
  onCloseCreditPanel: Function,
  onCredit: Function,
  onSave: Function,
  onShowCreditPanel: Function,
  onStartInvoicing: Function,
  onStopInvoicing: Function,
  ref?: Function,
  showCreditPanel: boolean,
  showStartInvoicingButton: boolean,
}

class AddInvoiceComponent extends Component <Props> {
  creditPanel: any
  panel: any

  handleOnAdd = () => {
    const {onAdd} = this.props;

    onAdd();
    setTimeout(() => {
      scrollToComponent(this.panel, {
        offset: -70,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  handleShowCreditPanel = () => {
    const {onShowCreditPanel} = this.props;

    onShowCreditPanel();
    setTimeout(() => {
      scrollToComponent(this.creditPanel, {
        offset: -70,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  render() {
    const {
      disableShowCreditButton,
      editMode,
      onClose,
      onCloseCreditPanel,
      onCredit,
      onSave,
      onStartInvoicing,
      onStopInvoicing,
      showCreditPanel,
      showStartInvoicingButton,
    } = this.props;
    return (
      <div className='invoice__add-invoice'>
        <FormSection>
          <div>
            <Button
              className='button-green no-margin'
              disabled={disableShowCreditButton}
              label='Hyvitä'
              onClick={this.handleShowCreditPanel}
              title='Hyvitä'
            />

            <Button
              className='button-green'
              disabled={editMode}
              label='+ Luo lasku'
              onClick={this.handleOnAdd}
              title='Luo lasku'
            />
            {showStartInvoicingButton
              ? (
                <Button
                  className='button-green'
                  label='Käynnistä laskutus'
                  onClick={onStartInvoicing}
                  title='Käynnistä laskutus'
                />
              ) : (
                <Button
                  className='button-red'
                  label='Keskeytä laskutus'
                  onClick={onStopInvoicing}
                  title='Keskeytä laskutus'
                />
              )
            }
          </div>
          <div ref={(ref) => this.creditPanel = ref}>
            {showCreditPanel &&
              <CreditInvoiceForm
                onClose={onCloseCreditPanel}
                onSave={onCredit}
              />
            }
          </div>
          <div ref={(ref) => this.panel = ref}>
            {editMode &&
              <NewInvoiceForm
                onClose={onClose}
                onSave={(invoice) => onSave(invoice)}
              />
            }
          </div>
        </FormSection>
      </div>
    );
  }
}

export default AddInvoiceComponent;
