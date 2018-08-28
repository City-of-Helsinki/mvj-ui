// @flow
import React from 'react';
import classNames from 'classnames';

import ExternalLinkIcon from '$components/icons/ExternalLinkIcon';

type Props = {
  className?: string,
  href: string,
  label: string,
  openInNewTab?: boolean,
}

const ExternalLink = ({
  className,
  href,
  label,
  openInNewTab = true,
}: Props) =>
  <a className={classNames('links__external-link', className)} target={openInNewTab ? '_blank' : '_self'} href={href}>
    {label}
    <ExternalLinkIcon />
  </a>;

export default ExternalLink;
