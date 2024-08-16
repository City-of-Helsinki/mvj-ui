import React from "react";
import classNames from "classnames";
import Collapse from "@/components/collapse/Collapse";
type Props = {
  children?: JSX.Element | null | undefined;
  className?: string;
  headerTitle: string;
};

const PlotApplicationInfoCheckCollapse: React.ComponentType<Props> = ({
  children,
  className,
  headerTitle
}: Props) => {
  return <Collapse className={classNames('collapse__third PlotApplicationInfoCheckCollapse', className)} headerTitle={headerTitle}>
      {children}
    </Collapse>;
};

export default PlotApplicationInfoCheckCollapse;