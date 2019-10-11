// @flow
import React from 'react';
import classNames from 'classnames';

import ExcelIcon from '$components/icons/ExcelIcon';

type Props = {
  className?: string,
  href: ?string,
  openInNewTab?: boolean,
  text: string,
}

const ExcelLink = ({
  className,
  href,
  openInNewTab = true,
  text,
}: Props) => {
  const isRelativePath = href && href.substring(0, 4) !== 'www.' ? true : false;

  return <a className={classNames('excel__excel-link', className)} target={openInNewTab ? '_blank' : '_self'} href={isRelativePath ? href : `http://${href || ''}`}>
    <span>{text}</span>
    <ExcelIcon />
  </a>;
};


export default ExcelLink;
