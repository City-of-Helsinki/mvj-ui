import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import Authorization from "/src/components/authorization/Authorization";
import ExternalLink from "/src/components/links/ExternalLink";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import GreenBox from "/src/components/content/GreenBox";
import ListItem from "/src/components/content/ListItem";
import ListItems from "/src/components/content/ListItems";
import SubTitle from "/src/components/content/SubTitle";
import { RentBasisFieldPaths, RentBasisFieldTitles, RentBasisDecisionsFieldPaths, RentBasisDecisionsFieldTitles, RentBasisPropertyIdentifiersFieldPaths, RentBasisPropertyIdentifiersFieldTitles, RentBasisRentRatesFieldPaths, RentBasisRentRatesFieldTitles } from "/src/rentbasis/enums";
import { getUiDataRentBasisKey } from "/src/uiData/helpers";
import { formatDate, formatNumber, getFieldOptions, getLabelOfOption, getReferenceNumberLink, isEmptyValue, isFieldAllowedToRead } from "/src/util/helpers";
import { getAttributes as getRentBasisAttributes } from "/src/rentbasis/selectors";
import type { Attributes } from "types";
import type { RentBasis } from "/src/rentbasis/types";
type Props = {
  rentBasis: RentBasis;
  rentBasisAttributes: Attributes;
};

const RentBasisReadonly = ({
  rentBasis,
  rentBasisAttributes
}: Props) => {
  const plotTypeOptions = getFieldOptions(rentBasisAttributes, RentBasisFieldPaths.PLOT_TYPE);
  const managementOptions = getFieldOptions(rentBasisAttributes, RentBasisFieldPaths.MANAGEMENT);
  const financingOptions = getFieldOptions(rentBasisAttributes, RentBasisFieldPaths.FINANCING);
  const indexOptions = getFieldOptions(rentBasisAttributes, RentBasisFieldPaths.INDEX);
  const buildPermissionTypeOptions = getFieldOptions(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE);
  const areaUnitOptions = getFieldOptions(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT, true, option => !isEmptyValue(option.display_name) ? option.display_name.replace(/\^2/g, '²') : option.display_name);
  const decisionsMakerOptions = getFieldOptions(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER);
  const decisions = get(rentBasis, 'decisions', []);
  return <GreenBox>
      <Row>
        <Column small={6} medium={4} large={3}>
          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.PLOT_TYPE)}>
            <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.PLOT_TYPE)}>
              {RentBasisFieldTitles.PLOT_TYPE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(plotTypeOptions, rentBasis.plot_type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={8} large={4}>
          <Row>
            <Column small={6}>
              <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.START_DATE)}>
                <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.START_DATE)}>
                  {RentBasisFieldTitles.START_DATE}
                </FormTextTitle>
                <FormText>{formatDate(rentBasis.start_date) || '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={6}>
              <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.END_DATE)}>
                <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.END_DATE)}>
                  {RentBasisFieldTitles.END_DATE}
                </FormTextTitle>
                <FormText>{formatDate(rentBasis.end_date) || '-'}</FormText>
              </Authorization>
            </Column>
          </Row>
        </Column>
      </Row>

      <Row>
        <Column small={6} medium={4} large={3}>
          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS)}>
            <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisPropertyIdentifiersFieldPaths.PROPERTY_IDENTIFIERS)}>
              {RentBasisPropertyIdentifiersFieldTitles.PROPERTY_IDENTIFIERS}
            </FormTextTitle>
            {rentBasis.property_identifiers && !!rentBasis.property_identifiers.length ? <ListItems>
                {rentBasis.property_identifiers.map((item, index) => <Authorization key={index} allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisPropertyIdentifiersFieldPaths.IDENTIFIER)}>
                    <ListItem>{item.identifier}</ListItem>
                  </Authorization>)}
              </ListItems> : <FormText>-</FormText>}
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.DETAILED_PLAN_IDENTIFIER)}>
            <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.DETAILED_PLAN_IDENTIFIER)}>
              {RentBasisFieldTitles.DETAILED_PLAN_IDENTIFIER}
            </FormTextTitle>
            <FormText>{rentBasis.detailed_plan_identifier || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.MANAGEMENT)}>
            <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.MANAGEMENT)}>
              {RentBasisFieldTitles.MANAGEMENT}
            </FormTextTitle>
            <FormText>{getLabelOfOption(managementOptions, rentBasis.management) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.FINANCING)}>
            <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.FINANCING)}>
              {RentBasisFieldTitles.FINANCING}
            </FormTextTitle>
            <FormText>{getLabelOfOption(financingOptions, rentBasis.financing) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>

      <Row>
        <Column small={6} medium={4} large={3}>
          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.LEASE_RIGHTS_END_DATE)}>
            <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.LEASE_RIGHTS_END_DATE)}>
              {RentBasisFieldTitles.LEASE_RIGHTS_END_DATE}
            </FormTextTitle>
            <FormText>{formatDate(rentBasis.lease_rights_end_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.INDEX)}>
            <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.INDEX)}>
              {RentBasisFieldTitles.INDEX}
            </FormTextTitle>
            <FormText>{getLabelOfOption(indexOptions, rentBasis.index) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISIONS)}>
        <Row>
          <Column>
            <SubTitle uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.DECISIONS)}>
              {RentBasisDecisionsFieldTitles.DECISIONS}
            </SubTitle>
            {decisions.length ? <ListItems>
                  <Row>
                    <Column small={3} large={2}>
                      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER)}>
                        <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.DECISION_MAKER)}>
                          {RentBasisDecisionsFieldTitles.DECISION_MAKER}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={3} large={1}>
                      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_DATE)}>
                        <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.DECISION_DATE)}>
                          {RentBasisDecisionsFieldTitles.DECISION_DATE}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.SECTION)}>
                        <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.SECTION)}>
                          {RentBasisDecisionsFieldTitles.SECTION}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisDecisionsFieldPaths.REFERENCE_NUMBER)}>
                        <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisDecisionsFieldPaths.REFERENCE_NUMBER)}>
                          {RentBasisDecisionsFieldTitles.REFERENCE_NUMBER}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                  </Row>
                  {decisions.map(decision => <Row key={decision.id}>
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
                          {decision.reference_number ? <ListItem>
                              <ExternalLink href={getReferenceNumberLink(decision.reference_number)} text={decision.reference_number} />
                            </ListItem> : <ListItem>-</ListItem>}
                        </Authorization>
                      </Column>
                    </Row>)}
                </ListItems> : <FormText>Ei päätöksiä</FormText>}
          </Column>
        </Row>
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.RENT_RATES)}>
        <Row>
          <Column>
            <SubTitle uiDataKey={RentBasisRentRatesFieldPaths.RENT_RATES}>
              {RentBasisRentRatesFieldTitles.RENT_RATES}
            </SubTitle>
            {rentBasis.rent_rates && !!rentBasis.rent_rates.length ? <ListItems>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}>
                        <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}>
                          {RentBasisRentRatesFieldTitles.BUILD_PERMISSION_TYPE}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={3} medium={4} large={1}>
                      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AMOUNT)}>
                        <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisRentRatesFieldPaths.AMOUNT)}>
                          {RentBasisRentRatesFieldTitles.AMOUNT}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={3} medium={4} large={1}>
                      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT)}>
                        <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisRentRatesFieldPaths.AREA_UNIT)}>
                          {RentBasisRentRatesFieldTitles.AREA_UNIT}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                  </Row>
                  {rentBasis.rent_rates.map((price, index) => {
              return <Row key={index}>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.BUILD_PERMISSION_TYPE)}>
                            <ListItem>{getLabelOfOption(buildPermissionTypeOptions, price.build_permission_type) || '-'}</ListItem>
                          </Authorization>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AMOUNT)}>
                            <ListItem>{!isEmptyValue(price.amount) ? `${formatNumber(price.amount)} €` : '-'}</ListItem>
                          </Authorization>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisRentRatesFieldPaths.AREA_UNIT)}>
                            <ListItem>{getLabelOfOption(areaUnitOptions, price.area_unit) || '-'}</ListItem>
                          </Authorization>
                        </Column>
                      </Row>;
            })}
                </ListItems> : <FormText>-</FormText>}
          </Column>
        </Row>
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.NOTE)}>
        <Row>
          <Column>
            <FormTextTitle uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.NOTE)}>
              {RentBasisFieldTitles.NOTE}
            </FormTextTitle>
            <FormText>{rentBasis.note || '-'}</FormText>
          </Column>
        </Row>
      </Authorization>
    </GreenBox>;
};

export default connect(state => {
  return {
    rentBasisAttributes: getRentBasisAttributes(state)
  };
})(RentBasisReadonly);