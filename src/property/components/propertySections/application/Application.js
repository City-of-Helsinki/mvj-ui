// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {FormNames, ViewModes} from '$src/enums';
import FormTitleAndText from '$components/form/FormTitleAndText';
import FileDownloadButton from '$components/file/FileDownloadButton';
import TitleH3 from '$components/content/TitleH3';
import WhiteBox from '$components/content/WhiteBox';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {getAttributes, getCollapseStateByKey, getCurrentProperty} from '$src/property/selectors';
import {receiveCollapseStates} from '$src/property/actions';
import {getContentApplication} from '$src/property/helpers';
import {ApplicationFieldTitles} from '$src/property/enums';
import {
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';

import type {Attributes} from '$src/types';
import type {Property} from '$src/property/types';
import Applicant from './Applicant';
import Target from './Target';

type Props = {
  usersPermissions: UsersPermissionsType,
  applicationCollapseState: Boolean,
  receiveCollapseStates: Function,
  attributes: Attributes,
  currentProperty: Property,
}

type State = {

}

class Application extends PureComponent<Props, State> {
  state = {
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PROPERTY_APPLICATION]: {
          application: val,
        },
      },
    });
  }

  render (){
    const {
      // usersPermissions,
      applicationCollapseState,
      attributes,
      currentProperty,
    } = this.props;

    const application = getContentApplication(currentProperty);
    const extraOptions = getFieldOptions(attributes, 'application_base.child.children.extra');
    const createdOptions = getFieldOptions(attributes, 'application_base.child.children.created');

    return (
      <Fragment>
        <Title>
          {ApplicationFieldTitles.APPLICATION}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={applicationCollapseState !== undefined ? applicationCollapseState : true}
              headerTitle={ApplicationFieldTitles.APPLICATION_BASE}
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Column large={3}>
                  <FormTextTitle >
                    {ApplicationFieldTitles.APPLICATION_DEFAULT}
                  </FormTextTitle>
                  <FormText>{application.default?'Hakytyypin oletuslomake':'-'}</FormText>
                </Column>
                <Column large={4}>
                  <FormTitleAndText
                    title={ApplicationFieldTitles.APPLICATION_EXTRA}
                    text={getLabelOfOption(extraOptions, application.extra) || '-'}
                  />
                </Column>
              </Row>
              <Row>
                <Column large={3}>
                  <FormTextTitle >
                    {ApplicationFieldTitles.APPLICATION_PREVIOUS}
                  </FormTextTitle>
                  <FormText>{application.previous?'Aiemmin luotu lomake':'-'}</FormText>
                </Column>
                <Column large={4}>
                  <FormTitleAndText
                    title={ApplicationFieldTitles.APPLICATION_CREATED}
                    text={getLabelOfOption(createdOptions, application.created) || '-'}
                  />
                </Column>
              </Row>
              <Column className={''} style={{margin: '0 0 10px 0'}}>
                <FileDownloadButton
                  disabled={true}
                  label='ESIKATSELE'
                  payload={{
                  }}
                  url={''} 
                />
              </Column>
              <WhiteBox className='application__white-stripes'>
                <TitleH3>
                  {'Kruununvuorenrannan kortteleiden 49288 ja 49289 hinta- ja laatukilpailu'}
                </TitleH3>
                {application.applicants.map((applicant, index)=>
                  <Applicant
                    applicant={applicant}
                    key={index}
                  />)}
                {application.targets.map((target, index)=>
                  <Target
                    target={target}
                    key={index}
                  />)}
              </WhiteBox>
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
      applicationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PROPERTY_APPLICATION}.application`),
      attributes: getAttributes(state),
      currentProperty: getCurrentProperty(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(Application);
