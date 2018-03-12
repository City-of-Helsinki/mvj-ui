// @flow
import React from 'react';

import AddButton from '$components/form/AddButton';
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
  showStartInvoicingButton: boolean,
}

const AddBillComponent = ({
  editMode,
  onAdd,
  onClose,
  onSave,
  onStartInvoicing,
  onStopInvoicing,
  showStartInvoicingButton,
}: Props) => {
  return (
    <div className='billing__add-bill'>
      {!editMode &&
        <FormSection>
          <AddButton
            label='Luo uusi lasku'
            onClick={() => onAdd()}
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
      {editMode &&
        <NewBillForm
          onClose={onClose}
          onSave={(bill) => onSave(bill)}
        />
      }
    </div>
  );
};

export default AddBillComponent;
