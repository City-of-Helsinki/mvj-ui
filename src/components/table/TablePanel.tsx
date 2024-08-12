import React from "react";
import CloseButton from "@/components/button/CloseButton";
type Props = {
  children: any;
  onClose: (...args: Array<any>) => any;
};

const TablePanel = ({
  children,
  onClose
}: Props) => {
  return <div className='table__table-panel'>
      <CloseButton onClick={onClose} />
      {children}
    </div>;
};

export default TablePanel;