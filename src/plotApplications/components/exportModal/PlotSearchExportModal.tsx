import React, { Component } from "react";
import { flowRight } from "lodash/util";
import { change, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Modal from "components/modal/Modal";
import ModalButtonWrapper from "components/modal/ModalButtonWrapper";
import Button from "components/button/Button";
import { ButtonColors } from "components/enums";
import FormField from "components/form/FormField";
import { FieldTypes } from "enums";
import FileDownloadButton from "components/file/FileDownloadButton";
import createUrl from "api/createUrl";
import type { Column } from "components/table/SortableTable";
import PlotSearchExportModalTargetTable from "plotApplications/components/exportModal/PlotSearchExportModalTargetTable";
import { fetchTargetInfoChecksForPlotSearch } from "plotApplications/actions";
import { getIsFetchingTargetInfoChecksForCurrentPlotSearch, getTargetInfoChecksForCurrentPlotSearch } from "plotApplications/selectors";
import Loader from "components/loader/Loader";
type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
  plotSearchId: number | null;
};
type Props = OwnProps & {
  selectedMode?: string | null;
  selectedItemIds: Array<number>;
  reset: () => void;
  resetSection: (...sections: Array<string>) => void;
  change: (...args: Array<any>) => any;
  items: Array<Record<string, any>>;
  isFetching: boolean;
  fetchTargetInfoChecksForPlotSearch: (...args: Array<any>) => any;
};
export const ExportModes = {
  BASIC_DATA_XLS: 'BASIC_DATA_XLS',
  APPLICATIONS_PDF: 'APPLICATIONS_PDF',
  APPLICATIONS_BY_TARGET_PDF: 'APPLICATIONS_BY_TARGET_PDF',
  APPLICATIONS_BY_APPLICANT_PDF: 'APPLICATIONS_BY_APPLICANT_PDF'
};
const ModalDetailColumns: Record<string, Column> = {
  CHECKBOX: {
    key: 'checkbox',
    text: 'Tulosta',
    sortable: false
  },
  IDENTIFIER: {
    key: 'application_identifier',
    text: 'Hakemustunnus',
    sortable: false
  },
  TARGET: {
    key: 'target_identifier',
    text: 'Kohteen tunnus',
    sortable: false
  },
  APPLICANT: {
    key: 'applicants',
    text: 'Hakija',
    sortable: false
  }
};

class PlotSearchExportModal extends Component<Props> {
  componentDidUpdate(prevProps: Props): void {
    const {
      isOpen,
      reset,
      fetchTargetInfoChecksForPlotSearch,
      plotSearchId
    } = this.props;

    if (isOpen && !prevProps.isOpen) {
      reset();
      fetchTargetInfoChecksForPlotSearch(plotSearchId);
    }
  }

  updateTargetItemSelection = (changedItem: Record<string, any>, newValue: boolean) => {
    const {
      selectedMode,
      selectedItemIds,
      items,
      change
    } = this.props;
    let matchingItems = [];

    switch (selectedMode) {
      case ExportModes.APPLICATIONS_PDF:
        matchingItems = [changedItem];
        break;

      case ExportModes.APPLICATIONS_BY_TARGET_PDF:
        matchingItems = items.filter(item => item.target_identifier === changedItem.target_identifier);
        break;

      case ExportModes.APPLICATIONS_BY_APPLICANT_PDF:
        matchingItems = items.filter(item => item.answer_id === changedItem.answer_id);
        break;
    }

    matchingItems.forEach(item => change(`items.${item.application_identifier}`, newValue));
    const newSelectedIds = new Set(selectedItemIds);

    if (newValue) {
      matchingItems.forEach(item => newSelectedIds.add(item.id));
    } else {
      matchingItems.forEach(item => newSelectedIds.delete(item.id));
    }

    change('selectedItemIds', Array.from(newSelectedIds));
  };

  render(): React.ReactNode {
    const {
      isOpen,
      onClose,
      selectedMode,
      selectedItemIds,
      plotSearchId,
      resetSection,
      items,
      isFetching
    } = this.props;
    let guideText: React.ReactNode = <p>Voit tulostaa hakemuksien tietoja tiedostoon. Aloita valitsemalla tulostusalue.</p>;
    let columns: Array<Column> = [];
    let downloadUrl = '';

    if (plotSearchId) {
      switch (selectedMode) {
        case ExportModes.BASIC_DATA_XLS:
          guideText = <p>Tulostus sisältää taulukkomuodossa kaikki tonttihaun perustiedot, haettavan kohteen tiedot sekä
            hakemuksen tiedot käsittelijän tiedoilla.</p>;
          downloadUrl = createUrl(`plot_search/${plotSearchId}/get_answers_xlsx/`);
          break;

        case ExportModes.APPLICATIONS_PDF:
          guideText = <p>Tulostus sisältää .pdf-muodossa yhden tai usean hakemuksen liitteineen.</p>;
          columns = [ModalDetailColumns.CHECKBOX, ModalDetailColumns.IDENTIFIER, ModalDetailColumns.TARGET, ModalDetailColumns.APPLICANT];

          if (selectedItemIds.length > 0) {
            downloadUrl = createUrl(`target_status_pdf/?targets=${selectedItemIds.join(',')}`);
          }

          break;

        case ExportModes.APPLICATIONS_BY_TARGET_PDF:
          guideText = <p>Tulostus sisältää .pdf-muodossa yhden kohteen kaikki hakemukset liitteineen.</p>;
          columns = [ModalDetailColumns.CHECKBOX, ModalDetailColumns.TARGET, ModalDetailColumns.IDENTIFIER, ModalDetailColumns.APPLICANT];

          if (selectedItemIds.length > 0) {
            downloadUrl = createUrl(`target_status_pdf/?targets=${selectedItemIds.join(',')}`);
          }

          break;

        case ExportModes.APPLICATIONS_BY_APPLICANT_PDF:
          guideText = <p>Tulostus sisältää .pdf-muodossa yhden hakijan kaikki hakemukset liitteineen.</p>;
          columns = [ModalDetailColumns.CHECKBOX, ModalDetailColumns.APPLICANT, ModalDetailColumns.IDENTIFIER, ModalDetailColumns.TARGET];

          if (selectedItemIds.length > 0) {
            downloadUrl = createUrl(`target_status_pdf/?targets=${selectedItemIds.join(',')}`);
          }

          break;

        default:
          break;
      }
    }

    return <Modal isOpen={isOpen} onClose={onClose} title="Tulosta tiedostoon" className="PlotSearchExportModal">
        <FormField name="mode" fieldAttributes={{
        type: FieldTypes.CHOICE,
        required: false,
        read_only: false,
        label: 'Tulostusalue',
        choices: [{
          value: ExportModes.APPLICATIONS_PDF,
          display_name: 'Tulosta hakemukset (PDF)'
        }, {
          value: ExportModes.APPLICATIONS_BY_TARGET_PDF,
          display_name: 'Tulosta hakemukset kohteittain (PDF)'
        }, {
          value: ExportModes.APPLICATIONS_BY_APPLICANT_PDF,
          display_name: 'Tulosta hakemukset hakijoittain (PDF)'
        }, {
          value: ExportModes.BASIC_DATA_XLS,
          display_name: 'Tulosta tonttihaun perustiedot (XLS)'
        }]
      }} disabled={!plotSearchId} disableDirty onChange={() => resetSection('selectedApplicationTargetItems', 'items')} />
        {guideText}
        {columns.length > 0 && !isFetching && <PlotSearchExportModalTargetTable items={items} onItemChange={this.updateTargetItemSelection} columns={columns} firstCheckboxOnly={selectedMode === ExportModes.APPLICATIONS_BY_APPLICANT_PDF} />}
        {columns.length > 0 && isFetching && <div className="PlotSearchExportModal__loader">
          <Loader isLoading={true} />
        </div>}
        <ModalButtonWrapper>
          <Button className={ButtonColors.SECONDARY} onClick={onClose} text="Peruuta" />
          <FileDownloadButton disabled={!selectedMode || !downloadUrl} url={downloadUrl} label="Tulosta" onSuccess={() => onClose()} />
        </ModalButtonWrapper>
      </Modal>;
  }

}

const formName = 'plot-search-export';
export default (flowRight(connect(state => ({
  selectedMode: formValueSelector(formName)(state, 'mode'),
  selectedItemIds: formValueSelector(formName)(state, 'selectedItemIds'),
  isFetching: getIsFetchingTargetInfoChecksForCurrentPlotSearch(state),
  items: getTargetInfoChecksForCurrentPlotSearch(state)
}), {
  change,
  fetchTargetInfoChecksForPlotSearch
}), reduxForm({
  form: formName,
  initialValues: {
    mode: null,
    selectedItemIds: []
  }
}))(PlotSearchExportModal) as React.ComponentType<OwnProps>);