// @flow
import React from 'react';

type Props = {
  children?: any,
}

const VisualisationTypeWrapper = ({
  children,
}: Props): React$Node =>
  <div className='table__visualisation-type-wrapper'>{children}</div>;

export default VisualisationTypeWrapper;
