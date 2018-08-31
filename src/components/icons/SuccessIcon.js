// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
}

const SuccessIcon = ({className}: Props) =>
  <svg viewBox="0 0 20 20" className={classNames('icons', className)}>
    <title>Onnistuminen</title>
    <g stroke="none" fill="none">
      <g id="Artboard" transform="translate(-460.000000, -212.000000)">
        <g transform="translate(460.000000, 212.000000)">
          <path d="M10,20 C4.4771525,20 0,15.5228475 0,10 C0,4.4771525 4.4771525,0 10,0 C15.5228475,0 20,4.4771525 20,10 C20,15.5228475 15.5228475,20 10,20 Z M4.78688069,11.1967526 L9.14826021,15.2908624 L15.2810207,6.58263967 L13.9228498,5.70063314 L8.85349253,12.9671576 L5.97353262,10.0504481 L4.78688069,11.1967526 Z"></path>
        </g>
      </g>
    </g>
  </svg>;

export default SuccessIcon;
