// @flow
import React from 'react';
// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {translate} from 'react-i18next';

type Props = {
  error: string,
  t: Function,
};

const ErrorBlock = ({error, t}: Props) =>
  // <CSSTransitionGroup
  //   transitionName="error-block"
  //   transitionAppear={true}
  //   transitionAppearTimeout={0}
  //   transitionEnter={false}
  //   transitionLeave={false}>
  <span className="form-field__error-block" role="alert">{t(error)}</span>;
  // </CSSTransitionGroup>;

export default translate(['validation'])(ErrorBlock);
