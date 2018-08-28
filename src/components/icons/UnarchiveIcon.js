// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
}

const UnarchiveIcon = ({className}: Props) =>
  <svg className={classNames('icons', className)} focusable='false' viewBox="0 0 30 30">
    <path d="M2.88 9.27h2.24V25h20.26V9.27h2.25v18H2.88v-18zm12.37-6.54l5.06 5.41h-3.93v11.25h-2.26V8.14h-3.93z"/>
  </svg>;

export default UnarchiveIcon;
