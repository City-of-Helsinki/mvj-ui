// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';

import {getUsersPermissions} from '$src/usersPermissions/selectors';
import Loader from '$components/loader/Loader';
import {FormNames, ViewModes} from '$src/enums';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentPlotSearch,
  getIsFetchingFormAttributes,
  getIsFetchingForm,
  getFormAttributes,
  getForm,
  getIsFetchingTemplateForms
} from '$src/plotSearch/selectors';
import {receiveCollapseStates} from '$src/plotSearch/actions';
import {getContentApplication} from '$src/plotSearch/helpers';
import {ApplicationFieldTitles} from '$src/plotSearch/enums';
import {
  getFieldOptions,
} from '$util/helpers';

import type {Attributes} from '$src/types';
import type {PlotSearch} from '$src/plotSearch/types';
import ApplicationPreviewSection from "./ApplicationPreviewSection";
import FormText from "../../../../components/form/FormText";

type Props = {
  usersPermissions: UsersPermissionsType,
  applicationCollapseState: Boolean,
  receiveCollapseStates: Function,
  isFetchingFormAttributes: Boolean,
  ifFetchingForm: Boolean,
  form: Object,
}

type State = {

}

class Application extends PureComponent<Props, State> {
  handleBasicInfoCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_SEARCH_APPLICATION]: {
          application: val,
        },
      },
    });
  }

  render (){
    const {
      // usersPermissions,
      applicationCollapseState,
      isFetchingFormAttributes,
      isFetchingForm,
      isFetchingTemplateForms,
      form,
    } = this.props;

    if (isFetchingFormAttributes || isFetchingForm || isFetchingTemplateForms) {
      return <Loader isLoading={true} />;
    }

    return (
      <Fragment>
        <Title>
          {ApplicationFieldTitles.APPLICATION}
        </Title>
        <Divider />
        {form && form.sections.filter((section) => section.visible).map((section, index) =>
            <ApplicationPreviewSection
              section={section}
              key={index}
              handleToggle={() => this.handleBasicInfoCollapseToggle(index)}
              defaultOpen={applicationCollapseState}
            />
        )}
        {!form && <FormText>Hakemuslomaketta ei ole vielä määritetty.</FormText>}
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      usersPermissions: getUsersPermissions(state),
      applicationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_SEARCH_APPLICATION}.application`),
      isFetchingFormAttributes: getIsFetchingFormAttributes(state),
      isFetchingForm: getIsFetchingForm(state),
      isFetchingTemplateForms: getIsFetchingTemplateForms(state),
      form: getForm(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(Application);
