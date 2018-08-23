// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
}

const BackIcon = ({className}: Props) =>
  <svg className={classNames('icons', className)} focusable='false' viewBox="0 0 30 30">
    <path xmlns="http://www.w3.org/2000/svg" transform="rotate(-90 14 15)" id="svg_1" d="m14,6.77l0.84,0.71l14.07,14.060001l-1.689999,1.689999l-13.220001,-13.289999l-13.220001,13.289999l-1.689999,-1.689999l14.07,-14.060001l0.84,-0.71z"/>
  </svg>;

export default BackIcon;
