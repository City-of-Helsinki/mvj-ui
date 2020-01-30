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
import {
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/property/selectors';
import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
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
      attributes,
    } = this.props;

    const identifierOptions = getFieldOptions(attributes, 'property_sites.child.children.target_identifier');
    const leaseIdOptions = getFieldOptions(attributes, 'property_sites.child.children.lease_id');
    const stepOptions = getFieldOptions(attributes, 'property_sites.child.children.step');
    const handlingOptions = getFieldOptions(attributes, 'property_sites.child.children.handling');
    const useOptions = getFieldOptions(attributes, 'property_sites.child.children.use');
    const fundingOptions = getFieldOptions(attributes, 'property_sites.child.children.funding');
    const ownershipOptions = getFieldOptions(attributes, 'property_sites.child.children.ownership');
    const suggestedNameOptions = getFieldOptions(attributes, 'property_sites.child.children.suggested.child.children.name');

    return (
      <Column large={12}>
        <Collapse
          className='collapse__secondary greenCollapse'
          defaultOpen={collapseState !== undefined ? collapseState : true}
          headerTitle={getLabelOfOption(identifierOptions, propertySite.target_identifier) || '-'}
          onToggle={this.handleCollapseToggle}
        >
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Kohteen tunnus'}
              </FormTextTitle>
              <FormText>
                <ExternalLink
                  className='no-margin'
                  href={`/`}
                  text={getLabelOfOption(identifierOptions, propertySite.target_identifier) || '-'}
                />
              </FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Vuokraustunnus'}
              </FormTextTitle>
              <FormText>
                <ExternalLink
                  className='no-margin'
                  href={`/`}
                  text={getLabelOfOption(leaseIdOptions, propertySite.lease_id) || '-'}
                />
              </FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Hitas'}
              </FormTextTitle>
              <FormText>{propertySite.hitas || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Osoite'}
              </FormTextTitle>
              <FormText>{propertySite.address || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Suunniteltu'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(stepOptions, propertySite.step) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Asemakaavan ja käsittelyvaihe'}
              </FormTextTitle>
              <ExternalLink
                className='no-margin'
                href={`/`}
                text={getLabelOfOption(handlingOptions, propertySite.handling) || '-'}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Hakemukset'}
              </FormTextTitle>
              {(propertySite.applications && !!propertySite.applications.length) && propertySite.applications.map((application, index) => 
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
              <FormTextTitle>
                {'Käyttötarkoitus'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(useOptions, propertySite.use) || '-'}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Rak. oikeus'}
              </FormTextTitle>
              {propertySite.build_right ? <FormText>{`${propertySite.build_right} k-m2`}</FormText>:<FormText>{'-'}</FormText>}
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Rak. valmius'}
              </FormTextTitle>
              <FormText>{propertySite.build_ready_in || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Rahoitusmuoto'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(fundingOptions, propertySite.funding) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Hallintamuoto'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(ownershipOptions, propertySite.ownership) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Ehdotettu varauksensaaja'}
              </FormTextTitle>
              {propertySite.suggested && !!propertySite.suggested.length && propertySite.suggested.map((suggested, index)=>
                <FormText key={index}>{getLabelOfOption(suggestedNameOptions, suggested.name) || '-'}</FormText>
              )}
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Osuus'}
              </FormTextTitle>
              {propertySite.suggested && !!propertySite.suggested.length && propertySite.suggested.map((suggested, index)=>
                <FormText key={index}>{`${suggested.share_numerator}/${suggested.share_denominator}`}</FormText>
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
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PROPERTY_BASIC_INFORMATION}.property_site.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(PropertySite);
