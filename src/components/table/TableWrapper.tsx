import React from "react";
type Props = {
  children?: any;
};

const TableWrapper = ({ children }: Props) => (
  <div className="table__table-wrapper">{children}</div>
);

export default TableWrapper;
