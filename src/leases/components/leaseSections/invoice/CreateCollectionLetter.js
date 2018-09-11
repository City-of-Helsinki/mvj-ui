// @flow
import React from 'react';

import CreateCollectionLetterForm from './forms/CreateCollectionLetterForm';
import GreenBox from '$components/content/GreenBox';

const CreateCollectionLetter = () => {
  return(
    <GreenBox>
      <h3>Perintäkirjeen luominen</h3>
      <CreateCollectionLetterForm />
    </GreenBox>
  );
};

export default CreateCollectionLetter;
