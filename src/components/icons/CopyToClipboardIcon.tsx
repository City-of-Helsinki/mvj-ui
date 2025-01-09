import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const CopyToClipboardIcon = ({ className }: Props) => (
  <svg
    viewBox="0 0 21 21"
    className={classNames("icons", "icons__copy-to-clipboard", className)}
  >
    <title>Kopio leikepöydälle</title>
    <g stroke="none" fill="none">
      <g id="Artboard" transform="translate(-614.000000, -334.000000)">
        <path
          d="M634.600586,337.896226 L634.600586,354.5 L617.933549,354.5 L617.933549,337.896226 L634.600586,337.896226 Z M633.085401,339.40566 L619.448734,339.40566 L619.448734,352.990566 L633.085401,352.990566 L633.085401,339.40566 Z M616.115771,336.009434 L616.115771,350.349057 L614.600586,350.349057 L614.600586,334.5 L630.51003,334.5 L630.51003,336.009434 L616.115771,336.009434 Z"
          id="Combined-Shape"
        ></path>
      </g>
    </g>
  </svg>
);

export default CopyToClipboardIcon;
