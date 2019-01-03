// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {
  RentBasisFieldPaths,
  RentBasisFieldTitles,
  RentBasisDecisionsFieldPaths,
  RentBasisDecisionsFieldTitles,
  RentBasisPropertyIdentifiersFieldPaths,
  RentBasisPropertyIdentifiersFieldTitles,
  RentBasisRentRatesFieldPaths,
  RentBasisRentRatesFieldTitles,
} from '$src/rentbasis/enums';
import {
  formatDate,
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes as getRentBasisAttributes} from '$src/rentbasis/selectors';

import type {Attributes} from '$src/types';
import type {RentBasis} from '$src/rentbasis/types';

type Props = {
  rentBasis: RentBasis,
  rentBasisAttributes: Attributes,
}

const RentBasisReadonly = ({rentBasis, rentBasisAttributes}: Props) => {
  const plotTypeOptions = getFieldOptions(getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.PLOT_TYPE));
  const managementOptions = getFieldOptions(getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.MANAGEMENT));
  const financingOptions = getFieldOptions(getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.FINANCING));
  const indexOptions = getFieldOptions(getFieldAttributes(rentBasisAttributes, RentBasisFieldPaths.INDEX));
  const buildPermissionTypeOptions = getFieldOptions(getFieldAttributes(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE));
  const areaUnitOptions = getFieldOptions(getFieldAttributes(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT));
  const decisionsMakerOptions = getFieldOptions(getFieldAttributes(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER));
  const decisions = get(rentBasis, 'decisions', []);

  return (
    <ContentContainer>
      <h2>Perustiedot</h2>
      <Divider />
      <GreenBox>
        <Row>
          <Column small={6} medium={4} large={3}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.PLOT_TYPE)}>
              <FormTextTitle>{RentBasisFieldTitles.PLOT_TYPE}</FormTextTitle>
              <FormText>{getLabelOfOption(plotTypeOptions, rentBasis.plot_type) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={8} large={4}>
            <Row>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.START_DATE)}>
                  <FormTextTitle>{RentBasisFieldTitles.START_DATE}</FormTextTitle>
                  <FormText>{formatDate(rentBasis.start_date) || '-'}</FormText>
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.END_DATE)}>
                  <FormTextTitle>{RentBasisFieldTitles.END_DATE}</FormTextTitle>
                  <FormText>{formatDate(rentBasis.end_date) || '-'}</FormText>
                </Authorization>
              </Column>
            </Row>
          </Column>
        </Row>

        <Row>
          <Column small={6} medium={4} large={3}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS)}>
              <FormTextTitle>{RentBasisPropertyIdentifiersFieldTitles.PROPERTY_IDENTIFIERS}</FormTextTitle>
              {rentBasis.property_identifiers && !!rentBasis.property_identifiers.length
                ? <ListItems>
                  {rentBasis.property_identifiers.map((item, index) =>
                    <Authorization key={index} allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER)}>
                      <ListItem>{item.identifier}</ListItem>
                    </Authorization>
                  )}
                </ListItems>
                : <FormText>-</FormText>
              }
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.DETAILED_PLAN_IDENTIFIER)}>
              <FormTextTitle>{RentBasisFieldTitles.DETAILED_PLAN_IDENTIFIER}</FormTextTitle>
              <FormText>{rentBasis.detailed_plan_identifier || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.MANAGEMENT)}>
              <FormTextTitle>{RentBasisFieldTitles.MANAGEMENT}</FormTextTitle>
              <FormText>{getLabelOfOption(managementOptions, rentBasis.management) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.FINANCING)}>
              <FormTextTitle>{RentBasisFieldTitles.FINANCING}</FormTextTitle>
              <FormText>{getLabelOfOption(financingOptions, rentBasis.financing) || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>

        <Row>
          <Column small={6} medium={4} large={3}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.LEASE_RIGHTS_END_DATE)}>
              <FormTextTitle>{RentBasisFieldTitles.LEASE_RIGHTS_END_DATE}</FormTextTitle>
              <FormText>{formatDate(rentBasis.lease_rights_end_date) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.INDEX)}>
              <FormTextTitle>{RentBasisFieldTitles.INDEX}</FormTextTitle>
              <FormText>{getLabelOfOption(indexOptions, rentBasis.index) || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISIONS)}>
          <Row>
            <Column>
              <SubTitle>{RentBasisDecisionsFieldTitles.DECISIONS}</SubTitle>
              {decisions.length
                ? (
                  <ListItems>
                    <Row>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER)}>
                          <FormTextTitle>{RentBasisDecisionsFieldTitles.DECISION_MAKER}</FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={3} large={1}>
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_DATE)}>
                          <FormTextTitle>{RentBasisDecisionsFieldTitles.DECISION_DATE}</FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.SECTION)}>
                          <FormTextTitle>{RentBasisDecisionsFieldTitles.SECTION}</FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.REFERENCE_NUMBER)}>
                          <FormTextTitle>{RentBasisDecisionsFieldTitles.REFERENCE_NUMBER}</FormTextTitle>
                        </Authorization>
                      </Column>
                    </Row>
                    {decisions.map((decision) =>
                      <Row key={decision.id}>
                        <Column small={3} large={2}>
                          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER)}>
                            <ListItem>{getLabelOfOption(decisionsMakerOptions, decision.decision_maker) || '-'}</ListItem>
                          </Authorization>
                        </Column>
                        <Column small={3} large={1}>
                          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_DATE)}>
                            <ListItem>{formatDate(decision.decision_date) || '-'}</ListItem>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.SECTION)}>
                            <ListItem>{decision.section ? `${decision.section} §` : '-'}</ListItem>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.REFERENCE_NUMBER)}>
                            {decision.reference_number
                              ? <ListItem>
                                <ExternalLink
                                  href={getReferenceNumberLink(decision.reference_number)}
                                  text={decision.reference_number}
                                />
                              </ListItem>
                              : <ListItem>-</ListItem>
                            }
                          </Authorization>
                        </Column>
                      </Row>
                    )}
                  </ListItems>
                ) : <FormText>Ei päätöksiä</FormText>
              }
            </Column>
          </Row>
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.RENT_RATES)}>
          <Row>
            <Column>
              <SubTitle>{RentBasisRentRatesFieldTitles.RENT_RATES}</SubTitle>
              {rentBasis.rent_rates && !!rentBasis.rent_rates.length
                ? (
                  <ListItems>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}>
                          <FormTextTitle>{RentBasisRentRatesFieldTitles.BUILD_PERMISSION_TYPE}</FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={3} medium={4} large={1}>
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AMOUNT)}>
                          <FormTextTitle>{RentBasisRentRatesFieldTitles.AMOUNT}</FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={3} medium={4} large={1}>
                        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT)}>
                          <FormTextTitle>{RentBasisRentRatesFieldTitles.AREA_UNIT}</FormTextTitle>
                        </Authorization>
                      </Column>
                    </Row>
                    {rentBasis.rent_rates.map((price, index) => {
                      return(
                        <Row key={index}>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}>
                              <ListItem>{getLabelOfOption(buildPermissionTypeOptions, price.build_permission_type) || '-'}</ListItem>
                            </Authorization>
                          </Column>
                          <Column small={3} medium={4} large={1}>
                            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AMOUNT)}>
                              <ListItem>{formatNumber(price.amount) || '-'}</ListItem>
                            </Authorization>
                          </Column>
                          <Column small={3} medium={4} large={1}>
                            <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT)}>
                              <ListItem>{getLabelOfOption(areaUnitOptions, price.area_unit) || '-'}</ListItem>
                            </Authorization>
                          </Column>
                        </Row>
                      );
                    })}
                  </ListItems>
                ) : <FormText>-</FormText>
              }
            </Column>
          </Row>
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.NOTE)}>
          <Row>
            <Column>
              <FormTextTitle>{RentBasisFieldTitles.NOTE}</FormTextTitle>
              <FormText>{rentBasis.note || '-'}</FormText>
            </Column>
          </Row>
        </Authorization>
      </GreenBox>
    </ContentContainer>
  );
};

export default connect(
  (state) => {
    return {
      rentBasisAttributes: getRentBasisAttributes(state),
    };
  }
)(RentBasisReadonly);
