import React from "react";
import { connect } from "react-redux";
import Button from "src/components/button/Button";
import ContactForm from "./forms/ContactForm";
import GreenBox from "src/components/content/GreenBox";
import Modal from "src/components/modal/Modal";
import { ButtonColors } from "src/components/enums";
import { Methods } from "src/enums";
import { isMethodAllowed } from "src/util/helpers";
import { getIsContactFormValid, getIsSaveClicked, getMethods as getContactMethods } from "src/contacts/selectors";
import type { Methods as MethodsType } from "src/types";
import type { RootState } from "src/root/types";
type Props = {
  contactMethods: MethodsType;
  isContactFormValid: boolean;
  isOpen: boolean;
  isSaveClicked: boolean;
  onCancel: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
  onSaveAndAdd: (...args: Array<any>) => any;
  showSave: boolean;
  showSaveAndAdd: boolean;
  title: string;
};

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
  title
}: Props) => {
  return <div className='contact-modal'>
      <Modal className='modal-large' isOpen={isOpen} onClose={onClose} title={title || 'Uusi asiakas'}>
        <div>
          <GreenBox className='no-margin'>
            {isOpen && <ContactForm isFocusedOnMount />}
          </GreenBox>

          <div className='button-wrapper'>
            <Button className={ButtonColors.SECONDARY} onClick={onCancel} text='Peruuta' />
            {showSave && <Button className={ButtonColors.SUCCESS} disabled={!isMethodAllowed(contactMethods, Methods.PATCH) || isSaveClicked && !isContactFormValid} onClick={onSave} text='Tallenna' />}
            {showSaveAndAdd && <Button className={ButtonColors.SUCCESS} disabled={!isMethodAllowed(contactMethods, Methods.POST) || isSaveClicked && !isContactFormValid} onClick={onSaveAndAdd} text='Tallenna ja Lisää' />}
          </div>
        </div>
      </Modal>
    </div>;
};

const mapStateToProps = (state: RootState) => {
  return {
    contactMethods: getContactMethods(state),
    isContactFormValid: getIsContactFormValid(state),
    isSaveClicked: getIsSaveClicked(state)
  };
};

export default connect(mapStateToProps)(ContactModal);