// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {getUiDataPropertyKey} from '$src/uiData/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {FormNames, FieldTypes, ViewModes} from '$src/enums';

import FormField from '$components/form/FormField';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {getCollapseStateByKey} from '$src/property/selectors';
import {receiveCollapseStates} from '$src/property/actions';
import {PropertyFieldTitles, PropertyFieldPaths} from '$src/property/enums';

type Props = {
  usersPermissions: UsersPermissionsType,
  collapseStateBasic: Boolean,
  receiveCollapseStates: Function,
}

type State = {

}

class BasicInfo extends PureComponent<Props, State> {
  state = {
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_SUMMARY]: {
          [key]: val,
        },
      },
    });
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('basic', val);
  }

  render (){
    const {
      // usersPermissions,
      collapseStateBasic,
    } = this.props;
    return (
      <Fragment>
        <Title uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.BASIC_INFO)}>
          {PropertyFieldTitles.BASIC_INFO}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              headerTitle={PropertyFieldTitles.BASIC_INFO}
              onToggle={this.handleBasicInfoCollapseToggle}
              uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.BASIC_INFO)}
            >
              <Row>
                <Column small={12} large={8}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.NAME)}>
                    {PropertyFieldTitles.NAME}
                  </FormTextTitle>
                  <FormText>{'Kruununvuorenrannan kortteleiden 49288 ja 49289 laatu- ja hintakilpailu'}</FormText>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.PREPARER)}>
                    {PropertyFieldTitles.PREPARER}
                  </FormTextTitle>
                  <FormText>{'Virve Virkailija'}</FormText>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.APPLICATIONS)}>
                    {PropertyFieldTitles.APPLICATIONS}
                  </FormTextTitle>
                  <FormText>
                    <ExternalLink
                      className='no-margin'
                      href={`/`}
                      text={'Hakemukset (1)'}
                    />
                  </FormText>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={3}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.TYPE)}>
                    {PropertyFieldTitles.TYPE}
                  </FormTextTitle>
                  <FormText>{'Asuntorakentaminen'}</FormText>
                </Column>
                <Column small={12} medium={6} large={3}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.SUBTYPE)}>
                    {PropertyFieldTitles.SUBTYPE}
                  </FormTextTitle>
                  <FormText>{'Hinta- ja laatukilpailu'}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.START_DATE)}>
                    {PropertyFieldTitles.START_DATE}
                  </FormTextTitle>
                  <FormText>{'01.01.2019'}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.CLOCK)}>
                    {PropertyFieldTitles.CLOCK}
                  </FormTextTitle>
                  <FormText>{'12:00'}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.END_DATE)}>
                    {PropertyFieldTitles.END_DATE}
                  </FormTextTitle>
                  <FormText>{'01.01.2019'}</FormText>
                </Column>
                <Column small={12} medium={6} large={1}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.CLOCK)}>
                    {PropertyFieldTitles.CLOCK}
                  </FormTextTitle>
                  <FormText>{'12:00'}</FormText>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.APPLICATIONS_UPDATED_DATE)}>
                    {PropertyFieldTitles.APPLICATIONS_UPDATED_DATE}
                  </FormTextTitle>
                  <FormText>{'14.09.2019 klo 00:00'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={6}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.DECISION)}>
                    {PropertyFieldTitles.DECISION}
                  </FormTextTitle>
                  <FormText>
                    <ExternalLink
                      className='no-margin'
                      href={`/`}
                      text={'Kiinteistölautakunta 15.12.2016 503 § Varausajan jatkaminen HEL 2018-123456'}
                    />
                  </FormText>
                  <FormText>
                    <ExternalLink
                      className='no-margin'
                      href={`/`}
                      text={'Kiinteistölautakunta 15.12.2016 503 § Lorem ipsum HEL 2018-123456'}
                    />
                  </FormText>
                </Column>
                <Column small={12} medium={6} large={6}>
                  <FormTextTitle uiDataKey={getUiDataPropertyKey(PropertyFieldPaths.DECISION_TO_LIST)}>
                    {PropertyFieldTitles.DECISION_TO_LIST}
                  </FormTextTitle>
                  {/* <FormField
                    className='no-margin'
                    fieldAttributes={{
                      label: 'Laskelman tyyppi',
                      type: FieldTypes.RADIO_WITH_FIELD,
                      required: true,
                      read_only: false,
                    }}
                    name='type'
                    invisibleLabel
                    disableDirty
                  /> */}
                </Column>
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
      collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PROPERTY_SUMMARY}.basic`),
    };
  },
  {
    receiveCollapseStates,
  }
)(BasicInfo);
