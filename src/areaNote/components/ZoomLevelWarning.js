// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  isOpen: boolean,
  text?: string,
}

const ZoomLevelWarning = ({
  isOpen,
  text,
}: Props) =>
  <div className={classNames('area-note-map__zoom-level-warning', {'area-note-map__zoom-level-warning--is-open': isOpen})}>
    {text}
  </div>;

export default ZoomLevelWarning;
