import React from "react";
import classNames from "classnames";
import CloseButton from "@/components/button/CloseButton";
type Props = {
  footer?: any;
  children: any;
  innerRef?: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  title: string;
};

const TablePanelContainer = ({
  children,
  footer,
  innerRef,
  onClose,
  title
}: Props) => {
  return <div className='table__table-panel-container' ref={innerRef}>
      <div className="table__table-panel-container_wrapper">
        <div className='table__table-panel-container_header'>
          <h3>{title}</h3>
          <CloseButton className='position-topright' onClick={onClose} title='Sulje' />
        </div>
        <div className={classNames('table__table-panel-container_body', {
        'table__table-panel-container_body--with-footer': footer
      })}>
          {children}
        </div>
        {footer && <div className='table__table-panel-container_footer'>
            {footer}
          </div>}
      </div>
    </div>;
};

export default TablePanelContainer;