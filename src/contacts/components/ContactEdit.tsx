import React from "react";
import { useSelector } from "react-redux";
import { FormSpy } from "react-final-form";

import ContactForm from "@/contacts/components/forms/ContactForm";
import GreenBox from "@/components/content/GreenBox";
import { getCurrentContact } from "@/contacts/selectors";

import type { FormApi } from "final-form";
import type { Contact } from "@/contacts/types";
import type { SetTabDirtyFunction } from "@/contacts/types";

const ContactEdit: React.FC<{
  form: FormApi<Contact>;
  tabId: number;
  setTabDirty: SetTabDirtyFunction;
}> = ({ form, tabId, setTabDirty }) => {
  const contact = useSelector(getCurrentContact);
  const formValues = form ? form.getState().values : null;
  const initialValues = formValues || contact;

  return (
    <GreenBox className="no-margin">
      <FormSpy subscription={{ dirty: true }}>
        {({ dirty }) => {
          // Update tab dirty state whenever form dirty state changes
          React.useEffect(() => {
            setTabDirty(tabId, dirty);
          }, [dirty, tabId, setTabDirty]);

          return null;
        }}
      </FormSpy>
      <ContactForm initialValues={initialValues} formApi={form} />
    </GreenBox>
  );
};

export default ContactEdit;
