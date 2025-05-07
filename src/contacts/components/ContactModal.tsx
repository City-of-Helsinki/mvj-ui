import React from "react";
import { Form } from "react-final-form";
import Button from "@/components/button/Button";
import ContactForm from "./forms/ContactForm";
import GreenBox from "@/components/content/GreenBox";
import Modal from "@/components/modal/Modal";
import { ButtonColors } from "@/components/enums";
import { Methods } from "@/enums";
import { isMethodAllowed } from "@/util/helpers";
import { useContactAttributes } from "@/components/attributes/ContactAttributes";
import type { FormApi } from "final-form";
import { useSelector } from "react-redux";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import type { ServiceUnit } from "@/serviceUnits/types";
import { getInitialContactFormValues } from "../selectors";
import type { Contact } from "@/contacts/types";

type Props = {
  isOpen: boolean;
  onCancel: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  onSave: (values: Partial<Contact>, isValid: boolean) => any;
  onSaveAndAdd: (...args: Array<any>) => any;
  showSave: boolean;
  showSaveAndAdd: boolean;
  title: string;
  serviceUnit: ServiceUnit;
};

const ContactModal = ({
  isOpen,
  onCancel,
  onClose,
  onSave,
  onSaveAndAdd,
  showSave = true,
  showSaveAndAdd,
  title,
  serviceUnit,
}: Props) => {
  const { contactMethods } = useContactAttributes();
  const initialContactFormValues = useSelector(getInitialContactFormValues);

  const userActiveServiceUnit = useSelector(getUserActiveServiceUnit);

  const handleSubmit = (values: any, form: FormApi) => {
    const isValid = form?.getState().valid;
    onSave(values, isValid);
  };

  return (
    <div className="contact-modal">
      <Modal
        className="modal-large"
        isOpen={isOpen}
        onClose={onClose}
        title={title || "Uusi asiakas"}
      >
        <Form
          onSubmit={handleSubmit}
          initialValues={{
            ...initialContactFormValues,
            // If initial values are set it is copying, otherwise creating a new contact
            service_unit: initialContactFormValues?.service_unit?.id
              ? initialContactFormValues.service_unit
              : // Allows passing a service unit as a prop in cases when users active service unit could be incorrect
                serviceUnit || userActiveServiceUnit,
          }}
          keepDirtyOnReinitialize={true}
        >
          {({ handleSubmit, form, submitting, pristine, valid }) => (
            <div>
              <GreenBox className="no-margin">
                {isOpen && <ContactForm formApi={form} isFocusedOnMount />}
              </GreenBox>

              <div className="button-wrapper">
                <Button
                  className={ButtonColors.SECONDARY}
                  onClick={onCancel}
                  text="Peruuta"
                />
                {showSave && (
                  <Button
                    className={ButtonColors.SUCCESS}
                    disabled={
                      !isMethodAllowed(contactMethods, Methods.PATCH) ||
                      (submitting && !valid)
                    }
                    onClick={handleSubmit}
                    text="Tallenna"
                  />
                )}
                {showSaveAndAdd && (
                  <Button
                    className={ButtonColors.SUCCESS}
                    disabled={
                      !isMethodAllowed(contactMethods, Methods.POST) ||
                      (submitting && !valid)
                    }
                    onClick={handleSubmit}
                    text="Tallenna ja Lisää"
                  />
                )}
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ContactModal;
