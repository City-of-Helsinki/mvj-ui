// @flow
import React from 'react';

import ContactForm from './forms/ContactForm';
import ContentContainer from '$components/content/ContentContainer';
import GreenBoxEdit from '$components/content/GreenBoxEdit';

import type {Attributes} from '../types';

type Props = {
  attributes: Attributes,

}

const ContactEdit = ({attributes}: Props) => {
  return (
    <ContentContainer>
      <GreenBoxEdit className='no-margin'>
        <ContactForm
          attributes={attributes}
        />
      </GreenBoxEdit>
    </ContentContainer>
  );
};

export default ContactEdit;
