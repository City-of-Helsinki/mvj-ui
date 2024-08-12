import { $Shape } from "utility-types";
import React, { useState, useEffect, useCallback, Fragment } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import orderBy from "lodash/orderBy";
import get from "lodash/get";
import { Column, Row } from "react-foundation";
import { reduxForm } from "redux-form";
import { getAttributes, getCurrentAreaSearch } from "areaSearch/selectors";
import ApplicationAnswersSection from "application/components/ApplicationAnswersSection";
import { formatDate, formatDateRange, formatNumber, getFieldAttributes, getFieldOptions, getLabelOfOption, displayUIMessage } from "util/helpers";
import type { Attributes } from "types";
import { reshapeSavedApplicationObject } from "plotApplications/helpers";
import { transformApplicantSectionTitle, getAreaSearchApplicationAttachmentDownloadLink } from "application/helpers";
import Title from "components/content/Title";
import Divider from "components/content/Divider";
import Collapse from "components/collapse/Collapse";
import Loader from "components/loader/Loader";
import FormTextTitle from "components/form/FormTextTitle";
import FormText from "components/form/FormText";
import { AreaSearchFieldTitles } from "areaSearch/enums";
import SubTitle from "components/content/SubTitle";
import FileDownloadLink from "components/file/FileDownloadLink";
import { getAreaFromGeoJSON } from "util/map";
import SingleAreaSearchMap from "areaSearch/components/map/SingleAreaSearchMap";
import AreaSearchApplicationPropertyIdentifiers from "areaSearch/components/AreaSearchApplicationPropertyIdentifiers";
import AreaSearchApplicantInfoCheckEdit from "areaSearch/components/AreaSearchApplicantInfoCheckEdit";
import { FieldTypes, FormNames } from "enums";
import { getInitialAreaSearchEditForm, transformApplicantInfoCheckTitle } from "areaSearch/helpers";
import FormField from "components/form/FormField";
import TitleH3 from "components/content/TitleH3";
import AreaSearchStatusNoteHistory from "areaSearch/components/AreaSearchStatusNoteHistory";
import { getFormAttributes, getIsFetchingFormAttributes, getIsPerformingFileOperation } from "application/selectors";
import { APPLICANT_SECTION_IDENTIFIER } from "application/constants";
import type { Form } from "application/types";
import type { AreaSearch, UploadedAreaSearchAttachmentMeta } from "areaSearch/types";
import AddFileButton from "components/form/AddFileButton";
import { uploadAttachment, setAreaSearchAttachments } from "areaSearch/actions";
import RemoveButton from "components/form/RemoveButton";
type Props = {
  areaSearch: AreaSearch | null;
  isFetchingFormAttributes: boolean;
  isPerformingFileOperation: boolean;
  formAttributes: Attributes;
  areaSearchAttributes: Attributes;
  initialize: (...args: Array<any>) => any;
  uploadAttachment: (...args: Array<any>) => any;
  setAreaSearchAttachments: (...args: Array<any>) => any;
};

const AreaSearchApplicationEdit = ({
  areaSearch,
  isFetchingFormAttributes,
  isPerformingFileOperation,
  formAttributes,
  areaSearchAttributes,
  initialize,
  uploadAttachment,
  setAreaSearchAttachments,
}: Props) => {
  // The Leaflet element doesn't initialize correctly if it's invisible in a collapsed section element,
  // only rendering some map tiles and calculating the viewport from given bounds incorrectly, until an
  // action that forces it to update its dimensions (like resizing the window) happens. We can
  // circumvent this by forcing it to rerender with a key whenever that section is opened; during
  // the opening transition, the initialization works properly.
  const [selectedAreaSectionRefreshKey, setSelectedAreaSectionRefreshKey] =
    useState<number>(0);

  const initializeForm = () => {
    if (!areaSearch) {
      return;
    }

    initialize(getInitialAreaSearchEditForm(areaSearch));
  };

  const handleFileAdded = useCallback(
    (e: Event) => {
      const currentFiles = areaSearch?.area_search_attachments || [];
      const file = (e.target as HTMLInputElement).files[0];
    const fileExists = currentFiles.find(currentFile => currentFile.name === file.name);

    if (fileExists) {
      displayUIMessage({
        title: 'Virhe',
        body: `Tiedosto nimellä ${file.name} on jo listassa.`
      }, {
        type: 'error'
      });
    } else {
      uploadAttachment({
        fileData: file,
        areaSearch: areaSearch?.id,
        callback: (newFile: UploadedAreaSearchAttachmentMeta) => {
          setAreaSearchAttachments([...currentFiles, newFile]);
        }
      });
    }
  },
  [areaSearch, uploadAttachment, setAreaSearchAttachments]
  );

  const fieldTypes = getFieldAttributes(formAttributes, 'sections.child.children.fields.child.children.type.choices');
  let form: Form | null | undefined;
  let answer: Record<string, any> | null | undefined;
  let area: number | null | undefined;
  let selectedAreaTitle = 'Alue';

    if (areaSearch) {
      form = areaSearch.form;
      answer = reshapeSavedApplicationObject(areaSearch.answer.entries_data, form, formAttributes, []);
      area = getAreaFromGeoJSON(areaSearch.geometry);
      selectedAreaTitle = [areaSearch.address, areaSearch.district].filter(part => !!part).join(', ') || selectedAreaTitle;
    }

    const intendedUseOptions = getFieldOptions(areaSearchAttributes, 'intended_use', false);
    const applicantSection = form?.sections.find(section => section.identifier === APPLICANT_SECTION_IDENTIFIER);

    useEffect(() => {
      initializeForm();
    }, []);

    return <div className="AreaSearchApplication">
      <Title>
        Hakemus
      </Title>
      <Divider />
      {!(form && answer && areaSearch && fieldTypes && !isFetchingFormAttributes) && <Loader isLoading={true} />}
      {form && answer && areaSearch && fieldTypes && !isFetchingFormAttributes && <>
        <Collapse headerTitle="Hakemuksen käsittelytiedot" defaultOpen>
          <Row>
            <Column small={4} medium={4} large={2}>
              <FormTextTitle>
                {AreaSearchFieldTitles.RECEIVED_DATE}
              </FormTextTitle>
              <FormText>{formatDate(areaSearch.received_date, 'dd.MM.yyyy H.mm')}</FormText>
            </Column>
            <Column small={4} medium={4} large={2}>
              <FormField name='state' fieldAttributes={get(areaSearchAttributes, 'state')} overrideValues={{
                label: AreaSearchFieldTitles.STATE
              }} />
            </Column>
            <Column small={4} medium={4} large={3}>
              <FormField name='lessor' fieldAttributes={get(areaSearchAttributes, 'lessor')} overrideValues={{
                label: AreaSearchFieldTitles.LESSOR
              }} />
            </Column>
            <Column small={6} medium={6} large={3}>
              <FormField name='preparer' fieldAttributes={get(areaSearchAttributes, 'preparer')} overrideValues={{
                fieldType: FieldTypes.USER,
                label: AreaSearchFieldTitles.PREPARER
              }} />
            </Column>
            <Column small={6} medium={6} large={2}>
              <FormField name='decline_reason' fieldAttributes={get(areaSearchAttributes, 'area_search_status.children.decline_reason')} overrideValues={{
                label: AreaSearchFieldTitles.DECLINE_REASON
              }} />
            </Column>
          </Row>
        </Collapse>
        <Collapse headerTitle={selectedAreaTitle} onToggle={isOpen => {
          if (isOpen) {
            setSelectedAreaSectionRefreshKey(
              selectedAreaSectionRefreshKey + 1
            );
          }
        }} defaultOpen>
          <SingleAreaSearchMap geometry={areaSearch.geometry} key={selectedAreaSectionRefreshKey} minimap />
          <Row>
            <Column small={6} medium={3} large={2}>
              <FormTextTitle>
                {AreaSearchFieldTitles.AREA}
              </FormTextTitle>
              <FormText>{area ? `${formatNumber(area, 1)} m²` : '-'}</FormText>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormTextTitle>
                {AreaSearchFieldTitles.PROPERTY_IDENTIFIER}
              </FormTextTitle>
              <FormText>
                <AreaSearchApplicationPropertyIdentifiers ids={areaSearch.plot} />
              </FormText>
            </Column>
            <Column small={6} medium={3} large={4}>
              <FormTextTitle>
                {AreaSearchFieldTitles.RENT_PERIOD}
              </FormTextTitle>
              <FormText>{formatDateRange(areaSearch.start_date, areaSearch.end_date)}</FormText>
            </Column>
            <Column small={6} medium={3} large={4}>
              <FormTextTitle>
                {AreaSearchFieldTitles.INTENDED_USE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(intendedUseOptions, areaSearch.intended_use)}</FormText>
            </Column>
          </Row>
          <SubTitle>{AreaSearchFieldTitles.DESCRIPTION_INTENDED_USE}</SubTitle>
          <p className="AreaSearchApplication__description">
            {areaSearch.description_intended_use || '-'}
          </p>
          <SubTitle>{AreaSearchFieldTitles.DESCRIPTION_AREA}</SubTitle>
          <p className="AreaSearchApplication__description">
            {areaSearch.description_area || '-'}
          </p>

        </Collapse>
        {orderBy(form.sections, 'sort_order').filter(section => section.visible).map(section => <ApplicationAnswersSection section={section} answer={answer.sections[section.identifier]} fieldTypes={fieldTypes} key={section.identifier} topLevel sectionTitleTransformers={[transformApplicantSectionTitle]} />)}
        <Collapse headerTitle="Liitteet" defaultOpen>
          {areaSearch.area_search_attachments.map((file, index) => {
            return <Row key={file.name}>
            <Column small={3}>Liite {index + 1}</Column>
            <Column small={8}>
              <FileDownloadLink fileUrl={getAreaSearchApplicationAttachmentDownloadLink(file.id)} label={file.name} />
            </Column>
          </Row>;
          })}
          {areaSearch.area_search_attachments.length === 0 && <p>
            Hakemuksella ei ole liitteitä.
          </p>}
          <AddFileButton label='Lisää tiedosto' onChange={handleFileAdded} name="AreaSearchApplicationEditAttachment" disabled={isPerformingFileOperation} />
        </Collapse>

        <Collapse headerTitle="Hakemuksen käsittely" defaultOpen>
          <TitleH3>Tarkistettavat dokumentit</TitleH3>
          {answer.sections[APPLICANT_SECTION_IDENTIFIER].map((applicant, index) => <Fragment key={applicant.metadata.identifier}>
              <SubTitle>{transformApplicantInfoCheckTitle(applicant)}</SubTitle>
              <AreaSearchApplicantInfoCheckEdit answer={applicant} identifier={`${APPLICANT_SECTION_IDENTIFIER}[${index}]`} section={applicantSection} />
            </Fragment>)}
          <TitleH3>Käsittelytiedot</TitleH3>
          <Row>
            <Column small={6} medium={4} large={3}>
              <FormField name='state' fieldAttributes={get(areaSearchAttributes, 'state')} overrideValues={{
                label: AreaSearchFieldTitles.STATE
              }} />
            </Column>
            <Column small={6} medium={4} large={3}>
              <FormField name='lessor' fieldAttributes={get(areaSearchAttributes, 'lessor')} overrideValues={{
                label: AreaSearchFieldTitles.LESSOR
              }} />
            </Column>
            <Column small={6} medium={4} large={3}>
              <FormField name='preparer' fieldAttributes={get(areaSearchAttributes, 'preparer')} overrideValues={{
                fieldType: FieldTypes.USER,
                label: AreaSearchFieldTitles.PREPARER
              }} />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={3}>
              <FormField name='decline_reason' fieldAttributes={get(areaSearchAttributes, 'area_search_status.children.decline_reason')} overrideValues={{
                label: AreaSearchFieldTitles.DECLINE_REASON
              }} />
            </Column>
          </Row>
          <Row>
            <Column small={12} medium={12} large={12}>
              <FormField name='preparer_note' fieldAttributes={get(areaSearchAttributes, 'area_search_status.children.preparer_note')} overrideValues={{
                label: AreaSearchFieldTitles.PREPARER_NOTE,
                fieldType: FieldTypes.TEXTAREA
              }} />
            </Column>
          </Row>
          <Row>
            <Column small={12} medium={12} large={12}>
              <FormField name='status_notes' fieldAttributes={get(areaSearchAttributes, 'area_search_status.children.status_notes.child.children.note')} overrideValues={{
                label: AreaSearchFieldTitles.STATUS_NOTES,
                fieldType: FieldTypes.TEXTAREA,
                required: false
              }} />
            </Column>
            <Column small={12} medium={12} large={12}>
              <AreaSearchStatusNoteHistory statusNotes={areaSearch.area_search_status?.status_notes} />
            </Column>
          </Row>
        </Collapse>
      </>}
    </div>;
  }

export default (flowRight(connect(state => ({
  areaSearch: getCurrentAreaSearch(state),
  areaSearchAttributes: getAttributes(state),
  formAttributes: getFormAttributes(state),
  isFetchingFormAttributes: getIsFetchingFormAttributes(state),
  isPerformingFileOperation: getIsPerformingFileOperation(state)
}), {
  uploadAttachment,
  setAreaSearchAttachments
}), reduxForm({
  form: FormNames.AREA_SEARCH
}))(AreaSearchApplicationEdit) as React.ComponentType<any>);