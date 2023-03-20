// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  field: any,
  removeButton: any,
}

const FieldAndRemoveButtonWrapper = ({
  className,
  field,
  removeButton,
}: Props): React$Node =>
  <div className={classNames('form__field-and-remove-button-wrapper', className)}>
    {field}
    <div className='form__field-and-remove-button-wrapper_button'>
      {removeButton}
    </div>
  </div>;

export default FieldAndRemoveButtonWrapper;
