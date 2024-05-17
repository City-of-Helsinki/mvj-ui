import React, { Component } from "react";
import { formValueSelector, reduxForm } from "redux-form";
import { flowRight } from "lodash/util";
import { connect } from "react-redux";
import Modal from "src/components/modal/Modal";
import ModalButtonWrapper from "src/components/modal/ModalButtonWrapper";
import Button from "src/components/button/Button";
import { ButtonColors } from "src/components/enums";
import FileDownloadButton from "src/components/file/FileDownloadButton";
import FormField from "src/components/form/FormField";
import { FieldTypes, FormNames } from "src/enums";
import type { RootState } from "src/root/types";
import createUrl from "src/api/createUrl";
type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
};
type Props = OwnProps & {
  change: (...args: Array<any>) => any;
  selectedMode: string | null | undefined;
  selectedSearches: Record<string, boolean>;
  includeInformationChecks: boolean;
  includeAttachments: boolean;
};
export const ExportModes = {
  APPLICATIONS_XLS: 'APPLICATIONS_XLS',
  APPLICATIONS_PDF: 'APPLICATIONS_PDF'
};

class AreaSearchExportModal extends Component<Props> {
  componentDidUpdate(prevProps: Props): void {
    const {
      isOpen,
      change
    } = this.props;

    if (isOpen && !prevProps.isOpen) {
      change('mode', null);
      change('includePreparerInformation', false);
      change('includeAttachments', false);
    }
  }

  render(): React.ReactNode {
    const {
      isOpen,
      onClose,
      selectedMode,
      selectedSearches,
      includeInformationChecks,
      includeAttachments
    } = this.props;
    const selectedSearchIds = Object.keys(selectedSearches).reduce((acc, key) => {
      if (selectedSearches[key]) {
        acc.push(key);
      }

      return acc;
    }, []);
    let guideText = '';
    let downloadUrl = '';

    switch (selectedMode) {
      case ExportModes.APPLICATIONS_PDF:
        guideText = 'Tulostus sisältää valitut hakemukset .pdf-muodossa.';
        const params: Record<string, string> = {
          ids: selectedSearchIds.join(',')
        };

        if (includeInformationChecks) {
          params.show_information_check = '1';
        }

        if (includeAttachments) {
          params.show_attachments = '1';
        }

        downloadUrl = createUrl('area_search_pdf/', params);
        break;

      case ExportModes.APPLICATIONS_XLS:
        guideText = 'Tulostus sisältää valitut hakemukset .xls-muodossa.';
        downloadUrl = createUrl('area_search/get_answers_xlsx/', {
          ids: selectedSearchIds.join(',')
        });
        break;
    }

    return <Modal isOpen={isOpen} onClose={onClose} title="Tulosta tiedostoon" className="AreaSearchExportModal">

        <FormField name="mode" fieldAttributes={{
        type: FieldTypes.CHOICE,
        required: false,
        read_only: false,
        label: 'Tulostusalue',
        choices: [{
          value: ExportModes.APPLICATIONS_PDF,
          display_name: 'Tulosta valitut hakemukset (PDF)'
        }, {
          value: ExportModes.APPLICATIONS_XLS,
          display_name: 'Tulosta valitut hakemukset (XLS)'
        }]
      }} disableDirty />
        <span className="AreaSearchExportModal__guide-text">{guideText}</span>
        {selectedMode === ExportModes.APPLICATIONS_PDF && <>
          <FormField name="includeInformationChecks" fieldAttributes={{
          type: FieldTypes.CHECKBOX,
          required: false,
          read_only: false,
          label: 'Sisällytä tulostukseen käsittelytiedot'
        }} overrideValues={{
          options: [{
            value: true,
            label: 'Sisällytä tulostukseen käsittelytiedot'
          }]
        }} disableDirty invisibleLabel />
          <FormField name="includeAttachments" fieldAttributes={{
          type: FieldTypes.CHECKBOX,
          required: false,
          read_only: false,
          label: 'Sisällytä tulostukseen liitteet'
        }} overrideValues={{
          options: [{
            value: true,
            label: 'Sisällytä tulostukseen liitteet'
          }]
        }} disableDirty invisibleLabel />
        </>}
        <ModalButtonWrapper>
          <Button className={ButtonColors.SECONDARY} onClick={onClose} text="Peruuta" />
          <FileDownloadButton disabled={!downloadUrl || !selectedMode} url={downloadUrl} label="Tulosta" onSuccess={() => onClose()} />
        </ModalButtonWrapper>
      </Modal>;
  }

}

const formName = FormNames.AREA_SEARCH_EXPORT;
const selector = formValueSelector(formName);
export default (flowRight(connect((state: RootState) => ({
  selectedMode: selector(state, 'mode'),
  selectedSearches: selector(state, 'selectedSearches'),
  includeInformationChecks: selector(state, 'includeInformationChecks'),
  includeAttachments: selector(state, 'includeAttachments')
})), reduxForm({
  form: formName,
  destroyOnUnmount: false
}))(AreaSearchExportModal) as React.ComponentType<OwnProps>);