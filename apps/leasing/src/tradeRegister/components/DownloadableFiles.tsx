import React from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { Row, Column } from "@/components/grid/Grid";
import type { RootState } from "@/root/types";
import Collapse from "@/components/collapse/Collapse";
import FormText from "@/components/form/FormText";
import FileDownloadLink from "@/components/file/FileDownloadLink";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import { receiveCollapseStates } from "@/tradeRegister/actions";
import { CollapseStatePaths } from "@/tradeRegister/enums";
import {
  getCollapseStateByKey,
  getCompanyExtendedById,
  getIsFetchingCompanyExtendedById,
} from "@/tradeRegister/selectors";
import createUrlWithoutVersionSuffix from "@/api/createUrlWithoutVersionSuffix";
import { FLAG_TRADE_REGISTER_RYYTI } from "@/featureFlags";

type Props = {
  businessId: string;
};

const DownloadableFiles = ({ businessId }: Props) => {
  const dispatch = useAppDispatch();

  const companyExtended = useAppSelector((state: RootState) =>
    getCompanyExtendedById(state, businessId),
  );
  const downloadableFilesCollapseState = useAppSelector((state: RootState) =>
    getCollapseStateByKey(
      state,
      `${CollapseStatePaths.DOWNLOADABLE_FILES}.${businessId}`,
    ),
  );
  const isFetchingCompanyExtended = useAppSelector((state: RootState) =>
    getIsFetchingCompanyExtendedById(state, businessId),
  );

  const handleCollapseToggleDownloadableFiles = (val: boolean) => {
    dispatch(
      receiveCollapseStates({
        [`${CollapseStatePaths.DOWNLOADABLE_FILES}.${businessId}`]: val,
      }),
    );
  };

  if (companyExtended === undefined && !isFetchingCompanyExtended) return null;
  return (
    <Collapse
      defaultOpen={
        downloadableFilesCollapseState !== undefined
          ? downloadableFilesCollapseState
          : true
      }
      headerTitle="Ladattavat tiedostot"
      onToggle={handleCollapseToggleDownloadableFiles}
    >
      {isFetchingCompanyExtended && (
        <LoaderWrapper>
          <Loader isLoading={isFetchingCompanyExtended} />
        </LoaderWrapper>
      )}
      {!isFetchingCompanyExtended && (
        <>
          {!companyExtended && (
            <FormText>Ladattavia tiedostoja ei saatavilla</FormText>
          )}
          {!!companyExtended && (
            <>
              <Row>
                <Column>
                  <FileDownloadLink
                    fileName={`kaupparekisteriote_${businessId}.pdf`}
                    fileUrl={createUrlWithoutVersionSuffix(
                      FLAG_TRADE_REGISTER_RYYTI
                        ? `ryyti/trade_register_pdf/${businessId}/`
                        : `trade_register/trade_register_entry/${businessId}/`,
                    )}
                    label="Kaupparekisteriote (pdf)"
                    openInlineInNewTab={FLAG_TRADE_REGISTER_RYYTI}
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <FileDownloadLink
                    fileName={`yhteisosaannot_${businessId}.pdf`}
                    fileUrl={createUrlWithoutVersionSuffix(
                      FLAG_TRADE_REGISTER_RYYTI
                        ? `ryyti/organisation_rules_pdf/${businessId}/`
                        : `trade_register/statute/${businessId}/`,
                    )}
                    label="Yhteisösäännöt (pdf)"
                    openInlineInNewTab={FLAG_TRADE_REGISTER_RYYTI}
                  />
                </Column>
              </Row>
            </>
          )}
        </>
      )}
    </Collapse>
  );
};

export default DownloadableFiles;
