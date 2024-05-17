import React from "react";
type Props = {
  label: string;
  onClick: (...args: Array<any>) => any;
  title: string;
};

const MapLink = ({
  label,
  onClick,
  title
}: Props) => <a className='map-link' onClick={onClick} title={title}>
    <svg className='icon' viewBox="0 0 30 30">
      <path d="M28.5 2.06v21.52l-.7.28-7.88 3.37-.42.22-.42-.15-8.58-3.23-7.45 3.16-1.55.71V6.42l.7-.28 7.88-3.37.42-.22.42.15 8.58 3.23L27 2.77zM9.38 5.44L3.75 7.83v16.73l5.63-2.39zm2.24-.07V22.1l6.76 2.53V7.9zm14.63.07l-5.63 2.39v16.73l5.63-2.39z" />
    </svg>
    <p className='subtitle'>{label}</p>
  </a>;

export default MapLink;