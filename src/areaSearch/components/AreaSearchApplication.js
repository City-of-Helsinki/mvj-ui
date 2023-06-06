// @flow

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import orderBy from 'lodash/orderBy';
import {Column, Row} from 'react-foundation';

import {getAttributes, getCurrentAreaSearch} from '$src/areaSearch/selectors';
import ApplicationAnswersSection from '$src/application/components/ApplicationAnswersSection';
import {getFormAttributes, getIsFetchingFormAttributes} from '$src/plotSearch/selectors';
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import type {Attributes} from '$src/types';
import type {Form} from '$src/plotSearch/types';
import {reshapeSavedApplicationObject} from '$src/plotApplications/helpers';
import {transformApplicantSectionTitle} from '$src/application/helpers';
import Title from '$components/content/Title';
import Divider from '$components/content/Divider';
import Collapse from '$components/collapse/Collapse';
import Loader from '$components/loader/Loader';
import FormTextTitle from '$components/form/FormTextTitle';
import FormText from '$components/form/FormText';
import {AreaSearchFieldTitles} from '$src/areaSearch/enums';
import {getUserFullName} from '$src/users/helpers';
import SubTitle from '$components/content/SubTitle';
import FileDownloadLink from '$components/file/FileDownloadLink';
import {getAreaFromGeoJSON} from '$util/map';
import AreaSearchSelectedAreaMiniMap from '$src/areaSearch/components/map/AreaSearchSelectedAreaMiniMap';
import AreaSearchApplicationPropertyIdentifiers
  from '$src/areaSearch/components/AreaSearchApplicationPropertyIdentifiers';
import {APPLICANT_SECTION_IDENTIFIER} from '$src/plotApplications/constants';
import AreaSearchApplicantInfoCheck from '$src/areaSearch/components/AreaSearchApplicantInfoCheck';
import {transformApplicantInfoCheckTitle} from '$src/areaSearch/helpers';
import TitleH3 from '$components/content/TitleH3';
import AreaSearchStatusNoteHistory from '$src/areaSearch/components/AreaSearchStatusNoteHistory';

type OwnProps = {

};

type Props = {
  ...OwnProps,
  areaSearch: Object | null,
  isFetchingFormAttributes: boolean,
  formAttributes: Attributes,
  areaSearchAttributes: Attributes,
};

type State = {
  // The Leaflet element doesn't initialize correctly if it's invisible in a collapsed section element,
  // only rendering some map tiles and calculating the viewport from given bounds incorrectly, until an
  // action that forces it to update its dimensions (like resizing the window) happens. We can
  // circumvent this by forcing it to rerender with a key whenever that section is opened; during
  // the opening transition, the initialization works properly.
  selectedAreaSectionRefreshKey: number,
};

class AreaSearchApplication extends Component<Props, State> {
  state: $Shape<State> = {
    selectedAreaSectionRefreshKey: 0,
  };

  render(): React$Node {
    const {
      areaSearch,
      isFetchingFormAttributes,
      formAttributes,
      areaSearchAttributes,
    } = this.props;
    const {
      selectedAreaSectionRefreshKey,
    } = this.state;
    const fieldTypes = getFieldAttributes(formAttributes, 'sections.child.children.fields.child.children.type.choices');

    let form: ?Form;
    let answer: ?Object;
    let area: ?number;
    let selectedAreaTitle = 'Alue';

    if (areaSearch) {
      form = areaSearch.form;
      answer = reshapeSavedApplicationObject(
        areaSearch.answer.entries_data,
        form,
        formAttributes,
        []
      );

      area = getAreaFromGeoJSON(areaSearch.geometry);

      selectedAreaTitle = [
        areaSearch.address,
        areaSearch.district,
      ].filter((part) => !!part).join(', ') || selectedAreaTitle;
    }

    const stateOptions = getFieldOptions(areaSearchAttributes, 'state', false);
    const lessorOptions = getFieldOptions(areaSearchAttributes, 'lessor', false);
    const intendedUseOptions = getFieldOptions(areaSearchAttributes, 'intended_use', false);
    const declineReasonOptions = getFieldOptions(areaSearchAttributes, 'area_search_status.children.decline_reason', false);

    return <div className="AreaSearchApplication">
      <Title>
        Hakemus
      </Title>
      <Divider />
      {!(form && answer && areaSearch && fieldTypes && !isFetchingFormAttributes) && <Loader isLoading={true} />}
      {form && answer && areaSearch && fieldTypes && !isFetchingFormAttributes && <>
        <Collapse
          headerTitle="Hakemuksen käsittelytiedot"
          defaultOpen
        >
          <Row>
            <Column small={6} medium={3} large={2}>
              <FormTextTitle>
                {AreaSearchFieldTitles.RECEIVED_DATE}
              </FormTextTitle>
              <FormText>{formatDate(areaSearch.received_date, 'dd.MM.yyyy H.mm')}</FormText>
            </Column>
            <Column small={6} medium={2} large={1}>
              <FormTextTitle>
                {AreaSearchFieldTitles.STATE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(stateOptions, areaSearch.state)}</FormText>
            </Column>
            <Column small={6} medium={3} large={3}>
              <FormTextTitle>
                {AreaSearchFieldTitles.LESSOR}
              </FormTextTitle>
              <FormText>{getLabelOfOption(lessorOptions, areaSearch.lessor) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={6}>
              <FormTextTitle>
                {AreaSearchFieldTitles.PREPARER}
              </FormTextTitle>
              <FormText>{getUserFullName(areaSearch.preparer) || '-'}</FormText>
            </Column>
          </Row>
        </Collapse>
        <Collapse
          headerTitle={selectedAreaTitle}
          onToggle={(isOpen) => {
            if (isOpen) {
              this.setState((state) => ({
                selectedAreaSectionRefreshKey: state.selectedAreaSectionRefreshKey + 1,
              }));
            }
          }}
          defaultOpen
        >
          <AreaSearchSelectedAreaMiniMap geometry={areaSearch.geometry} key={selectedAreaSectionRefreshKey} />
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
        {orderBy(form.sections, 'sort_order').filter((section) => section.visible).map((section) =>
          <ApplicationAnswersSection
            section={section}
            answer={answer.sections[section.identifier]}
            fieldTypes={fieldTypes}
            key={section.identifier}
            topLevel
            sectionTitleTransformers={[
              transformApplicantSectionTitle,
            ]}
          />)}
        <Collapse headerTitle="Liitteet" defaultOpen>
          {areaSearch.area_search_attachments.map((file, index) => <Row key={file.id}>
            <Column small={3}>Liite {index + 1}</Column>
            <Column small={9}>
              <FileDownloadLink
                fileUrl={file.file}
                label={file.name}
              />
            </Column>
          </Row>)}
          {areaSearch.area_search_attachments.length === 0 && <p>
            Hakemuksella ei ole liitteitä.
          </p>}
        </Collapse>

        <Collapse headerTitle="Hakemuksen käsittely" defaultOpen>
          <TitleH3>Tarkistettavat dokumentit</TitleH3>
          {answer.sections[APPLICANT_SECTION_IDENTIFIER].map((applicant, index) => <Fragment key={index}>
            <SubTitle>{transformApplicantInfoCheckTitle(applicant)}</SubTitle>
            <AreaSearchApplicantInfoCheck
              infoCheckData={areaSearch.answer.information_checks.filter((check) => check.entry === `${APPLICANT_SECTION_IDENTIFIER}[${index}]`)}
              key={applicant.metadata.identifier}
            />
          </Fragment>)}
          <TitleH3>Käsittelytiedot</TitleH3>
          <Row>
            <Column small={6} medium={4} large={3}>
              <FormTextTitle>
                {AreaSearchFieldTitles.STATE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(stateOptions, areaSearch.state)}</FormText>
            </Column>
            <Column small={6} medium={4} large={3}>
              <FormTextTitle>
                {AreaSearchFieldTitles.LESSOR}
              </FormTextTitle>
              <FormText>{getLabelOfOption(lessorOptions, areaSearch.lessor) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={3}>
              <FormTextTitle>
                {AreaSearchFieldTitles.PREPARER}
              </FormTextTitle>
              <FormText>{getUserFullName(areaSearch.preparer) || '-'}</FormText>
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={3}>
              <FormTextTitle>
                {AreaSearchFieldTitles.DECLINE_REASON}
              </FormTextTitle>
              <FormText>{getLabelOfOption(declineReasonOptions, areaSearch.area_search_status?.decline_reason) || '-'}</FormText>
            </Column>
          </Row>
          <Row>
            <Column small={12} medium={12} large={12}>
              <FormTextTitle>
                {AreaSearchFieldTitles.PREPARER_NOTE}
              </FormTextTitle>
              <FormText>{areaSearch.area_search_status?.preparer_note || '-'}</FormText>
            </Column>
          </Row>
          {(areaSearch.area_search_status?.status_notes?.length > 0) && <Row>
            <Column small={12} medium={12} large={12}>
              <FormTextTitle>
                {AreaSearchFieldTitles.STATUS_NOTES}
              </FormTextTitle>
              <AreaSearchStatusNoteHistory statusNotes={areaSearch.area_search_status?.status_notes} />
            </Column>
          </Row>}
        </Collapse>
      </>}
    </div>;
  }
}

export default (flowRight(
  connect((state) => ({
    areaSearch: getCurrentAreaSearch(state),
    areaSearchAttributes: getAttributes(state),
    formAttributes: getFormAttributes(state),
    isFetchingFormAttributes: getIsFetchingFormAttributes(state),
  })),
)(AreaSearchApplication): React$ComponentType<OwnProps>);
