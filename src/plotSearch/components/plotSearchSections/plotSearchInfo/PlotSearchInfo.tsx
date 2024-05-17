import React from "react";
import { Row, Column } from "react-foundation";
type Props = {
  title: string;
};

const PlotSearchInfo = ({
  title
}: Props): React.ReactNode => {
  return <div className='lease-info'>
      <Row>
        <Column>
          <h1 className='lease-info__identifier'>{title}</h1>
        </Column>
      </Row>
    </div>;
};

export default PlotSearchInfo;