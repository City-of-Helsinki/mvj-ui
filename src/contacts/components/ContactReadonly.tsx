import React from "react";
import ContactTemplate from "@/contacts/components/templates/ContactTemplate";
import GreenBox from "@/components/content/GreenBox";
import type { Contact } from "@/contacts/types";
type Props = {
  contact: Contact;
};

const ContactReadonly = ({
  contact
}: Props) => {
  return <GreenBox>
      <ContactTemplate contact={contact} />
    </GreenBox>;
};

export default ContactReadonly;