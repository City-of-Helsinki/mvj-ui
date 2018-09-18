// @flow
import React from 'react';

import FormText from './FormText';
import FormTextTitle from './FormTextTitle';

type Props = {
  text: any,
  textClassName?: string,
  title: string,
}

const FormTitleAndText = ({
  text,
  textClassName,
  title,
}: Props) => {
  return(
    <div>
      <FormTextTitle title={title} />
      <FormText className={textClassName}>{text}</FormText>
    </div>
  );
};

export default FormTitleAndText;
