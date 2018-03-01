// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  label: string,
  onClick: Function,
  title: ?string,
}

const AddButtonSecondary = ({className, label, onClick, title}: Props) =>
  <a
    className={classNames('add-button-secondary', className)}
    onClick={() => onClick()}
    title={title || label} >
    <i/>
    <span>{label}</span>
  </a>;


export default AddButtonSecondary;
