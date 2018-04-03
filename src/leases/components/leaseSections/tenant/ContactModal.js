// @flow
import React from 'react';

import Button from '$components/button/Button';
import ContactForm from '$src/contacts/components/forms/ContactForm';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import Modal from '$components/modal/Modal';

import type {Attributes as ContactAttributes} from '$src/contacts/types';

type Props = {
  contactAttributes: ContactAttributes,
  isOpen: boolean,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
}

const ContactModal = ({
  contactAttributes,
  isOpen,
  onCancel,
  onClose,
  onSave,
}: Props) => {
  return(
    <div className='contact-modal'>
      <Modal
        className='modal-center modal-large'
        isOpen={isOpen}
        onClose={onClose}
        title='Uusi asiakas'
      >
        <div>
          <GreenBoxEdit
            className='no-margin'
          >
            {isOpen &&
              <ContactForm
                attributes={contactAttributes}
              />
            }

          </GreenBoxEdit>
          <div className='button-wrapper'>
            <Button
              className='button-red'
              label='Peruuta'
              onClick={onCancel}
            />
            <Button
              className='button-green'
              label='Tallenna'
              onClick={onSave}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactModal;
