// @flow
import React from 'react';
import classNames from 'classnames';

import ExternalLinkIcon from '$components/icons/ExternalLinkIcon';

type Props = {
  className?: string,
  href: ?string,
  openInNewTab?: boolean,
  text: string,
}

const ExternalLink = ({
  className,
  href,
  openInNewTab = true,
  text,
}: Props) =>
  <a className={classNames('links__external-link', className)} target={openInNewTab ? '_blank' : '_self'} href={href}>
    <span>{text}</span>
    <ExternalLinkIcon />
  </a>;

export default ExternalLink;
