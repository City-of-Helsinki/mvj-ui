// @flow
import React from 'react';
import {connect} from 'react-redux';

import Button from '$components/button/Button';
import ContactForm from './forms/ContactForm';
import GreenBox from '$components/content/GreenBox';
import Modal from '$components/modal/Modal';
import {ButtonColors} from '$components/enums';
import {
  getIsContactFormValid,
  getIsSaveClicked,
  getMethods as getContactMethods,
} from '$src/contacts/selectors';

import type {Methods} from '$src/types';
import type {RootState} from '$src/root/types';

type Props = {
  contactMethods: Methods,
  isContactFormValid: boolean,
  isOpen: boolean,
  isSaveClicked: boolean,
  onCancel: Function,
  onClose: Function,
  onSave: Function,
  onSaveAndAdd : Function,
  showSave: boolean,
  showSaveAndAdd: boolean,
  title: string,
}

const ContactModal = ({
  contactMethods,
  isContactFormValid,
  isOpen,
  isSaveClicked,
  onCancel,
  onClose,
  onSave,
  onSaveAndAdd,
  showSave = true,
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
          <GreenBox className='no-margin'>
            {isOpen && <ContactForm isFocusedOnMount/>}
          </GreenBox>

          <div className='button-wrapper'>
            <Button
              className={ButtonColors.SECONDARY}
              onClick={onCancel}
              text='Peruuta'
            />
            {showSave &&
              <Button
                className={ButtonColors.SUCCESS}
                disabled={!contactMethods.PATCH || isSaveClicked && !isContactFormValid}
                onClick={onSave}
                text='Tallenna'
              />
            }
            {showSaveAndAdd &&
              <Button
                className={ButtonColors.SUCCESS}
                disabled={!contactMethods.POST || (isSaveClicked && !isContactFormValid)}
                onClick={onSaveAndAdd}
                text='Tallenna ja Lisää'
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
    contactMethods: getContactMethods(state),
    isContactFormValid: getIsContactFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
  };
};

export default connect(
  mapStateToProps,
)(ContactModal);
