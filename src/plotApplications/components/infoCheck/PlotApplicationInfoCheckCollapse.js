//@flow

import React from 'react';
import Collapse from "../../../components/collapse/Collapse";
import classNames from 'classnames';

type Props = {
  children?: ?React$Node,
  className?: string,
  headerTitle: string
};

const PlotApplicationInfoCheckCollapse: React$ComponentType<Props> = ({ children, className, ...rest } : Props) => {
  return (
    <Collapse className={classNames("collapse__third PlotApplicationInfoCheckCollapse", className)} {...rest}>
      {children}
    </Collapse>
  );
};

export default PlotApplicationInfoCheckCollapse;
