import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import Authorization from "src/components/authorization/Authorization";
import Collapse from "src/components/collapse/Collapse";
import CollapseHeaderSubtitle from "src/components/collapse/CollapseHeaderSubtitle";
import Divider from "src/components/content/Divider";
import FormText from "src/components/form/FormText";
import FormTextTitle from "src/components/form/FormTextTitle";
import LeaseArea from "./LeaseArea";
import { receiveCollapseStates } from "src/leases/actions";
import { FormNames, ViewModes } from "src/enums";
import { LeaseAreaAddressesFieldPaths, LeaseAreasFieldPaths, LeaseAreasFieldTitles } from "src/leases/enums";
import { getFullAddress } from "src/leases/helpers";
import { getUiDataLeaseKey } from "src/uiData/helpers";
import { formatDate, formatNumber, getFieldOptions, getLabelOfOption, isFieldAllowedToRead } from "src/util/helpers";
import { getAttributes, getCollapseStateByKey } from "src/leases/selectors";
import type { Attributes } from "src/types";
type Props = {
  area: Record<string, any>;
  areaCollapseState: boolean;
  attributes: Attributes;
  decisionOptions: Array<Record<string, any>>;
  planUnitsContractCollapseState: boolean;
  planUnitsCurrentCollapseState: boolean;
  plotsContractCollapseState: boolean;
  plotsCurrentCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
};

const LeaseAreaWithArchiveInfo = ({
  area,
  areaCollapseState,
  attributes,
  decisionOptions,
  receiveCollapseStates
}: Props) => {
  const handleAreaCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            area: val
          }
        }
      }
    });
  };

  const locationOptions = getFieldOptions(attributes, LeaseAreasFieldPaths.LOCATION);
  const typeOptions = getFieldOptions(attributes, LeaseAreasFieldPaths.TYPE);
  const archived = Boolean(area.archived_at);
  return <Collapse archived={archived} defaultOpen={areaCollapseState !== undefined ? areaCollapseState : !archived} headerSubtitles={<Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}>
              <CollapseHeaderSubtitle>{getLabelOfOption(typeOptions, area.type) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
              <CollapseHeaderSubtitle>{getFullAddress(get(area, 'addresses[0]')) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
              <CollapseHeaderSubtitle>{formatNumber(area.area) || '-'} m<sup>2</sup></CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.LOCATION)}>
              <CollapseHeaderSubtitle>{getLabelOfOption(locationOptions, area.location) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>} headerTitle={<Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
          {area.identifier || '-'}
        </Authorization>} onToggle={handleAreaCollapseToggle}>
      <LeaseArea area={area} />

      {!!archived && <Divider className='lease-area-divider' />}
      {!!archived && <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_AT)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.ARCHIVED_AT)}>
                {LeaseAreasFieldTitles.ARCHIVED_AT}
              </FormTextTitle>
              <FormText>{formatDate(area.archived_at) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_DECISION)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.ARCHIVED_DECISION)}>
                {LeaseAreasFieldTitles.ARCHIVED_DECISION}
              </FormTextTitle>
              <FormText>{getLabelOfOption(decisionOptions, area.archived_decision) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={8}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_NOTE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.ARCHIVED_NOTE)}>
                {LeaseAreasFieldTitles.ARCHIVED_NOTE}
              </FormTextTitle>
              <FormText>{area.archived_note || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>}
    </Collapse>;
};

export default connect((state, props) => {
  const id = get(props, 'area.id');
  return {
    areaCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.area`),
    attributes: getAttributes(state)
  };
}, {
  receiveCollapseStates
})(LeaseAreaWithArchiveInfo);