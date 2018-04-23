// @flow
import React from 'react';
import {connect} from 'react-redux';

import Button from '$components/button/Button';
import ContactForm from '$src/contacts/components/forms/ContactForm';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import Modal from '$components/modal/Modal';
import {getIsContactFormValid} from '$src/contacts/selectors';

import type {Attributes as ContactAttributes} from '$src/contacts/types';
import type {RootState} from '$src/root/types';

type Props = {
  contactAttributes: ContactAttributes,
  isContactFormValid: boolean,
  isOpen: boolean,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
  onSaveAndAdd : Function,
  showSaveAndAdd: Function,
}

const ContactModal = ({
  contactAttributes,
  isContactFormValid,
  isOpen,
  onCancel,
  onClose,
  onSave,
  onSaveAndAdd,
  showSaveAndAdd,
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
              disabled={!isContactFormValid}
              label='Tallenna'
              onClick={onSave}
            />
            {showSaveAndAdd &&
              <Button
                className='button-green'
                disabled={!isContactFormValid}
                label='Tallenna ja Lisää'
                onClick={onSaveAndAdd}
              />
            }
          </div>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    isContactFormValid: getIsContactFormValid(state),
  };
};

export default connect(
  mapStateToProps,
)(ContactModal);
