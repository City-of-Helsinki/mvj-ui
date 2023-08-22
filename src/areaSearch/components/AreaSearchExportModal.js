//@flow

import React, {Component} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {flowRight} from 'lodash/util';
import {connect} from 'react-redux';

import Modal from '$components/modal/Modal';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import Button from '$components/button/Button';
import {ButtonColors} from '$components/enums';
import FileDownloadButton from '$components/file/FileDownloadButton';
import FormField from '$components/form/FormField';
import {FieldTypes, FormNames} from '$src/enums';
import type {RootState} from '$src/root/types';
import createUrl from '$src/api/createUrl';

type OwnProps = {
  isOpen: boolean,
  onClose: () => void,
};

type Props = {
  ...OwnProps,
  change: Function,
  selectedMode: ?string,
  selectedSearches: {[key: string]: boolean},
};

export const ExportModes = {
  APPLICATIONS_XLS: 'APPLICATIONS_XLS',
  APPLICATIONS_PDF: 'APPLICATIONS_PDF',
};

class AreaSearchExportModal extends Component<Props> {

  componentDidUpdate(prevProps: Props): void {
    const {isOpen, change} = this.props;

    if (isOpen && !prevProps.isOpen) {
      change('mode', null);
    }
  }

  render(): React$Node {
    const {isOpen, onClose, selectedMode, selectedSearches} = this.props;

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
        downloadUrl = createUrl(`area_search/get_answers_pdf/?ids=${selectedSearchIds.join(',')}`);
        break;
      case ExportModes.APPLICATIONS_XLS:
        guideText = 'Tulostus sisältää valitut hakemukset .xls-muodossa.';
        downloadUrl = createUrl(`area_search/get_answers_xlsx/?ids=${selectedSearchIds.join(',')}`);
        break;
    }

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Tulosta tiedostoon"
        className="PlotSearchExportModal"
      >

        <FormField
          name="mode"
          fieldAttributes={{
            type: FieldTypes.CHOICE,
            required: false,
            read_only: false,
            label: 'Tulostusalue',
            choices: [
              {
                value: ExportModes.APPLICATIONS_PDF,
                display_name: 'Tulosta valitut hakemukset (PDF)',
              },
              {
                value: ExportModes.APPLICATIONS_XLS,
                display_name: 'Tulosta valitut hakemukset (XLS)',
              },
            ],
          }}
          disableDirty
        />
        {guideText}
        <ModalButtonWrapper>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onClose}
            text="Peruuta"
          />
          <FileDownloadButton
            disabled={!downloadUrl || !selectedMode}
            url={downloadUrl}
            label="Tulosta"
            onSuccess={() => onClose()}
          />
        </ModalButtonWrapper>
      </Modal>
    );
  }
}

const formName = FormNames.AREA_SEARCH_EXPORT;

export default (flowRight(
  connect((state: RootState) => ({
    selectedMode: formValueSelector(formName)(state, 'mode'),
    selectedSearches: formValueSelector(formName)(state, 'selectedSearches'),
  })),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  })
)(AreaSearchExportModal): React$ComponentType<OwnProps>);
