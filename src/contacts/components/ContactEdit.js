// @flow
import React from 'react';

import ContactForm from './forms/ContactForm';
import ContentContainer from '$components/content/ContentContainer';
import GreenBoxEdit from '$components/content/GreenBoxEdit';

const ContactEdit = () => {
  return (
    <ContentContainer>
      <GreenBoxEdit className='no-margin'>
        <ContactForm/>
      </GreenBoxEdit>
    </ContentContainer>
  );
};

export default ContactEdit;
