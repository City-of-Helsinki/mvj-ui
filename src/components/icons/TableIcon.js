// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
}

const MapIcon = ({className}: Props) =>
  <svg className={classNames('icons map-icon', className)} focusable='false' viewBox="0 0 30 30">
    <path d="M1.5 3.75h27v22.5h-27V3.75zM3.75 6v4.5h5.63V6zm0 6.75v4.5h5.63v-4.5zm0 6.75V24h5.63v-4.5zM11.62 6v4.5h14.63V6zm0 6.75v4.5h14.63v-4.5zm0 6.75V24h14.63v-4.5z" />
  </svg>;

export default MapIcon;
