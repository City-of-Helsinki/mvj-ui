import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const ExternalLinkIcon = ({
  className
}: Props) => <svg className={classNames('icons', 'icons__external-link', className)} focusable='false' viewBox="0 0 15 12">
    <g stroke='none' transform="translate(-530.000000, -551.000000)">
      <path d="M531.333333,561.666667 L531.333333,552.333333 L536.9,552.333333 L536.9,551 L531.333333,551 C530.593333,551 530,551.6 530,552.333333 L530,561.666667 C530,562.4 530.593333,563 531.333333,563 L543.066667,563 C543.8,563 544.4,562.4 544.4,561.666667 L544.4,558.5 L543.066667,558.5 L543.066667,561.666667 L531.333333,561.666667 Z M539.733333,552.333333 L542.126667,552.333333 L537.073333,557.386667 L538.013333,558.326667 L543.066667,553.273333 L543.066667,555.666667 L544.4,555.666667 L544.4,551 L539.733333,551 L539.733333,552.333333 Z"></path>
    </g>
  </svg>;

export default ExternalLinkIcon;