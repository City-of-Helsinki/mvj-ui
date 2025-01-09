import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const MoveUpIcon = ({
  className,
}: Props): React.ReactElement<React.ComponentProps<"svg">, "svg"> => (
  <svg
    className={classNames("icons", "icons__move-up", className)}
    viewBox="0 0 16 27"
    version="1.1"
  >
    <title>Siirrä ylös</title>
    <g id="icon_sort2" stroke="none" strokeWidth="1" fillRule="evenodd">
      <polygon
        id="Path"
        fillRule="nonzero"
        points="8.06 5 13.12 10.41 9.19 10.41 9.19 21.66 6.93 21.66 6.93 10.41 3 10.41"
      ></polygon>
    </g>
  </svg>
);

export default MoveUpIcon;
