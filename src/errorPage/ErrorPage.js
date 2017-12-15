import React from 'react';
import {Row, Column} from 'react-foundation';

const ErrorPage = () =>
  <div className="error-page">
    <Row>
      <Column>
        <h1>404</h1>
        <Row>
          <Column medium={6} offsetOnMedium={3}>
            <p>Etsimääsi sivua ei ole olemassa</p>
          </Column>
        </Row>
      </Column>
    </Row>
  </div>;

export default ErrorPage;
