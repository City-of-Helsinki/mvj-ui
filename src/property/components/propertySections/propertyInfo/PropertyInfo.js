// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

const PropertyInfo = () => {

  return (
    <div className='lease-info'>
      <Row>
        <Column>
          <h1 className='lease-info__identifier'>{'Kruununvuorenrannan kortteleiden 49288 ja 49289 hinta- ja laatukilpailu'}</h1>
        </Column>
      </Row>
    </div>
  );
};

export default connect(
)(PropertyInfo);
