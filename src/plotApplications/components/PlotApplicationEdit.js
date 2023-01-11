// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {
  getApplicationRelatedAttachments,
  getApplicationRelatedForm, getApplicationRelatedPlotSearch,
  getCurrentPlotApplication, getIsFetchingApplicationRelatedAttachments, getIsFetchingApplicationRelatedPlotSearch,
} from '$src/plotApplications/selectors';
import type {RootState} from '$src/root/types';
import type {PlotApplication} from '$src/plotApplications/types';
import {reshapeSavedApplicationObject} from '$src/plotApplications/helpers';
import {getFieldAttributes} from '$util/helpers';
import {getFormAttributes, getIsFetchingForm, getIsFetchingFormAttributes} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';
import {orderBy} from 'lodash';
import PlotApplicationSectionData from '$src/plotApplications/components/PlotApplicationSectionData';
import Loader from '$components/loader/Loader';
import Title from '$components/content/Title';
import Divider from '$components/content/Divider';

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
          <PlotApplicationSectionData
            section={section}
            answer={answerData.sections[section.identifier]}
            topLevel
            fieldTypes={fieldTypes}
            key={section.identifier}
            plotSearch={plotSearch}
            editMode={true}
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
