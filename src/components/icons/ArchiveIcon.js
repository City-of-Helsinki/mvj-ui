// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
}

const ArchiveIcon = ({className}: Props) =>
  <svg className={classNames('icons', className)} focusable='false' viewBox="0 0 30 30">
    <path d="M1.5 2.62h27v6.76h-1.12v18H2.62v-18H1.5V2.62zm2.25 2.26v2.24h22.5V4.88zm1.13 4.5v15.74h20.24V9.38zm6.53 2.24h7a1.13 1.13 0 1 1 0 2.26h-6.9a1.13 1.13 0 0 1-.77-.32 1.05 1.05 0 0 1-.35-.81 1 1 0 0 1 .32-.74 1.34 1.34 0 0 1 .7-.39z"/>
  </svg>;

export default ArchiveIcon;
