// @flow
import React, {Component} from 'react';
import scrollToComponent from 'react-scroll-to-component';

import Button from '$components/button/Button';
import FormSection from '$components/form/FormSection';
import NewBillForm from './forms/NewBillForm';

type Props = {
  editMode: boolean,
  onAdd: Function,
  onClose: Function,
  onSave: Function,
  onStartInvoicing: Function,
  onStopInvoicing: Function,
  ref?: Function,
  showStartInvoicingButton: boolean,
}

class AddBillComponent extends Component {
  props: Props

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

  render() {
    const {
      editMode,
      onClose,
      onSave,
      onStartInvoicing,
      onStopInvoicing,
      showStartInvoicingButton,
    } = this.props;
    return (
      <div className='billing__add-bill'>
        {!editMode &&
          <FormSection>
            <Button
              className='button-green no-margin'
              label='+ Luo uusi lasku'
              onClick={this.handleOnAdd}
              title='Luo uusi lasku'
            />
            {showStartInvoicingButton
              ? (
                <Button
                  className='button-green'
                  label='Käynnistä laskutus'
                  onClick={() => onStartInvoicing()}
                  title='Käynnistä laskutus'
                />
              ) : (
                <Button
                  className='button-red'
                  label='Keskeytä laskutus'
                  onClick={() => onStopInvoicing()}
                  title='Keskeytä laskutus'
                />
              )
            }
          </FormSection>
        }
        <div ref={(ref) => this.panel = ref}>
          {editMode &&
            <NewBillForm
              onClose={onClose}
              onSave={(bill) => onSave(bill)}
            />
          }
        </div>

      </div>
    );
  }
}

export default AddBillComponent;
