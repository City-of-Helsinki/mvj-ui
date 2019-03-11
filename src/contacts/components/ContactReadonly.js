// @flow
import React from 'react';

import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import GreenBox from '$components/content/GreenBox';

import type {Contact} from '../types';

type Props = {
  contact: Contact,
}

const ContactReadonly = ({contact}: Props) => {
  return (
    <GreenBox>
      <ContactTemplate
        contact={contact}
      />
    </GreenBox>
  );
};

export default ContactReadonly;
