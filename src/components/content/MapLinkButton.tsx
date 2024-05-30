import React from "react";
type Props = {
  label?: string;
  onClick: (...args: Array<any>) => any;
};

const MapLinkButton = ({
  label = 'Kartta',
  onClick
}: Props) => <a className='map-link-button' onClick={onClick}>
    <span>{label}</span>
    <i />
  </a>;

export default MapLinkButton;