import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { orderBy } from "lodash";
import { getApplicationRelatedForm, getApplicationRelatedPlotSearch, getCurrentPlotApplication, getIsFetchingApplicationRelatedPlotSearch } from "plotApplications/selectors";
import { reshapeSavedApplicationObject } from "plotApplications/helpers";
import { getFieldAttributes } from "util/helpers";
import { getIsFetchingForm } from "plotSearch/selectors";
import ApplicationAnswersSection from "application/components/ApplicationAnswersSection";
import Loader from "components/loader/Loader";
import Title from "components/content/Title";
import Divider from "components/content/Divider";
import PlotApplicationTargetInfoCheckEdit from "plotApplications/components/infoCheck/PlotApplicationTargetInfoCheckEdit";
import PlotApplicationApplicantInfoCheckEdit from "plotApplications/components/infoCheck/PlotApplicationApplicantInfoCheckEdit";
import { transformApplicantSectionTitle, transformTargetSectionTitle } from "application/helpers";
import { getApplicationRelatedAttachments, getFormAttributes, getIsFetchingApplicationRelatedAttachments, getIsFetchingFormAttributes } from "application/selectors";
import { APPLICANT_SECTION_IDENTIFIER, TARGET_SECTION_IDENTIFIER } from "application/constants";
import Collapse from "components/collapse/Collapse";
import PlotApplicationOpeningRecordForm from "plotApplications/components/PlotApplicationOpeningRecordForm";
import type { RootState } from "root/types";
import type { PlotApplication } from "plotApplications/types";
import type { SectionExtraComponentProps } from "application/types";
import type { Attributes } from "types";
type OwnProps = {};
type Props = OwnProps & {
  currentPlotApplication: PlotApplication;
  isFetchingFormAttributes: boolean;
  isFetchingForm: boolean;
  isFetchingAttachments: boolean;
  isFetchingPlotSearch: boolean;
  form: any;
  formAttributes: Attributes;
  attachments: Array<Record<string, any>>;
  plotSearch: any;
};

const PlotApplicationEditSectionExtras = ({
  section,
  identifier,
  answer,
  topLevel
}: SectionExtraComponentProps) => {
  return <>
    {topLevel && section.identifier === TARGET_SECTION_IDENTIFIER && (answer.metadata?.identifier ? <PlotApplicationTargetInfoCheckEdit section={section} identifier={identifier} targetId={(answer.metadata.identifier as any)} /> : <Loader isLoading={true} />)}
    {topLevel && section.identifier === APPLICANT_SECTION_IDENTIFIER && <PlotApplicationApplicantInfoCheckEdit section={section} identifier={identifier} answer={answer} />}
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
      plotSearch
    } = this.props;
    const plotApplication = currentPlotApplication;
    const isLoading = !form || isFetchingForm || isFetchingFormAttributes || isFetchingAttachments || !plotSearch?.id || isFetchingPlotSearch;
    let answerData;

    if (!isLoading) {
      answerData = reshapeSavedApplicationObject(plotApplication.entries_data, form, formAttributes, attachments);
    }

    const fieldTypes: any = getFieldAttributes(formAttributes, 'sections.child.children.fields.child.children.type.choices');
    return <div className="PlotApplication">
        <Title>
          Hakemus
        </Title>
        <Divider />
        <Loader isLoading={isLoading} />
        {!isLoading && fieldTypes && <>
          {currentPlotApplication.opening_record && <Collapse defaultOpen={true} headerTitle='Hakemuksen avaaminen'>
            <PlotApplicationOpeningRecordForm />
          </Collapse>}
          {orderBy(form.sections, 'order').filter(section => section.visible).map(section => <ApplicationAnswersSection section={section} answer={answerData.sections[section.identifier]} topLevel fieldTypes={fieldTypes} key={section.identifier} plotSearch={plotSearch} sectionExtraComponent={PlotApplicationEditSectionExtras} sectionTitleTransformers={[transformTargetSectionTitle(plotSearch), transformApplicantSectionTitle]} />)}
        </>}
      </div>;
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
  plotSearch: getApplicationRelatedPlotSearch(state)
}))(PlotApplicationEdit) as React.ComponentType<OwnProps>);