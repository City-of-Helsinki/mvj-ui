// @flow
import React from 'react';

import ContentContainer from '$components/content/ContentContainer';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import GreenBox from '$components/content/GreenBox';

import type {Contact} from '../types';

type Props = {
  contact: Contact,
}

const ContactReadonly = ({contact}: Props) => {
  return (
    <ContentContainer>
      <GreenBox>
        <ContactTemplate
          contact={contact}
        />
      </GreenBox>
    </ContentContainer>
  );
};

export default ContactReadonly;
