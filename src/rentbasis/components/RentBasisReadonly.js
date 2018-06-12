// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ContentContainer from '$components/content/ContentContainer';
import FormFieldLabel from '$components/form/FormFieldLabel';
import GreenBox from '$components/content/GreenBox';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {formatDate, formatNumber, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getAttributes} from '$src/rentbasis/selectors';

import type {Attributes, RentBasis} from '../types';

type Props = {
  attributes: Attributes,
  rentBasis: RentBasis,
}

const RentBasisReadonly = ({attributes, rentBasis}: Props) => {
  const plotTypeOptions = getAttributeFieldOptions(attributes, 'plot_type');
  const managementOptions = getAttributeFieldOptions(attributes, 'management');
  const financingOptions = getAttributeFieldOptions(attributes, 'financing');
  const indexOptions = getAttributeFieldOptions(attributes, 'index');
  const buildPermissionTypeOptions = getAttributeFieldOptions(attributes, 'rent_rates.child.children.build_permission_type');
  const areaUnitOptions = getAttributeFieldOptions(attributes, 'rent_rates.child.children.area_unit');
  const decisionsMakerOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.decision_maker');
  const decisions = get(rentBasis, 'decisions', []);

  return (
    <ContentContainer>
      <GreenBox>
        <Row>
          <Column small={6} medium={4} large={3}>
            <label>Tonttityyppi</label>
            <p>{getLabelOfOption(plotTypeOptions, rentBasis.plot_type) || '-'}</p>
          </Column>
          <Column small={6} medium={8} large={4}>
            <Row>
              <Column small={6}>
                <label>Alkupvm</label>
                <p>{formatDate(rentBasis.start_date) || '-'}</p>
              </Column>
              <Column small={6}>
                <label>Loppupvm</label>
                <p>{formatDate(rentBasis.end_date) || '-'}</p>
              </Column>
            </Row>

          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <label>Kiinteistötunnukset</label>
            {rentBasis.property_identifiers && !!rentBasis.property_identifiers.length
              ? (
                <ListItems>
                  {rentBasis.property_identifiers.map((item, index) => {
                    return(<p key={index} className='no-margin'>{item.identifier}</p>);
                  })}
                </ListItems>
              ) : <p>-</p>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Asemakaava</label>
            <p>{rentBasis.detailed_plan_identifier || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Hallintamuoto</label>
            <p>{getLabelOfOption(managementOptions, rentBasis.management) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Hallintamuoto</label>
            <p>{getLabelOfOption(financingOptions, rentBasis.financing) || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <label>Vuokraoikeus päättyy</label>
            <p>{formatDate(rentBasis.lease_rights_end_date) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Indeksi</label>
            <p>{getLabelOfOption(indexOptions, rentBasis.index) || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column>
            <SubTitle>Päätökset</SubTitle>
            {decisions.length
              ? (
                <ListItems>
                  <Row>
                    <Column small={3} large={2}>
                      <FormFieldLabel>Päättäjä</FormFieldLabel>
                    </Column>
                    <Column small={3} large={1}>
                      <FormFieldLabel>Pvm</FormFieldLabel>
                    </Column>
                    <Column small={3} large={2}>
                      <FormFieldLabel>Pykälä</FormFieldLabel>
                    </Column>
                    <Column small={3} large={2}>
                      <FormFieldLabel>Hel diaarinumero</FormFieldLabel>
                    </Column>
                  </Row>
                  {decisions.map((decision) =>
                    <Row key={decision.id}>
                      <Column small={3} large={2}>
                        <p className='no-margin'>{getLabelOfOption(decisionsMakerOptions, decision.decision_maker) || '-'}</p>
                      </Column>
                      <Column small={3} large={1}>
                        <p className='no-margin'>{formatDate(decision.decision_date) || '-'}</p>
                      </Column>
                      <Column small={3} large={2}>
                        <p className='no-margin'>{decision.section ? `${decision.section} §` : '-'}</p>
                      </Column>
                      <Column small={3} large={2}>
                        {decision.reference_number
                          ? <p className='no-margin'><a href={getReferenceNumberLink(decision.reference_number)} target='_blank' className='no-margin'>{decision.reference_number}</a></p>
                          : <p className='no-margin'>-</p>
                        }
                      </Column>
                    </Row>
                  )}
                </ListItems>
              ) : <p>Ei päätöksiä</p>
            }
          </Column>
        </Row>
        <Row>
          <Column>
            <SubTitle>Hinnat</SubTitle>
            {rentBasis.rent_rates && !!rentBasis.rent_rates.length
              ? (
                <ListItems>
                  <Row>
                    <Column small={6} medium={4} large={2}><label>Rakennusoikeustyyppi</label></Column>
                    <Column small={3} medium={4} large={1}><label>Euroa</label></Column>
                    <Column small={3} medium={4} large={1}><label>Yksikkö</label></Column>
                  </Row>
                  {rentBasis.rent_rates.map((price, index) => {
                    return(
                      <Row key={index}>
                        <Column small={6} medium={4} large={2}>
                          <p className='no-margin'>{getLabelOfOption(buildPermissionTypeOptions, price.build_permission_type) || '-'}</p>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <p className='no-margin'>{formatNumber(price.amount) || '-'}</p>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <p className='no-margin'>{getLabelOfOption(areaUnitOptions, price.area_unit) || '-'}</p>
                        </Column>
                      </Row>
                    );
                  })}
                </ListItems>
              ) : <p>-</p>
            }
          </Column>
        </Row>
        <Row>
          <Column>
            <label>Huomautus</label>
            <p>{rentBasis.note || '-'}</p>
          </Column>
        </Row>
      </GreenBox>
    </ContentContainer>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(RentBasisReadonly);
