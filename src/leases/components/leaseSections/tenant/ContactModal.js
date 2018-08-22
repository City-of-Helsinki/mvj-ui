// @flow
import React from 'react';
import {connect} from 'react-redux';

import Button from '$components/button/Button';
import ContactForm from '$src/contacts/components/forms/ContactForm';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import Modal from '$components/modal/Modal';
import {getIsContactFormValid, getIsSaveClicked} from '$src/contacts/selectors';

import type {RootState} from '$src/root/types';

type Props = {
  isContactFormValid: boolean,
  isOpen: boolean,
  isSaveClicked: boolean,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
  onSaveAndAdd : Function,
  showSaveAndAdd: Function,
  title: string,
}

const ContactModal = ({
  isContactFormValid,
  isOpen,
  isSaveClicked,
  onCancel,
  onClose,
  onSave,
  onSaveAndAdd,
  showSaveAndAdd,
  title,
}: Props) => {
  return(
    <div className='contact-modal'>
      <Modal
        className='modal-center modal-large'
        isOpen={isOpen}
        onClose={onClose}
        title={title || 'Uusi asiakas'}
      >
        <div>
          <GreenBoxEdit
            className='no-margin'
          >
            {isOpen &&
              <ContactForm isFocusedOnMount/>
            }
          </GreenBoxEdit>
          <div className='button-wrapper'>
            <Button
              className='button-red'
              disabled={!isOpen}
              label='Peruuta'
              onClick={onCancel}
            />
            <Button
              className='button-green'
              disabled={!isOpen || (isSaveClicked && !isContactFormValid)}
              label='Tallenna'
              onClick={onSave}
            />
            {showSaveAndAdd &&
              <Button
                className='button-green'
                disabled={!isOpen || (isSaveClicked && !isContactFormValid)}
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
    isSaveClicked: getIsSaveClicked(state),
  };
};

export default connect(
  mapStateToProps,
)(ContactModal);
