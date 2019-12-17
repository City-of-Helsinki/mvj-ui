// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {receiveCollapseStates} from '$src/property/actions';
import {FormNames, ViewModes} from '$src/enums';
import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ExternalLink from '$components/links/ExternalLink';
import {getCollapseStateByKey} from '$src/property/selectors';

type Props = {
  propertySite: Object,
  receiveCollapseStates: Function,
  collapseState: Boolean,
}

type State = {

}

class PropertySite extends PureComponent<Props, State> {
  state = {
  }

  handleCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates, propertySite} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PROPERTY_BASIC_INFORMATION]: {
          property_site: {
            [propertySite.id]: val,
          },
        },
      },
    });
  };

  render (){
    
    const {
      collapseState,
      propertySite,
    } = this.props;

    return (
      <Column large={12}>
        <Collapse
          className='collapse__secondary greenCollapse'
          defaultOpen={collapseState !== undefined ? collapseState : true}
          headerTitle={propertySite.target_identifier}
          onToggle={this.handleCollapseToggle}
        >
          <Row> {/* TODO wrap columns around authorization */}
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>{/* required={false} enableUiDataEdit */}
                {'Kohteen tunnus'}
              </FormTextTitle>
              <FormText>
                <ExternalLink
                  className='no-margin'
                  href={`/`}
                  text={propertySite.target_identifier}
                />
              </FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Vuokraustunnus'}
              </FormTextTitle>
              <FormText>
                <ExternalLink
                  className='no-margin'
                  href={`/`}
                  text={propertySite.lease_id}
                />
              </FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Hitas'}
              </FormTextTitle>
              <FormText>{propertySite.hitas}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {propertySite.address}
              </FormTextTitle>
              <FormText>{'Verkkosaarenranta'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {propertySite.step}
              </FormTextTitle>
              <FormText>{'Suunniteltu'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Asemakaavan ja käsittelyvaihe'}
              </FormTextTitle>
              {!!propertySite.handling.length && propertySite.handling.map((handling, index) =>
                <FormText key={index}>
                  <ExternalLink
                    className='no-margin'
                    href={`/`}
                    text={handling.id}
                  />
                </FormText>
              )}  
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Hakemukset'}
              </FormTextTitle>
              {!!propertySite.applications.length && propertySite.applications.map((application, index) => 
                <FormText key={index}>
                  <ExternalLink
                    className='no-margin'
                    href={`/`}
                    text={application.name}
                  />
                </FormText>
              )}
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Käyttötarkoitus'}
              </FormTextTitle>
              <FormText>{propertySite.use}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Rak. oikeus'}
              </FormTextTitle>
              <FormText>{propertySite.build_law}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Rak. oikeus'}
              </FormTextTitle>
              <FormText>{'-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Rahoitusmuoto'}
              </FormTextTitle>
              <FormText>{propertySite.funding}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Hallintamuoto'}
              </FormTextTitle>
              <FormText>{propertySite.management}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={''}>
                {'Ehdotettu varauksensaaja'}
              </FormTextTitle>
              {!!propertySite.suggested.length && propertySite.suggested.map((suggested, index)=>
                <FormText key={index}>{suggested.name}</FormText>
              )}
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle uiDataKey={''}>
                {'Osuus'}
              </FormTextTitle>
              {!!propertySite.suggested.length && propertySite.suggested.map((suggested, index)=>
                <FormText key={index}>{suggested.share}</FormText>
              )}
            </Column>
          </Row>
        </Collapse>
      </Column>
    );
  }
}

export default connect(
  (state, props) => {
    const id = props.propertySite.id;
    return {
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PROPERTY_BASIC_INFORMATION}.property_site.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(PropertySite);
