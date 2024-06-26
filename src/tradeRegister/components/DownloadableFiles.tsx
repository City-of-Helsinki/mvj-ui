import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Collapse from "/src/components/collapse/Collapse";
import FormText from "/src/components/form/FormText";
import FileDownloadLink from "/src/components/file/FileDownloadLink";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import { receiveCollapseStates } from "tradeRegister/actions";
import { CollapseStatePaths } from "tradeRegister/enums";
import { getCollapseStateByKey, getCompanyExtendedById, getIsFetchingCompanyExtendedById } from "tradeRegister/selectors";
import createUrlWithoutVersionSuffix from "/src/api/createUrlWithoutVersionSuffix";
type Props = {
  businessId: string;
  companyExtended: Record<string, any> | null | undefined;
  downloadableFilesCollapseState: boolean | null | undefined;
  isFetchingCompanyExtended: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
};

const DownloadableFiles = ({
  businessId,
  companyExtended,
  downloadableFilesCollapseState,
  isFetchingCompanyExtended,
  receiveCollapseStates
}: Props) => {
  const handleCollapseToggleDownloadableFiles = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.DOWNLOADABLE_FILES}.${businessId}`]: val
    });
  };

  if (companyExtended === undefined && !isFetchingCompanyExtended) return null;
  return <Collapse defaultOpen={downloadableFilesCollapseState !== undefined ? downloadableFilesCollapseState : true} headerTitle='Ladattavat tiedostot' onToggle={handleCollapseToggleDownloadableFiles}>
      {isFetchingCompanyExtended && <LoaderWrapper>
          <Loader isLoading={isFetchingCompanyExtended} />
        </LoaderWrapper>}
      {!isFetchingCompanyExtended && <Fragment>
          {!companyExtended && <FormText>Ladattavia tiedostoja ei saatavilla</FormText>}
          {!!companyExtended && <Fragment>
              <Row>
                <Column>
                  <FileDownloadLink fileName={`kaupparekisteriote_${businessId}.pdf`} fileUrl={createUrlWithoutVersionSuffix(`trade_register/trade_register_entry/${businessId}/`)} label='Kaupparekisteriote (pdf)' />
                </Column>
              </Row>
              <Row>
                <Column>
                  <FileDownloadLink fileName={`yhteisosaannot_${businessId}.pdf`} fileUrl={createUrlWithoutVersionSuffix(`trade_register/statute/${businessId}/`)} label='Yhteisösäännöt (pdf)' />
                </Column>
              </Row>
            </Fragment>}
        </Fragment>}
    </Collapse>;
};

export default connect((state, props: Props) => {
  return {
    companyExtended: getCompanyExtendedById(state, props.businessId),
    downloadableFilesCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.DOWNLOADABLE_FILES}.${props.businessId}`),
    isFetchingCompanyExtended: getIsFetchingCompanyExtendedById(state, props.businessId)
  };
}, {
  receiveCollapseStates
})(DownloadableFiles);