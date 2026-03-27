import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const unsubscribe = form.subscribe(
      ({ dirty }) => {
        setTabDirty(tabId, dirty);
      },
      { dirty: true, pristine: true },
    );
    return unsubscribe;
  }, [form, setTabDirty, tabId]);

  return (
    <GreenBox className="no-margin">
      <ContactForm initialValues={initialValues} formApi={form} />
    </GreenBox>
  );
};

export default ContactEdit;
