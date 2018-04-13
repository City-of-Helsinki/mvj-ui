// @flow
import React from 'react';

import ContentContainer from '$components/content/ContentContainer';
import ContactInfoTemplate from './ContactInfoTemplate';
import GreenBox from '$components/content/GreenBox';

import type {Attributes, Contact} from '../types';

type Props = {
  attributes: Attributes,
  contact: Contact,
}

const ContactReadonly = ({attributes, contact}: Props) => {
  return (
    <ContentContainer>
      <GreenBox>
        <ContactInfoTemplate
          attributes={attributes}
          contact={contact}
        />
      </GreenBox>
    </ContentContainer>
  );
};

export default ContactReadonly;
