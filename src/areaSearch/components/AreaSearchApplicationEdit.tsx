import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import orderBy from "lodash/orderBy";
import get from "lodash/get";
import { Column, Row } from "react-foundation";
import { reduxForm, change, getFormValues } from "redux-form";
import { getAttributes, getCurrentAreaSearch } from "@/areaSearch/selectors";
import ApplicationAnswersSection from "@/application/components/ApplicationAnswersSection";
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  displayUIMessage,
} from "@/util/helpers";
import type { Attributes } from "types";
import { reshapeSavedApplicationObject } from "@/plotApplications/helpers";
import { transformApplicantSectionTitle } from "@/application/helpers";
import Title from "@/components/content/Title";
import Divider from "@/components/content/Divider";
import Collapse from "@/components/collapse/Collapse";
import Loader from "@/components/loader/Loader";
import FormTextTitle from "@/components/form/FormTextTitle";
import FormText from "@/components/form/FormText";
import { AreaSearchFieldTitles } from "@/areaSearch/enums";
import SubTitle from "@/components/content/SubTitle";
import { getAreaFromGeoJSON } from "@/util/map";
import SingleAreaSearchMap from "@/areaSearch/components/map/SingleAreaSearchMap";
import AreaSearchApplicationPropertyIdentifiers from "@/areaSearch/components/AreaSearchApplicationPropertyIdentifiers";
import AreaSearchApplicantInfoCheckEdit from "@/areaSearch/components/AreaSearchApplicantInfoCheckEdit";
import { renderAttachments } from "@/areaSearch/components/AreaSearchApplication";
import { FieldTypes, FormNames } from "@/enums";
import {
  getInitialAreaSearchEditForm,
  transformApplicantInfoCheckTitle,
} from "@/areaSearch/helpers";
import FormField from "@/components/form/FormField";
import TitleH3 from "@/components/content/TitleH3";
import AreaSearchStatusNoteHistory from "@/areaSearch/components/AreaSearchStatusNoteHistory";
import {
  getFormAttributes,
  getIsFetchingFormAttributes,
  getIsPerformingFileOperation,
} from "@/application/selectors";
import { APPLICANT_SECTION_IDENTIFIER } from "@/application/constants";
import type { Form } from "@/application/types";
import type {
  AreaSearch,
  UploadedAreaSearchAttachmentMeta,
} from "@/areaSearch/types";
import AddFileButton from "@/components/form/AddFileButton";
import {
  uploadAttachment,
  setAreaSearchAttachments,
} from "@/areaSearch/actions";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import CreateLeaseModal from '@/leases/components/createLease/CreateLeaseModal';
import { createLease, fetchAttributes as fetchLeaseAttributes } from "@/leases/actions";
import { getAttributes as getLeaseAttributes, getIsFetchingAttributes as getIsFetchingLeaseAttributes } from "@/leases/selectors";
import { ButtonLabels } from "@/components/enums";
import { Link } from "hds-react";
import { getRouteById } from "@/root/routes";

type Props = {
  areaSearch: AreaSearch | null;
  areaSearchAttributes: Attributes;
  change: (...args: Array<any>) => any;
  createLease: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  fetchLeaseAttributes: (...args: Array<any>) => any;
  formAttributes: Attributes;
  formValues: Record<string, any> | null | undefined;
  isFetchingFormAttributes: boolean;
  isFetchingLeaseAttributes: boolean;
  isPerformingFileOperation: boolean;
  leaseAttributes: Attributes;
  setAreaSearchAttachments: (...args: Array<any>) => any;
  uploadAttachment: (...args: Array<any>) => any;
};
type State = {
  // The Leaflet element doesn't initialize correctly if it's invisible in a collapsed section element,
  // only rendering some map tiles and calculating the viewport from given bounds incorrectly, until an
  // action that forces it to update its dimensions (like resizing the window) happens. We can
  // circumvent this by forcing it to rerender with a key whenever that section is opened; during
  // the opening transition, the initialization works properly.
  selectedAreaSectionRefreshKey: number;
  isModalOpen: boolean;
};

class AreaSearchApplicationEdit extends Component<Props, State> {
  state: any = {
    selectedAreaSectionRefreshKey: 0,
    isModalOpen: false,
  };

  componentDidMount() {
    const { leaseAttributes, fetchLeaseAttributes, isFetchingLeaseAttributes } = this.props;
    if (!isFetchingLeaseAttributes && !leaseAttributes) {
      fetchLeaseAttributes();
    }
    this.initializeForm();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.areaSearch && !prevProps.areaSearch) {
      this.initializeForm();
    }
  }

  initializeForm = () => {
    const { areaSearch, initialize } = this.props;

    if (!areaSearch) {
      return;
    }

    initialize(getInitialAreaSearchEditForm(areaSearch));
  };
  handleFileAdded = (e: Event) => {
    const { uploadAttachment, areaSearch, setAreaSearchAttachments } =
      this.props;
    const currentFiles = areaSearch?.area_search_attachments || [];
    const file = (e.target as HTMLInputElement).files[0];
    const fileExists = currentFiles.find(
      (currentFile) => currentFile.name === file.name,
    );

    if (fileExists) {
      displayUIMessage(
        {
          title: "Virhe",
          body: `Tiedosto nimellä ${file.name} on jo listassa.`,
        },
        {
          type: "error",
        },
      );
    } else {
      uploadAttachment({
        fileData: file,
        areaSearch: areaSearch?.id,
        callback: (newFile: UploadedAreaSearchAttachmentMeta) => {
          setAreaSearchAttachments([...currentFiles, newFile]);
        },
      });
    }
  };

  handleLessorChange = (newLessor: string) => {
    const { change, formValues } = this.props;
    const lessorWasChanged = formValues?.lessor !== newLessor;
    if (lessorWasChanged) {
      change("preparer", null);
    }
  };

  showCreateLeaseModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  hideCreateLeaseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  render(): JSX.Element {
    const {
      areaSearch: {
        lease,
        ...areaSearch
      },
      createLease,
      isFetchingFormAttributes,
      isPerformingFileOperation,
      formAttributes,
      areaSearchAttributes,
    } = this.props;
    const { selectedAreaSectionRefreshKey, isModalOpen } = this.state;
    const leaseIdentifier = lease?.identifier?.identifier || null;
    const leaseId = lease?.id || null;
    const fieldTypes = getFieldAttributes(
      formAttributes,
      "sections.child.children.fields.child.children.type.choices",
    );
    let form: Form | null | undefined;
    let answer: Record<string, any> | null | undefined;
    let area: number | null | undefined;
    let selectedAreaTitle = "Alue";

    if (areaSearch) {
      form = areaSearch.form;
      answer = reshapeSavedApplicationObject(
        areaSearch.answer.entries_data,
        form,
        formAttributes,
        [],
      );
      if (areaSearch.geometry) {
        area = getAreaFromGeoJSON(areaSearch.geometry);
      }
      selectedAreaTitle =
        [areaSearch.address, areaSearch.district]
          .filter((part) => !!part)
          .join(", ") || selectedAreaTitle;
    }

    const intendedUseOptions = getFieldOptions(
      areaSearchAttributes,
      "intended_use",
      false,
    );
    const applicantSection = form?.sections.find(
      (section) => section.identifier === APPLICANT_SECTION_IDENTIFIER,
    );
    return (
      <div className="AreaSearchApplication">
        <CreateLeaseModal
            isOpen={isModalOpen}
            onClose={this.hideCreateLeaseModal}
            onSubmit={createLease}
            areaSearch={areaSearch}
        />
        <div className="AreaSearchApplication__header">
          <Title>Hakemus</Title>
          <AddButtonSecondary
            label={ButtonLabels.CREATE_LEASE}
            onClick={this.showCreateLeaseModal}
          />
        </div>
        <Divider />
        {!(
          form &&
          answer &&
          areaSearch &&
          fieldTypes &&
          !isFetchingFormAttributes
        ) && <Loader isLoading={true} />}
        {form &&
          answer &&
          areaSearch &&
          fieldTypes &&
          !isFetchingFormAttributes && (
            <>
              <Collapse headerTitle="Hakemuksen käsittelytiedot" defaultOpen>
                <Row>
                  <Column small={4} medium={4} large={3}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.RECEIVED_DATE}
                    </FormTextTitle>
                    <FormText>
                      {formatDate(areaSearch.received_date, "dd.MM.yyyy H.mm")}
                    </FormText>
                  </Column>
                  <Column small={4} medium={4} large={3}>
                    <FormField
                      name="state"
                      fieldAttributes={get(areaSearchAttributes, "state")}
                      overrideValues={{
                        label: AreaSearchFieldTitles.STATE,
                      }}
                    />
                  </Column>
                  <Column small={4} medium={4} large={3}>
                    <FormTextTitle>{AreaSearchFieldTitles.SETTLED_DATE}</FormTextTitle>
                    <FormText>
                      {areaSearch?.settled_date ? (
                        formatDate(areaSearch.settled_date, "dd.MM.yyyy H.mm")
                      ) : "-"}
                    </FormText>
                  </Column>
                  <Column small={4} medium={4} large={3}>
                    <FormTextTitle>{AreaSearchFieldTitles.LEASE}</FormTextTitle>
                    <FormText>
                      {leaseId && leaseIdentifier ? (
                        <Link
                          href={`${getRouteById("leases")}/${leaseId}`}
                          openInNewTab
                          style={{ border: "unset", margin: "unset" }}
                        >
                          {leaseIdentifier}
                        </Link>
                      ) : "-"}
                    </FormText>
                  </Column>
                  <Column small={4} medium={4} large={3}>
                    <FormField
                      name="lessor"
                      fieldAttributes={get(areaSearchAttributes, "lessor")}
                      overrideValues={{
                        label: AreaSearchFieldTitles.LESSOR,
                      }}
                      onChange={this.handleLessorChange}
                    />
                  </Column>
                  <Column small={6} medium={6} large={3}>
                    <FormField
                      name="preparer"
                      fieldAttributes={get(areaSearchAttributes, "preparer")}
                      overrideValues={{
                        fieldType: FieldTypes.USER,
                        label: AreaSearchFieldTitles.PREPARER,
                      }}
                    />
                  </Column>
                  <Column small={6} medium={6} large={3}>
                    <FormField
                      name="decline_reason"
                      fieldAttributes={get(
                        areaSearchAttributes,
                        "area_search_status.children.decline_reason",
                      )}
                      overrideValues={{
                        label: AreaSearchFieldTitles.DECLINE_REASON,
                      }}
                    />
                  </Column>
                </Row>
              </Collapse>
              <Collapse
                headerTitle={selectedAreaTitle}
                onToggle={(isOpen) => {
                  if (isOpen) {
                    this.setState((state) => ({
                      selectedAreaSectionRefreshKey:
                        state.selectedAreaSectionRefreshKey + 1,
                    }));
                  }
                }}
                defaultOpen
              >
                {areaSearch.geometry ? (
                  <SingleAreaSearchMap
                    geometry={areaSearch.geometry}
                    key={selectedAreaSectionRefreshKey}
                    minimap
                  />
                ) : null}
                <Row>
                  <Column small={6} medium={3} large={2}>
                    <FormTextTitle>{AreaSearchFieldTitles.AREA}</FormTextTitle>
                    <FormText>
                      {area ? `${formatNumber(area, 1)} m²` : "-"}
                    </FormText>
                  </Column>
                  <Column small={6} medium={3} large={2}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.PROPERTY_IDENTIFIER}
                    </FormTextTitle>
                    <FormText>
                      <AreaSearchApplicationPropertyIdentifiers
                        ids={areaSearch.plot}
                      />
                    </FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.RENT_PERIOD}
                    </FormTextTitle>
                    <FormText>
                      {formatDateRange(
                        areaSearch.start_date,
                        areaSearch.end_date,
                      )}
                    </FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.INTENDED_USE}
                    </FormTextTitle>
                    <FormText>
                      {getLabelOfOption(
                        intendedUseOptions,
                        areaSearch.intended_use,
                      )}
                    </FormText>
                  </Column>
                </Row>
                <SubTitle>
                  {AreaSearchFieldTitles.DESCRIPTION_INTENDED_USE}
                </SubTitle>
                <p className="AreaSearchApplication__description">
                  {areaSearch.description_intended_use || "-"}
                </p>
                <SubTitle>{AreaSearchFieldTitles.DESCRIPTION_AREA}</SubTitle>
                <p className="AreaSearchApplication__description">
                  {areaSearch.description_area || "-"}
                </p>
              </Collapse>
              {orderBy(form.sections, "sort_order")
                .filter((section) => section.visible)
                .map((section) => (
                  <ApplicationAnswersSection
                    section={section}
                    answer={answer.sections[section.identifier]}
                    fieldTypes={fieldTypes}
                    key={section.identifier}
                    topLevel
                    sectionTitleTransformers={[transformApplicantSectionTitle]}
                  />
                ))}
              <Collapse headerTitle="Liitteet" defaultOpen>
                {renderAttachments(areaSearch.area_search_attachments || [])}
                <AddFileButton
                  label="Lisää tiedosto"
                  onChange={this.handleFileAdded}
                  name="AreaSearchApplicationEditAttachment"
                  disabled={isPerformingFileOperation}
                />
              </Collapse>

              <Collapse headerTitle="Hakemuksen käsittely" defaultOpen>
                <TitleH3>Tarkistettavat dokumentit</TitleH3>
                {answer.sections[APPLICANT_SECTION_IDENTIFIER].map(
                  (applicant, index) => (
                    <Fragment key={applicant.metadata.identifier}>
                      <SubTitle>
                        {transformApplicantInfoCheckTitle(applicant)}
                      </SubTitle>
                      <AreaSearchApplicantInfoCheckEdit
                        answer={applicant}
                        identifier={`${APPLICANT_SECTION_IDENTIFIER}[${index}]`}
                        section={applicantSection}
                      />
                    </Fragment>
                  ),
                )}
                <TitleH3>Käsittelytiedot</TitleH3>
                <Row>
                  <Column small={6} medium={4} large={3}>
                    <FormField
                      name="state"
                      fieldAttributes={get(areaSearchAttributes, "state")}
                      overrideValues={{
                        label: AreaSearchFieldTitles.STATE,
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormField
                      name="lessor"
                      fieldAttributes={get(areaSearchAttributes, "lessor")}
                      overrideValues={{
                        label: AreaSearchFieldTitles.LESSOR,
                      }}
                      onChange={this.handleLessorChange}
                    />
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormField
                      name="preparer"
                      fieldAttributes={get(areaSearchAttributes, "preparer")}
                      overrideValues={{
                        fieldType: FieldTypes.USER,
                        label: AreaSearchFieldTitles.PREPARER,
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={4} large={3}>
                    <FormField
                      name="decline_reason"
                      fieldAttributes={get(
                        areaSearchAttributes,
                        "area_search_status.children.decline_reason",
                      )}
                      overrideValues={{
                        label: AreaSearchFieldTitles.DECLINE_REASON,
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={12} large={12}>
                    <FormField
                      name="preparer_note"
                      fieldAttributes={get(
                        areaSearchAttributes,
                        "area_search_status.children.preparer_note",
                      )}
                      overrideValues={{
                        label: AreaSearchFieldTitles.PREPARER_NOTE,
                        fieldType: FieldTypes.TEXTAREA,
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={12} large={12}>
                    <FormField
                      name="status_notes"
                      fieldAttributes={get(
                        areaSearchAttributes,
                        "area_search_status.children.status_notes.child.children.note",
                      )}
                      overrideValues={{
                        label: AreaSearchFieldTitles.STATUS_NOTES,
                        fieldType: FieldTypes.TEXTAREA,
                        required: false,
                      }}
                    />
                  </Column>
                  <Column small={12} medium={12} large={12}>
                    <AreaSearchStatusNoteHistory
                      statusNotes={areaSearch.area_search_status?.status_notes}
                    />
                  </Column>
                </Row>
              </Collapse>
            </>
          )}
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => ({
      areaSearch: getCurrentAreaSearch(state),
      areaSearchAttributes: getAttributes(state),
      formAttributes: getFormAttributes(state),
      formValues: getFormValues(FormNames.AREA_SEARCH)(state),
      isFetchingFormAttributes: getIsFetchingFormAttributes(state),
      isFetchingLeaseAttributes: getIsFetchingLeaseAttributes(state),
      isPerformingFileOperation: getIsPerformingFileOperation(state),
      leaseAttributes: getLeaseAttributes(state),
    }),
    {
      createLease,
      fetchLeaseAttributes,
      uploadAttachment,
      setAreaSearchAttachments,
      change,
    },
  ),
  reduxForm({
    form: FormNames.AREA_SEARCH,
  }),
)(AreaSearchApplicationEdit) as React.ComponentType<any>;
