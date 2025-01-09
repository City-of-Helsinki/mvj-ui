import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const MoveDownIcon = ({
  className,
}: Props): React.ReactElement<React.ComponentProps<"svg">, "svg"> => (
  <svg
    className={classNames("icons", "icons__move-down", className)}
    viewBox="11 0 16 27"
  >
    <title>Siirrä alas</title>
    <g id="icon_sort2" stroke="none" strokeWidth="1" fillRule="evenodd">
      <polygon
        id="Path-Copy-2"
        fillRule="nonzero"
        transform="translate(19.060000, 13.330000) rotate(-180.000000) translate(-19.060000, -13.330000) "
        points="19.06 5 24.12 10.41 20.19 10.41 20.19 21.66 17.93 21.66 17.93 10.41 14 10.41"
      ></polygon>
    </g>
  </svg>
);

export default MoveDownIcon;
