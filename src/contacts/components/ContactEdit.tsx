import React from "react";
import { useDispatch, useSelector } from "react-redux";

import ContactForm from "@/contacts/components/forms/ContactForm";
import GreenBox from "@/components/content/GreenBox";
import { editContact } from "@/contacts/actions";
import { getCurrentContact } from "@/contacts/selectors";

import type { Contact } from "@/contacts/types";

const ContactEdit: React.FC = () => {
  const dispatch = useDispatch();
  const contact = useSelector(getCurrentContact);

  const handleSubmit = async (values: Contact) => {
    dispatch(editContact(values));
  };

  return (
    <GreenBox className="no-margin">
      <ContactForm initialValues={contact} onSubmit={handleSubmit} />
    </GreenBox>
  );
};

export default ContactEdit;
