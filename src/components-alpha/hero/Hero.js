// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  children?: Object,
};

const Hero = ({className, children}: Props) => (
  <header className={classNames('mvj-hero', className)}>
    <div className="mvj-hero__content">
      {children}
    </div>
  </header>
);

export default Hero;
