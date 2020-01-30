// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {FormNames, ViewModes} from '$src/enums';
import FormTitleAndText from '$components/form/FormTitleAndText';
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
import {PropertyFieldTitles} from '$src/property/enums';
import PropertySite from './PropertySite';
import {getContentBasicInformation} from '$src/property/helpers';
import {
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';

import type {Attributes} from '$src/types';
import type {Property} from '$src/property/types';
import SingleRadioInput from '$components/inputs/SingleRadioInput';

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
      attributes,
      currentProperty,
    } = this.props;

    const property = getContentBasicInformation(currentProperty);
    const preparerOptions = getFieldOptions(attributes, 'preparer');
    const typeOptions = getFieldOptions(attributes, 'type');
    const subtypeOptions = getFieldOptions(attributes, 'subtype');
    const decisionOptions = getFieldOptions(attributes, 'decision.child.children.type');
    const stepOptions = getFieldOptions(attributes, 'step');
    
    return (
      <Fragment>
        <Title>
          {PropertyFieldTitles.BASIC_INFO}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
              headerTitle={PropertyFieldTitles.BASIC_INFO}
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Column small={12} large={8}>
                  <FormTextTitle>
                    {PropertyFieldTitles.NAME}
                  </FormTextTitle>
                  <FormText>{property.search_name}</FormText>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormTitleAndText
                    title={PropertyFieldTitles.PREPARER}
                    text={getLabelOfOption(preparerOptions, property.preparer) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormTextTitle>
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
                  <FormTitleAndText
                    title={PropertyFieldTitles.TYPE}
                    text={getLabelOfOption(typeOptions, property.type) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={3}>
                  <FormTitleAndText
                    title={PropertyFieldTitles.SUBTYPE}
                    text={getLabelOfOption(subtypeOptions, property.subtype) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle >
                    {PropertyFieldTitles.START_DATE}
                  </FormTextTitle>
                  <FormText>{property.start_date}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle>
                    {PropertyFieldTitles.CLOCK}
                  </FormTextTitle>
                  <FormText>{property.start_time}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle>
                    {PropertyFieldTitles.END_DATE}
                  </FormTextTitle>
                  <FormText>{property.end_date}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle>
                    {PropertyFieldTitles.CLOCK}
                  </FormTextTitle>
                  <FormText>{property.end_time}</FormText>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormTextTitle>
                    {PropertyFieldTitles.APPLICATIONS_UPDATED_DATE}
                  </FormTextTitle>
                  <FormText>{property.last_update}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={6}>
                  <FormTextTitle>
                    {PropertyFieldTitles.DECISION}
                  </FormTextTitle>
                  {!!property.decisions && property.decisions.map((decision, index) => 
                    <FormText key={index}>
                      <ExternalLink
                        className='no-margin'
                        href={`${decision.id}`}
                        text={getLabelOfOption(decisionOptions, decision.type) || '-'}
                      />
                    </FormText>
                  )}
                </Column>
                <Column small={6} medium={4} large={4}>
                  <FormTextTitle>
                    {PropertyFieldTitles.DECISION_TO_LIST}
                  </FormTextTitle>
                  {!!property.decisions && property.decisions.map((decision, index) => 
                    <Row key={index}>
                      <Column>
                        <SingleRadioInput
                          name={''}
                          label={''}
                          checked={!!decision.decision_to_list}
                          onChange={()=>{}}
                          onClick={()=>{}}
                          onKeyDown={()=>{}}
                        />
                      </Column>
                    </Row>
                  )}
                </Column>
                <Column small={6} medium={2} large={2}>
                  <FormTitleAndText
                    title={PropertyFieldTitles.STEP}
                    text={getLabelOfOption(stepOptions, property.step) || '-'}
                  />
                </Column>
              </Row>
              <WhiteBox>
                <SubTitle>
                  {'HAETTAVAT KOHTEET'}
                </SubTitle>

                {!!property.property_sites && property.property_sites.map((propertySite, index) => {
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
