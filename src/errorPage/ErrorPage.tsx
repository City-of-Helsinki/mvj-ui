import React from "react";
import { Row, Column } from "react-foundation";

const ErrorPage = () => <div className="error-page">
    <Row>
      <Column>
        <h1>404</h1>
        <p>Etsimääsi sivua ei ole olemassa</p>
      </Column>
    </Row>
  </div>;

export default ErrorPage;