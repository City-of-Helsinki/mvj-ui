import React from "react";
type Props = {
  children?: any;
};

const ModalButtonWrapper = ({
  children
}: Props): React.ReactNode => <div className='modal__button-wrapper'>{children}</div>;

export default ModalButtonWrapper;