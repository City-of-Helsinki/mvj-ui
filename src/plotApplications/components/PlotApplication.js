// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {orderBy} from 'lodash';

import Authorization from '$components/authorization/Authorization';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {FormNames, ViewModes} from '$src/enums';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import {
  getCollapseStateByKey,
  getCurrentPlotApplication,
  getIsFetchingApplicationRelatedForm,
  getApplicationRelatedForm,

} from '$src/plotApplications/selectors';
import {receiveCollapseStates} from '$src/plotApplications/actions';
import {
  formatDate,
  isFieldAllowedToRead,
} from '$util/helpers';
import Loader from '$components/loader/Loader';
import {reshapeSavedApplicationObject} from '$src/plotApplications/helpers';
import {getFieldAttributes} from '$util/helpers';
import {
  getApplicationRelatedPlotSearch,
  getIsFetchingApplicationRelatedPlotSearch,
} from '$src/plotApplications/selectors';
import ApplicationAnswersSection from '$src/application/components/ApplicationAnswersSection';
import PlotApplicationTargetInfoCheck from '$src/plotApplications/components/infoCheck/PlotApplicationTargetInfoCheck';
import PlotApplicationApplicantInfoCheck
  from '$src/plotApplications/components/infoCheck/PlotApplicationApplicantInfoCheck';
import {
  transformApplicantSectionTitle,
  transformTargetSectionTitle,
} from '$src/application/helpers';
import {
  getApplicationRelatedAttachments, getAttributes,
  getFormAttributes, getIsFetchingApplicationRelatedAttachments,
  getIsFetchingFormAttributes,
} from '$src/application/selectors';
import {APPLICANT_SECTION_IDENTIFIER, TARGET_SECTION_IDENTIFIER} from '$src/application/constants';

import type {Attributes} from '$src/types';
import type {PlotApplication as PlotApplicationType} from '$src/plotApplications/types';
import type {SectionExtraComponentProps} from '$src/application/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {PlotApplicationOpeningRecordLabels, PlotApplicationOpeningRecordPaths} from '$src/plotApplications/enums';
import {getHoursAndMinutes} from '$util/date';
import {getContentUser} from '$src/users/helpers';

type OwnProps = {};

type Props = {
  usersPermissions: UsersPermissionsType,
  applicationCollapseState: boolean,
  receiveCollapseStates: Function,
  attributes: Attributes,
  currentPlotApplication: PlotApplicationType,
  isFetchingFormAttributes: boolean,
  isFetchingForm: boolean,
  form: Object,
  formAttributes: Attributes,
  isFetchingAttachments: boolean,
  attachments: Array<Object>,
  isFetchingPlotSearch: boolean,
  plotSearch: ?Object,
}

const PlotApplicationSectionExtras = ({
  section,
  identifier,
  answer,
  topLevel,
}: SectionExtraComponentProps) => {
  return <>
    {topLevel && section.identifier === TARGET_SECTION_IDENTIFIER &&
      (answer.metadata?.identifier ? <PlotApplicationTargetInfoCheck
        section={section}
        identifier={identifier}
        targetId={(answer.metadata.identifier: any)}
      /> : <Loader isLoading={true} />)}
    {topLevel && section.identifier === APPLICANT_SECTION_IDENTIFIER &&
      <PlotApplicationApplicantInfoCheck
        section={section}
        identifier={identifier}
        answer={answer}
      />}
  </>;
};

class PlotApplication extends PureComponent<Props> {
  handleBasicInfoCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_APPLICATION]: {
          plot_application: val,
        },
      },
    });
  }

  render() {
    const {
      applicationCollapseState,
      attributes,
      currentPlotApplication,
      isFetchingForm,
      form,
      isFetchingFormAttributes,
      formAttributes,
      isFetchingAttachments,
      attachments,
      plotSearch,
      isFetchingPlotSearch,
    } = this.props;

    const plotApplication = currentPlotApplication;
    const isLoading = !form || isFetchingForm || isFetchingFormAttributes || isFetchingAttachments || !plotSearch?.id || isFetchingPlotSearch;

    let answerData;
    if (!isLoading) {
      answerData = reshapeSavedApplicationObject(plotApplication.entries_data, form, formAttributes, attachments);
    }

    const fieldTypes = getFieldAttributes(formAttributes, 'sections.child.children.fields.child.children.type.choices');

    return (
      <div className="PlotApplication">
        <Title>
          Hakemus
        </Title>
        <Divider />
        <Loader isLoading={isLoading} />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            {plotApplication.opening_record && <Collapse
              defaultOpen={true}
              headerTitle='Hakemuksen avaaminen'
            >
              <Row>

                <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.PLOT_SEARCH_TIMESTAMP)}>
                  <Column small={12} medium={6} large={4}>
                    <FormTextTitle>
                      {PlotApplicationOpeningRecordLabels.PLOT_SEARCH_TIMESTAMP}
                    </FormTextTitle>
                    <FormText>{formatDate(plotApplication.plot_search_opening_time_stamp)}{', '}
                      {getHoursAndMinutes(plotApplication.plot_search_opening_time_stamp)}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.TIMESTAMP)}>
                  <Column small={6} medium={3} large={2}>
                    <FormTextTitle>
                      {PlotApplicationOpeningRecordLabels.TIMESTAMP}
                    </FormTextTitle>
                    <FormText>{formatDate(plotApplication.opening_record.time_stamp)}{', '}
                      {getHoursAndMinutes(plotApplication.opening_record.time_stamp)}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.CREATED_BY)}>
                  <Column small={6} medium={3} large={2}>
                    <FormTextTitle>
                      {PlotApplicationOpeningRecordLabels.CREATED_BY}
                    </FormTextTitle>
                    <FormText>{plotApplication.opening_record.created_by}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.OPENERS)}>
                  <Column small={12} medium={12} large={4}>
                    <FormTextTitle>
                      {PlotApplicationOpeningRecordLabels.OPENERS}
                    </FormTextTitle>
                    <FormText>{plotApplication.opening_record.openers.map((opener) => getContentUser(opener)?.label).join(', ')}</FormText>
                  </Column>
                </Authorization>
              </Row>
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.NOTE)}>
                  <Column small={12}>
                    <FormTextTitle>
                      {PlotApplicationOpeningRecordLabels.NOTE}
                    </FormTextTitle>
                    <FormText>{plotApplication.opening_record.note}</FormText>
                  </Column>
                </Authorization>
              </Row>
            </Collapse>}
            <Collapse
              defaultOpen={applicationCollapseState !== undefined ? applicationCollapseState : true}
              headerTitle='Hakemuksen käsittelytiedot'
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, 'plot_search')}>
                  <Column small={12} medium={6} large={4}>
                    <FormTextTitle>
                      Tonttihakemus
                    </FormTextTitle>
                    <FormText>{plotApplication.plot_search}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'arrival_time')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Saapumisajankohta
                    </FormTextTitle>
                    <FormText>{plotApplication.arrival_time}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'time')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Klo
                    </FormTextTitle>
                    <FormText>{plotApplication.time}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'saver')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Tallentaja
                    </FormTextTitle>
                    <FormText>{plotApplication.saver}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'disapproval_reason')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Hylkäämisen syy
                    </FormTextTitle>
                    <FormText>{plotApplication.disapproval_reason}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'notice')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Huomautus
                    </FormTextTitle>
                    <FormText>{plotApplication.notice}</FormText>
                  </Column>
                </Authorization>
              </Row>
            </Collapse>
            {!isLoading && fieldTypes && orderBy(form.sections, 'order').filter((section) => section.visible).map((section) =>
              <ApplicationAnswersSection
                section={section}
                answer={answerData.sections[section.identifier]}
                topLevel
                fieldTypes={fieldTypes}
                key={section.identifier}
                plotSearch={plotSearch}
                editMode={false}
                sectionExtraComponent={PlotApplicationSectionExtras}
                sectionTitleTransformers={[
                  transformTargetSectionTitle(plotSearch),
                  transformApplicantSectionTitle,
                ]}
              />)}
          </Column>
        </Row>
      </div>
    );
  }
}

export default (connect(
  (state) => {
    return {
      usersPermissions: getUsersPermissions(state),
      applicationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_APPLICATION}.basic_information`),
      attributes: getAttributes(state),
      currentPlotApplication: getCurrentPlotApplication(state),
      isFetchingForm: getIsFetchingApplicationRelatedForm(state),
      form: getApplicationRelatedForm(state),
      formAttributes: getFormAttributes(state),
      isFetchingFormAttributes: getIsFetchingFormAttributes(state),
      attachments: getApplicationRelatedAttachments(state),
      isFetchingAttachments: getIsFetchingApplicationRelatedAttachments(state),
      isFetchingPlotSearch: getIsFetchingApplicationRelatedPlotSearch(state),
      plotSearch: getApplicationRelatedPlotSearch(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(PlotApplication): React$ComponentType<OwnProps>);
