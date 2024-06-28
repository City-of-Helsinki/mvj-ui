import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import CompanyExtended from "/src/tradeRegister/components/CompanyExtended";
import CompanyNotice from "/src/tradeRegister/components/CompanyNotice";
import CompanyRepresent from "/src/tradeRegister/components/CompanyRepresent";
import DownloadableFiles from "/src/tradeRegister/components/DownloadableFiles";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import { fetchTradeRegisterCompanyExtendedById, fetchTradeRegisterCompanyNoticeById, fetchTradeRegisterCompanyRepresentById } from "/src/tradeRegister/actions";
import { getCompanyExtendedById, getCompanyNoticeById, getCompanyRepresentById, getIsFetchingCompanyExtendedById, getIsFetchingCompanyNoticeById, getIsFetchingCompanyRepresentById } from "/src/tradeRegister/selectors";
type Props = {
  businessId: string;
  companyExtended: Record<string, any> | null | undefined;
  companyNotice: Record<string, any> | null | undefined;
  companyRepresent: Record<string, any> | null | undefined;
  fetchTradeRegisterCompanyExtendedById: (...args: Array<any>) => any;
  fetchTradeRegisterCompanyNoticeById: (...args: Array<any>) => any;
  fetchTradeRegisterCompanyRepresentById: (...args: Array<any>) => any;
  isFetchingCompanyExtended: boolean;
  isFetchingCompanyNotice: boolean;
  isFetchingCompanyRepresent: boolean;
};

class TradeRegisterTemplate extends PureComponent<Props> {
  componentDidMount() {
    this.fetchCompanyDataIfNeeded();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      businessId
    } = this.props;

    if (businessId !== prevProps.businessId) {
      this.fetchCompanyDataIfNeeded();
    }
  }

  fetchCompanyDataIfNeeded = () => {
    const {
      businessId,
      companyExtended,
      companyNotice,
      companyRepresent,
      fetchTradeRegisterCompanyExtendedById,
      fetchTradeRegisterCompanyNoticeById,
      fetchTradeRegisterCompanyRepresentById
    } = this.props;
    if (!businessId) return;

    if (companyExtended === undefined) {
      fetchTradeRegisterCompanyExtendedById(businessId);
    }

    if (companyNotice === undefined) {
      fetchTradeRegisterCompanyNoticeById(businessId);
    }

    if (companyRepresent === undefined) {
      fetchTradeRegisterCompanyRepresentById(businessId);
    }
  };

  render() {
    const {
      businessId,
      isFetchingCompanyExtended,
      isFetchingCompanyNotice,
      isFetchingCompanyRepresent
    } = this.props;

    if (isFetchingCompanyExtended && isFetchingCompanyNotice && isFetchingCompanyRepresent) {
      return <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>;
    }

    return <Fragment>
        <DownloadableFiles businessId={businessId} />

        <CompanyExtended businessId={businessId} />

        <CompanyRepresent businessId={businessId} />

        <CompanyNotice businessId={businessId} />
      </Fragment>;
  }

}

export default flowRight(connect((state, props: Props) => {
  return {
    companyExtended: getCompanyExtendedById(state, props.businessId),
    companyNotice: getCompanyNoticeById(state, props.businessId),
    companyRepresent: getCompanyRepresentById(state, props.businessId),
    isFetchingCompanyExtended: getIsFetchingCompanyExtendedById(state, props.businessId),
    isFetchingCompanyNotice: getIsFetchingCompanyNoticeById(state, props.businessId),
    isFetchingCompanyRepresent: getIsFetchingCompanyRepresentById(state, props.businessId)
  };
}, {
  fetchTradeRegisterCompanyExtendedById,
  fetchTradeRegisterCompanyNoticeById,
  fetchTradeRegisterCompanyRepresentById
}))(TradeRegisterTemplate);