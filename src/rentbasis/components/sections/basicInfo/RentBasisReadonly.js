// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import GreenBox from '$components/content/GreenBox';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {formatDate, formatNumber, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getAttributes} from '$src/rentbasis/selectors';

import type {Attributes} from '$src/types';
import type {RentBasis} from '$src/rentbasis/types';

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
      <h2>Perustiedot</h2>
      <Divider />
      <GreenBox>
        <Row>
          <Column small={6} medium={4} large={3}>
            <FormTitleAndText
              title='Tonttityyppi'
              text={getLabelOfOption(plotTypeOptions, rentBasis.plot_type) || '-'}
            />
          </Column>
          <Column small={6} medium={8} large={4}>
            <Row>
              <Column small={6}>
                <FormTitleAndText
                  title='Alkupvm'
                  text={formatDate(rentBasis.start_date) || '-'}
                />
              </Column>
              <Column small={6}>
                <FormTitleAndText
                  title='Loppupvm'
                  text={formatDate(rentBasis.end_date) || '-'}
                />
              </Column>
            </Row>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <FormTextTitle title='Kiinteistötunnukset' />
            {rentBasis.property_identifiers && !!rentBasis.property_identifiers.length
              ? (
                <ListItems>
                  {rentBasis.property_identifiers.map((item, index) => {
                    return(<ListItem key={index}>{item.identifier}</ListItem>);
                  })}
                </ListItems>
              ) : <FormText>-</FormText>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Asemakaava'
              text={rentBasis.detailed_plan_identifier || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Hallintamuoto'
              text={getLabelOfOption(managementOptions, rentBasis.management) || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Rahoitusmuoto'
              text={getLabelOfOption(financingOptions, rentBasis.financing) || '-'}
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <FormTitleAndText
              title='Vuokraoikeus päättyy'
              text={formatDate(rentBasis.lease_rights_end_date) || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Indeksi'
              text={getLabelOfOption(indexOptions, rentBasis.index) || '-'}
            />
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
                      <FormTextTitle title='Päättäjä' />
                    </Column>
                    <Column small={3} large={1}>
                      <FormTextTitle title='Pvm' />
                    </Column>
                    <Column small={3} large={2}>
                      <FormTextTitle title='Pykälä' />
                    </Column>
                    <Column small={3} large={2}>
                      <FormTextTitle title='Hel diaarinumero' />
                    </Column>
                  </Row>
                  {decisions.map((decision) =>
                    <Row key={decision.id}>
                      <Column small={3} large={2}>
                        <ListItem>{getLabelOfOption(decisionsMakerOptions, decision.decision_maker) || '-'}</ListItem>
                      </Column>
                      <Column small={3} large={1}>
                        <ListItem>{formatDate(decision.decision_date) || '-'}</ListItem>
                      </Column>
                      <Column small={3} large={2}>
                        <ListItem>{decision.section ? `${decision.section} §` : '-'}</ListItem>
                      </Column>
                      <Column small={3} large={2}>
                        {decision.reference_number
                          ? <ListItem>
                            <ExternalLink
                              href={getReferenceNumberLink(decision.reference_number)}
                              text={decision.reference_number}
                            />
                          </ListItem>
                          : <ListItem>-</ListItem>
                        }
                      </Column>
                    </Row>
                  )}
                </ListItems>
              ) : <FormText>Ei päätöksiä</FormText>
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
                    <Column small={6} medium={4} large={2}>
                      <FormTextTitle title='Rakennusoikeustyyppi' />
                    </Column>
                    <Column small={3} medium={4} large={1}>
                      <FormTextTitle title='Euroa' />
                    </Column>
                    <Column small={3} medium={4} large={1}>
                      <FormTextTitle title='Yksikkö' />
                    </Column>
                  </Row>
                  {rentBasis.rent_rates.map((price, index) => {
                    return(
                      <Row key={index}>
                        <Column small={6} medium={4} large={2}>
                          <ListItem>{getLabelOfOption(buildPermissionTypeOptions, price.build_permission_type) || '-'}</ListItem>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <ListItem>{formatNumber(price.amount) || '-'}</ListItem>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <ListItem>{getLabelOfOption(areaUnitOptions, price.area_unit) || '-'}</ListItem>
                        </Column>
                      </Row>
                    );
                  })}
                </ListItems>
              ) : <FormText>-</FormText>
            }
          </Column>
        </Row>
        <Row>
          <Column>
            <FormTitleAndText
              title='Huomautus'
              text={rentBasis.note || '-'}
            />
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
