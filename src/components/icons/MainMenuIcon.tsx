import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const MainMenuIcon = ({
  className
}: Props) => <svg className={classNames('icons', className)} viewBox="0 0 22 13">
    <title>Avaa/sulje päävalikko</title>
    <g fill="none">
      <g transform="translate(-1355.000000, -24.000000)" strokeWidth="2.5">
        <polyline transform="translate(1366.000000, 31.000000) rotate(180.000000) translate(-1366.000000, -31.000000) " points="1376 26 1366.0358 36 1356 26"></polyline>
      </g>
    </g>
  </svg>;

export default MainMenuIcon;