import React, { useEffect, memo } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import CompanyExtended from "@/tradeRegister/components/CompanyExtended";
import CompanyNotice from "@/tradeRegister/components/CompanyNotice";
import CompanyRepresent from "@/tradeRegister/components/CompanyRepresent";
import DownloadableFiles from "@/tradeRegister/components/DownloadableFiles";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import {
  fetchTradeRegisterCompanyExtendedById,
  fetchTradeRegisterCompanyNoticeById,
  fetchTradeRegisterCompanyRepresentById,
} from "@/tradeRegister/actions";
import {
  getCompanyExtendedById,
  getCompanyNoticeById,
  getCompanyRepresentById,
  getIsFetchingCompanyExtendedById,
  getIsFetchingCompanyNoticeById,
  getIsFetchingCompanyRepresentById,
} from "@/tradeRegister/selectors";
import { FLAG_TRADE_REGISTER_RYYTI } from "@/featureFlags";
import type { RootState } from "@/root/types";

type Props = {
  businessId: string;
};

const TradeRegisterTemplate = ({ businessId }: Props) => {
  const dispatch = useAppDispatch();

  const companyExtended = useAppSelector((state: RootState) =>
    getCompanyExtendedById(state, businessId),
  );
  const companyNotice = useAppSelector((state: RootState) =>
    getCompanyNoticeById(state, businessId),
  );
  const companyRepresent = useAppSelector((state: RootState) =>
    getCompanyRepresentById(state, businessId),
  );
  const isFetchingCompanyExtended = useAppSelector((state: RootState) =>
    getIsFetchingCompanyExtendedById(state, businessId),
  );
  const isFetchingCompanyNotice = useAppSelector((state: RootState) =>
    getIsFetchingCompanyNoticeById(state, businessId),
  );
  const isFetchingCompanyRepresent = useAppSelector((state: RootState) =>
    getIsFetchingCompanyRepresentById(state, businessId),
  );

  useEffect(() => {
    if (!businessId) return;

    const needsExtended =
      companyExtended === undefined && !isFetchingCompanyExtended;
    const needsNotice = companyNotice === undefined && !isFetchingCompanyNotice;
    const needsRepresent =
      companyRepresent === undefined && !isFetchingCompanyRepresent;

    if (FLAG_TRADE_REGISTER_RYYTI) {
      if (needsExtended || needsNotice || needsRepresent) {
        // Any of the actions will trigger the unified Ryyti fetch
        dispatch(fetchTradeRegisterCompanyExtendedById(businessId));
      }
      return;
    }

    if (needsExtended)
      dispatch(fetchTradeRegisterCompanyExtendedById(businessId));
    if (needsNotice) dispatch(fetchTradeRegisterCompanyNoticeById(businessId));
    if (needsRepresent)
      dispatch(fetchTradeRegisterCompanyRepresentById(businessId));
  }, [businessId, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  if (
    isFetchingCompanyExtended &&
    isFetchingCompanyNotice &&
    isFetchingCompanyRepresent
  ) {
    return (
      <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>
    );
  }

  return (
    <>
      <DownloadableFiles businessId={businessId} />

      <CompanyExtended businessId={businessId} />

      <CompanyRepresent businessId={businessId} />

      <CompanyNotice businessId={businessId} />
    </>
  );
};

export default memo(TradeRegisterTemplate);
