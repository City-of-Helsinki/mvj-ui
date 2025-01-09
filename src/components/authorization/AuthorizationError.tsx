import React from "react";
type Props = {
  text: string;
};

const AuthorizationError = ({ text }: Props) => (
  <div className="authorization__error">
    <p>{text}</p>
  </div>
);

export default AuthorizationError;
