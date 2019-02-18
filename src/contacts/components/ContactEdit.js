// @flow
import React from 'react';

import ContactForm from './forms/ContactForm';
import ContentContainer from '$components/content/ContentContainer';
import GreenBox from '$components/content/GreenBox';

const ContactEdit = () => {
  return (
    <ContentContainer>
      <GreenBox className='no-margin'>
        <ContactForm/>
      </GreenBox>
    </ContentContainer>
  );
};

export default ContactEdit;
