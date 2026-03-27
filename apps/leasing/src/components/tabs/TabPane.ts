import { cloneElement } from "react";
type Props = Record<string, any>;

const TabPane = (props: Props) =>
  cloneElement(props.children, {
    className: props.className,
  });

export default TabPane;
