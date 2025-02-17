import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const InfoIcon = ({ className }: Props) => (
  <svg
    className={classNames("icons", "icons__info", className)}
    focusable="false"
    viewBox="0 0 16 16"
  >
    <title>Info</title>
    <g id="Page-1" stroke="none" fill="none">
      <g
        id="Artboard"
        transform="translate(-93.000000, -85.000000)"
        fill="#007A3A"
      >
        <g id="Group-29" transform="translate(93.000000, 85.000000)">
          <path
            d="M8,0 C10.1942857,0 12.0766984,0.785269841 13.6462222,2.35377778 C15.2147302,3.92330159 16,5.80571429 16,8 C16,10.1942857 15.2147302,12.0766984 13.6462222,13.6462222 C12.0766984,15.215746 10.1942857,16 8,16 C5.80571429,16 3.92330159,15.215746 2.35377778,13.6462222 C0.784253968,12.0766984 0,10.1942857 0,8 C0,5.80571429 0.784253968,3.92330159 2.35377778,2.35377778 C3.92330159,0.785269841 5.80571429,0 8,0 Z M7.11111111,2.66666667 L7.11111111,4.66666667 L9.11111111,4.66666667 L9.11111111,2.66666667 L7.11111111,2.66666667 Z M7.11111111,6.55555556 L7.11111111,13.5555556 L9.11111111,13.5555556 L9.11111111,6.55555556 L7.11111111,6.55555556 Z"
            id="Combined-Shape"
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

export default InfoIcon;
