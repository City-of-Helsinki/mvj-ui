// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
}

const QuestionIcon = ({className}: Props) =>
  <svg viewBox="0 0 16 16" className={classNames('icons', className)}>
    {/* CC 4.0 https://fontawesome.com/license */}
    <path d="M15.6,8c0,4.4-3.4,7.9-7.6,7.9S0.4,12.4,0.4,8c0-4.3,3.4-7.9,7.6-7.9S15.6,3.7,15.6,8z M8.2,2.7c-1.7,0-2.7,0.7-3.6,2 C4.5,4.9,4.6,5.1,4.7,5.3l1.1,0.8C5.9,6.2,6.2,6.2,6.3,6C6.8,5.3,7.2,4.9,8,4.9c0.6,0,1.4,0.4,1.4,1c0,0.5-0.4,0.7-1,1.1	C7.7,7.4,6.8,8,6.8,9.3v0.1c0,0.2,0.2,0.4,0.4,0.4h1.7c0.2,0,0.4-0.2,0.4-0.4v0c0-0.9,2.5-0.9,2.5-3.4C11.8,4.1,9.9,2.7,8.2,2.7z M8,10.6c-0.8,0-1.4,0.7-1.4,1.5c0,0.8,0.6,1.5,1.4,1.5s1.4-0.7,1.4-1.5C9.4,11.3,8.8,10.6,8,10.6z"/>
  </svg>;

export default QuestionIcon;
