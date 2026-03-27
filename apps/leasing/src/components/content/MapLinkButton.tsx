import React from "react";
type Props = {
  label?: string;
  onClick: (...args: Array<any>) => any;
};

const MapLinkButton = ({ label = "Kartta", onClick }: Props) => (
  <a
    className="map-link-button"
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <span>{label}</span>
    <i />
  </a>
);

export default MapLinkButton;
