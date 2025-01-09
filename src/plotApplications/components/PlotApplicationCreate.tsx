import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { reduxForm, initialize, change, getFormValues } from "redux-form";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Authorization from "@/components/authorization/Authorization";
import { FormNames, ViewModes } from "@/enums";
import Collapse from "@/components/collapse/Collapse";
import Divider from "@/components/content/Divider";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import Title from "@/components/content/Title";
import FormField from "@/components/form/FormField";
import {
  receiveCollapseStates,
  receiveIsSaveClicked,
} from "@/plotApplications/actions";
import {
  getCollapseStateByKey,
  getIsSaveClicked,
  getErrorsByFormName,
} from "@/plotApplications/selectors";
import {
  getInitialApplication,
  getSectionTargetFromMeta,
} from "@/plotApplications/helpers";
import {
  getIsFetching as getIsFetchingPlotSearchList,
  getIsFetchingForm,
  getPlotSearchList,
} from "@/plotSearch/selectors";
import {
  getCurrentEditorTargets,
  getCurrentPlotApplication,
} from "@/plotApplications/selectors";
import ApplicationSubsection from "@/application/components/ApplicationSubsection";
import {
  receiveFormValidFlags,
  receiveSinglePlotApplication,
  setCurrentEditorTargets,
} from "@/plotApplications/actions";
import Loader from "@/components/loader/Loader";
import {
  getAttributes,
  getFieldTypeMapping,
  getFormAttributes,
  getIsFetchingApplicantInfoCheckAttributes,
  getIsFetchingAttachmentAttributes,
  getIsFetchingFormAttributes,
} from "@/application/selectors";
import {
  getInitialApplicationForm,
  getSectionTemplate,
  getTargetTitle,
} from "@/application/helpers";
import {
  fetchAttachmentAttributes,
  fetchFormAttributes,
  fetchPendingUploads,
} from "@/application/actions";
import { TARGET_SECTION_IDENTIFIER } from "@/application/constants";
import type { Attributes } from "types";
import type { PlotSearchList } from "@/plotSearch/types";
import type { PlotApplication } from "@/plotApplications/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import { validateApplicationForm } from "@/application/formValidation";
type OwnProps = {};
type Props = OwnProps & {
  attributes: Attributes;
  collapseStateCommon: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  errors: Record<string, any> | null | undefined;
  preparer: string | null | undefined;
  formName: string;
  isSaveClicked: boolean;
  initialize: (...args: Array<any>) => any;
  change: (...args: Array<any>) => any;
  plotSearches: PlotSearchList;
  fetchPendingUploads: (...args: Array<any>) => any;
  fetchFormAttributes: (...args: Array<any>) => any;
  fetchAttachmentAttributes: (...args: Array<any>) => any;
  isFetchingFormAttributes: boolean;
  isFetchingAttachmentAttributes: boolean;
  isFetchingPlotSearchList: boolean;
  array: Record<string, (...args: Array<any>) => any>;
  fieldTypeMapping: Record<string, any>;
  valid: boolean;
  receiveFormValidFlags: (...args: Array<any>) => any;
  formValues: Record<string, any>;
  currentEditorTargets: Array<Record<string, any>>;
  setCurrentEditorTargets: (...args: Array<any>) => any;
  isFetchingApplicantInfoCheckAttributes: boolean;
  retrievingData: boolean;
  currentPlotApplication?: PlotApplication;
  formAttributes: Attributes;
  receiveSinglePlotApplication: (...args: Array<any>) => any;
};
type State = {
  form: Record<string, any>;
  isFormFixed: boolean;
};

class PlotApplicationCreate extends PureComponent<Props, State> {
  state = {
    form: null,
    isFormFixed: false,
  };

  componentDidMount() {
    const {
      fetchFormAttributes,
      fetchAttachmentAttributes,
      fetchPendingUploads,
      initialize,
      valid,
      receiveSinglePlotApplication,
    } = this.props;
    fetchPendingUploads();
    fetchFormAttributes(1);
    fetchAttachmentAttributes();
    initialize(getInitialApplication());
    // remove single application view data if that view had been visited during the same session
    receiveSinglePlotApplication({});
    receiveFormValidFlags({
      [FormNames.PLOT_APPLICATION]: valid,
    });
  }

  componentDidUpdate(prevProps) {
    const { receiveFormValidFlags } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.PLOT_APPLICATION]: this.props.valid,
      });
    }
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const { receiveCollapseStates } = this.props;
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.PLOT_APPLICATION]: {
          common: val,
        },
      },
    });
  };
  handleCommonFieldsCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle("common", val);
  };
  initializeFormValues = (formId) => {
    const { setCurrentEditorTargets } = this.props;
    const matchingSearch = this.props.plotSearches.results?.find(
      (search) => search.form?.id === formId,
    );
    this.props.change(
      "formEntries",
      getInitialApplicationForm(
        this.props.fieldTypeMapping,
        matchingSearch?.form,
        null,
      ),
    );
    this.props.change("targets", []);
    this.setState(() => ({
      form: matchingSearch?.form,
    }));
    setCurrentEditorTargets(matchingSearch?.plot_search_targets);
  };
  updateTargetSections = (newTargetIds, _, oldTargetIds) => {
    const { array, formValues } = this.props;
    const deleted = oldTargetIds.filter((id) => !newTargetIds.includes(id));
    const added = newTargetIds.filter((id) => !oldTargetIds.includes(id));
    const targetSectionsArrayPath = `formEntries.sections.${TARGET_SECTION_IDENTIFIER}`;
    const oldValues = get(formValues, targetSectionsArrayPath);
    // Create a new section for every previously missing target ID
    added.forEach((id) => {
      array.push(targetSectionsArrayPath, {
        ...getSectionTemplate(
          FormNames.PLOT_APPLICATION,
          "formEntries",
          TARGET_SECTION_IDENTIFIER,
        ),
        metadata: {
          identifier: id,
        },
      });
    });
    // Remove all sections for no longer existing target IDs
    // (sorted descending by index, so we can remove them all in one sweep
    //  without the indices changing halfway)
    const deletedIndices = deleted
      .map((id) =>
        oldValues.findIndex((item) => item.metadata?.identifier === id),
      )
      .sort((a, b) => (a < b ? 1 : -1));
    deletedIndices.forEach((index) =>
      array.remove(targetSectionsArrayPath, index),
    );
  };

  render() {
    const {
      collapseStateCommon,
      isSaveClicked,
      attributes,
      errors,
      plotSearches,
      currentEditorTargets,
      currentPlotApplication,
      retrievingData,
    } = this.props;
    const { isFormFixed } = this.state;

    if (retrievingData) {
      return <Loader isLoading={true} />;
    }

    const plotSearchCandidates = plotSearches.results || [];
    const plotSearchChoices = plotSearchCandidates
      .filter((option) => option.form)
      .map((option) => ({
        display_name: option.name,
        value: option.form.id,
      }));
    const targetOptions = currentEditorTargets.map((target) => ({
      value: target.id,
      label: getTargetTitle(target),
    }));
    return (
      <form className="PlotApplicationEdit">
        <Title>Hakemus</Title>
        <Divider />
        <Row className="summary__content-wrapper">
          <Column small={12}>
            <Collapse
              defaultOpen={
                collapseStateCommon !== undefined ? collapseStateCommon : true
              }
              hasErrors={isSaveClicked && !isEmpty(errors)}
              headerTitle="Hakemus"
              onToggle={this.handleCommonFieldsCollapseToggle}
            >
              <Row>
                <Authorization allow={true}>
                  <Column small={12} medium={6} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={{
                        ...get(attributes, "form"),
                        label: "Tonttihaku",
                        choices: plotSearchChoices,
                      }}
                      overrideValues={{
                        allowEdit: !isFormFixed,
                      }}
                      name="formId"
                      onChange={this.initializeFormValues}
                    />
                  </Column>
                </Authorization>
                <Authorization allow={true}>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, "id")}
                      name="id"
                      disabled
                    />
                  </Column>
                </Authorization>
              </Row>
            </Collapse>

            {this.state.form && (
              <>
                <Row>
                  <Column small={12}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={{
                        ...get(attributes, "targets"),
                        type: "multiselect",
                        label: "Haettavat kohteet",
                      }}
                      overrideValues={{
                        options: targetOptions,
                      }}
                      name="targets"
                      onChange={this.updateTargetSections}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12}>
                    {this.state.form.sections.map((section) => (
                      <ApplicationSubsection
                        path={["formEntries.sections"]}
                        section={section}
                        headerTag="h2"
                        key={section.id}
                        formName={FormNames.PLOT_APPLICATION}
                        formPath="formEntries"
                        sectionTitleTransformers={[
                          (title, section, identifier) =>
                            getSectionTargetFromMeta(identifier) || title,
                        ]}
                        answerId={currentPlotApplication?.id || null}
                      />
                    ))}
                  </Column>
                </Row>
              </>
            )}
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.PLOT_APPLICATION;
export default flowRight(
  connect(
    (state) => {
      const isFetchingPlotSearchList = getIsFetchingPlotSearchList(state);
      const isFetchingFormAttributes = getIsFetchingFormAttributes(state);
      const isFetchingAttachmentAttributes =
        getIsFetchingAttachmentAttributes(state);
      const isFetchingApplicantInfoCheckAttributes =
        getIsFetchingApplicantInfoCheckAttributes(state);
      const isFetchingForm = getIsFetchingForm(state);
      const isRetrievingData =
        isFetchingFormAttributes ||
        isFetchingAttachmentAttributes ||
        isFetchingApplicantInfoCheckAttributes ||
        isFetchingForm ||
        isFetchingPlotSearchList;
      return {
        attributes: getAttributes(state),
        usersPermissions: getUsersPermissions(state),
        collapseStateCommon: getCollapseStateByKey(
          state,
          `${ViewModes.EDIT}.${formName}.common`,
        ),
        isSaveClicked: getIsSaveClicked(state),
        errors: getErrorsByFormName(state, formName),
        plotSearches: getPlotSearchList(state),
        fieldTypeMapping: getFieldTypeMapping(state),
        isFetchingPlotSearchList,
        isFetchingFormAttributes,
        isFetchingAttachmentAttributes,
        isFetchingApplicantInfoCheckAttributes,
        isFetchingForm,
        formValues: getFormValues(formName)(state),
        currentEditorTargets: getCurrentEditorTargets(state),
        currentPlotApplication: getCurrentPlotApplication(state),
        formAttributes: getFormAttributes(state),
        retrievingData: isRetrievingData,
      };
    },
    {
      receiveCollapseStates,
      receiveIsSaveClicked,
      receiveFormValidFlags,
      initialize,
      change,
      fetchFormAttributes,
      fetchPendingUploads,
      fetchAttachmentAttributes,
      setCurrentEditorTargets,
      receiveSinglePlotApplication,
    },
  ),
  reduxForm({
    form: formName,
    validate: validateApplicationForm("formEntries"),
  }),
)(PlotApplicationCreate) as React.ComponentType<OwnProps>;
