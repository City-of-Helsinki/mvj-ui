// @flow
import React from 'react';

type Props = {
  field: any,
  removeButton: any,
}

const FieldAndRemoveButtonWrapper = ({
  field,
  removeButton,
}: Props) =>
  <div className='form__field-and-remove-button-wrapper'>
    {field}
    <div className='form__field-and-remove-button-wrapper_button'>
      {removeButton}
    </div>
  </div>;

export default FieldAndRemoveButtonWrapper;
