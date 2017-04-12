// @flow
import React from 'react';
import {translate} from 'react-i18next';

type Props = {
  error: string,
  t: Function,
};

const ErrorBlock = ({error, t}: Props) => <span className="form-field__error-block" role="alert">{t(error)}</span>;

export default translate(['validation'])(ErrorBlock);
