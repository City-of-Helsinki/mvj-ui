import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Button from "@/components/button/Button";
import FileDownloadLink from "@/components/file/FileDownloadLink";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import Modal from "@/components/modal/Modal";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import { ButtonColors } from "@/components/enums";
import { fetchContractFilesById } from "@/contractFile/actions";
import createUrlWithoutVersionSuffix from "@/api/createUrlWithoutVersionSuffix";
import { humanReadableByteCount } from "@/util/helpers";
import {
  getContractFilesById,
  getIsFetchingById,
} from "@/contractFile/selectors";
type Props = {
  contractId: number;
  fetchContractFilesById: (...args: Array<any>) => any;
  files: Array<Record<string, any>> | null | undefined;
  isFetching: boolean;
  onClose: (...args: Array<any>) => any;
  open: boolean;
};

class ContractFileModal extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    if (!prevProps.open && this.props.open) {
      const { contractId, fetchContractFilesById, files } = this.props;

      if (!files) {
        fetchContractFilesById(contractId);
      }
    }
  }

  render() {
    const { contractId, files, isFetching, onClose, open } = this.props;
    return (
      <Modal isOpen={open} onClose={onClose} title="Sopimuksen tiedostot">
        {isFetching && (
          <LoaderWrapper>
            <Loader isLoading={true} />
          </LoaderWrapper>
        )}
        {files && !files.length && (
          <FormText>Sopimuksella {contractId} ei ole tiedostoja</FormText>
        )}
        {files && !!files.length && (
          <Fragment>
            <Row>
              <Column small={4}>
                <FormTextTitle>Tiedosto</FormTextTitle>
              </Column>
              <Column small={4}>
                <FormTextTitle>Tyyppi</FormTextTitle>
              </Column>
              <Column small={4}>
                <FormTextTitle>Koko</FormTextTitle>
              </Column>
            </Row>

            {files.map((file, index) => {
              const getCategoryText = () => {
                switch (file.fileCategory) {
                  case "CONTRACT":
                    return "Sopimus";

                  case "CONTRACT_ATTACHMENT":
                    return "Sopimusliite";

                  case "OTHER_ATTACHMENT":
                    return "Muu";

                  default:
                    return file.fileCategory;
                }
              };

              return (
                <Row key={index}>
                  <Column small={4}>
                    <FileDownloadLink
                      fileUrl={createUrlWithoutVersionSuffix(
                        `contract_file/${contractId}/${file.id}/`,
                      )}
                      label={file.fileName}
                    />
                  </Column>
                  <Column small={4}>
                    <FormText>{getCategoryText()}</FormText>
                  </Column>
                  <Column small={4}>
                    <FormText>{humanReadableByteCount(file.fileSize)}</FormText>
                  </Column>
                </Row>
              );
            })}
          </Fragment>
        )}
        <ModalButtonWrapper>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onClose}
            text="Sulje"
          />
        </ModalButtonWrapper>
      </Modal>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      files: getContractFilesById(state, props.contractId),
      isFetching: getIsFetchingById(state, props.contractId),
    };
  },
  {
    fetchContractFilesById,
  },
)(ContractFileModal);
