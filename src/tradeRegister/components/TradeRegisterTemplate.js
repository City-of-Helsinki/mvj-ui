// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import CompanyExtended from '$src/tradeRegister/components/CompanyExtended';
import CompanyNotice from '$src/tradeRegister/components/CompanyNotice';
import CompanyRepresent from '$src/tradeRegister/components/CompanyRepresent';
import DownloadableFiles from '$src/tradeRegister/components/DownloadableFiles';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {
  fetchTradeRegisterCompanyExtendedById,
  fetchTradeRegisterCompanyNoticeById,
  fetchTradeRegisterCompanyRepresentById,
} from '$src/tradeRegister/actions';
import {
  getCompanyExtendedById,
  getCompanyNoticeById,
  getCompanyRepresentById,
  getIsFetchingCompanyExtendedById,
  getIsFetchingCompanyNoticeById,
  getIsFetchingCompanyRepresentById,
} from '$src/tradeRegister/selectors';

type Props = {
  businessId: string,
  companyExtended: ?Object,
  companyNotice: ?Object,
  companyRepresent: ?Object,
  fetchTradeRegisterCompanyExtendedById: Function,
  fetchTradeRegisterCompanyNoticeById: Function,
  fetchTradeRegisterCompanyRepresentById: Function,
  isFetchingCompanyExtended: boolean,
  isFetchingCompanyNotice: boolean,
  isFetchingCompanyRepresent: boolean,
}

class TradeRegisterTemplate extends PureComponent<Props> {
  componentDidMount() {
    const {
      businessId,
      companyExtended,
      companyNotice,
      companyRepresent,
      fetchTradeRegisterCompanyExtendedById,
      fetchTradeRegisterCompanyNoticeById,
      fetchTradeRegisterCompanyRepresentById,
    } = this.props;

    if(!companyExtended) {
      fetchTradeRegisterCompanyExtendedById(businessId);
    }

    if(!companyNotice) {
      fetchTradeRegisterCompanyNoticeById(businessId);
    }

    if(!companyRepresent) {
      fetchTradeRegisterCompanyRepresentById(businessId);
    }
  }

  render() {
    const {
      businessId,
      isFetchingCompanyExtended,
      isFetchingCompanyNotice,
      isFetchingCompanyRepresent,
    } = this.props;

    if(isFetchingCompanyExtended && isFetchingCompanyNotice && isFetchingCompanyRepresent) {
      return <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>;
    }

    return (
      <Fragment>
        <DownloadableFiles businessId={businessId} />

        <CompanyExtended businessId={businessId} />

        <CompanyRepresent businessId={businessId} />

        <CompanyNotice businessId={businessId} />
      </Fragment>
    );
  }
}

export default flowRight(
  connect(
    (state, props: Props) => {
      return {
        companyExtended: getCompanyExtendedById(state, props.businessId),
        companyNotice: getCompanyNoticeById(state, props.businessId),
        companyRepresent: getCompanyRepresentById(state, props.businessId),
        isFetchingCompanyExtended: getIsFetchingCompanyExtendedById(state, props.businessId),
        isFetchingCompanyNotice: getIsFetchingCompanyNoticeById(state, props.businessId),
        isFetchingCompanyRepresent: getIsFetchingCompanyRepresentById(state, props.businessId),
      };
    },
    {
      fetchTradeRegisterCompanyExtendedById,
      fetchTradeRegisterCompanyNoticeById,
      fetchTradeRegisterCompanyRepresentById,
    }
  ),
)(TradeRegisterTemplate);
