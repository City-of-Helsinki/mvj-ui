type Props = {
  allow: boolean;
  children?: React.ReactNode;
  errorComponent?: React.ReactNode;
};

const Authorization = ({
  allow,
  children,
  errorComponent
}: Props): React.ReactNode => allow ? children || null : errorComponent ? errorComponent : null;

export default Authorization;