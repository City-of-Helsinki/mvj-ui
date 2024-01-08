//@flow

import React from 'react';
import classNames from 'classnames';

import Collapse from '$src/components/collapse/Collapse';

type Props = {
  children?: ?React$Node,
  className?: string,
  headerTitle: string
};

const PlotApplicationInfoCheckCollapse: React$ComponentType<Props> = ({children, className, headerTitle}: Props) => {
  return (
    <Collapse
      className={classNames('collapse__third PlotApplicationInfoCheckCollapse', className)}
      headerTitle={headerTitle}>
      {children}
    </Collapse>
  );
};

export default PlotApplicationInfoCheckCollapse;
