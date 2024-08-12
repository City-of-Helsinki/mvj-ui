import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import Loader from "@/components/loader/Loader";
import { FormNames, ViewModes } from "@/enums";
import Divider from "@/components/content/Divider";
import Title from "@/components/content/Title";
import { getCollapseStateByKey, getIsFetchingForm, getForm, getIsFetchingTemplateForms } from "@/plotSearch/selectors";
import { receiveCollapseStates } from "@/plotSearch/actions";
import { ApplicationFieldTitles } from "@/plotSearch/enums";
import ApplicationPreviewSection from "@/plotSearch/components/plotSearchSections/application/ApplicationPreviewSection";
import FormText from "@/components/form/FormText";
import { getIsFetchingFormAttributes } from "@/application/selectors";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type OwnProps = {};
type Props = OwnProps & {
  usersPermissions: UsersPermissionsType;
  applicationCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  isFetchingFormAttributes: boolean;
  isFetchingForm: boolean;
  isFetchingTemplateForms: boolean;
  form: Record<string, any>;
};
type State = {};

class Application extends PureComponent<Props, State> {
  handleBasicInfoCollapseToggle = (val: boolean) => {
    const {
      receiveCollapseStates
    } = this.props;
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_SEARCH_APPLICATION]: {
          application: val
        }
      }
    });
  };

  render() {
    const {
      // usersPermissions,
      applicationCollapseState,
      isFetchingFormAttributes,
      isFetchingForm,
      isFetchingTemplateForms,
      form
    } = this.props;

    if (isFetchingFormAttributes || isFetchingForm || isFetchingTemplateForms) {
      return <Loader isLoading={true} />;
    }

    return <Fragment>
        <Title>
          {ApplicationFieldTitles.APPLICATION}
        </Title>
        <Divider />
        {form && form.sections.filter(section => section.visible).map((section, index) => <ApplicationPreviewSection section={section} key={index} handleToggle={() => this.handleBasicInfoCollapseToggle(index)} defaultOpen={applicationCollapseState} />)}
        {!form && <FormText>Hakemuslomaketta ei ole vielä määritetty.</FormText>}
      </Fragment>;
  }

}

export default (connect(state => {
  return {
    usersPermissions: getUsersPermissions(state),
    applicationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_SEARCH_APPLICATION}.application`),
    isFetchingFormAttributes: getIsFetchingFormAttributes(state),
    isFetchingForm: getIsFetchingForm(state),
    isFetchingTemplateForms: getIsFetchingTemplateForms(state),
    form: getForm(state)
  };
}, {
  receiveCollapseStates
})(Application) as React.ComponentType<OwnProps>);