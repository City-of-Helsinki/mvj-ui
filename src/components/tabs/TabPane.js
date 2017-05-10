// @flow
import {cloneElement} from 'react';

type Props = Object;

const TabPane = (props: Props) => cloneElement(props.children, {className: props.className});

export default TabPane;
