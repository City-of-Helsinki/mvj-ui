import React, { Component } from "react";
import { FieldTypes, FormNames } from "@/enums";
import { formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { flowRight } from "lodash/util";
import type { RootState } from "@/root/types";
import { Column, Row } from "react-foundation";
import FormField from "@/components/form/FormField";
import {
  PlotApplicationOpeningRecordLabels,
  PlotApplicationOpeningRecordPaths,
} from "@/plotApplications/enums";
import { get } from "lodash/object";
import { getAttributes } from "@/application/selectors";
import type { Attributes } from "types";
import Authorization from "@/components/authorization/Authorization";
import { formatDate, isFieldAllowedToRead } from "@/util/helpers";
import { getCurrentPlotSearch } from "@/plotSearch/selectors";
import FormTextTitle from "@/components/form/FormTextTitle";
import FormText from "@/components/form/FormText";
import type { PlotSearch } from "@/plotSearch/types";
import Collapse from "@/components/collapse/Collapse";
import { getHoursAndMinutes } from "@/util/date";
type Props = {};
type InnerProps = Props & {
  enabled: boolean;
  applicationAttributes: Attributes;
  plotSearch: PlotSearch;
};

class PlotSearchApplicationsOpeningSection extends Component<InnerProps> {
  render() {
    const { applicationAttributes, plotSearch, enabled } = this.props;
    const isSaveClicked = false;

    if (!enabled) {
      return null;
    }

    return (
      <Collapse defaultOpen={true} headerTitle="Kilpailun hakemusten avaaminen">
        <Row>
          <Authorization
            allow={isFieldAllowedToRead(
              applicationAttributes,
              PlotApplicationOpeningRecordPaths.PLOT_SEARCH_TIMESTAMP,
            )}
          >
            <Column small={12} medium={6} large={4}>
              <FormTextTitle>
                {PlotApplicationOpeningRecordLabels.PLOT_SEARCH_TIMESTAMP}
              </FormTextTitle>
              <FormText>
                {plotSearch.opening_record?.length > 1
                  ? formatDate(plotSearch.opening_record) +
                    " " +
                    getHoursAndMinutes(plotSearch.opening_record)
                  : "-"}
              </FormText>
            </Column>
          </Authorization>
          <Authorization
            allow={isFieldAllowedToRead(
              applicationAttributes,
              PlotApplicationOpeningRecordPaths.CREATED_BY,
            )}
          >
            <Column small={6} medium={3} large={2}>
              <FormField
                name="opening_record.created_by"
                fieldAttributes={get(
                  applicationAttributes,
                  PlotApplicationOpeningRecordPaths.CREATED_BY,
                )}
                overrideValues={{
                  label: PlotApplicationOpeningRecordLabels.CREATED_BY,
                }}
                disableTouched={isSaveClicked}
              />
            </Column>
          </Authorization>
          <Authorization
            allow={isFieldAllowedToRead(
              applicationAttributes,
              PlotApplicationOpeningRecordPaths.OPENERS,
            )}
          >
            <Column small={12} medium={12} large={4}>
              <FormField
                name="opening_record.openers"
                fieldAttributes={get(
                  applicationAttributes,
                  PlotApplicationOpeningRecordPaths.OPENERS,
                )}
                overrideValues={{
                  fieldType: FieldTypes.USER,
                  label: PlotApplicationOpeningRecordLabels.OPENERS,
                  required: true,
                  multiSelect: true,
                }}
                disableTouched={isSaveClicked}
              />
            </Column>
          </Authorization>
        </Row>
        <Row>
          <Authorization
            allow={isFieldAllowedToRead(
              applicationAttributes,
              PlotApplicationOpeningRecordPaths.NOTE,
            )}
          >
            <Column small={12}>
              <FormField
                name="opening_record.note"
                fieldAttributes={get(
                  applicationAttributes,
                  PlotApplicationOpeningRecordPaths.NOTE,
                )}
                overrideValues={{
                  fieldType: FieldTypes.TEXTAREA,
                  required: true,
                  label: PlotApplicationOpeningRecordLabels.NOTE,
                }}
              />
            </Column>
          </Authorization>
        </Row>
        <Row>{/* document */}</Row>
      </Collapse>
    );
  }
}

export default flowRight(
  connect((state: RootState) => ({
    applicationAttributes: getAttributes(state),
    plotSearch: getCurrentPlotSearch(state),
    enabled:
      formValueSelector(FormNames.PLOT_SEARCH_APPLICATIONS_OPENING)(
        state,
        "opening_record",
      ) !== null,
  })),
  reduxForm({
    form: FormNames.PLOT_SEARCH_APPLICATIONS_OPENING,
    destroyOnUnmount: false,
  }),
)(PlotSearchApplicationsOpeningSection) as React.ComponentType<Props>;
