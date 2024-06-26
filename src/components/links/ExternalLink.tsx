import React from "react";
import classNames from "classnames";
import ExternalLinkIcon from "/src/components/icons/ExternalLinkIcon";
type Props = {
  className?: string;
  href: string | null | undefined;
  openInNewTab?: boolean;
  text: string;
};

const ExternalLink = ({
  className,
  href,
  openInNewTab = true,
  text
}: Props) => {
  const isRelativePath = href && href.substring(0, 4) !== 'www.' ? true : false;
  return <a onMouseDown={e => e.stopPropagation()
  /* Links are used in clickable rows in few places */
  } className={classNames('links__external-link', className)} target={openInNewTab ? '_blank' : '_self'} href={isRelativePath ? href : `http://${href || ''}`}>
      <span>{text}</span>
      <ExternalLinkIcon />
    </a>;
};

export default ExternalLink;