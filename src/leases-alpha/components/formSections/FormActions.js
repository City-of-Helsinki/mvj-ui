// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

type Props = {
  className?: string,
  icon?: Object,
  invalid: Boolean,
  submitting: Boolean,
  pristine: Boolean,
  label: string,
};

const FormActions = ({className, icon, invalid, submitting, pristine, label, ...rest}: Props) => {
  return (
    <Row className={classNames('mvj-form__actions', className)}>
      <Column medium={12}>

        <button
          type="submit"
          disabled={invalid || submitting || pristine}>
          {label} {icon && icon}
        </button>

        {rest.displayCreateButton &&
        <span className="create-new" onClick={rest.onCreateClick}>
          {rest.createLabel}
        </span>
        }
      </Column>
    </Row>
  );
};

export default FormActions;
