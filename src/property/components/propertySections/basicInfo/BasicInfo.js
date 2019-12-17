// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {getUiDataPropertyKey} from '$src/uiData/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {FormNames, ViewModes} from '$src/enums';

import WhiteBox from '$components/content/WhiteBox';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import SubTitle from '$components/content/SubTitle';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {getAttributes, getCollapseStateByKey, getCurrentProperty} from '$src/property/selectors';
import {receiveCollapseStates} from '$src/property/actions';
import {PropertyFieldTitles, PropertyFieldPaths} from '$src/property/enums';
import PropertySite from './PropertySite';
import {getContentBasicInformation} from '$src/property/helpers';

import type {Attributes} from '$src/types';
import type {Property} from '$src/property/types';

type Props = {
  usersPermissions: UsersPermissionsType,
  basicInformationCollapseState: Boolean,
  receiveCollapseStates: Function,
  attributes: Attributes,
  currentProperty: Property,
}

type State = {

}

class BasicInfo extends PureComponent<Props, State> {
  state = {
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PROPERTY_BASIC_INFORMATION]: {
          basic_information: val,
        },
      },
    });
  }

  render (){
    const {
      // usersPermissions,
      basicInformationCollapseState,
      // attributes,
      currentProperty,
    } = this.props;

    console.log('collapse:', basicInformationCollapseState);

    const property = getContentBasicInformation(currentProperty);

    return (
      <Fragment>
        <Title uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.BASIC_INFO)}>
          {PropertyFieldTitles.BASIC_INFO}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
              headerTitle={PropertyFieldTitles.BASIC_INFO}
              onToggle={this.handleBasicInfoCollapseToggle}
              uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.BASIC_INFO)}
            >
              <Row>
                <Column small={12} large={8}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.NAME)}>
                    {PropertyFieldTitles.NAME}
                  </FormTextTitle>
                  <FormText>{property.search_name}</FormText>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.PREPARER)}>
                    {PropertyFieldTitles.PREPARER}
                  </FormTextTitle>
                  <FormText>{property.preparer}</FormText>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.APPLICATIONS)}>
                    {PropertyFieldTitles.APPLICATIONS}
                  </FormTextTitle>
                  {property.applications && property.applications.map((application, index) => 
                    <FormText key={index}>
                      <ExternalLink
                        className='no-margin'
                        href={`${application.id}`}
                        text={application.name}
                      />
                    </FormText>
                  )}
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={3}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.TYPE)}>
                    {PropertyFieldTitles.TYPE}
                  </FormTextTitle>
                  <FormText>{property.type.name}</FormText>
                </Column>
                <Column small={12} medium={6} large={3}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.SUBTYPE)}>
                    {PropertyFieldTitles.SUBTYPE}
                  </FormTextTitle>
                  <FormText>{property.subtype.name}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.START_DATE)}>
                    {PropertyFieldTitles.START_DATE}
                  </FormTextTitle>
                  <FormText>{property.start_date}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.CLOCK)}>
                    {PropertyFieldTitles.CLOCK}
                  </FormTextTitle>
                  <FormText>{property.start_time}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.END_DATE)}>
                    {PropertyFieldTitles.END_DATE}
                  </FormTextTitle>
                  <FormText>{property.end_date}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.CLOCK)}>
                    {PropertyFieldTitles.CLOCK}
                  </FormTextTitle>
                  <FormText>{property.end_time}</FormText>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.APPLICATIONS_UPDATED_DATE)}>
                    {PropertyFieldTitles.APPLICATIONS_UPDATED_DATE}
                  </FormTextTitle>
                  <FormText>{property.last_update}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={6}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.DECISION)}>
                    {PropertyFieldTitles.DECISION}
                  </FormTextTitle>
                  {!!property.decisions.length && property.decisions.map((decision, index) => 
                    <FormText key={index}>
                      <ExternalLink
                        className='no-margin'
                        href={`${decision.id}`}
                        text={decision.name}
                      />
                    </FormText>
                  )}
                </Column>
                <Column small={12} medium={6} large={6}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.DECISION_TO_LIST)}>
                    {PropertyFieldTitles.DECISION_TO_LIST}
                  </FormTextTitle>
                </Column>
              </Row>
              <WhiteBox> {/* TODO  : make light green */}
                <SubTitle>
                  {'HAETTAVAT KOHTEET'}
                </SubTitle>

                {!!property.search_properties && property.search_properties.map((propertySite, index) => {
                  return(
                    <Row key={index}>
                      <PropertySite
                        propertySite={propertySite}
                        index={index}
                      />
                    </Row>
                  );
                })}
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
      basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PROPERTY_BASIC_INFORMATION}.basic_information`),
      attributes: getAttributes(state),
      currentProperty: getCurrentProperty(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(BasicInfo);
