// @flow
type Props = {
  allow: boolean,
  children?: React$Node,
  errorComponent?: React$Node,
}

const Authorization = ({allow, children, errorComponent}: Props): React$Node =>
  allow
    ? children || null
    : errorComponent ? errorComponent : null;

export default Authorization;
