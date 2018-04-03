// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
}

const AddIcon = ({className}: Props) =>
  <svg className={classNames('icons', className)} viewBox="0 0 30 30">
    <path d="M5.46 5.46A13 13 0 0 1 15 1.5a13 13 0 0 1 9.54 4 13 13 0 0 1 4 9.54 13 13 0 0 1-4 9.54 13 13 0 0 1-9.54 4 13 13 0 0 1-9.54-4A13 13 0 0 1 1.5 15a13 13 0 0 1 3.96-9.54zm17.62 1.46A11 11 0 0 0 15 3.58a11 11 0 0 0-8.08 3.34A11 11 0 0 0 3.58 15a11 11 0 0 0 3.34 8.08A11 11 0 0 0 15 26.42a11 11 0 0 0 8.08-3.34A11 11 0 0 0 26.42 15a11 11 0 0 0-3.34-8.08zM14 8.77h2V14h5.19v2H16v5.19h-2V16H8.77v-2H14z"/>
  </svg>;

export default AddIcon;
