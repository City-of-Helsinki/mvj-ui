// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';

import {getUsersPermissions} from '$src/usersPermissions/selectors';
import Loader from '$components/loader/Loader';
import {FormNames, ViewModes} from '$src/enums';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import {
  getCollapseStateByKey,
  getIsFetchingForm,
  getForm,
  getIsFetchingTemplateForms,
} from '$src/plotSearch/selectors';
import {receiveCollapseStates} from '$src/plotSearch/actions';
import {ApplicationFieldTitles} from '$src/plotSearch/enums';
import ApplicationPreviewSection from '$src/plotSearch/components/plotSearchSections/application/ApplicationPreviewSection';
import FormText from '$components/form/FormText';
import {getIsFetchingFormAttributes} from '$src/application/selectors';

import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type OwnProps = {

};

type Props = {
  ...OwnProps,
  usersPermissions: UsersPermissionsType,
  applicationCollapseState: boolean,
  receiveCollapseStates: Function,
  isFetchingFormAttributes: boolean,
  isFetchingForm: boolean,
  isFetchingTemplateForms: boolean,
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

export default (connect(
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
)(Application): React$ComponentType<OwnProps>);
