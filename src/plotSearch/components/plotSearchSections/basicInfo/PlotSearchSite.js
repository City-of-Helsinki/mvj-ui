// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {receiveCollapseStates} from '$src/plotSearch/actions';
import {FormNames, ViewModes} from '$src/enums';
import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ExternalLink from '$components/links/ExternalLink';
import {
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  plotSearchSite: Object,
  receiveCollapseStates: Function,
  collapseState: Boolean,
}

type State = {

}

class PlotSearchSite extends PureComponent<Props, State> {
  state = {
  }

  handleCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates, plotSearchSite} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: {
          plotSearch_site: {
            [plotSearchSite.id]: val,
          },
        },
      },
    });
  };

  render (){
    
    const {
      collapseState,
      plotSearchSite,
      attributes,
    } = this.props;

    const identifierOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.target_identifier');
    const leaseIdOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.lease_id');
    const stepOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.step');
    const handlingOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.handling');
    const useOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.use');
    const fundingOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.funding');
    const ownershipOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.ownership');
    const suggestedNameOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.suggested.child.children.name');

    return (
      <Column large={12}>
        <Collapse
          className='collapse__secondary greenCollapse'
          defaultOpen={collapseState !== undefined ? collapseState : true}
          headerTitle={getLabelOfOption(identifierOptions, plotSearchSite.target_identifier) || '-'}
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
                  text={getLabelOfOption(identifierOptions, plotSearchSite.target_identifier) || '-'}
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
                  text={getLabelOfOption(leaseIdOptions, plotSearchSite.lease_id) || '-'}
                />
              </FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Hitas'}
              </FormTextTitle>
              <FormText>{plotSearchSite.hitas || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Osoite'}
              </FormTextTitle>
              <FormText>{plotSearchSite.address || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Suunniteltu'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(stepOptions, plotSearchSite.step) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Asemakaavan ja käsittelyvaihe'}
              </FormTextTitle>
              <ExternalLink
                className='no-margin'
                href={`/`}
                text={getLabelOfOption(handlingOptions, plotSearchSite.handling) || '-'}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Hakemukset'}
              </FormTextTitle>
              {(plotSearchSite.applications && !!plotSearchSite.applications.length) && plotSearchSite.applications.map((application, index) => 
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
              <FormText>{getLabelOfOption(useOptions, plotSearchSite.use) || '-'}</FormText>
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Rak. oikeus'}
              </FormTextTitle>
              {plotSearchSite.build_right ? <FormText>{`${plotSearchSite.build_right} k-m2`}</FormText>:<FormText>{'-'}</FormText>}
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Rak. valmius'}
              </FormTextTitle>
              <FormText>{plotSearchSite.build_ready_in || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Rahoitusmuoto'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(fundingOptions, plotSearchSite.funding) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Hallintamuoto'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(ownershipOptions, plotSearchSite.ownership) || '-'}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle>
                {'Ehdotettu varauksensaaja'}
              </FormTextTitle>
              {plotSearchSite.suggested && !!plotSearchSite.suggested.length && plotSearchSite.suggested.map((suggested, index)=>
                <FormText key={index}>{getLabelOfOption(suggestedNameOptions, suggested.name) || '-'}</FormText>
              )}
            </Column>
            <Column small={3} medium={2} large={1}>
              <FormTextTitle>
                {'Osuus'}
              </FormTextTitle>
              {plotSearchSite.suggested && !!plotSearchSite.suggested.length && plotSearchSite.suggested.map((suggested, index)=>
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
    const id = props.plotSearchSite.id;
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.plotSearch_site.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(PlotSearchSite);
