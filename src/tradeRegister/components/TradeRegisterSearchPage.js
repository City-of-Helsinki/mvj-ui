// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import ContentContainer from '$components/content/ContentContainer';
import PageContainer from '$components/content/PageContainer';
import TradeRegisterTemplate from '$src/tradeRegister/components/TradeRegisterTemplate';

type Props = {

};

class TradeRegisterSearchPage extends PureComponent<Props> {
  render() {
    return (
      <PageContainer>
        <ContentContainer>
          <TradeRegisterTemplate
            businessId='0831312-4'
          />
        </ContentContainer>
      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    
  ),
)(TradeRegisterSearchPage);
