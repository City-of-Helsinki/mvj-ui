// @flow
import React from 'react';
import classnames from 'classnames';

type Props = Object;

const TabPane = (props: Props) => <div className={classnames('tab__content', props.className)}>{props.children}</div>;

export default TabPane;
