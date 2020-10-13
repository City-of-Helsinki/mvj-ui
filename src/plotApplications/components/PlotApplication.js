// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {FormNames, ViewModes} from '$src/enums';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {getAttributes, getCollapseStateByKey, getCurrentPlotApplication} from '$src/plotApplications/selectors';
import {receiveCollapseStates} from '$src/plotApplications/actions';
// import {getContentBasicInformation} from '$src/plotApplications/helpers';
import {
  isFieldAllowedToRead,
} from '$util/helpers';
import type {Attributes} from '$src/types';
import type {PlotApplication as PlotApplicationType} from '$src/plotApplications/types';

type Props = {
  usersPermissions: UsersPermissionsType,
  applicationCollapseState: Boolean,
  receiveCollapseStates: Function,
  attributes: Attributes,
  currentPlotApplication: PlotApplicationType,
}

type State = {

}

class PlotApplication extends PureComponent<Props, State> {
  state = {
  }

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

  render (){
    const {
      applicationCollapseState,
      attributes,
      currentPlotApplication,
    } = this.props;

    const plotApplication = currentPlotApplication; // getContentBasicInformation(currentPlotApplication);
    
    return (
      <Fragment>
        <Title>
          {'Hakemus'}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={applicationCollapseState !== undefined ? applicationCollapseState : true}
              headerTitle={'Hakemus'}
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, 'name')}>
                  <Column small={12} large={8}>
                    <FormTextTitle>
                      {'Nimi'}
                    </FormTextTitle>
                    <FormText>{plotApplication.name}</FormText>
                  </Column>
                </Authorization>
              </Row>

            </Collapse>
          </Column>
        </Row>
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      usersPermissions: getUsersPermissions(state),
      applicationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_APPLICATION}.basic_information`),
      attributes: getAttributes(state),
      currentPlotApplication: getCurrentPlotApplication(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(PlotApplication);
