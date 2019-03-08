// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import CompanyExtended from '$src/tradeRegister/components/CompanyExtended';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {fetchTradeRegisterCompanyExtendedById} from '$src/tradeRegister/actions';
import {
  getIsFetchingCompanyExtendedById,
} from '$src/tradeRegister/selectors';

type Props = {
  businessId: string,
  fetchTradeRegisterCompanyExtendedById: Function,
  isFetchingCompanyExtended: boolean,
}

class TradeRegisterTemplate extends PureComponent<Props> {
  componentDidMount() {
    const {businessId, fetchTradeRegisterCompanyExtendedById} = this.props;

    fetchTradeRegisterCompanyExtendedById(businessId);
  }

  render() {
    const {businessId, isFetchingCompanyExtended} = this.props;

    if(isFetchingCompanyExtended) {
      return <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>;
    }

    return (
      <Fragment>
        <CompanyExtended businessId={businessId} />
      </Fragment>
    );
  }
}

export default flowRight(
  connect(
    (state, props: Props) => {
      return {
        isFetchingCompanyExtended: getIsFetchingCompanyExtendedById(state, props.businessId),
      };
    },
    {
      fetchTradeRegisterCompanyExtendedById,
    }
  ),
)(TradeRegisterTemplate);
