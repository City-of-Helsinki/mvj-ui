import { $Shape } from "utility-types";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import orderBy from "lodash/orderBy";
import get from "lodash/get";
import { Column, Row } from "react-foundation";
import { reduxForm } from "redux-form";
import { getAttributes, getCurrentAreaSearch } from "src/areaSearch/selectors";
import ApplicationAnswersSection from "src/application/components/ApplicationAnswersSection";
import { formatDate, formatDateRange, formatNumber, getFieldAttributes, getFieldOptions, getLabelOfOption, displayUIMessage } from "src/util/helpers";
import type { Attributes } from "src/types";
import { reshapeSavedApplicationObject } from "src/plotApplications/helpers";
import { transformApplicantSectionTitle, getAreaSearchApplicationAttachmentDownloadLink } from "src/application/helpers";
import Title from "src/components/content/Title";
import Divider from "src/components/content/Divider";
import Collapse from "src/components/collapse/Collapse";
import Loader from "src/components/loader/Loader";
import FormTextTitle from "src/components/form/FormTextTitle";
import FormText from "src/components/form/FormText";
import { AreaSearchFieldTitles } from "src/areaSearch/enums";
import { getUserFullName } from "src/users/helpers";
import SubTitle from "src/components/content/SubTitle";
import FileDownloadLink from "src/components/file/FileDownloadLink";
import { getAreaFromGeoJSON } from "src/util/map";
import SingleAreaSearchMap from "src/areaSearch/components/map/SingleAreaSearchMap";
import AreaSearchApplicationPropertyIdentifiers from "src/areaSearch/components/AreaSearchApplicationPropertyIdentifiers";
import AreaSearchApplicantInfoCheckEdit from "src/areaSearch/components/AreaSearchApplicantInfoCheckEdit";
import { FieldTypes, FormNames } from "src/enums";
import { getInitialAreaSearchEditForm, transformApplicantInfoCheckTitle } from "src/areaSearch/helpers";
import FormField from "src/components/form/FormField";
import TitleH3 from "src/components/content/TitleH3";
import AreaSearchStatusNoteHistory from "src/areaSearch/components/AreaSearchStatusNoteHistory";
import { getFormAttributes, getIsFetchingFormAttributes, getIsPerformingFileOperation } from "src/application/selectors";
import { APPLICANT_SECTION_IDENTIFIER } from "src/application/constants";
import type { Form } from "src/application/types";
import type { AreaSearch, UploadedAreaSearchAttachmentMeta } from "src/areaSearch/types";
import AddFileButton from "src/components/form/AddFileButton";
import { uploadAttachment, setAreaSearchAttachments } from "src/areaSearch/actions";
import RemoveButton from "src/components/form/RemoveButton";
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
type State = {
  // The Leaflet element doesn't initialize correctly if it's invisible in a collapsed section element,
  // only rendering some map tiles and calculating the viewport from given bounds incorrectly, until an
  // action that forces it to update its dimensions (like resizing the window) happens. We can
  // circumvent this by forcing it to rerender with a key whenever that section is opened; during
  // the opening transition, the initialization works properly.
  selectedAreaSectionRefreshKey: number;
};

class AreaSearchApplicationEdit extends Component<Props, State> {
  state: $Shape<State> = {
    selectedAreaSectionRefreshKey: 0
  };

  componentDidMount() {
    this.initializeForm();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.areaSearch && !prevProps.areaSearch) {
      this.initializeForm();
    }
  }

  initializeForm = () => {
    const {
      areaSearch,
      initialize
    } = this.props;

    if (!areaSearch) {
      return;
    }

    initialize(getInitialAreaSearchEditForm(areaSearch));
  };
  handleFileAdded = (e: Event) => {
    const {
      uploadAttachment,
      areaSearch,
      setAreaSearchAttachments
    } = this.props;
    const currentFiles = areaSearch?.area_search_attachments || [];
    const file = e.target.files[0];
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
  };

  render(): React.ReactNode {
    const {
      areaSearch,
      isFetchingFormAttributes,
      isPerformingFileOperation,
      formAttributes,
      areaSearchAttributes,
      attachments,
      addAttachment
    } = this.props;
    const {
      selectedAreaSectionRefreshKey
    } = this.state;
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
            this.setState(state => ({
              selectedAreaSectionRefreshKey: state.selectedAreaSectionRefreshKey + 1
            }));
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
          <AddFileButton label='Lisää tiedosto' onChange={this.handleFileAdded} name="AreaSearchApplicationEditAttachment" disabled={isPerformingFileOperation} />
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
}))(AreaSearchApplicationEdit) as React.ComponentType<OwnProps>);