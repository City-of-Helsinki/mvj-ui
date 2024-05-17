import React from "react";
import ContactForm from "./forms/ContactForm";
import GreenBox from "src/components/content/GreenBox";

const ContactEdit = () => {
  return <GreenBox className='no-margin'>
      <ContactForm />
    </GreenBox>;
};

export default ContactEdit;