// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';

import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FileDownloadLink from '$components/file/FileDownloadLink';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {receiveCollapseStates} from '$src/tradeRegister/actions';
import {
  CollapseStatePaths,
} from '$src/tradeRegister/enums';
import {
  getCollapseStateByKey,
  getCompanyExtendedById,
  getIsFetchingCompanyExtendedById,
} from '$src/tradeRegister/selectors';
import createUrlWithoutVersionSuffix from '$src/api/createUrlWithoutVersionSuffix';

type Props = {
  businessId: string,
  companyExtended: ?Object,
  downloadableFilesCollapseState: ?boolean,
  isFetchingCompanyExtended: boolean,
  receiveCollapseStates: Function,
}

const DownloadableFiles = ({
  businessId,
  companyExtended,
  downloadableFilesCollapseState,
  isFetchingCompanyExtended,
  receiveCollapseStates,
}: Props) => {
  const handleCollapseToggleDownloadableFiles = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.DOWNLOADABLE_FILES}.${businessId}`]: val,
    });
  };

  if(companyExtended === undefined && !isFetchingCompanyExtended) return null;

  return (
    <Collapse
      defaultOpen={downloadableFilesCollapseState !== undefined ? downloadableFilesCollapseState : true}
      headerTitle='Ladattavat tiedostot'
      onToggle={handleCollapseToggleDownloadableFiles}
    >
      {isFetchingCompanyExtended &&
        <LoaderWrapper>
          <Loader isLoading={isFetchingCompanyExtended} />
        </LoaderWrapper>
      }
      {!isFetchingCompanyExtended &&
        <Fragment>
          {!companyExtended &&
            <FormText>Ladattavia tiedostoja ei saatavilla</FormText>
          }
          {!!companyExtended &&
            <Fragment>
              <FileDownloadLink
                fileName={`kaupparekisteriote_${businessId}.pdf`}
                fileUrl={createUrlWithoutVersionSuffix(`trade_register/trade_register_entry/${businessId}/`)}
                label='Kaupparekisteriote (pdf)'
              />
            </Fragment>
          }
        </Fragment>
      }
    </Collapse>
  );
};

export default connect(
  (state, props: Props) => {
    return {
      companyExtended: getCompanyExtendedById(state, props.businessId),
      downloadableFilesCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.DOWNLOADABLE_FILES}.${props.businessId}`),
      isFetchingCompanyExtended: getIsFetchingCompanyExtendedById(state, props.businessId),
    };
  },
  {
    receiveCollapseStates,
  }
)(DownloadableFiles);
