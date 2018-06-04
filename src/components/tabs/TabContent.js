// @flow
type Props = Object;

const TabContent = (props: Props) => props.children.length ? props.children[props.active] || null : props.children || null;

export default TabContent;
