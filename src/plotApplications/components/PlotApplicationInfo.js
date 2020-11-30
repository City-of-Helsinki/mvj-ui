// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

type Props = {
  title: string,
}

const PlotApplicationInfo = ({
  title,
}: Props) => {

  return (
    <div className='lease-info'>
      <Row>
        <Column>
          <h1 className='lease-info__identifier'>{title}</h1>
        </Column>
      </Row>
    </div>
  );
};

export default connect(
)(PlotApplicationInfo);
