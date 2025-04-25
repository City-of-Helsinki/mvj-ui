import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import orderBy from "lodash/orderBy";
import { Column, Row } from "react-foundation";
import { Link, Table } from "hds-react";
import { getAttributes, getCurrentAreaSearch } from "@/areaSearch/selectors";
import ApplicationAnswersSection from "@/application/components/ApplicationAnswersSection";
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
} from "@/util/helpers";
import type { Attributes } from "types";
import { reshapeSavedApplicationObject } from "@/plotApplications/helpers";
import {
  transformApplicantSectionTitle,
  getAreaSearchApplicationAttachmentDownloadLink,
} from "@/application/helpers";
import Title from "@/components/content/Title";
import Divider from "@/components/content/Divider";
import Collapse from "@/components/collapse/Collapse";
import Loader from "@/components/loader/Loader";
import FormTextTitle from "@/components/form/FormTextTitle";
import FormText from "@/components/form/FormText";
import { AreaSearchFieldTitles } from "@/areaSearch/enums";
import { getUserFullName } from "@/users/helpers";
import SubTitle from "@/components/content/SubTitle";
import FileDownloadLink from "@/components/file/FileDownloadLink";
import { getAreaFromGeoJSON } from "@/util/map";
import SingleAreaSearchMap from "@/areaSearch/components/map/SingleAreaSearchMap";
import AreaSearchApplicationPropertyIdentifiers from "@/areaSearch/components/AreaSearchApplicationPropertyIdentifiers";
import AreaSearchApplicantInfoCheck from "@/areaSearch/components/AreaSearchApplicantInfoCheck";
import { transformApplicantInfoCheckTitle } from "@/areaSearch/helpers";
import TitleH3 from "@/components/content/TitleH3";
import AreaSearchStatusNoteHistory from "@/areaSearch/components/AreaSearchStatusNoteHistory";
import {
  getFormAttributes,
  getIsFetchingFormAttributes,
} from "@/application/selectors";
import { APPLICANT_SECTION_IDENTIFIER } from "@/application/constants";
import type { Form } from "@/application/types";
import { AreaSearch, UploadedAreaSearchAttachmentMeta } from "@/areaSearch/types";
import { getRouteById } from "@/root/routes";
type OwnProps = {};
type Props = OwnProps & {
  areaSearch: AreaSearch | null;
  isFetchingFormAttributes: boolean;
  formAttributes: Attributes;
  areaSearchAttributes: Attributes;
};
type State = {
  // The Leaflet element doesn't initialize correctly if it's invisible in a collapsed section element,
  // only rendering some map tiles and calculating the viewport from given bounds incorrectly, until an
  // action that forces it to update its dimensions (like resizing the window) happens. We can
  // circumvent this by forcing it to rerender with a key whenever that section is opened; during
  // the opening transition, the initialization works properly.
  selectedAreaSectionRefreshKey: number;
};

export const renderAttachments = (
  areaSearchAttachments: Array<UploadedAreaSearchAttachmentMeta>,
) => {
  const getUploaderType = (file: UploadedAreaSearchAttachmentMeta) => {
    if (file.is_user_helsinki_ad === true) return "Käsittelijä";
    if (file.is_user_helsinki_ad === false) return "Hakija";
    return "Ei tiedossa";
  };

  const cols = [
    { key: "id", headerName: undefined },
    { key: "attachmentId", headerName: "Liite nro" },
    { key: "fileName", headerName: "Tiedostonnimi" },
    { key: "uploaderType", headerName: "Tiedoston lähettäjä" },
  ];
  const rows = areaSearchAttachments.map((file, index) => {
    return {
      id: file.id,
      attachmentId: index + 1,
      fileName: (
        <FileDownloadLink
          fileUrl={getAreaSearchApplicationAttachmentDownloadLink(file.id)}
          label={file.name}
          className="AreaSearchApplication__attachment-link"
        />
      ),
      uploaderType: getUploaderType(file),
    };
  });
  if (areaSearchAttachments.length === 0) {
    return <p>Hakemuksella ei ole liitteitä.</p>;
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <Table
        cols={cols}
        rows={rows}
        variant="light"
        dense
        indexKey="id"
        renderIndexCol={false}
      />
    </div>
  );
};

class AreaSearchApplication extends Component<Props, State> {
  state: any = {
    selectedAreaSectionRefreshKey: 0,
  };

  render(): JSX.Element {
    const {
      areaSearch: {
        lease,
        ...areaSearch
      },
      isFetchingFormAttributes,
      formAttributes,
      areaSearchAttributes,
    } = this.props;
    const { selectedAreaSectionRefreshKey } = this.state;
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

    const stateOptions = getFieldOptions(areaSearchAttributes, "state", false);
    const lessorOptions = getFieldOptions(
      areaSearchAttributes,
      "lessor",
      false,
    );
    const intendedUseOptions = getFieldOptions(
      areaSearchAttributes,
      "intended_use",
      false,
    );
    const declineReasonOptions = getFieldOptions(
      areaSearchAttributes,
      "area_search_status.children.decline_reason",
      false,
    );
    return (
      <div className="AreaSearchApplication">
        <Title>Hakemus</Title>
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
                    <FormTextTitle>{AreaSearchFieldTitles.STATE}</FormTextTitle>
                    <FormText>
                      {getLabelOfOption(stateOptions, areaSearch.state)}
                    </FormText>
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
                    <FormTextTitle>
                      {AreaSearchFieldTitles.LESSOR}
                    </FormTextTitle>
                    <FormText>
                      {getLabelOfOption(lessorOptions, areaSearch.lessor) ||
                        "-"}
                    </FormText>
                  </Column>
                  <Column small={6} medium={6} large={3}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.PREPARER}
                    </FormTextTitle>
                    <FormText>
                      {getUserFullName(areaSearch.preparer) || "-"}
                    </FormText>
                  </Column>
                  <Column small={6} medium={6} large={3}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.DECLINE_REASON}
                    </FormTextTitle>
                    <FormText>
                      {getLabelOfOption(
                        declineReasonOptions,
                        areaSearch.area_search_status?.decline_reason,
                      ) || "-"}
                    </FormText>
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
              </Collapse>

              <Collapse headerTitle="Hakemuksen käsittely" defaultOpen>
                <TitleH3>Tarkistettavat dokumentit</TitleH3>
                {answer.sections[APPLICANT_SECTION_IDENTIFIER].map(
                  (applicant, index) => (
                    <Fragment key={index}>
                      <SubTitle>
                        {transformApplicantInfoCheckTitle(applicant)}
                      </SubTitle>
                      <AreaSearchApplicantInfoCheck
                        infoCheckData={areaSearch.answer.information_checks.filter(
                          (check) =>
                            check.entry ===
                            `${APPLICANT_SECTION_IDENTIFIER}[${index}]`,
                        )}
                        key={applicant.metadata.identifier}
                      />
                    </Fragment>
                  ),
                )}
                <TitleH3>Käsittelytiedot</TitleH3>
                <Row>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>{AreaSearchFieldTitles.STATE}</FormTextTitle>
                    <FormText>
                      {getLabelOfOption(stateOptions, areaSearch.state)}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.LESSOR}
                    </FormTextTitle>
                    <FormText>
                      {getLabelOfOption(lessorOptions, areaSearch.lessor) ||
                        "-"}
                    </FormText>
                  </Column>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.PREPARER}
                    </FormTextTitle>
                    <FormText>
                      {getUserFullName(areaSearch.preparer) || "-"}
                    </FormText>
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={4} large={3}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.DECLINE_REASON}
                    </FormTextTitle>
                    <FormText>
                      {getLabelOfOption(
                        declineReasonOptions,
                        areaSearch.area_search_status?.decline_reason,
                      ) || "-"}
                    </FormText>
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={12} large={12}>
                    <FormTextTitle>
                      {AreaSearchFieldTitles.PREPARER_NOTE}
                    </FormTextTitle>
                    <FormText>
                      {areaSearch.area_search_status?.preparer_note || "-"}
                    </FormText>
                  </Column>
                </Row>
                {areaSearch.area_search_status?.status_notes?.length > 0 && (
                  <Row>
                    <Column small={12} medium={12} large={12}>
                      <FormTextTitle>
                        {AreaSearchFieldTitles.STATUS_NOTES}
                      </FormTextTitle>
                      <AreaSearchStatusNoteHistory
                        statusNotes={
                          areaSearch.area_search_status?.status_notes
                        }
                      />
                    </Column>
                  </Row>
                )}
              </Collapse>
            </>
          )}
      </div>
    );
  }
}

export default flowRight(
  connect((state) => ({
    areaSearch: getCurrentAreaSearch(state),
    areaSearchAttributes: getAttributes(state),
    formAttributes: getFormAttributes(state),
    isFetchingFormAttributes: getIsFetchingFormAttributes(state),
  })),
)(AreaSearchApplication) as React.ComponentType<OwnProps>;
