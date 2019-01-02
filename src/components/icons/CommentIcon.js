// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
}

const CommentIcon = ({className}: Props) =>
  <svg focusable='false' viewBox="0 0 30 30" className={classNames('icons', 'icons__comment', className)}>
    <title>Avaa kommentointi</title>
    <path d="M.38 1.85h29.24v22.5H18.87l-3 3.1-.84.7-.84-.7-3-3.1H.38V1.85zM2.62 4.1v18h9.43l.42.28L15 25l2.53-2.6.47-.3h9.43v-18zm4.5 3.38h15.76v2.25H7.12zm0 4.5h15.76v2.25H7.12zm0 4.5h11.26v2.25H7.12z"/>
  </svg>;

export default CommentIcon;
