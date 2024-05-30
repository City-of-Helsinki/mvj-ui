import React from "react";
import classNames from "classnames";
type Props = {
  alignCenter?: boolean;
  buttonComponent?: any;
  children: any;
  hideIcon?: boolean;
  style?: Record<string, any>;
  success?: boolean;
};

const WarningContainer = ({
  alignCenter,
  buttonComponent,
  children,
  hideIcon,
  style,
  success
}: Props) => <div className={classNames('content__warning-container', {
  'content__warning-container--align-center': alignCenter,
  'content__warning-container--success': success
})} style={style}>
    <div className='content__warning-container_empty-space'></div>
    {buttonComponent && <div className='content__warning-container_button-wrapper'>{buttonComponent}</div>}
    <div className='content__warning-container_wrapper'>{children}</div>
    {!hideIcon && <i />}
  </div>;

export default WarningContainer;