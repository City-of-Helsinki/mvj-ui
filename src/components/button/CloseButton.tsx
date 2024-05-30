import React from "react";
import classNames from "classnames";
// @ts-ignore: unable to find svg file. Handled by webpack?
import closeIcon from "../../../assets/icons/icon_close.svg";
type Props = {
  className?: string;
  onClick: (...args: Array<any>) => any;
  setReference?: (...args: Array<any>) => any;
  title?: string;
  type?: any;
};

const CloseButton = ({
  className,
  onClick,
  setReference,
  title,
  type = 'button'
}: Props) => {
  const handleSetReference = (element: Record<string, any> | null | undefined) => {
    if (element && setReference) {
      setReference(element);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onClick();
    }
  };

  return <button ref={handleSetReference} aria-label='Sulje' className={classNames('close-button-component', className)} type={type} title={title} onClick={onClick} onKeyDown={handleKeyDown}>
      <img src={closeIcon} alt='Poista' />
    </button>;
};

export default CloseButton;