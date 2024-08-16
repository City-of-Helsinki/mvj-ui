type Props = {
  allow: boolean;
  children?: JSX.Element;
  errorComponent?: JSX.Element;
};

const Authorization = ({
  allow,
  children,
  errorComponent
}: Props): JSX.Element => allow ? children || null : errorComponent ? errorComponent : null;

export default Authorization;