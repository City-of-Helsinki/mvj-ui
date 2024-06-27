import React, { Component } from "react";
import { getFormValues, reduxForm } from "redux-form";
import { Column, Row } from "react-foundation";
import { get } from "lodash/object";
import { flowRight } from "lodash/util";
import { connect } from "react-redux";
import FormField from "/src/components/form/FormField";
import type { RootState } from "root/types";
import { getAttributes } from "/src/application/selectors";
import type { Attributes } from "types";
import { FieldTypes, FormNames } from "enums";
import { getCurrentPlotApplication, getIsSaveClicked } from "/src/plotApplications/selectors";
import { getContentUser } from "users/helpers";
import { PlotApplicationOpeningRecordLabels, PlotApplicationOpeningRecordPaths } from "/src/plotApplications/enums";
import { isFieldAllowedToRead } from "util/helpers";
import Authorization from "/src/components/authorization/Authorization";
type Props = {};
type InnerProps = Props & {
  attributes: Attributes;
  isSaveClicked: boolean;
  initialize: (...args: Array<any>) => any;
  change: (...args: Array<any>) => any;
  currentPlotApplication: Record<string, any>;
  formValues: Record<string, any>;
};

class PlotApplicationOpeningRecordForm extends Component<InnerProps> {
  componentDidMount(): any {
    const {
      initialize,
      change,
      currentPlotApplication,
      formValues
    } = this.props;
    initialize({
      opening_record: {
        id: currentPlotApplication.opening_record.id,
        note: currentPlotApplication.opening_record.note,
        openers: currentPlotApplication.opening_record.openers.map(getContentUser),
        time_stamp: currentPlotApplication.opening_record.time_stamp,
        plot_search_time_stamp: currentPlotApplication.plot_search_opening_time_stamp
      }
    });

    if (formValues?.opening_record) {
      change('opening_record.note', formValues.opening_record.note);
      change('opening_record.openers', formValues.opening_record.openers);
    }
  }

  render(): React.ReactNode {
    const {
      attributes,
      isSaveClicked
    } = this.props;
    return <div>
        <Row>
          <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.PLOT_SEARCH_TIMESTAMP)}>
            <Column small={12} medium={6} large={4}>
              <FormField name='opening_record.plot_search_time_stamp' fieldAttributes={{
              type: FieldTypes.TIME,
              read_only: true,
              label: PlotApplicationOpeningRecordLabels.PLOT_SEARCH_TIMESTAMP
            }} disableTouched={isSaveClicked} />
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.TIMESTAMP)}>
            <Column small={6} medium={3} large={2}>
              <FormField name='opening_record.time_stamp' fieldAttributes={{
              type: FieldTypes.TIME,
              read_only: true,
              label: PlotApplicationOpeningRecordLabels.TIMESTAMP
            }} disableTouched={isSaveClicked} />
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.CREATED_BY)}>
            <Column small={6} medium={3} large={2}>
              <FormField name='opening_record.created_by' fieldAttributes={get(attributes, PlotApplicationOpeningRecordPaths.CREATED_BY)} overrideValues={{
              label: PlotApplicationOpeningRecordLabels.CREATED_BY
            }} disableTouched={isSaveClicked} />
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.OPENERS)}>
            <Column small={12} medium={12} large={4}>
              <FormField name='opening_record.openers' fieldAttributes={get(attributes, PlotApplicationOpeningRecordPaths.OPENERS)} overrideValues={{
              fieldType: FieldTypes.USER,
              label: PlotApplicationOpeningRecordLabels.OPENERS,
              required: true,
              multiSelect: true
            }} disableTouched={isSaveClicked} />
            </Column>
          </Authorization>
        </Row>
        <Row>
          <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationOpeningRecordPaths.NOTE)}>
            <Column small={12}>
              <FormField name='opening_record.note' fieldAttributes={get(attributes, PlotApplicationOpeningRecordPaths.NOTE)} overrideValues={{
              fieldType: FieldTypes.TEXTAREA,
              required: true,
              label: PlotApplicationOpeningRecordLabels.NOTE
            }} />
            </Column>
          </Authorization>
        </Row>
      </div>;
  }

}

export default (flowRight(connect((state: RootState) => ({
  attributes: getAttributes(state),
  isSaveClicked: getIsSaveClicked(state),
  currentPlotApplication: getCurrentPlotApplication(state),
  formValues: getFormValues(FormNames.PLOT_APPLICATION_OPENING)(state)
})), reduxForm({
  form: FormNames.PLOT_APPLICATION_OPENING
}))(PlotApplicationOpeningRecordForm) as React.ComponentType<Props>);