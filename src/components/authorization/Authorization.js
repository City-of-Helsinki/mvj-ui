// @flow
type Props = {
  allow: boolean,
  children?: any,
  errorComponent?: any,
}

const Authorization = ({allow, children, errorComponent}: Props) =>
  allow
    ? children || null
    : errorComponent ? errorComponent : null;

export default Authorization;
