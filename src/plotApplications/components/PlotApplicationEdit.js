// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {orderBy} from 'lodash';

import {
  getApplicationRelatedForm,
  getApplicationRelatedPlotSearch,
  getCurrentPlotApplication,
  getIsFetchingApplicationRelatedPlotSearch,
} from '$src/plotApplications/selectors';
import {reshapeSavedApplicationObject} from '$src/plotApplications/helpers';
import {getFieldAttributes} from '$util/helpers';
import {getIsFetchingForm} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';
import ApplicationAnswersSection from '$src/application/components/ApplicationAnswersSection';
import Loader from '$components/loader/Loader';
import Title from '$components/content/Title';
import Divider from '$components/content/Divider';
import type {SectionExtraComponentProps} from '$src/application/types';
import PlotApplicationTargetInfoCheckEdit
  from '$src/plotApplications/components/infoCheck/PlotApplicationTargetInfoCheckEdit';
import PlotApplicationApplicantInfoCheckEdit
  from '$src/plotApplications/components/infoCheck/PlotApplicationApplicantInfoCheckEdit';
import {transformApplicantSectionTitle, transformTargetSectionTitle} from '$src/application/helpers';
import {
  getApplicationRelatedAttachments,
  getFormAttributes, getIsFetchingApplicationRelatedAttachments,
  getIsFetchingFormAttributes,
} from '$src/application/selectors';
import {APPLICANT_SECTION_IDENTIFIER, TARGET_SECTION_IDENTIFIER} from '$src/application/constants';

import type {RootState} from '$src/root/types';
import type {PlotApplication} from '$src/plotApplications/types';

type OwnProps = {};

type Props = {
  ...OwnProps,
  currentPlotApplication: PlotApplication,
  isFetchingFormAttributes: boolean,
  isFetchingForm: boolean,
  isFetchingAttachments: boolean,
  isFetchingPlotSearch: boolean,
  form: Object,
  formAttributes: Attributes,
  attachments: Array<Object>,
  plotSearch: ?Object,
};

const PlotApplicationEditSectionExtras = ({
  section,
  identifier,
  answer,
  topLevel,
}: SectionExtraComponentProps) => {
  return <>
    {topLevel && section.identifier === TARGET_SECTION_IDENTIFIER &&
      (answer.metadata?.identifier ? <PlotApplicationTargetInfoCheckEdit
        section={section}
        identifier={identifier}
        targetId={(answer.metadata.identifier: any)}
      /> : <Loader isLoading={true} />)}
    {topLevel && section.identifier === APPLICANT_SECTION_IDENTIFIER &&
      <PlotApplicationApplicantInfoCheckEdit
        section={section}
        identifier={identifier}
        answer={answer}
      />}
  </>;
};
class PlotApplicationEdit extends PureComponent<Props> {
  render() {
    const {
      currentPlotApplication,
      form,
      isFetchingForm,
      isFetchingFormAttributes,
      isFetchingAttachments,
      isFetchingPlotSearch,
      attachments,
      formAttributes,
      plotSearch,
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
        {!isLoading && fieldTypes && orderBy(form.sections, 'order').filter((section) => section.visible).map((section) =>
          <ApplicationAnswersSection
            section={section}
            answer={answerData.sections[section.identifier]}
            topLevel
            fieldTypes={fieldTypes}
            key={section.identifier}
            plotSearch={plotSearch}
            sectionExtraComponent={PlotApplicationEditSectionExtras}
            sectionTitleTransformers={[
              transformTargetSectionTitle(plotSearch),
              transformApplicantSectionTitle,
            ]}
          />)}
      </div>
    );
  }
}

export default (connect((state: RootState) => ({
  currentPlotApplication: getCurrentPlotApplication(state),
  form: getApplicationRelatedForm(state),
  formAttributes: getFormAttributes(state),
  isFetchingForm: getIsFetchingForm(state),
  isFetchingFormAttributes: getIsFetchingFormAttributes(state),
  attachments: getApplicationRelatedAttachments(state),
  isFetchingAttachments: getIsFetchingApplicationRelatedAttachments(state),
  isFetchingPlotSearch: getIsFetchingApplicationRelatedPlotSearch(state),
  plotSearch: getApplicationRelatedPlotSearch(state),
}))(PlotApplicationEdit): React$ComponentType<OwnProps>);
